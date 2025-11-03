import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, useEffect, useState } from "react";
import WalletProvider from "./contexts/wallet";
import { AuthProvider } from "./contexts/auth";
import { usePrivy, useUser } from "@privy-io/react-auth";
import { ToastContainer } from "react-toastify";
import Loading from "@/components/loading";
import VerifyEmail from "./views/verify-email";
import { useGlobalStore } from "@/stores/use-global";
import ErrorPage from "./views/error-page";
// import "react-toastify/dist/ReactToastify.css";

import MainLayout from "./layouts/main";
// import "./libs/howl";
import Callback from "./views/callback";
import DollaEyeContextProvider from "./contexts/dolla-eye";
import BtcList from "./views/btc-list";

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
const LazyDocs = lazy(() => import("./views/docs"));

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
    element: <LazyBtc />,
    errorElement: <ErrorPage />
  },
  {
    path: "btc/detail/:poolId",
    element: <LazyBtc />,
    errorElement: <ErrorPage />
  },
  {
    path: "/callback",
    element: <Callback />
  },
  {
    path: "/docs",
    element: <LazyDocs />
  }
]);

const Content = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { ready } = usePrivy();
  const { user } = useUser();
  const globalStore = useGlobalStore();

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

  if (window.location.pathname === "/docs") {
    return <RouterProvider router={router} />;
  }

  return isLoading ? (
    <Loading />
  ) : !user ||
    globalStore.email.toLowerCase() !==
      (user?.email?.address?.toLowerCase() ||
        user?.google?.email?.toLowerCase()) ? (
    <VerifyEmail />
  ) : (
    <RouterProvider router={router} />
  );
};

function App() {
  return (
    <DollaEyeContextProvider>
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
    </DollaEyeContextProvider>
  );
}

export default App;
