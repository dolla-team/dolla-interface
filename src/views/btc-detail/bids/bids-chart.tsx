import { useRef, useEffect, useState, useMemo } from "react";
import { Chart } from "chart.js";
import ProgressAvatar from "@/views/btc/detail/end/progress-avatar";
import usePoolVolume from "../use-pool-volume";
import { useBtcContext } from "@/views/btc/context";
import Empty from "@/components/dolla-eye/empty";
import Loading from "@/components/icons/loading";
import { formatNumber } from '@/utils/format/number'
import Big from 'big.js'

interface BidsChartProps {
  label: string
  chain: string
  period: '1d' | '1w' | '1m' | 'all'
  pool_id: number
  status: number
  winnerInfo: any
  winnerBidsTime: any
  winnerBidList: any[]
}

interface PointPosition {
  x: number;
  y: number;
  index: number;
}

export default function BidsChart({
  label,
  chain,
  period,
  pool_id,
  status,
  winnerInfo,
  winnerBidList,
  winnerBidsTime,
}: BidsChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState<boolean>(false)
  const [showAvatar, setShowAvatar] = useState<boolean>(false)
  const [userPointPositions, setUserPointPositions] = useState<PointPosition[]>([])
  const { data: volumeData, loading } = usePoolVolume({
    chain,
    period,
    pool_id,
  })
  const { pool } = useBtcContext()

  useEffect(() => {
    if (!chartRef.current || loading) return

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    setMounted(false)
    setShowAvatar(false)

    // Transform API data to chart format
    const chartData = volumeData.map(item => ({
      x: item.timestamp,
      y: item.volume,
    }))

    // If no data, show empty chart
    if (chartData.length === 0) {
      chartData.push({ x: Date.now(), y: 0 })
    }

    const data = {
      datasets: [
        {
          label: 'Total Bids',
          data: chartData,
          borderColor: status === 1 ? '#DD9000' : '#ABABAB',
          backgroundColor: (context: any) => {
            const chart = context.chart
            const { ctx, chartArea } = chart
            if (!chartArea) {
              return status === 1 ? '#FFC42F' : '#ABABAB'
            }
            // Create gradient from top to bottom of chart area
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
            gradient.addColorStop(0, status === 1 ? '#FFC42F' : '#ABABAB')
            gradient.addColorStop(1, '#fff')
            return gradient
          },
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    }

    const config = {
      type: 'line' as const,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          onComplete: () => {
            // Get data point positions after chart is drawn
            setMounted(true)
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        scales: {
          x: {
            type: 'linear' as const,
            display: false,
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            display: false,
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              display: false,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest' as const,
        },
        onHover: undefined,
      },
    }

    chartInstance.current = new Chart(ctx, config)

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [volumeData, loading])

  useEffect(() => {
    if (winnerBidList.length === 0) return
    if (!chartInstance.current || !containerRef.current || !chartRef.current || !mounted) return

    const chart = chartInstance.current
    const meta = chart.getDatasetMeta(0)
    const positions: PointPosition[] = []

    meta.data.forEach((element: any, index: number) => {
      const bidTimeIndex = winnerBidsTime.findIndex(
        (time: number) => time === volumeData[index]?.timestamp
      )
      if (bidTimeIndex !== -1 && element.x !== undefined && element.y !== undefined) {
        // Get canvas position relative to container
        const canvasRect = chartRef.current!.getBoundingClientRect()
        const containerRect = containerRef.current!.getBoundingClientRect()

        // Calculate position relative to container
        const x = element.x + (canvasRect.left - containerRect.left)
        const y = element.y + (canvasRect.top - containerRect.top + 33)

        positions.push({
          x,
          y,
          index: bidTimeIndex,
        })
      }
    })

    setUserPointPositions(positions)

    setTimeout(() => {
      setShowAvatar(true)
    }, 1000)
  }, [winnerBidList, chartInstance.current, containerRef.current, chartRef.current, mounted])

  // Prepare user data for ProgressAvatar
  const userDataForAvatar = useMemo(() => {
    if (!winnerInfo || !pool) return null
    return {
      winner_user_info: {
        icon: winnerInfo.icon,
        user: winnerInfo.user,
      },
    }
  }, [winnerInfo, pool])

  const volume = useMemo(() => {
    if (volumeData.length === 0) return '-'
    if (volumeData.length === 1) return volumeData[0].volume
    return formatNumber(
      Big(volumeData[0].volume)
        .minus(volumeData[volumeData.length - 1].volume)
        .add(1)
        .toString(),
      0,
      true,
      { prefix: '$' }
    )
  }, [volumeData])

  return (
    <>
      <div className="absolute  z-[2]">
        <div className="text-[24px] font-[600] text-black">{volume}</div>
        <div className="text-[14px] text-black/60">{label}-Time</div>
      </div>
      <div ref={containerRef} className="h-[200px] w-[426px] mt-4 relative">
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
          volumeData.length > 0 &&
          showAvatar && (
            <div className="absolute inset-0 overflow-visible">
              {userPointPositions.map((position, idx) => {
                const originalIndex = position.index
                return (
                  <div
                    key={`${originalIndex}-${idx}`}
                    className="absolute z-[5] cursor-pointer hover:scale-[1.2] hover:z-[100] transition-all duration-300"
                    style={{
                      left: `${position.x - 14}px`,
                      top: `${position.y - 33}px`, // Position above the point
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <div className="absolute top-[-33px]">
                      <ProgressAvatar
                        data={userDataForAvatar}
                        winnerBid={winnerBidList[originalIndex]}
                        className="!rounded-full"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
      </div>
    </>
  )
}
