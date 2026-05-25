import { type FC } from "react"
import DemoHeroSection from "./components/DemoHeroSection"
import ElectionDemoSection from "./components/ElectionDemoSection"
import ElectionGuideSection from "./components/ElectionGuideSection"

const DemoPage: FC = () => {
  return (
    <main className="min-h-screen">
      <DemoHeroSection />

      <div id="live-demo-section">
        <ElectionDemoSection />
      </div>

      <ElectionGuideSection />
    </main>
  )
}

export default DemoPage