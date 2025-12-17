import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { CurrencySection } from "@/components/currency-section"
import { VirtualCard } from "@/components/virtual-card"
import { SecuritySection } from "@/components/security-section"
import { AISupport } from "@/components/ai-support"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <CurrencySection />
        <VirtualCard />
        <SecuritySection />
        <AISupport />
      </main>
      <Footer />
    </>
  )
}
