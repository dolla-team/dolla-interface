import { useNearKeyStore } from "@/stores/use-near-key";
import { KeyPair, KeyPairSigner } from "near-api-js";
import { useSignMessage } from "@privy-io/react-auth";
import { viewMethod } from "./util";
import { useAuth } from "@/contexts/auth/privy";
import { QUOTE_TOKEN } from "@/config/btc";
import axiosInstance from "@/libs/axios";
import Big from "big.js";
import useToast from "../use-toast";

export default function useGenerateKey() {
  const { set, publicKey, privateKey } = useNearKeyStore();
  const { signMessage } = useSignMessage();
  const { address, nearAccount } = useAuth();
  const toast = useToast();

  async function generateKeyPair(isDeposit = false) {
    try {
      const res = await viewMethod({
        method: "get_user_id_ak",
        args: { user_id: { Evm: address.replace(/^0x/, "").toLowerCase() } }
      });

      const isCorrect = res === "ed25519:" + publicKey;
      const contractPublicKey = res;

      if (publicKey && privateKey && isCorrect) {
        const newKeyPairSigner = KeyPairSigner.fromSecretKey(
          ("ed25519:" + privateKey) as any
        );

        return {
          publicKey,
          privateKey,
          keyPairSigner: newKeyPairSigner
        };
      }

      const {
        publicKey: shortPublicKey,
        keyPairSigner: newKeyPairSigner,
        privateKey: newPrivateKey
      } = createKeyPair();

      if (!isCorrect && contractPublicKey && !isDeposit) {
        await updateAk({ publicKey: shortPublicKey });
        saveKeyPair(shortPublicKey, newPrivateKey);
        return {};
      }

      saveKeyPair(shortPublicKey, newPrivateKey);
      return {
        publicKey: shortPublicKey,
        privateKey: newPrivateKey,
        keyPairSigner: newKeyPairSigner
      };
    } catch (error) {
      return {
        publicKey: "",
        privateKey: "",
        keyPairSigner: null
      };
    }
  }

  function createKeyPair(): any {
    const newAccountKeyPair: any = KeyPair.fromRandom("ed25519");
    const newPublicKey = newAccountKeyPair.getPublicKey().toString();
    const shortPublicKey = newPublicKey.split(":")[1];
    const newKeyPairSigner = new KeyPairSigner(newAccountKeyPair);
    return {
      publicKey: shortPublicKey,
      privateKey: newAccountKeyPair.extendedSecretKey,
      keyPairSigner: newKeyPairSigner
    };
  }
  function saveKeyPair(publicKey: string, privateKey: string) {
    set({ publicKey, privateKey });
  }

  async function updateAk({ publicKey }: any) {
    if (Big(nearAccount?.balance || 0).lt(1)) {
      toast.info({
        title: `${QUOTE_TOKEN.symbol} is insufficient to update AK`
      });
      return;
    }
    const res = await viewMethod({
      method: "get_account",
      args: { user_id: { Evm: address.replace(/^0x/, "").toLowerCase() } }
    });
    const payload = {
      user_id: {
        Evm: address.slice(2).toLowerCase()
      },
      ak: publicKey,
      fee_token: { FT: QUOTE_TOKEN.address },
      gas_token: {
        FT: QUOTE_TOKEN.address
      },
      nonce: res.nonce,
      deadline: String(Date.now() + 1000 * 60 * 60 * 6)
    };

    const payloadString = JSON.stringify(payload);

    const _signature = await signMessage({
      message: payloadString
    });

    const signature = _signature.signature.replace(/^0x/, "");

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
