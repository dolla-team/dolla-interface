import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import { Suspense, lazy } from "react";
import WalletProvider from "./contexts/wallet";
import { AuthProvider } from "./contexts/auth";
import { ToastContainer } from "react-toastify";
import Temp from "./views/temp";
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

import("react-toastify/dist/ReactToastify.css");

const ErrorPage = () => {
  return (
    <div
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh"
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>Oops! Something went wrong.</h1>
        <p>We're sorry, but an unexpected error occurred.</p>
      </div>
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "rgb(221, 144, 0)",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px"
        }}
        onClick={() => window.location.reload()}
      >
        Reload Page
      </button>
    </div>
  );
};

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
      }
    ]
  },
  {
    path: "btc/detail",
    element: <LazyBtc />
  },
  {
    path: "btc/detail/:poolId",
    element: <LazyBtc />
  },
  {
    path: "/callback",
    element: <Callback />
  },
  {
    path: "/temp",
    element: <Temp />
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

function App() {
  return (
    <DollaEyeContextProvider>
      <Suspense>
        <WalletProvider>
          <AuthProvider>
            <RouterProvider router={router} />
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
