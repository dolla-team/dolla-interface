import { useNearKeyStore } from "@/stores/use-near-key";
import { KeyPair, KeyPairSigner, transactions } from "near-api-js";
import { useEffect } from "react";
import { useSignMessage } from "@privy-io/react-auth";
import { getNonce, getProvider } from "./util";
import { PublicKey } from "near-api-js/lib/utils/key_pair";
import { functionCall } from "near-api-js/lib/transaction";
import { base_decode } from "near-api-js/lib/utils/serialize";

const THIRTY_TGAS = "300000000000000";
export default function useGenerateKey(account?: any) {
  const { setPublicKey, setPrivateKey, publicKey, privateKey } =
    useNearKeyStore();
  const { signMessage } = useSignMessage();

  async function generateKeyPair() {
    if (!publicKey) {
      const {
        publicKey: shortPublicKey,
        keyPairSigner: newKeyPairSigner,
        privateKey: newPrivateKey
      } = createKeyPair();

      saveKeyPair(shortPublicKey, newPrivateKey);

      return {
        publicKey: shortPublicKey,
        keyPairSigner: newKeyPairSigner
      };
    }
    if (publicKey && privateKey) {
      const newKeyPairSigner = KeyPairSigner.fromSecretKey(
        ("ed25519:" + privateKey) as any
      );

      return {
        publicKey,
        keyPairSigner: newKeyPairSigner
      };
    }
    if (account && !publicKey) {
      // TODO
      console.log("generateKeyPair", "no key");
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
    setPublicKey(publicKey);
    setPrivateKey(privateKey);
  }

  async function updateAk({
    evmAddress,
    publicKey,
    nonce
  }: {
    evmAddress: string;
    publicKey: string;
    nonce: number;
  }) {
    const payload = {
      user_id: {
        Evm: evmAddress.toLowerCase()
      },
      ak: publicKey,
      nonce: nonce
    };

    const signatureData = await signMessage({
      message: JSON.stringify(payload)
    });

    console.log("signature:", signatureData);

    const provider = getProvider();
    const { header } = await provider.block({ finality: "final" });

    const argas = {
      update_user_ak_args: {
        payload,
        signature: signatureData.signature.replace(/^0x/, "")
      }
    };

    console.log("argas:", argas);

    const signNonce = await getNonce(publicKey);
    const transaction = transactions.createTransaction(
      import.meta.env.VITE_NEAR_ACCOUNT_ID,
      PublicKey.from(publicKey),
      import.meta.env.VITE_NEAR_ACCOUNT_ID,
      signNonce,
      [functionCall("update_user_ak", argas, BigInt(THIRTY_TGAS), BigInt(1))],
      base_decode(header.hash)
    );

    const keyPairSigner = KeyPairSigner.fromSecretKey(
      ("ed25519:" + privateKey) as any
    );

    const [, signedTransaction] = await keyPairSigner.signTransaction(
      transaction
    );

    const result = await provider.sendTransaction(signedTransaction);

    return result;
  }

  useEffect(() => {
    generateKeyPair();
  }, [account]);

  return {
    generateKeyPair,
    createKeyPair,
    saveKeyPair,
    publicKey,
    privateKey,
    updateAk
  };
}
