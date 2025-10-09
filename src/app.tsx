import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  ScrollRestoration
} from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import WalletProvider from "./contexts/wallet";
import { AuthProvider, useAuth } from "./contexts/auth";
import { ToastContainer } from "react-toastify";
import Loading from "@/components/loading";
import Temp from "./views/temp";
// import "react-toastify/dist/ReactToastify.css";

import MainLayout from "./layouts/main";
// import "./libs/howl";
import Callback from "./views/callback";
import DollaEyeContextProvider from "./contexts/dolla-eye";
import BtcList from "./views/btc-list";
import ErrorPage from "./views/error-page";

const LazyNftCreate = lazy(() => import("./views/nft-create"));
const LazyBtcCreate = lazy(() => import("./views/btc-create"));
const LazyProfilePlayer = lazy(() => import("./views/profile/player"));
const LazyProfileSeller = lazy(() => import("./views/profile/seller"));
const LazyNft = lazy(() => import("./views/nft/index"));
const LazyNftList = lazy(() => import("./views/nft-list"));
const LazyBtc = lazy(() => import("./views/btc/index"));
const LazyTerms = lazy(() => import("./views/terms"));
const LazyPolicy = lazy(() => import("./views/policy"));
const LazyDemo = lazy(() => import("./views/demo"));

import("react-toastify/dist/ReactToastify.css");

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <BtcList />
      },
      {
        path: "nft",
        element: <LazyNftList />
      },
      {
        path: "nft/detail",
        element: <LazyNft />
      },
      {
        path: "nft/detail/:poolId",
        element: <LazyNft />
      },
      {
        path: "nft/create",
        element: <LazyNftCreate />
      },
      {
        path: "btc",
        element: <BtcList />
      },
      {
        path: "btc/create",
        element: <LazyBtcCreate />
      },
      {
        path: "portfolio/player",
        element: <LazyProfilePlayer />
      },
      {
        path: "portfolio/seller",
        element: <LazyProfileSeller />
      },
      {
        path: "terms-of-service",
        element: <LazyTerms />
      },
      {
        path: "privacy-policy",
        element: <LazyPolicy />
      },
      {
        path: "demo",
        element: <LazyDemo />
      }
    ]
  },
  {
    path: "btc/detail",
    errorElement: <ErrorPage />,
    element: <LazyBtc />
  },
  {
    path: "btc/detail/:poolId",
    errorElement: <ErrorPage />,
    element: <LazyBtc />
  },
  {
    path: "/callback",
    element: <Callback />
  },
  {
    path: "/temp",
    element: <Temp />
  }
]);

const Content = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { ready, user } = useAuth() || {};
  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!user) {
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [ready, user]);
  return isLoading ? <Loading /> : <RouterProvider router={router} />;
};

function App() {
  return (
    <DollaEyeContextProvider>
      <Suspense>
        <WalletProvider>
          <AuthProvider>
            <Content />
          </AuthProvider>
        </WalletProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          theme="light"
          toastStyle={{ backgroundColor: "transparent", boxShadow: "none" }}
          newestOnTop
          rtl={false}
          pauseOnFocusLoss
          closeButton={false}
        />
      </Suspense>
    </DollaEyeContextProvider>
  );
}

export default App;
