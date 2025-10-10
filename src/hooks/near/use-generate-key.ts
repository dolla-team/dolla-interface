import { useNearKeyStore } from "@/stores/use-near-key";
import { KeyPair, KeyPairSigner } from "near-api-js";
import { useSignMessage } from "@privy-io/react-auth";
import { viewMethod } from "./util";
import { useAuth } from "@/contexts/auth/privy";
import { BASE_TOKEN, QUOTE_TOKEN } from "@/config/btc";
import axiosInstance from "@/libs/axios";

export default function useGenerateKey() {
  const { set, publicKey, privateKey } = useNearKeyStore();
  const { signMessage } = useSignMessage();
  const { nearAccount, address } = useAuth();

  async function generateKeyPair(isDeposit = false) {
    let isCorrect = false;
    if (publicKey && privateKey) {
      const newKeyPairSigner = KeyPairSigner.fromSecretKey(
        ("ed25519:" + privateKey) as any
      );

      const res = await viewMethod({
        method: "get_user_id_ak",
        args: { user_id: { Evm: address.replace(/^0x/, "").toLowerCase() } }
      });

      isCorrect = res === "ed25519:" + publicKey;

      if (isCorrect) {
        return {
          publicKey,
          privateKey,
          keyPairSigner: newKeyPairSigner
        };
      }
    }

    const {
      publicKey: shortPublicKey,
      keyPairSigner: newKeyPairSigner,
      privateKey: newPrivateKey
    } = createKeyPair();

    if ((nearAccount && !isDeposit) || !isCorrect) {
      await updateAk({ publicKey: shortPublicKey });
    }

    saveKeyPair(shortPublicKey, newPrivateKey);

    return {
      publicKey: shortPublicKey,
      privateKey: newPrivateKey,
      keyPairSigner: newKeyPairSigner
    };
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
    if (!address) return;
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
        FT:
          nearAccount?.balance === "0"
            ? BASE_TOKEN.address
            : QUOTE_TOKEN.address
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
