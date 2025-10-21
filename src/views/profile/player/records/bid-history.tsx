import clsx from "clsx";
import GridTable, { GridTableAlign } from "@/components/grid-table";
import dayjs from "dayjs";
import Pagination from "@/components/pagination";
import { formatNumber } from "@/utils/format/number";
import { useNavigate } from "react-router-dom";
import useCopy from "@/hooks/use-copy";
import { useAuth } from "@/contexts/auth";
import { BASE_TOKEN } from "@/config/btc";
import PointIcon from "@/components/icons/point-icon";

const BidHistory = (props: any) => {
  const { className, page, loading, data, hasMore, onPageChange } = props;

  const navigate = useNavigate();
  const { onCopy } = useCopy();
  const { address } = useAuth();

  const columns: any[] = [
    {
      dataIndex: "marketId",
      title: "Market ID",
      width: "10%",
      fixed: true,
      render: (record: any) => {
        return (
          <div
            className="flex items-center gap-[7px] cursor-pointer"
            onClick={() => {
              navigate(`/btc/detail/${record.pool_id}`);
            }}
          >
            <div className="">#{record.pool_id}</div>
            <img
              src="/profile/icon-share.svg"
              alt="share"
              className="w-[9px] h-[9px] shrink-0"
            />
          </div>
        );
      }
    },
    {
      dataIndex: "market_size",
      title: "Market Size",
      width: "15%",
      render: (record: any) => {
        return (
          <div>
            {formatNumber(
              Number(record.reward_amount) /
                10 ** record.reward_token_info?.[0].decimals,
              6,
              true
            )}{" "}
            {BASE_TOKEN.symbol}
          </div>
        );
      }
    },
    {
      dataIndex: "purchase_amount",
      title: "Bid",
      width: "15%",
      render: (record: any) => {
        return `${formatNumber(record.purchase_amount, 4, true, {
          isShort: true,
          isShortUppercase: true,
          prefix: "-"
        })} ${record.purchase_token_info?.symbol}`;
      }
    },
    {
      dataIndex: "results",
      title: "Rewards",
      width: "25%",
      render: (record: any) => {
        if (
          record.pool_info.winner_user?.toLowerCase() ===
            address?.toLowerCase() &&
          record.winner_point_reward === "0" &&
          record.winner_ticket_number === 0
        ) {
          return (
            <div className="bg-[#FFC42F] h-[30px] flex items-center gap-[6px] leading-[30px] rounded-[12px] px-[10px] font-[600] text-[12px]">
              <span>
                {formatNumber(
                  Number(record.reward_amount) /
                    10 ** record.reward_token_info?.[0].decimals,
                  6,
                  true
                )}
              </span>
              <img className="w-[20px] h-[20px]" src={BASE_TOKEN.icon} />
            </div>
          );
        }
        let str = "";
        if (
          record.winner_point_reward &&
          Number(record.winner_point_reward) !== 0
        ) {
          str += formatNumber(record.winner_point_reward, 0, true) + " credits";
        }
        if (
          record.winner_ticket_number &&
          Number(record.winner_ticket_number) !== 0
        ) {
          if (str) str += " + ";
          str += record.winner_ticket_number + " tickets";
        }
        return (
          <div className="flex items-center gap-[10px]">
            {!!record.winner_point_reward &&
              Number(record.winner_point_reward) !== 0 && (
                <div className="flex items-center gap-[4px]">
                  <span>
                    {formatNumber(record.winner_point_reward, 0, true)}
                  </span>
                  <PointIcon size={16} />
                </div>
              )}
            {!!record.winner_ticket_number &&
              Number(record.winner_ticket_number) !== 0 && (
                <div className="flex items-center gap-[4px]">
                  <span>
                    {formatNumber(record.winner_ticket_number, 0, true)}
                  </span>
                  <img
                    src="/lucky-draw/ticket.png"
                    alt="ticket"
                    className="w-[37px] h-[22px]"
                  />
                </div>
              )}
          </div>
        );
      }
    },
    {
      dataIndex: "date",
      title: "Date / tx",
      width: "30%",
      align: GridTableAlign.Right,
      render: (record: any) => {
        return (
          <div className="flex items-center gap-[10px] whitespace-nowrap">
            <div className="text-[#5E6B7D]">
              {dayjs(record.time).format("HH:mm D MMM, YYYY")}
            </div>
            <div className="text-[#0095FF] text-[14px] underline cursor-pointer">
              <a
                href={`https://nearblocks.io/txns/${record.result_tx_hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Tx
              </a>
            </div>

            <svg
              className="cursor-pointer"
              onClick={() => {
                onCopy(record.result_tx_hash);
              }}
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.28516 3.69531C7.54736 3.69502 7.8075 3.7465 8.04981 3.84668C8.29195 3.94684 8.51193 4.09406 8.69727 4.2793C8.88268 4.4647 9.02966 4.68544 9.12989 4.92773C9.23011 5.17012 9.28159 5.43009 9.28125 5.69238V11.002C9.30232 12.1068 8.38998 12.9989 7.28516 12.999H1.9961C1.73381 12.9994 1.47384 12.9488 1.23145 12.8486C0.989051 12.7484 0.768485 12.6005 0.583011 12.415C0.397763 12.2297 0.25054 12.0097 0.150393 11.7676C0.0501783 11.5252 -0.00129708 11.2652 -0.000973732 11.0029V5.69336C-0.00141736 5.43109 0.0502858 5.17113 0.150393 4.92871C0.250535 4.6863 0.397613 4.46579 0.583011 4.28027C0.768496 4.09472 0.988995 3.94695 1.23145 3.84668C1.47385 3.74646 1.73379 3.69498 1.9961 3.69531H7.28516ZM1.9961 4.96973C1.90102 4.96894 1.80674 4.98742 1.71875 5.02344C1.63076 5.05946 1.55063 5.11246 1.4834 5.17969C1.41618 5.24691 1.36317 5.32706 1.32715 5.41504C1.29114 5.50302 1.27265 5.59732 1.27344 5.69238V11.002C1.27265 11.097 1.29114 11.1913 1.32715 11.2793C1.36317 11.3673 1.41618 11.4474 1.4834 11.5146C1.55063 11.5819 1.63076 11.6349 1.71875 11.6709C1.80674 11.7069 1.90102 11.7254 1.9961 11.7246H7.28516C7.38013 11.7254 7.4746 11.7069 7.5625 11.6709C7.65039 11.6349 7.73069 11.5818 7.79785 11.5146C7.865 11.4475 7.91811 11.3672 7.9541 11.2793C7.99008 11.1914 8.00762 11.097 8.00684 11.002V5.69238C8.00762 5.59736 7.99009 5.50299 7.9541 5.41504C7.91811 5.32712 7.86501 5.24688 7.79785 5.17969C7.73069 5.11252 7.65039 5.05946 7.5625 5.02344C7.4746 4.98745 7.38013 4.96898 7.28516 4.96973H1.9961ZM10.1104 0.935547C10.6114 0.93666 11.092 1.13595 11.4463 1.49023C11.8003 1.84439 11.9998 2.32444 12.001 2.8252V8.34766C11.9999 8.84868 11.8006 9.32931 11.4463 9.68359C11.092 10.0379 10.6114 10.2372 10.1104 10.2383C9.94152 10.2383 9.77962 10.171 9.66016 10.0518C9.54066 9.93227 9.47364 9.76957 9.47364 9.60059C9.47373 9.43172 9.54074 9.2698 9.66016 9.15039C9.77963 9.03101 9.94145 8.96387 10.1104 8.96387C10.2738 8.96387 10.4304 8.89874 10.5459 8.7832C10.6614 8.66766 10.7266 8.51105 10.7266 8.34766V2.8252C10.7265 2.66195 10.6613 2.50509 10.5459 2.38965C10.4304 2.27425 10.2737 2.20996 10.1104 2.20996H4.58789C4.42462 2.21002 4.26782 2.27423 4.15235 2.38965C4.0369 2.50509 3.97179 2.66195 3.97168 2.8252C3.97168 2.99418 3.90465 3.15688 3.78516 3.27637C3.66572 3.39569 3.5038 3.46286 3.33496 3.46289C3.16614 3.46289 3.00423 3.39564 2.88477 3.27637C2.76527 3.15688 2.69727 2.99418 2.69727 2.8252C2.69849 2.32432 2.89874 1.84442 3.25293 1.49023C3.60716 1.13608 4.08699 0.936722 4.58789 0.935547H10.1104Z"
                fill="#ADBCCF"
              />
            </svg>
          </div>
        );
      }
    }
  ];

  return (
    <div className={clsx("mt-[20px]", className)}>
      <GridTable
        // data={[...data, ...data].slice(0, 10)}
        data={data}
        columns={columns}
        loading={loading}
        className="max-md:w-full max-md:overflow-x-auto"
        rowClassName="max-md:px-0 max-md:gap-x-0"
        colClassName="max-md:px-[10px] max-md:bg-[#22201D]"
        bodyColClassName="max-md:first:border-r max-md:border-[#423930]"
      />
      <div className="flex justify-end items-center pt-[18px] max-md:justify-center">
        <Pagination
          current={page}
          hasNextPage={hasMore}
          size={10}
          onPrev={onPageChange}
          onNext={onPageChange}
        />
      </div>
    </div>
  );
};

export default BidHistory;
