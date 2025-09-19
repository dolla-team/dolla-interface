import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { motion } from "framer-motion";
import Coin from "@/components/icons/coin";
import clsx from "clsx";

// Register Chart.js components
Chart.register(...registerables);

// Tooltip React 组件
function ChartTooltip({
  visible,
  x,
  y,
  profit,
  date
}: {
  visible: boolean;
  x: number;
  y: number;
  profit: string;
  date: string;
}) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute bg-[#1A1E24] border border-[#484848] rounded-[6px] py-[8px] px-[10px] min-w-[120px] shadow-none z-50 pointer-events-none"
      style={{ left: x, top: y - 14 }}
    >
      <div className="flex items-center gap-[24px] text-[12px]">
        <span className="text-[#5E6B7D]">{date}</span>
        <div className="flex gap-[2px] items-center">
          <span
            className={clsx(
              Number(profit) < 0 ? "text-[#FF2687]" : "text-white"
            )}
          >
            {profit}
          </span>
          <Coin size={12} />
        </div>
      </div>
      {Number(profit) > 0 && (
        <>
          <div className="text-center text-[16px] text-[#57FF70] mt-[10px]">
            $0.001
          </div>
          <div className="text-center text-[12px] text-[#5E6B7D]">You won</div>
        </>
      )}
    </motion.div>
  );
}

export default function ProfileChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    profit: "",
    date: ""
  });

  const chartData = [
    { played: 10, profit: -100, date: "2025-06-23" },
    { played: 25, profit: -50, date: "2025-06-24" },
    { played: 40, profit: 0, date: "2025-06-25" },
    { played: 35, profit: 100, date: "2025-06-26" },
    { played: 60, profit: 30, date: "2025-06-27" },
    { played: 45, profit: 150, date: "2025-06-28" },
    { played: 80, profit: 200, date: "2025-06-29" }
  ];

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // 构建 labels 和 datasets
    const data = {
      labels: chartData.map((d) => d.played), // x-axis: Played
      datasets: [
        {
          label: "Profit",
          data: chartData.map((d) => d.profit), // y-axis: Profit
          borderColor: "#FFC42F",
          backgroundColor: "rgba(255, 196, 47, 0.1)",
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: "#FFC42F",
          pointHoverBorderColor: "#FFC42F"
        }
      ]
    };

    // Custom external tooltip handler (React state)
    function externalTooltipHandler(context: any) {
      const { chart, tooltip } = context;
      if (tooltip.opacity === 0) {
        setTooltip((t) => ({ ...t, visible: false }));
        return;
      }
      if (tooltip.body && chartContainerRef.current) {
        const containerRect = chartContainerRef.current.getBoundingClientRect();
        const canvasRect = chart.canvas.getBoundingClientRect();
        const x = tooltip.caretX + (canvasRect.left - containerRect.left) - 60;
        const y = tooltip.caretY + (canvasRect.top - containerRect.top) - 48;
        const dataIndex = tooltip.dataPoints[0].dataIndex;
        const profit = chartData[dataIndex].profit;
        const date = chartData[dataIndex].date;
        setTooltip({
          visible: true,
          x,
          y,
          profit: String(profit),
          date
        });
      }
    }

    const config = {
      type: "line" as const,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false, // Disable the default tooltip
            external: externalTooltipHandler
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Played",
              color: "#5E6B7D",
              font: {
                size: 10
              }
            },
            grid: {
              display: true,
              color: (context: any) => {
                return context.tick?.value === 0
                  ? "rgba(94, 107, 125, 0.3)"
                  : "transparent";
              }
            },
            ticks: {
              color: "#5E6B7D",
              font: {
                size: 10,
                family: "Unbounded"
              }
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Profit",
              color: "#5E6B7D",
              font: {
                size: 10,
                family: "Unbounded"
              }
            },
            grid: {
              display: true,
              color: "rgba(94, 107, 125, 0.3)",
              drawBorder: false
            },
            ticks: {
              color: "#5E6B7D",
              font: {
                size: 10,
                family: "Unbounded"
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: "index" as const
        }
      }
    };

    chartInstance.current = new Chart(ctx, config);

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div
      className="h-[340px] w-full bg-[#1A1E24] rounded-[6px] px-[20px] py-[16px] mt-[10px] relative"
      ref={chartContainerRef}
    >
      <canvas ref={chartRef}></canvas>
      <ChartTooltip {...tooltip} />
    </div>
  );
}
