import { useRef, useEffect, useState, useMemo } from "react";
import { Chart } from "chart.js";
import { ProgressAvatar } from "@/views/btc/detail/end";
import usePoolVolume from "../use-pool-volume";
import { useBtcContext } from "@/views/btc/context";
import Empty from "@/components/dolla-eye/empty";
import Loading from "@/components/icons/loading";

interface BidsChartProps {
  chain: string;
  period: "1d" | "1w" | "1m" | "all";
  pool_id: number;
  status: number;
  winnerInfo: any;
  winnerBidsTime: any;
}

interface PointPosition {
  x: number;
  y: number;
  index: number;
}

export default function BidsChart({
  chain,
  period,
  pool_id,
  status,
  winnerInfo,
  winnerBidsTime
}: BidsChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showAvatar, setShowAvatar] = useState<boolean>(false);
  const [userPointPositions, setUserPointPositions] = useState<PointPosition[]>(
    []
  );
  const { data: volumeData, loading } = usePoolVolume({
    chain,
    period,
    pool_id
  });
  const { pool } = useBtcContext();

  useEffect(() => {
    if (!chartRef.current || loading) return;

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Transform API data to chart format
    const chartData = volumeData.map((item) => ({
      x: item.timestamp,
      y: item.volume
    }));

    // If no data, show empty chart
    if (chartData.length === 0) {
      chartData.push({ x: Date.now(), y: 0 });
    }

    const data = {
      datasets: [
        {
          label: "Total Bids",
          data: chartData,
          borderColor: status === 1 ? "#DD9000" : "#ABABAB",
          backgroundColor: (context: any) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              return status === 1 ? "#FFC42F" : "#ABABAB";
            }
            // Create gradient from top to bottom of chart area
            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            gradient.addColorStop(0, status === 1 ? "#FFC42F" : "#ABABAB");
            gradient.addColorStop(1, "#fff");
            return gradient;
          },
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0
        }
      ]
    };

    // Function to update point positions
    const updatePointPositions = () => {
      if (chartInstance.current && containerRef.current && chartRef.current) {
        const chart = chartInstance.current;
        const meta = chart.getDatasetMeta(0);
        const positions: PointPosition[] = [];

        meta.data.forEach((element: any, index: number) => {
          if (
            winnerBidsTime.includes(volumeData[index]?.timestamp) &&
            element.x !== undefined &&
            element.y !== undefined
          ) {
            // Get canvas position relative to container
            const canvasRect = chartRef.current!.getBoundingClientRect();
            const containerRect = containerRef.current!.getBoundingClientRect();

            // Calculate position relative to container
            const x = element.x + (canvasRect.left - containerRect.left);
            const y = element.y + (canvasRect.top - containerRect.top + 33);

            positions.push({
              x,
              y,
              index
            });
          }
        });

        setUserPointPositions(positions);

        setTimeout(() => {
          setShowAvatar(true);
        }, 1000);
      }
    };

    const config = {
      type: "line" as const,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          onComplete: () => {
            // Get data point positions after chart is drawn
            updatePointPositions();
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
          x: {
            type: "linear" as const,
            display: false,
            grid: {
              display: false
            },
            ticks: {
              display: false
            }
          },
          y: {
            display: false,
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.1)"
            },
            ticks: {
              display: false
            }
          }
        },
        interaction: {
          intersect: false,
          mode: "nearest" as const
        },
        onHover: undefined
      }
    };

    chartInstance.current = new Chart(ctx, config);

    // Also update positions after initial render and on resize
    setTimeout(updatePointPositions, 100);

    // Update positions on window resize
    const handleResize = () => {
      setTimeout(updatePointPositions, 100);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [volumeData, loading]);

  // Prepare user data for ProgressAvatar
  const userDataForAvatar = useMemo(() => {
    if (!winnerInfo || !pool) return null;
    return {
      winner_user_info: {
        icon: winnerInfo.icon,
        user: winnerInfo.user
      }
    };
  }, [winnerInfo, pool]);

  useEffect(() => {
    setShowAvatar(false);
  }, [period]);

  return (
    <div ref={containerRef} className="h-[200px] w-full mt-4 relative">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loading size={20} />
        </div>
      ) : volumeData.length > 0 ? (
        <canvas ref={chartRef} />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Empty />
          <div className="text-[12px] text-black/40 mt-[4px]">No data</div>
        </div>
      )}
      {!loading &&
        userDataForAvatar &&
        userPointPositions.length > 0 &&
        showAvatar && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {userPointPositions.map((position, idx) => {
              const originalIndex = position.index;
              return (
                <div
                  key={`${originalIndex}-${idx}`}
                  className="absolute"
                  style={{
                    left: `${position.x}px`,
                    top: `${position.y - 33}px`, // Position above the point
                    transform: "translateX(-50%)",
                    zIndex: idx
                  }}
                >
                  <ProgressAvatar
                    data={userDataForAvatar}
                    progress={0} // Not used when positioned absolutely
                    index={idx}
                    className="!rounded-full"
                  />
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
