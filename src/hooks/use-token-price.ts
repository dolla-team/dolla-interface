import { useAuth } from '@/contexts/wallet'
import axiosInstance from '@/libs/axios'
import { useEffect, useState } from 'react'

export default function useTokenPrice(tokens: any) {
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { userInfo } = useAuth()
  const fetchPrice = async () => {
    try {
      setLoading(true)
      const _tokens = Array.isArray(tokens) ? tokens : [tokens]
      const tokensStr: string[] = []

      _tokens.forEach((item: any) => {
        let str = `${item.chain}:${item.address}`
        if (item.tokenIds) {
          str += `:${item.tokenIds.join(',')}`
        }
        tokensStr.push(str)
      })
      const res = await axiosInstance.get(`/api/v1/token/price?tokens=${tokensStr.join(',')}`)

      setPrices(res.data.data)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userInfo?.user) return
    if ((Array.isArray(tokens) && tokens.length === 0) || !tokens) return
    if (Array.isArray(tokens) && tokens.filter(item => !!item).length === 0) return
    fetchPrice()
  }, [userInfo?.user, tokens])

  return { prices, loading }
}
