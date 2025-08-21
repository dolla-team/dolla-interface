import Avatar from "@/components/avatar";
import { formatAddress } from "@/utils/format/address";
import { useAuth } from "@/contexts/auth";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { INVATE_ACTIVE } from "@/config";
import useCopy from "@/hooks/use-copy";
import { useUser } from "@privy-io/react-auth";
import AvatarCashier from "./avatar-cashier";
import { useEffect, useState } from "react";
// import useClaimTestCoin from "@/hooks/solana/use-claim-test-coin";
import { AnimatePresence, motion } from "framer-motion";
// import Loading from "@/components/icons/loading";
import useWalletStore from "@/stores/use-wallet";

const MENU = [
  {
    key: "invite",
    label: "Invite",
    isActive: INVATE_ACTIVE,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M7.26191 8.95365C6.68507 8.95413 6.11408 8.83828 5.58316 8.61304C5.05224 8.38781 4.57234 8.05783 4.17222 7.64288C3.34666 6.79605 2.88722 5.65926 2.89286 4.4774C2.89286 3.28091 3.34716 2.15756 4.17222 1.31191C4.57224 0.896757 5.0521 0.566564 5.58302 0.341131C6.11395 0.115697 6.68499 -0.000332168 7.26191 7.14236e-07C8.42912 7.14236e-07 9.52539 0.466253 10.3516 1.31076C11.1767 2.15779 11.6358 3.29455 11.6298 4.47625C11.6298 5.67274 11.1755 6.79723 10.3505 7.64174C9.95043 8.05689 9.47057 8.38708 8.93965 8.61252C8.40873 8.83795 7.83768 8.95398 7.26076 8.95365H7.26191ZM7.26191 2.19184C5.99971 2.19184 4.97325 3.21691 4.97325 4.4774C4.97325 5.73673 5.99971 6.76295 7.26191 6.76295C8.5241 6.76295 9.55056 5.73673 9.55056 4.4774C9.55056 3.21691 8.5241 2.19184 7.26191 2.19184ZM1.11229 15.9989C0.577886 15.9989 0 15.7726 0 15.4926C0 14.4938 0.191103 12.3728 0.567587 11.4598C0.928417 10.5839 1.45443 9.7855 2.11701 9.10792C2.77109 8.43454 3.55095 7.89566 4.41253 7.52175C5.2996 7.13649 6.25682 6.93846 7.22415 6.94008C8.62366 6.94008 9.66614 7.18806 10.3516 7.68288L9.21871 9.52732C8.83422 9.26562 8.16936 9.13535 7.22415 9.13535C4.14933 9.13535 1.76455 12.4243 2.331 15.4938C2.38249 15.7703 1.64783 16 1.11343 16L1.11229 15.9989ZM16 13.6013H8.04234V11.5809H16V13.6013ZM11.3311 15.9783V9.17306H13.3589V15.9783H11.3311Z"
          fill="white"
        />
      </svg>
    )
  },
  {
    key: "portfolio",
    label: "Portfolio",
    isActive: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="18"
        viewBox="0 0 19 18"
        fill="none"
      >
        <path
          d="M18.8408 9.04102L14.3408 16.041L13.791 16.8965L12.9453 16.332L9.23145 13.8564L6.7998 17.0996L5.2002 15.9004L8.2002 11.9004L8.76758 11.1436L9.55469 11.668L13.208 14.1035L17.1592 7.95898L18.8408 9.04102ZM7.26172 6.10337e-07C8.42887 6.10337e-07 9.52537 0.466117 10.3516 1.31055C11.1767 2.15757 11.6358 3.29486 11.6299 4.47656C11.6298 5.67287 11.1755 6.79718 10.3506 7.6416C10.3428 7.64968 10.334 7.65703 10.3262 7.66504C10.3346 7.67098 10.3432 7.67661 10.3516 7.68262L9.21875 9.52734C8.83432 9.26569 8.16958 9.13579 7.22461 9.13574C4.1498 9.13574 1.76461 12.4246 2.33105 15.4941C2.38179 15.7705 1.64743 16 1.11328 16L1.1123 15.999C0.577903 15.999 0 15.7722 0 15.4922C5.3825e-05 14.4933 0.19102 12.373 0.567383 11.46C0.928186 10.5842 1.45468 9.78594 2.11719 9.1084C2.70795 8.5002 3.40153 8.00205 4.16504 7.63574C3.34396 6.78971 2.88699 5.65598 2.89258 4.47754C2.89258 3.28105 3.34681 2.15718 4.17188 1.31152C4.57189 0.896386 5.0521 0.56625 5.58301 0.340821C6.11384 0.115439 6.6849 -0.0003067 7.26172 6.10337e-07ZM7.26172 2.19141C5.99961 2.19151 4.97363 3.21712 4.97363 4.47754C4.97371 5.73675 5.99966 6.76259 7.26172 6.7627C8.52386 6.7627 9.5507 5.73681 9.55078 4.47754C9.55078 3.21706 8.52391 2.19141 7.26172 2.19141Z"
          fill="white"
        />
      </svg>
    )
  },
  {
    key: "create-market",
    label: "Create Market",
    isActive: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2ZM10 8H13V10H10V13H8V10H5V8H8V5H10V8Z"
          fill="white"
        />
      </svg>
    )
  },
  // {
  //   key: "claim",
  //   label: "Airdrop",
  //   isActive: true,
  //   icon: <span className="text-[20px]">$</span>
  // },
  {
    key: "logout",
    label: "Disconnect",
    isActive: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
      >
        <path
          d="M8.91304 1L1 1V14H8.91304M6.08696 7.19048H14M14 7.19048L10.6087 3.47619M14 7.19048L10.6087 10.9048"
          stroke="white"
          stroke-width="2"
        />
      </svg>
    )
  }
];

