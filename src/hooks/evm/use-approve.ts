import Big from "big.js";
import { Contract, ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import useToast from "@/hooks/use-toast";
import { useWallets } from "@privy-io/react-auth";
import { useAuth } from "@/contexts/auth";
import useGelatonetwork from "./use-gelatonetwork";

export const MAX_APPROVE =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

export default function useApprove({
  token,
  amount,
  spender,
  isSkip,
  account,
  onSuccess
}: {
  token?: any;
  amount?: string;
  spender?: string;
  isSkip?: boolean;
  isMax?: boolean;
  account?: string;
  onSuccess?: VoidFunction;
  checkApproved?: VoidFunction;
}) {
  const [approved, setApproved] = useState(false);
  const [approving, setApproving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [allowance, setAllowance] = useState<any>(0);
  const { wallets } = useWallets();
  const { address: privyAccount } = useAuth();
  const toast = useToast();
  const { executeTransaction } = useGelatonetwork();

  const mergedAccount = account || privyAccount;
  const wallet = useMemo(() => {
    return wallets.find((item) => item.address === mergedAccount);
  }, [wallets, mergedAccount]);

  const checkApproved = async () => {
    if (!token?.address || !amount || !spender) return;
    if (token.type === "nft" && !token.id) {
      return;
    }
    if (
      token?.address === "0x0000000000000000000000000000000000000000" ||
      token?.address === "native"
    ) {
      setApproved(true);
      setChecking(false);
      return;
    }
    try {
      const ethereumProvider = await wallet?.getEthereumProvider();

      if (!ethereumProvider) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereumProvider);

      const signer = provider.getSigner();

      setChecking(true);

      const TokenContract = new Contract(
        token.address,
        token.type === "nft"
          ? [
              {
                inputs: [
                  {
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256"
                  }
                ],
                name: "getApproved",
                outputs: [
                  {
                    internalType: "address",
                    name: "",
                    type: "address"
                  }
                ],
                stateMutability: "view",
                type: "function"
              }
            ]
          : [
              {
                inputs: [
                  { internalType: "address", name: "", type: "address" },
                  { internalType: "address", name: "", type: "address" }
                ],
                name: "allowance",
                outputs: [
                  { internalType: "uint256", name: "", type: "uint256" }
                ],
                stateMutability: "view",
                type: "function"
              }
            ],
        signer
      );

      const method = token.type === "nft" ? "getApproved" : "allowance";
      const params =
        token.type === "nft" ? [token.id] : [mergedAccount, spender];

      const allowanceRes = await TokenContract[method](...params);

      if (token.type === "nft") {
        setApproved(
          allowanceRes !== "0x0000000000000000000000000000000000000000"
        );
      } else {
        const _allowance = ethers.utils.formatUnits(
          allowanceRes.toString(),
          token.decimals
        );
        console.log("_allowance", _allowance);
        const needApproved = Big(_allowance).lt(amount || "0");

        setAllowance(_allowance);
        setApproved(!needApproved);
      }
      setChecking(false);
    } catch (err) {
      console.log("check approved failed: %o", err);
      setChecking(false);
    }
  };

  const approve = async () => {
    if (!token?.address || !amount || !spender) return;
    let toastId = toast.loading({
      title: "Approving..."
    });
    try {
      setApproving(true);

      const params = [spender, token.type === "nft" ? token.id : MAX_APPROVE];

      const ethereumProvider = await wallet?.getEthereumProvider();
      if (!ethereumProvider) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereumProvider);
      const signer = provider.getSigner();
      const TokenContract = new Contract(
        token.address,
        [
          {
            inputs: [
              { internalType: "address", name: "spender", type: "address" },
              { internalType: "uint256", name: "value", type: "uint256" }
            ],
            name: "approve",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function"
          }
        ],
        signer
      );

      const transaction = await TokenContract.populateTransaction.approve(
        ...params
      );

      executeTransaction({
        calls: [transaction],
        onSuccess: (receipt: any) => {
          setApproving(false);
          console.log("receipt", receipt);
          if (receipt?.status === 1) {
            setApproved(true);
            onSuccess?.();
            toast.dismiss(toastId);
            toast.success({
              title: "Approve Successful!"
            });
          }
        },
        onError: () => {
          setApproving(false);
          toast.dismiss(toastId);
          toast.fail({
            title: "Approve Failed!"
          });
        }
      });
    } catch (err: any) {
      console.log("err", err);
      toast.dismiss(toastId);
      toast.fail({
        title: "Approve Failed!",
        text: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : ""
      });
      setApproving(false);
    }
  };

  useEffect(() => {
    if (
      token?.isNative ||
      isSkip ||
      token?.address === "0x0000000000000000000000000000000000000000" ||
      token?.address === "native"
    ) {
      setApproved(true);
      return;
    }

    if (token && amount && spender && wallet) checkApproved();
  }, [token, amount, spender, isSkip, wallet]);

  return {
    approved,
    approve,
    approving,
    checking,
    allowance,
    checkApproved
  };
}
