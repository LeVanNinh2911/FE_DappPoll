import { ConfigProvider, Grid, Layout } from "antd"
import Navbar from "./components/layout/Navbar"
import { Content } from "antd/es/layout/layout"
import { Route, Routes } from "react-router-dom"
import SwitchChain from "./components/SwitchChain"
import ConnectWallet from "./components/ConnectWallet"
import type { FC } from "react"
import CreateElection from "./pages/CreatePoll/CreatePoll"
import ElectionDetails from "./pages/PollDetail/ElectionDetail"
import CreatedElectionsPage from "./pages/CreatedPoll/CreatedElections"
import VotedElectionsPage from "./pages/HistoryVoted/VotedPoll"
import HomePage from "./pages/Home/Home"
import AppFooter from "./components/layout/AppFooter"
import DemoPage from "./pages/Demo/DemoPage"

const { useBreakpoint } = Grid;

const App: FC = () => {

  const screens = useBreakpoint();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1e3a8a", // blue-900 (giữ core)
          colorInfo: "#1e40af", // blue-800 (nhẹ hơn primary)
          colorLink: "#2563eb", // blue-600 (link nổi bật hơn)
          
          colorSuccess: "#16a34a",
          colorWarning: "#f59e0b",
          colorError: "#dc2626",

          colorBorder: "#e2e8f0", // sáng hơn (slate-200)
          colorText: "#0f172a",

          controlOutline: "rgba(37, 99, 235, 0.25)", // focus đẹp hơn (blue-600 glow)
          
          borderRadius: 12
        },

        components: {
          Button: {
            colorPrimary: "#1e3a8a",
            colorPrimaryHover: "#1d4ed8", // blue-700
            colorPrimaryActive: "#172554", // blue-950

            primaryShadow: "0 8px 20px rgba(30, 58, 138, 0.25)",

            borderRadius: 14
          },

          Radio: {
            colorPrimary: "#1e3a8a",
            colorPrimaryHover: "#2563eb"
          },

          Checkbox: {
            colorPrimary: "#1e3a8a",
            colorPrimaryHover: "#2563eb"
          },

          Card: {
            borderRadiusLG: 20,
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)" // mềm hơn
          },

          Spin: {
            colorPrimary: "#2563eb"
          }
        }
      }}
    >
      <div style={{ minHeight: "100vh" }}>
        <Navbar />
        <Layout>
          <Content
            style={{
              padding: screens.md ? 24 : 0,
              margin: "0 auto",
              width: "100%",
              marginTop: 100,

            }}
            className="md:p-6"
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-election" element={<CreateElection />} />
              <Route path="/election/:address" element={<ElectionDetails />} />

              <Route path="/network-selector" element={<SwitchChain />} />
              <Route path="/connect-wallet" element={<ConnectWallet />} />

              <Route path="/my-created-poll" element={<CreatedElectionsPage />} />
              <Route path="/my-voted-poll" element={<VotedElectionsPage />} />
              <Route path="/demo" element={<DemoPage />} />
            </Routes>
          </Content>
          <AppFooter />
        </Layout>
      </div>

    </ConfigProvider>
  );
}

export default App
