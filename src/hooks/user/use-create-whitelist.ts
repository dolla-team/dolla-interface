import { useCallback, useMemo } from 'react'
import { useRequest } from 'ahooks'
import axiosInstance from '@/libs/axios'

export default function useCreateWhitelist(user?: any) {

  const [address, email] = useMemo(() => {
    if (!user) return ['', '']
    const address = user.wallet?.address
    let email = user.email?.address || user.google?.email
    if (user.twitter) {
      email = '@' + user.twitter.username
    }
    return [address, email]
  }, [user])

  const service = useCallback(async () => {
    try {
      if (!email && !address) return false

      const res = await axiosInstance.get('/api/v1/user/create/whitelist', {
        params: { email, address },
      })

      return res?.data?.data?.is_whitelist
    } catch (err) {
      return false
    }
  }, [email, address])

  const { data } = useRequest(service, {
    refreshDeps: [email, address, user],
  })

  return {
    isCreatedWhitelist: data,
  }
}
