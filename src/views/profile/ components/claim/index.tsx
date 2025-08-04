import { useState } from "react";
import ButtonV2 from "@/components/button/v2";
import { formatAddress } from "@/utils/format/address";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import useClaimFunds from "@/hooks/near/use-claim-funds";
import { useMemo } from "react";
import useClaimReward from "@/hooks/near/use-claim-reward";
import { useNavigate } from "react-router-dom";
import { getProfitFee } from "@/utils/pool";
import GridTable from "@/components/grid-table";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";
import { useRequest } from "ahooks";
import axiosInstance from "@/libs/axios";
import { useAuth } from "@/contexts/auth";
import Pagination from "@/components/pagination";

const ClaimIndex = (props: any) => {
  const { className, type } = props;

  const { onQueryUserInfo, userInfo, userInfoLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [pageHasNextPage, setPageHasNextPage] = useState(true);

  const {
    runAsync: getClaimList,
    data: claimList,
    loading: claimListLoading
  } = useRequest(
    async () => {
      let url: string = "/user/player/history";
      const params = new URLSearchParams();
      params.set("limit", pageSize + "");
      params.set("offset", pageIndex * pageSize + "");
      if (type === "player") {
        // 0: ALl
        // 1: Winner
        // 2: Loser
        params.set("winner", "1");
      } else {
        url = "/user/create/pool/list";
        // -1: All
        // 0: Created
        // 1: Sold
        // 2: Ended
        // 3: Cancelled
        params.set("status", "2");
      }
      const response = await axiosInstance.get(
        `/api/v1${url}?${params.toString()}`
      );
      const _list = response.data.data.list || [];
      _list.forEach((item: any) => {
        if (type === "seller") {
          item.pool_info = item;
        }
        if (type === "player") {
          item.is_claim = item.status === 6;
        }
      });
      setPageHasNextPage(response.data.data.has_next_page);
      return _list;
    },
    {
      refreshDeps: [pageIndex, pageSize]
    }
  );

  const onPageChange = (page: number) => {
    setPageIndex(page - 1);
  };

  const onAfterSuccess = () => {
    onQueryUserInfo();
    getClaimList();
  };

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
            <div>#{record.pool_id}</div>
            <img
              src="/profile/icon-share.svg"
              className="w-[9px] h-[9px] shrink-0"
            />
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
            {formatNumber(
              Big(record.reward_amount || 0).div(
                10 ** (record.reward_token_info?.[0]?.decimals || 6)
              ),
              4,
              true,
              { isShort: true, isShortUppercase: true }
            )}{" "}
            {record.reward_token_info?.[0]?.symbol || "BTC"}
          </>
        );
      }
    },
    {
      dataIndex: "winner",
      title: "Winner",
      width: isMobile ? 150 : void 0,
      render: (record: any) => {
        if (type === "player") {
          return formatAddress(userInfo?.sol_user || "");
        }
        return formatAddress(record.winner_user);
      }
    },
    {
      dataIndex: "claimable",
      title: "Claimable",
      width: 110,
      render: (record: any) => {
        return formatNumber(
          type === "player"
            ? record.pool_info?.accumulative_bids
            : Big(record.pool_info?.accumulative_bids || 0).minus(
                getProfitFee(record.pool_info)
              ),
          2,
          true,
          {
            prefix: "$",
            isShort:
              type === "player"
                ? Big(record.accumulative_bids || 0).gt(100000)
                : Big(record.accumulative_bids || 0)
                    .minus(getProfitFee(record))
                    .gt(100000),
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
            onAfterSuccess={onAfterSuccess}
            item={record}
            type={type}
          />
        );
      }
    }
  ];

  return (
    <div className="">
      <GridTable
        columns={columns}
        data={claimList}
        loading={claimListLoading}
        className={clsx(
          "h-full max-md:w-full max-md:overflow-x-auto",
          className
        )}
        rowClassName="max-md:px-0 max-md:gap-x-0"
        colClassName="max-md:px-[10px] max-md:bg-[#35302B]"
        bodyColClassName="max-md:first:border-r max-md:border-[#423930]"
        bodyClassName="md:overflow-y-auto md:h-[320px]"
      />
      <div className="flex justify-end items-center pt-[8px] max-md:justify-center">
        <Pagination
          current={pageIndex + 1}
          hasNextPage={pageHasNextPage}
          size={pageSize}
          onPrev={onPageChange}
          onNext={onPageChange}
        />
      </div>
    </div>
  );
};

export default ClaimIndex;

const ClaimButton = (props: any) => {
  const { onAfterSuccess, item, type } = props;

  const { onClaim: onSellerClaim, claiming: sellerClaiming } = useClaimFunds({
    onClaimSuccess: () => {
      onAfterSuccess();
    }
  });
  const { onClaim: onPlayerClaim, claiming: playerClaiming } = useClaimReward({
    onClaimSuccess: () => {
      onAfterSuccess();
    }
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
