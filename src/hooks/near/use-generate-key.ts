import { useNearKeyStore } from "@/stores/use-near-key";
import { KeyPair } from 'near-api-js'
import {
  createAccessKeyTransactionSigner,
  getUserId,
  keyPairFromStoredSecret,
  viewMethod,
} from './util'
import { useAuth } from '@/contexts/wallet'
import { QUOTE_TOKEN } from "@/config/btc";
import axiosInstance from "@/libs/axios";
import Big from "big.js";
import useToast from "../use-toast";

export default function useGenerateKey() {
  const { set, publicKey, privateKey } = useNearKeyStore();
  const { address, chainType, nearAccount, signMessage } = useAuth();
  const toast = useToast();

  async function generateKeyPair(isDeposit = false) {
    try {
      const res = await viewMethod({
        method: "get_user_id_ak",
        args: { user_id: getUserId(address, chainType) }
      });

      const isCorrect = res === "ed25519:" + publicKey;
      const contractPublicKey = res;

      if (publicKey && privateKey && isCorrect) {
        const newKeyPairSigner = await createAccessKeyTransactionSigner(
          keyPairFromStoredSecret(privateKey)
        )

        return {
          publicKey,
          privateKey,
          keyPairSigner: newKeyPairSigner,
          isRegistered: !!res
        };
      }

      const {
        publicKey: shortPublicKey,
        keyPairSigner: newKeyPairSigner,
        privateKey: newPrivateKey,
      } = await createKeyPair()

      if (!isCorrect && contractPublicKey && !isDeposit) {
        await updateAk({ publicKey: shortPublicKey });
        saveKeyPair(shortPublicKey, newPrivateKey);
        return {};
      }

      saveKeyPair(shortPublicKey, newPrivateKey);
      return {
        publicKey: shortPublicKey,
        privateKey: newPrivateKey,
        keyPairSigner: newKeyPairSigner,
        isRegistered: !!res
      };
    } catch (error) {
      return {
        publicKey: "",
        privateKey: "",
        keyPairSigner: null
      };
    }
  }

  async function createKeyPair() {
    const newAccountKeyPair = KeyPair.fromRandom('ed25519')
    const newPublicKey = newAccountKeyPair.getPublicKey().toString()
    const shortPublicKey = newPublicKey.split(':')[1]
    const shortPrivateKey = newAccountKeyPair.toString().split(':')[1]
    const keyPairSigner = await createAccessKeyTransactionSigner(newAccountKeyPair)
    return {
      publicKey: shortPublicKey,
      privateKey: shortPrivateKey,
      keyPairSigner,
    }
  }
  function saveKeyPair(publicKey: string, privateKey: string) {
    set({ publicKey, privateKey });
  }

  async function updateAk({ publicKey }: any) {
    if (Big(nearAccount?.balance || 0).lt(1)) {
      toast.info({
        title: `A minimum of 1 ${QUOTE_TOKEN.symbol} is required to update the AK. Please make a deposit`,
      })
      return;
    }
    const res = await viewMethod({
      method: "get_account",
      args: { user_id: getUserId(address, chainType) }
    });
    const payload = {
      user_id: getUserId(address, chainType),
      ak: publicKey,
      fee_token: { FT: QUOTE_TOKEN.address },
      gas_token: {
        FT: QUOTE_TOKEN.address
      },
      nonce: res.nonce,
      deadline: String(Date.now() + 1000 * 60 * 60 * 6)
    };

    const payloadString = JSON.stringify(payload);

    const _signature = await signMessage(payloadString, true);

    const signature = _signature.replace(/^0x/, "");

    await axiosInstance.put(`/api/v1/user/publickey`, {
      payload: payloadString,
      signature
    });
  }

  return {
    generateKeyPair,
    createKeyPair,
    saveKeyPair,
    publicKey,
    privateKey,
    updateAk
  };
}
