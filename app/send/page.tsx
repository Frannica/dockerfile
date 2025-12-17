"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function SendMoneyPage() {
  const { user, isAuthenticated, updateBalance } = useAuth()
  const router = useRouter()
  const [recipientId, setRecipientId] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount")
      return
    }

    const userBalance = user?.balance[currency] || 0
    if (amountNum > userBalance) {
      setError(`Insufficient balance. You have ${userBalance} ${currency}`)
      return
    }

    if (recipientId === user?.id) {
      setError("You cannot send money to yourself")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId,
          amount: amountNum,
          currency,
          senderId: user?.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Update local balance
        updateBalance(currency, -amountNum)
        setSuccess(true)
        setRecipientId("")
        setAmount("")
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError(data.error || "Failed to send money")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (success) {
    return (
      <>
        <Header />
        <main className="container px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-12 pb-12">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Money Sent Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  {amount} {currency} has been sent to wallet {recipientId}
                </p>
                <Button asChild>
                  <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Send Money</h1>
            <p className="text-muted-foreground">
              Transfer funds to another E.G. Wallet user instantly
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
              <CardDescription>
                All transfers are processed instantly within E.G. Wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Available Balances */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm font-medium mb-3">Your Available Balances</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(user.balance || {}).map(([curr, bal]) => (
                      <div key={curr} className="text-center">
                        <div className="text-xs text-muted-foreground">{curr}</div>
                        <div className="font-semibold">{bal.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recipient */}
                <div className="space-y-2">
                  <label htmlFor="recipientId" className="text-sm font-medium">
                    Recipient Wallet ID
                  </label>
                  <Input
                    id="recipientId"
                    type="text"
                    placeholder="Enter recipient's wallet ID"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    The recipient must have an E.G. Wallet account
                  </p>
                </div>

                {/* Currency Selection */}
                <div className="space-y-2">
                  <label htmlFor="currency" className="text-sm font-medium">
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading}
                  >
                    {Object.keys(user.balance || {}).map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Amount
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: {(user.balance[currency] || 0).toFixed(2)} {currency}
                  </p>
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? (
                      "Processing..."
                    ) : (
                      <>
                        Send Money <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                  >
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm">
                  <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    ℹ️ Internal Transfer
                  </p>
                  <p className="text-muted-foreground">
                    Transfers are only available between E.G. Wallet users. External transfers to banks or other services are not supported.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
