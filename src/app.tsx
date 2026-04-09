import { createBrowserRouter, Navigate, RouterProvider, useLocation } from 'react-router-dom'
import { lazy, useEffect, useState } from 'react'
import WalletProvider from './contexts/wallet'
import { ToastContainer } from 'react-toastify'
import Loading from '@/components/loading'
import ErrorPage from './views/error-page'
import { useBidResultSubscription } from '@/hooks/use-websocket'
import useIsMobile from '@/hooks/use-is-mobile'
import useContractConfig from '@/hooks/near/use-config'
// import "react-toastify/dist/ReactToastify.css";

import MainLayout from './layouts/main'
// import "./libs/howl";
import Callback from './views/callback'
import DollaEyeContextProvider from './contexts/dolla-eye'
import BtcList from './views/btc-list'
import axiosInstance from '@/libs/axios'

const LazyBtcCreate = lazy(() => import('./views/btc-create'))
const LazyProfilePlayer = lazy(() => import('./views/profile/player'))
const LazyProfileSeller = lazy(() => import('./views/profile/seller'))
const LazyBtc = lazy(() => import('./views/btc/index'))
const LazyTerms = lazy(() => import('./views/terms'))
const LazyPolicy = lazy(() => import('./views/policy'))
const LazyDocs = lazy(() => import('./views/docs'))
const LazyTemp = lazy(() => import('./views/temp'))
const LazyLeaderboard = lazy(() => import('./views/leaderboard'))
const LazyMobile = lazy(() => import('./views/mobile'))

import('react-toastify/dist/ReactToastify.css')

const DynamicDefaultRoute = () => {
  const location = useLocation()
  if (window.cachedPoolId && window.cachedPoolId > 0) {
    setTimeout(() => {
      window.cachedPoolId = 0
    }, 1000)
    const searchParams = location.search || ''
    return <Navigate to={`/btc/${window.cachedPoolId}${searchParams}`} replace />
  }
  return <BtcList />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DynamicDefaultRoute />,
      },
      {
        path: 'btc/create',
        element: <LazyBtcCreate />,
      },
      {
        path: 'btc',
        element: <LazyBtc />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'btc/:poolId',
        element: <LazyBtc />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'portfolio/bidder',
        element: <LazyProfilePlayer />,
      },
      {
        path: 'portfolio/lister',
        element: <LazyProfileSeller />,
      },
      {
        path: 'terms-of-service',
        element: <LazyTerms />,
      },
      {
        path: 'privacy-policy',
        element: <LazyPolicy />,
      },
      {
        path: 'leaderboard',
        element: <LazyLeaderboard />,
      },
    ],
  },
  {
    path: '/callback',
    element: <Callback />,
  },
  {
    path: '/docs',
    element: <LazyDocs />,
  },
  {
    path: '/temp',
    element: <LazyTemp />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

const Content = () => {
  const [isLoading, setIsLoading] = useState(true)
  useContractConfig()

  useEffect(() => {
    const init = async () => {
      const code = new URLSearchParams(window.location.search).get('code')
      if (code && code?.length === 6) {
        try {
          const res = await axiosInstance.get('/api/v1/airdrop/code/valid', {
            params: {
              code,
            },
          })
          if (res.data.data?.pool_id) {
            window.cachedPoolId = res.data.data?.pool_id
          }
        } catch (error) {
          console.error('Failed to check code:', error)
        } finally {
        }
      } else {
      }
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    init()
  }, [])

  if (window.location.pathname === '/docs') {
    return <RouterProvider router={router} />
  }

  return isLoading ? <Loading /> : <RouterContent />
}

const RouterContent = () => {
  useBidResultSubscription()
  return <RouterProvider router={router} />
}

function App() {
  const isMobile = useIsMobile()
  return (
    <DollaEyeContextProvider>
      {isMobile ? (
        <LazyMobile />
      ) : (
        <WalletProvider>
          <Content />
        </WalletProvider>
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        theme="light"
        toastStyle={{ backgroundColor: 'transparent', boxShadow: 'none' }}
        newestOnTop
        rtl={false}
        pauseOnFocusLoss
        closeButton={false}
      />
    </DollaEyeContextProvider>
  )
}

export default App