export default function AvatarAction() {
  const { userInfo, logout, quoteTokenBalance, address } = useAuth();
  const navigate = useNavigate();
  const { onCopy } = useCopy();
  const { user } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  // const { claiming, claimTestCoin } = useClaimTestCoin();
  const { set } = useWalletStore();
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenu(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative group flex items-center gap-[10px]">
      {user?.wallet?.address && (
        <AvatarCashier
          onClick={() => {
            set({ showWallet: true });
          }}
          tokenBalance={quoteTokenBalance}
        />
      )}
      {userInfo?.icon && (
        <Avatar
          size={32}
          address={address}
          email={userInfo?.show_email}
          className="shrink-0 button"
          onClick={(e: any) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        />
      )}

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
              opacity: { duration: 0.15 },
              scale: { duration: 0.2 }
            }}
            className={clsx(
              "w-[208px] rounded-[10px] bg-[#2D2B35] border border-[#514A5D] absolute right-0 top-[40px] text-white"
            )}
          >
            <div className="p-[10px] flex gap-[8px] items-center border-b border-[#423930]">
              <Avatar
                size={32}
                address={userInfo.user}
                email={userInfo?.email}
                className="shrink-0"
              />
              <div className="flex-1 w-0 whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="text-[12px] font-medium">
                  {user?.email?.address}
                </span>
                <div className="flex items-center gap-[3px]">
                  <span className="text-[12px]">
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
            {MENU.map((item: any, index: number) => (
              <div
                key={item.key + index}
                className={clsx(
                  "px-[20px] py-[12px] flex items-center justify-between text-[12px] font-medium",
                  item.isActive ? "hover:bg-[#00000033] button" : "opacity-50"
                )}
                onClick={(e) => {
                  if (item.key === "logout") {
                    logout();
                    return;
                  } else if (item.key === "invite") {
                    return;
                  } else if (item.key === "portfolio") {
                    navigate("/portfolio/player");
                    return;
                  } else if (item.key === "create-market") {
                    navigate("/nft/create");
                    return;
                  } else if (item.key === "claim") {
                    e.stopPropagation();
                    // claimTestCoin();
                    return;
                  }
                }}
              >
                <div className="flex items-center gap-[16px]">
                  <div className="w-[20px]">{item.icon}</div>
                  <span>{item.label}</span>
                </div>
                {!item.isActive && (
                  <div className="w-[38px] h-[20px] rounded-[6px] bg-[#4C4C4C] text-[12px] text-center leading-[20px]">
                    soon
                  </div>
                )}
                {/* {item.key === "claim" && claiming && <Loading size={16} />} */}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
