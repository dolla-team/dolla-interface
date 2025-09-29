import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import FundFromCoinbase from "./fund-from-coinbase";
import FundFromMoonpay from "./fund-from-moonpay";
import useCopy from "@/hooks/use-copy";
import BackIcon from "@/sections/wallet/back-icon";
import RechargeFrom1click from "./recharge-from-1click";

interface FundOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function FundList({ onBack }: { onBack: () => void }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const fundOptions: FundOption[] = [
    // {
    //   id: "bridge",
    //   title: "Bridge",
    //   description: "Bridge from another chain",
    //   icon: (
    //     <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
    //       <svg
    //         width="36"
    //         height="36"
    //         viewBox="0 0 36 36"
    //         fill="none"
    //         xmlns="http://www.w3.org/2000/svg"
    //       >
    //         <circle cx="18" cy="18" r="18" fill="#090909" />
    //         <path
    //           d="M18.501 9.95898C24.7142 9.95944 29.7767 14.8825 30.001 21.041H25.7383C25.5581 16.2955 22.387 12.5172 18.501 12.5166C14.6145 12.5166 11.4419 16.2952 11.2617 21.041H6.99902C7.22333 14.8822 12.2874 9.95898 18.501 9.95898Z"
    //           fill="#fff"
    //         />
    //       </svg>
    //     </div>
    //   ),
    //   onClick: () => {
    //     // setSelectedOption("bridge");
    //     if (userInfo?.user) {
    //       const windowWidth = 800;
    //       const windowHeight = 600;
    //       const left = (screen.width - windowWidth) / 2;
    //       const top = (screen.height - windowHeight) / 2;
    //       window.open(
    //         `https://dolla-bridge-interface.pages.dev?toAddress=${userInfo?.user}`,
    //         "_blank",
    //         `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`
    //       );
    //     }
    //   }
    // },
    {
      id: "centralized-exchange",
      title: "Centralized Exchange",
      description: "Transfer from an centralized exchange",
      icon: (
        <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="18" cy="18" r="18" fill="#090909" />
            <path
              d="M15.2384 15.9692H9.33066C9.26984 15.969 9.21039 15.9511 9.15955 15.9177C9.1087 15.8844 9.06867 15.8369 9.04433 15.7812C9.01998 15.7254 9.01237 15.6638 9.02244 15.6039C9.0325 15.5439 9.05979 15.4881 9.10099 15.4434L14.6968 9.4316C14.7398 9.38594 14.7954 9.35423 14.8566 9.34055C14.9178 9.32688 14.9817 9.33187 15.0401 9.35489C15.0984 9.37791 15.1485 9.4179 15.1838 9.46969C15.2192 9.52147 15.2382 9.58267 15.2384 9.64538V13.4876C15.2384 13.6609 15.3785 13.7996 15.5519 13.7996H27.0757C27.249 13.7996 27.3891 13.9397 27.3891 14.113V15.6557C27.3891 15.829 27.249 15.9692 27.0757 15.9692H15.2384ZM20.762 20.0309H26.6698C26.7306 20.0311 26.79 20.049 26.8409 20.0824C26.8917 20.1157 26.9318 20.1632 26.9561 20.2189C26.9805 20.2746 26.9881 20.3363 26.978 20.3962C26.9679 20.4562 26.9406 20.512 26.8994 20.5567L21.3037 26.5685C21.2607 26.6141 21.205 26.6459 21.1438 26.6595C21.0826 26.6732 21.0187 26.6682 20.9604 26.6452C20.902 26.6222 20.852 26.5822 20.8166 26.5304C20.7812 26.4786 20.7622 26.4174 20.762 26.3547V22.5212C20.762 22.438 20.729 22.3583 20.6702 22.2995C20.6114 22.2407 20.5317 22.2077 20.4486 22.2077H8.92477C8.84189 22.2077 8.76238 22.1749 8.70364 22.1164C8.6449 22.0579 8.61171 21.9786 8.61133 21.8957V20.3429C8.61133 20.1696 8.75144 20.0295 8.92477 20.0295H20.762V20.0309Z"
              fill="#fff"
            />
          </svg>
        </div>
      ),
      onClick: () => {
        console.log("Centralized Exchange clicked");
        setSelectedOption("centralized-exchange");
      }
    },
    {
      id: "coinbase",
      title: "Coinbase",
      description: "Instant Fees 0.5 - 2.5%",
      icon: (
        <div className="w-6 h-6 rounded-full flex items-center justify-center">
          <img
            src="/fund/coinbase.png"
            alt="Coinbase"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      onClick: () => {
        console.log("Coinbase clicked");
        setSelectedOption("coinbase");
      }
    }
    // {
    //   id: "moonpay",
    //   title: "Moonpay",
    //   description: "Instant Fees 0.5 - 2.5%",
    //   icon: (
    //     <div className="w-6 h-6 rounded-full flex items-center justify-center">
    //       <img
    //         src="/fund/moonpay.png"
    //         alt="Moonpay"
    //         className="w-full h-full object-cover"
    //       />
    //     </div>
    //   ),
    //   onClick: () => {
    //     console.log("Moonpay clicked");
    //     setSelectedOption("moonpay");
    //   }
    // }
  ];

  return (
    <>
      {!selectedOption && (
        <>
          <div
            className="flex items-center gap-[18px] text-[16px] cursor-pointer button"
            onClick={onBack}
          >
            <BackIcon />
            <div className="text-[#8A87AA]">Deposit</div>
          </div>
          <div className="space-y-2 pt-[20px] pb-[20px]">
            {fundOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-3 bg-[#1A1E24] rounded-lg border border-[#383F47] cursor-pointer hover:bg-[#2A3440] transition-colors duration-200"
                onClick={option.onClick}
              >
                <div className="flex items-center space-x-3">
                  {option.icon}
                  <div className="flex flex-col">
                    <span className="text-[#8A87AA] text-[14px]">
                      {option.title}
                    </span>
                    <span className="text-[#8A87AA] text-[10px]">
                      {option.description}
                    </span>
                  </div>
                </div>
                <div className="text-[#8A87AA]">
                  <svg
                    width="6"
                    height="14"
                    viewBox="0 0 6 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 0.60182L3.654 6.60782L0 12.6138L1.386 13.2158L5.404 6.60782L1.386 -0.000180244L0 0.60182Z"
                      fill="#8A87AA"
                    />
                  </svg>
                </div>
              </div>
            ))}
            <div
              className="text-[14px] font-medium text-[#8A87AA] text-center mt-[20px] button"
              onClick={() => {
                setSelectedOption("maually");
              }}
            >
              Deposit Funds Manually
            </div>
          </div>
        </>
      )}

      {(selectedOption === "centralized-exchange" ||
        selectedOption === "maually") && (
        <RechargeFrom1click setSelectedOption={setSelectedOption} />
      )}

      {selectedOption === "coinbase" && (
        <FundFromCoinbase onBack={() => setSelectedOption(null)} />
      )}

      {selectedOption === "moonpay" && (
        <FundFromMoonpay onBack={() => setSelectedOption(null)} />
      )}
    </>
  );
}
