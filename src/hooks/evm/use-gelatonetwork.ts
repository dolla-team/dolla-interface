import {
  sponsored,
  createGelatoSmartWalletClient
} from "@gelatonetwork/smartwallet";
import { useGelatoSmartWalletPrivyContext } from '@/contexts/wallet/privy'
import axiosInstance from "@/libs/axios";

import { useAuth } from "@/contexts/auth";
import { ethers } from "ethers";

export default function useGelatonetwork() {
  const {
    gelato: { client }
  } = useGelatoSmartWalletPrivyContext();
  const { wallet } = useAuth();

  const executeTransaction = async ({ calls, onSuccess, onError }: any) => {
    if (!client) {
      onError?.({ error: "Gelato client is not available" });
      return;
    }

    try {
      const ethereumProvider = await wallet?.getEthereumProvider();
      if (!ethereumProvider) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereumProvider);
      const swc = await createGelatoSmartWalletClient(client, {
        apiKey: import.meta.env.VITE_SPONSOR_API_KEY
      });
      const _calls = calls.map((call: any) => {
        if (call.value) call.value = call.value.toString();
        return {
          data: call.data,
          to: call.to,
          value: call.value
        };
      });

      console.log("calls", _calls);
      const preparedCalls = await swc.prepare({
        payment: sponsored(import.meta.env.VITE_SPONSOR_API_KEY),
        calls: _calls
      });
      console.log("preparedCalls", preparedCalls);
      const signedData = await axiosInstance.post(
        "/api/v1/privy/berachain/sign_typed_data",
        {
          type_data: JSON.stringify({
            // @ts-ignore
            types: preparedCalls.signatureRequest.data.types,
            // @ts-ignore
            message: preparedCalls.signatureRequest.data.message,
            // @ts-ignore
            primary_type: preparedCalls.signatureRequest.data.primaryType,
            // @ts-ignore
            domain: preparedCalls.signatureRequest.data.domain
          })
        }
      );
      const signature = signedData.data.data.data.signature;

      const isDeployed = await client.account.isDeployed();
      console.log("isDeployed", isDeployed);

      const params: any = {
        preparedCalls,
        signature
      };
      if (!isDeployed) {
        const signedAuthorization = await client.signAuthorization({
          address: "0x5aF42746a8Af42d8a4708dF238C53F1F71abF0E0" as any,
          chainId: 80094
        });
        params.authorizationList = [signedAuthorization];
      }

      const response = await client.send(params);

      console.log("Transaction response:", response);

      response.on("success", async (status: any) => {
        console.log("Transaction submitted:", status);
        const hash = status.transactionHash;
        const needConfirmTx = await provider.getTransaction(hash);
        const receipt = await needConfirmTx.wait();
        onSuccess?.(receipt);
      });

      response.on("error", (status: any) => {
        console.error("Transaction error:", status);
        onError?.(status);
      });
    } catch (error) {
      console.error("Error executing transaction:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      onError?.({ error: errorMessage });
    }
  };

  return {
    executeTransaction
  };
}
