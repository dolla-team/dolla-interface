import { useNearWallet } from "@/contexts/wallet/near";
import axiosInstance from "@/libs/axios";
import { useEffect, useRef, useState } from "react";
import GridTable from "@/components/grid-table";
import Pagination from "@/components/pagination";
import { formatAddress } from "@/utils/format/address";
import { formatNumber } from "@/utils/format/number";
import useCopy from "@/hooks/use-copy";
import { listGames } from "@/utils/near-contract";

export default function HistoryPanel() {
  const { accountId } = useNearWallet();
  const { onCopy } = useCopy();
  const [page, setPage] = useState(1);
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const gameCached = useRef<any[]>([]);

  const onQuery = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/apibtc/v1/btc/deposit/history?fromChainId=1&address=${accountId}&page=${page}&pageSize=10`
      );
      setList(res.data.result_data);
      setHasNextPage(res.data.result_data.length === 20);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getListGames = async () => {
    if (!accountId) {
      return;
    }
    const res = await listGames();
    gameCached.current = res;
  };

  useEffect(() => {
    if (accountId) onQuery();
  }, [accountId, page]);

  useEffect(() => {
    if (accountId) getListGames();
  }, [accountId]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Copy button component
  const CopyButton = ({ text }: { text: string }) => {
    if (!text) return null;

    return (
      <button
        className="ml-2 p-1 hover:bg-[#2A2A2A] rounded transition-colors button"
        onClick={() => onCopy(text)}
        title="Copy to clipboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M4.5 2.5C4.5 2.22386 4.72386 2 5 2H9.5C9.77614 2 10 2.22386 10 2.5V7C10 7.27614 9.77614 7.5 9.5 7.5H5C4.72386 7.5 4.5 7.27614 4.5 7V2.5Z"
            stroke="#BBACA6"
            strokeWidth="1"
          />
          <path
            d="M2.5 4.5C2.22386 4.5 2 4.72386 2 5V9.5C2 9.77614 2.22386 10 2.5 10H7C7.27614 10 7.5 9.77614 7.5 9.5V5C7.5 4.72386 7.27614 4.5 7 4.5H2.5Z"
            stroke="#BBACA6"
            strokeWidth="1"
          />
        </svg>
      </button>
    );
  };

  // Define table columns
  const columns = [
    {
      dataIndex: "Amount",
      title: "Amount",
      width: "8%",
      render: (record: any) => {
        return (
          <div className="text-[#FFC42F]">
            {formatNumber(record.Amount / 1e8, 4, true)}
          </div>
        );
      }
    },
    {
      dataIndex: "BtcValue",
      title: "BtcValue",
      width: "8%",
      render: (record: any) => {
        return (
          <div className="text-[#FFC42F]">
            {formatNumber(record.BtcValue, 0, true, { prefix: "$" })}
          </div>
        );
      }
    },
    {
      dataIndex: "Status",
      title: "Status",
      width: "10%",
      render: (record: any) => {
        // Determine status based on record data
        let text = "Pending";
        let statusColor = "text-[#FFC42F]";
        const status = record.Status;

        if (status === 4) {
          text = "Success";
          statusColor = "text-[#54FF59]";
        } else if (status === 0) {
          text = "Processing";
          statusColor = "text-[#FFA500]";
        } else if (status === 3) {
          text = "Verified";
          statusColor = "text-[#75AEFD]";
        } else if (status >= 50) {
          text = "Failed";
          statusColor = "text-red-500";
        }

        return <div className={`${statusColor} font-medium`}>{text}</div>;
      }
    },
    {
      dataIndex: "FromAccount",
      title: "From Account",
      width: "14%",
      ellipsis: true,
      render: (record: any) => {
        return (
          <div className="text-white flex items-center">
            {formatAddress(record.FromAccount, 3)}
            <CopyButton text={record.FromAccount} />
          </div>
        );
      }
    },
    {
      dataIndex: "DepositAccount",
      title: "Deposit Account",
      width: "14%",
      ellipsis: true,
      render: (record: any) => {
        return (
          <div className="text-white flex items-center">
            {formatAddress(record.DepositAccount, 3)}
            <CopyButton text={record.DepositAccount} />
          </div>
        );
      }
    },
    {
      dataIndex: "FromTxHash",
      title: "From Tx Hash",
      width: "14%",
      ellipsis: true,
      render: (record: any) => {
        return (
          <div className="text-[#BBACA6] font-mono text-[12px] flex items-center">
            {formatAddress(record.FromTxHash, 5)}
            <CopyButton text={record.FromTxHash} />
          </div>
        );
      }
    },
    {
      dataIndex: "ToTxHash",
      title: "To Tx Hash",
      width: "14%",
      ellipsis: true,
      render: (record: any) => {
        return (
          <div className="text-[#BBACA6] font-mono text-[12px] flex items-center">
            {formatAddress(record.ToTxHash, 5)}
            <CopyButton text={record.ToTxHash} />
          </div>
        );
      }
    },
    {
      dataIndex: "VerifyTxHash",
      title: "Verify Tx Hash",
      width: "14%",
      ellipsis: true,
      render: (record: any) => {
        return (
          <div className="text-[#BBACA6] font-mono text-[12px] flex items-center">
            {formatAddress(record.VerifyTxHash, 5)}
            <CopyButton text={record.VerifyTxHash} />
          </div>
        );
      }
    }
  ];

  return (
    <div className="grow bg-gray-800 rounded-lg p-6">
      <div className="text-white text-[18px] font-[DelaGothicOne] mb-6">
        Deposit History
      </div>
      <div className="flex flex-col">
        {/* Table Section */}
        <div className="flex-1 min-h-0">
          <GridTable
            columns={columns}
            data={list}
            loading={loading}
            className="h-full"
            bodyClassName="overflow-y-auto overflow-x-hidden"
            emptyClassName="py-[50px]"
          />
        </div>

        {/* Pagination Section */}
        {!loading && list.length > 0 && (
          <div className="flex justify-end items-center pt-4 mt-4">
            <Pagination
              size={20}
              hasNextPage={hasNextPage}
              onPrev={handlePageChange}
              onNext={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
