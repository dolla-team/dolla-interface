import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";
import useIsBtc from "@/hooks/use-is-btc";

export default function Actions() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isBtc = useIsBtc();

  return (
    <div className="absolute bottom-0 right-0 border-t border-[#313038] px-[20px] pt-[12px] w-full">
      {MENU.map((item) => (
        <button
          key={item.key}
          className="flex button items-center gap-[8px] w-full h-[40px] mb-[10px] rounded-[10px] bg-[#F2F2F21A] backdrop-blur-[25px] pl-[12px]"
          onClick={(e) => {
            if (item.key === "logout") {
              logout();
            } else if (item.key === "invite") {
            } else if (item.key === "portfolio") {
              navigate("/portfolio/player");
            } else if (item.key === "create-market") {
              navigate(isBtc ? "/btc/create" : "/nft/create");
            } else if (item.key === "claim") {
              e.stopPropagation();
              // claimTestCoin();
            }
          }}
        >
          {item.icon}
          <span className="text-[12px] text-white">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

const MENU = [
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
          strokeWidth="2"
        />
      </svg>
    )
  }
];
