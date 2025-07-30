import { useEffect } from "react";
import ButtonV2 from "@/components/button/v2";
import { formatAddress } from "@/utils/format/address";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import useClaimFunds from "@/hooks/solana/use-claim-funds";
import { useAuth } from "@/contexts/auth";
import { useMemo } from "react";
import useClaimReward from "@/hooks/solana/use-claim-reward";
import { useNavigate } from "react-router-dom";
import { getProfitFee } from "@/utils/pool";
import GridTable from "@/components/grid-table";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";

const ClaimIndex = (props: any) => {
  const { className, type } = props;

  const { onQueryUserInfo, userInfo, userInfoLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const columns = [
    {
      dataIndex: "pool_id",
      title: "Market ID",
      width: isMobile ? 90 : 120,
      fixed: true,
      render: (record: any) => {
        return (
          <a
            className="py-[10px] flex items-center gap-[7px]"
            href={"javascript: void(0);"}
            onClick={() => {
              navigate(`/btc/${record.pool_id}`);
            }}
          >
            <div>
              #{record.pool_id}
            </div>
            <img src="/profile/icon-share.svg" className="w-[9px] h-[9px] shrink-0" />
          </a>
        );
      }
    },
    {
      dataIndex: "marketSize",
      title: "Market Size",
      width: 120,
      render: (record: any) => {
        return (
          <>
            {formatNumber(Big(record.reward_amount || 0).div(10 ** (record.reward_token_info?.[0]?.decimals || 6)), 4, true, { isShort: true, isShortUppercase: true })} {record.reward_token_info?.[0]?.symbol || "BTC"}
          </>
        );
      }
    },
    {
      dataIndex: "winner",
      title: "Winner",
      width: isMobile ? 150 : void 0,
      render: (record: any) => {
        return formatAddress(record.winner_user);
      }
    },
    {
      dataIndex: "claimable",
      title: "Claimable",
      width: 110,
      render: (record: any) => {
        return formatNumber(
          type === "player" ? record.accumulative_bids : Big(record.accumulative_bids || 0).minus(getProfitFee(record)),
          2,
          true,
          {
            prefix: "$",
            isShort: type === "player" ? Big(record.accumulative_bids || 0).gt(100000) : Big(record.accumulative_bids || 0).minus(getProfitFee(record)).gt(100000),
            isShortUppercase: true
          }
        );
      }
    },
    {
      dataIndex: "action",
      title: "Action",
      width: isMobile ? 100 : 70,
      render: (record: any) => {
        return (
          <ClaimButton
            onQueryUserInfo={onQueryUserInfo}
            item={record}
            type={type}
          />
        );
      }
    },
  ];

  const list = useMemo(() => {
    if (!userInfo) {
      return [];
    }
    if (type === "player") {
      return userInfo.claim_winner_pool || [];
    }
    return userInfo.claim_pool || [];
  }, [userInfo, type]);

  useEffect(() => {
    onQueryUserInfo();
  }, []);

  return (
    <GridTable
      columns={columns}
      data={list}
      loading={userInfoLoading}
      className={clsx("h-full max-md:w-full max-md:overflow-x-auto", className)}
      rowClassName="max-md:px-0 max-md:gap-x-0"
      colClassName="max-md:px-[10px] max-md:bg-[#35302B]"
      bodyColClassName="max-md:first:border-r max-md:border-[#423930]"
      bodyClassName="md:overflow-y-auto md:h-[320px]"
    />
  );
};

export default ClaimIndex;

const ClaimButton = (props: any) => {
  const { onQueryUserInfo, item, type } = props;

  const { onClaim: onSellerClaim, claiming: sellerClaiming } = useClaimFunds({
    onClaimSuccess: () => {
      onQueryUserInfo();
    },
  });
  const { onClaim: onPlayerClaim, claiming: playerClaiming } = useClaimReward({
    onClaimSuccess: () => {
      onQueryUserInfo();
    },
  });

  const [onClaim, claiming] = useMemo(() => {
    const isPlayer = type === "player";
    if (isPlayer) {
      return [onPlayerClaim, playerClaiming];
    }
    return [onSellerClaim, sellerClaiming];
  }, [onSellerClaim, sellerClaiming, onPlayerClaim, playerClaiming, type]);

  return (
    <ButtonV2
      className="!w-[69px] !px-[unset]"
      loading={claiming}
      disabled={claiming || item.is_claim}
      onClick={() => {
        onClaim(item.pool_id);
      }}
    >
      {item.is_claim ? "Claimed" : "Claim"}
    </ButtonV2>
  );
};
