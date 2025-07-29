import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "./components/loading";
import WalletProvider from "./contexts/wallet";
import { AuthProvider } from "./contexts/auth";
import { ToastContainer } from "react-toastify";
import Temp from "./views/temp";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./layouts/main";
import "./libs/howl";
import Callback from "./views/callback";

const LazyNewBTC = lazy(() => import("./views/btc"));
const LazyBtcCreate = lazy(() => import("./views/btc-create"));
const LazyProfilePlayer = lazy(() => import("./views/profile/player"));
const LazyProfileSeller = lazy(() => import("./views/profile/seller"));
const LazyNearTest = lazy(() => import("./views/near-test"));
const LazyBtcCreator = lazy(() => import("./views/btc-creator"));
const LazyPlayerBetting = lazy(() => import("./views/player-betting"));
const LazyTools = lazy(() => import("./views/tools"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/btc" replace />
      },
      {
        index: true,
        path: "btc",
        element: <LazyNewBTC />
      },
      {
        path: "btc/:poolId",
        element: <LazyNewBTC />
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
        path: "near-test",
        element: <LazyNearTest />
      },
      {
        path: "btc-creator",
        element: <LazyBtcCreator />
      },
      {
        path: "player-betting",
        element: <LazyPlayerBetting />
      },
      {
        path: "tools",
        element: <LazyTools />
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
    <Suspense fallback={<Loading />}>
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
  );
}

export default App;
