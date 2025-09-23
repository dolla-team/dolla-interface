import BackIcon from "@/sections/wallet/back-icon";
import TokenSelector from "./token-selector";
import Recharge from "./recharge";
import config from "@/config/bera";
import { useMemo, useState } from "react";
import { chainConfig } from "../utils/chainConfig";
import Big from "big.js";

export default function RechargeFrom1click({
  setSelectedOption
}: {
  setSelectedOption: (option: string | null) => void;
}) {
  const [token, setToken] = useState<any>(null);
  const [qoute, setQoute] = useState<any>(null);
  const [showAddress, setShowAddress] = useState(false);

  const rechargeToken = useMemo(() => {
    return {
      ...config.purchaseToken,
      chainName: chainConfig[token?.blockchain]?.name,
      chainLogo: chainConfig[token?.blockchain]?.icon,
      symbol: token?.symbol,
      address: qoute?.depositAddress,
      icon: token?.icon
    };
  }, [qoute, token, config]);

  return (
    <div className="pb-[20px] relative">
      <div
        className="flex items-center gap-[18px] text-[16px] cursor-pointer button"
        onClick={() => {
          if (showAddress) {
            setShowAddress(false);
          } else {
            setSelectedOption(null);
          }
        }}
      >
        <BackIcon />
        <div className="text-[#4c4789] text-[12px]">Back</div>
      </div>

      {!showAddress && (
        <div className="py-[20px]">
          <TokenSelector
            onTokenSelect={(token) => {
              setToken(token);
            }}
            onQoute={(qoute) => {
              setQoute(qoute);
            }}
            onConfirm={() => {
              setShowAddress(true);
            }}
            // onLoading={setLoading}
          />
        </div>
      )}

      {/* {
            loading && <div className="flex align-center justify-center p-[20px]">
                <Loading size={20} />
            </div>
        } */}

      {showAddress && token && qoute && (
        <>
          {/* <div className="text-[14px] text-[#8A87AA]">
                    Deposit <span className="text-[##000000]">{token?.symbol}</span> from a
                    centralized exchange (Binance, OKX, etc.) to this one-time address
                    on the <span className="text-[#000000]">{chainConfig[token?.blockchain]?.name}  network</span> to
                    fund your Dolla wallet. This address can only be used one time.
                </div> */}
          <div className="pt-[50px]">
            <Recharge token={rechargeToken} />

            <div className="flex justify-between items-center mt-[20px] px-[10px]">
              <div className="text-[14px] text-[#8A87AA]">Minimum Receive</div>
              <div className="text-[14px] text-[#8A87AA]">
                {qoute?.minAmountOut
                  ? new Big(qoute?.minAmountOut)
                      .div(10 ** token?.decimals)
                      .toString()
                  : "-"}{" "}
                {token?.symbol}
              </div>
            </div>

            <div className="flex justify-between items-center mt-[20px] px-[10px]">
              <div className="text-[14px] text-[#8A87AA]">Cost time</div>
              <div className="text-[14px] text-[#8A87AA]">
                {qoute?.costTime || "~"}
              </div>
            </div>
          </div>

          {/* {selectedOption === "maually" && (
                    <div className="w-full mt-[12px] p-[12px] border border-[#383F47] bg-[#1A1E24] rounded-[10px] flex justify-between items-center">
                        <div className="flex items-center gap-[10px]">
                            <Avatar
                                size={36}
                                email={userInfo?.show_email}
                                address={userInfo?.user}
                            />
                            <div>
                                <div className="text-[14px] text-[#8A87AA]">
                                    {userInfo?.show_email}
                                </div>
                                <div className="flex items-center gap-[3px]">
                                    <span className="text-[12px] text-[#8A87AA]">
                                        {formatAddress(userInfo?.user)}
                                    </span>
                                    <button
                                        className="button"
                                        onClick={() => {
                                            onCopy(userInfo?.user);
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            height="10"
                                            viewBox="0 0 10 10"
                                            fill="none"
                                        >
                                            <path
                                                d="M6.03809 2.28809C6.25541 2.28784 6.47105 2.33102 6.67188 2.41406C6.87262 2.49713 7.05537 2.61884 7.20899 2.77246C7.36262 2.92613 7.48434 3.10877 7.56739 3.30957C7.65044 3.51046 7.69265 3.72598 7.69239 3.94336V8.34473C7.70966 9.26031 6.95367 9.99987 6.03809 10H1.6543C1.43696 10.0003 1.22136 9.95805 1.02051 9.875C0.819663 9.79193 0.637089 9.66932 0.483401 9.51562C0.329807 9.36195 0.20802 9.1793 0.125002 8.97852C0.0419817 8.77766 -0.000273377 8.56207 2.37201e-06 8.34473V3.94434C-0.000365337 3.72693 0.0420218 3.51149 0.125002 3.31055C0.208028 3.10956 0.329669 2.92626 0.483401 2.77246C0.637051 2.61879 0.819711 2.49714 1.02051 2.41406C1.22141 2.33097 1.4369 2.28783 1.6543 2.28809H6.03809ZM1.6543 3.34473C1.57566 3.3441 1.4976 3.35892 1.42481 3.38867C1.35188 3.41853 1.28522 3.46283 1.22949 3.51855C1.1738 3.57426 1.12946 3.64096 1.09961 3.71387C1.06988 3.78666 1.05502 3.86473 1.05567 3.94336V8.34473C1.05506 8.42334 1.06985 8.50145 1.09961 8.57422C1.12947 8.64715 1.17377 8.71381 1.22949 8.76953C1.2852 8.82521 1.35192 8.8686 1.42481 8.89844C1.49767 8.92826 1.57557 8.94399 1.6543 8.94336H6.03809C6.11681 8.94398 6.19473 8.92826 6.26758 8.89844C6.34048 8.86859 6.40719 8.82523 6.46289 8.76953C6.51858 8.71384 6.56195 8.64709 6.5918 8.57422C6.62161 8.5014 6.63733 8.42341 6.63672 8.34473V3.94336C6.63736 3.86462 6.62162 3.78675 6.5918 3.71387C6.56196 3.64098 6.51857 3.57426 6.46289 3.51855C6.40717 3.46283 6.34051 3.41853 6.26758 3.38867C6.19479 3.35891 6.11672 3.34411 6.03809 3.34473H1.6543ZM8.37988 0C8.79501 0.000995696 9.19276 0.166432 9.48633 0.459961C9.77986 0.753496 9.94524 1.1513 9.94629 1.56641V6.14355C9.94537 6.55883 9.77997 6.95733 9.48633 7.25098C9.19277 7.54445 8.79498 7.70994 8.37988 7.71094C8.23982 7.71094 8.1049 7.65471 8.00586 7.55566C7.90706 7.45666 7.85156 7.32251 7.85156 7.18262C7.85157 7.04272 7.90704 6.90857 8.00586 6.80957C8.1049 6.71053 8.23982 6.6543 8.37988 6.6543C8.51513 6.65422 8.64456 6.60047 8.74024 6.50488C8.836 6.40912 8.89063 6.27899 8.89063 6.14355V1.56641C8.8905 1.43115 8.83589 1.30171 8.74024 1.20605C8.64455 1.11041 8.51517 1.05671 8.37988 1.05664H3.80274C3.66731 1.05664 3.53717 1.11029 3.44141 1.20605C3.34591 1.30168 3.29212 1.43126 3.29199 1.56641C3.29199 1.70643 3.23668 1.8414 3.1377 1.94043C3.03866 2.03947 2.90374 2.09473 2.76367 2.09473C2.62377 2.09465 2.48959 2.03934 2.39063 1.94043C2.29159 1.84139 2.23633 1.70647 2.23633 1.56641C2.23738 1.1513 2.40276 0.753496 2.69629 0.459961C2.98991 0.16646 3.38758 0.000922396 3.80274 0H8.37988Z"
                                                fill="#ADBCCF"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-[10px]">
                            <div className="flex items-center gap-[10px] text-[#8A87AA]">
                                {formatNumber(tokenBalance, 2, true, {
                                    prefix: "$"
                                })}{" "}
                            </div>
                            <div className="text-[16px] text-[#8A87AA] flex items-center gap-[7px]">
                                <img
                                    className="w-[28px] h-[28px]"
                                    src={config.purchaseToken.icon}
                                />
                            </div>
                        </div>
                    </div>
                )} */}
          {/* <div className="mt-[20px] flex items-center justify-center gap-[8px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="27"
                        height="26"
                        viewBox="0 0 27 26"
                        fill="none"
                    >
                        <path
                            d="M11.7847 2.86099C12.5614 1.56556 14.4386 1.56556 15.2153 2.86099L23.3756 16.4716C24.1749 17.8046 23.2146 19.5 21.6603 19.5H5.33969C3.7854 19.5 2.82513 17.8046 3.62437 16.4716L11.7847 2.86099Z"
                            fill="#FF4372"
                        />
                        <path
                            d="M12.1593 7.5H14.8613L14.4273 14.416H12.5793L12.1593 7.5ZM13.5033 18.14C13.0647 18.14 12.71 18.014 12.4393 17.762C12.1687 17.5007 12.0333 17.1647 12.0333 16.754C12.0333 16.3433 12.1687 16.012 12.4393 15.76C12.71 15.508 13.0647 15.382 13.5033 15.382C13.942 15.382 14.2967 15.508 14.5673 15.76C14.838 16.012 14.9733 16.3433 14.9733 16.754C14.9733 17.1647 14.838 17.5007 14.5673 17.762C14.2967 18.014 13.942 18.14 13.5033 18.14Z"
                            fill="#252525"
                        />
                    </svg>
                    <div className="text-[14px] text-[#FF4372] whitespace-nowrap flex items-center gap-[4px]">
                        Make sure to send funds to{" "}
                        <span className="font-bold">{chainConfig[token?.blockchain]?.name}</span>
                    </div>
                </div> */}
        </>
      )}
    </div>
  );
}
