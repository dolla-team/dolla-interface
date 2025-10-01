import { useNearKeyStore } from "@/stores/use-near-key";
import { KeyPair, KeyPairSigner } from "near-api-js";
import { useSignMessage } from "@privy-io/react-auth";
import { viewMethod } from "./util";
import { useAuth } from "@/contexts/auth/privy";
import { QUOTE_TOKEN } from "@/config/btc";

export default function useGenerateKey() {
  const { setPublicKey, setPrivateKey, publicKey, privateKey } =
    useNearKeyStore();
  const { signMessage } = useSignMessage();
  const { nearAccount, address } = useAuth();

  async function generateKeyPair() {
    if (publicKey && privateKey) {
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

    if (nearAccount) {
      // TODO update ak
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
    setPublicKey(publicKey);
    setPrivateKey(privateKey);
  }

  async function updateAk({ publicKey }: any) {
    if (!address) return;
    const res = await viewMethod({
      method: "get_account",
      args: { user_id: { Evm: address.replace(/^0x/, "").toLowerCase() } }
    });
    const payload = {
      ak: publicKey,
      nonce: res.nonce,
      gas_token: { FT: QUOTE_TOKEN.address },
      fee_token: { FT: QUOTE_TOKEN.address },
      deadline: String(Date.now() + 1000 * 60 * 60 * 2),
      user_id: {
        Evm: address.slice(2).toLowerCase()
      }
    };

    const payloadString = JSON.stringify(payload);

    const _signature = await signMessage({
      message: payloadString
    });

    const signature = _signature.signature.replace(/^0x/, "");

    console.log("signature", signature, payloadString);
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
