"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Wallet } from "lucide-react"

export function Hero() {
  return (
    <section className="container px-4 py-24 md:py-32">
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Your Multi-Currency{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Digital Wallet
            </span>
          </h1>
          <p className="text-xl text-muted-foreground md:text-2xl max-w-2xl mx-auto">
            Send, receive, and manage money across 8 currencies with ease. 
            Supporting XAF, XOF, NGN, GHS, ZAR, CNY, USD, and EUR.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="text-lg px-8">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            Learn More
          </Button>
        </div>

        <div className="mt-12 relative w-full max-w-4xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl -z-10" />
          <div className="rounded-2xl border bg-card p-8 shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Wallet className="h-12 w-12 text-primary" />
              <div className="text-left">
                <div className="text-sm text-muted-foreground">Available Balance</div>
                <div className="text-3xl font-bold">$12,459.50</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-background rounded-lg p-3">
                <div className="text-muted-foreground">USD</div>
                <div className="font-semibold">$5,230</div>
              </div>
              <div className="bg-background rounded-lg p-3">
                <div className="text-muted-foreground">EUR</div>
                <div className="font-semibold">€4,810</div>
              </div>
              <div className="bg-background rounded-lg p-3">
                <div className="text-muted-foreground">CNY</div>
                <div className="font-semibold">¥15,420</div>
              </div>
              <div className="bg-background rounded-lg p-3">
                <div className="text-muted-foreground">NGN</div>
                <div className="font-semibold">₦3.2M</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
