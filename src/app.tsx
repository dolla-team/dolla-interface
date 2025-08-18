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
import "./libs/howl";
import Callback from "./views/callback";
import DollaEyeContextProvider from "./contexts/dolla-eye";
import NFT from "./views/nft";
import NftList from "./views/nft-list";

// const LazyNewBTC = lazy(() => import("./views/btc"));
const LazyNftCreate = lazy(() => import("./views/nft-create"));
const LazyProfilePlayer = lazy(() => import("./views/profile/player"));
const LazyProfileSeller = lazy(() => import("./views/profile/seller"));
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
        element: <Navigate to="/nft" replace />
      },
      {
        index: true,
        path: "nft",
        element: <NFT />
      },
      {
        path: "nft/:poolId",
        element: <NFT />
      },
      {
        path: "nft/create",
        element: <LazyNftCreate />
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
        path: "nft-list",
        element: <NftList />
      }
    ]
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
