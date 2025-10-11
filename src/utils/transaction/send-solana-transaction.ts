import axiosInstance from "@/libs/axios";
import config from "@/config/solana";

export const sendSolanaTransaction = async (tx: any, action: string) => {
  const txBuffer = tx.serialize({ requireAllSignatures: false });
  const transaction = txBuffer.toString("base64");

  console.time("sendSolanaTransaction");
  const gasPayResult = await axiosInstance.post(`/api/v1/paygas/sol/send`, {
    operator_key: config.operator,
    action,
    tx: transaction
  });
  console.timeEnd("sendSolanaTransaction");
  console.log(Date.now());

  // const response = await axiosInstance.post(`/api/v1/privy/sol/transaction`, {
  //   transaction: gasPayResult.data.data
  // });

  return gasPayResult.data;
};
