"use client"

import { CreditCard, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function VirtualCard() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <section className="container px-4 py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Virtual Cards for Secure Payments
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Create unlimited virtual cards for safe online transactions. Each card is linked 
            to your wallet balance and can be frozen or deleted anytime.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-1">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Instant Generation</h3>
                <p className="text-muted-foreground">Create new virtual cards in seconds</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-1">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Enhanced Security</h3>
                <p className="text-muted-foreground">Use different cards for different merchants</p>
              </div>
            </div>
          </div>

          <Button size="lg">Create Virtual Card</Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 blur-3xl opacity-20 -z-10" />
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-transform">
            <div className="flex justify-between items-start mb-12">
              <div>
                <div className="text-sm opacity-80 mb-1">Virtual Card</div>
                <div className="text-xl font-semibold">E.G. Wallet</div>
              </div>
              <CreditCard className="h-10 w-10 opacity-80" />
            </div>

            <div className="mb-8">
              <div className="font-mono text-2xl tracking-wider mb-4">
                {showDetails ? "4532 1234 5678 9010" : "•••• •••• •••• 9010"}
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-xs opacity-80">VALID THRU</div>
                  <div className="font-mono">{showDetails ? "12/28" : "••/••"}</div>
                </div>
                <div>
                  <div className="text-xs opacity-80">CVV</div>
                  <div className="font-mono">{showDetails ? "123" : "•••"}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="font-semibold">JOHN DOE</div>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
