"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowUpRight, ArrowDownLeft, Clock, Wallet } from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: string
  type: "send" | "receive"
  amount: number
  currency: string
  from?: string
  to?: string
  date: string
  status: "completed" | "pending"
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin")
      return
    }

    // Fetch transactions from Express backend
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("egwallet_token")
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-backend.onrender.com"
        
        const response = await fetch(`${API_BASE_URL}/transactions`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setTransactions(data.transactions || [])
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const totalBalance = Object.entries(user.balance || {}).reduce(
    (sum, [_, amount]) => sum + amount,
    0
  )

  return (
    <>
      <Header />
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Manage your multi-currency wallet</p>
        </div>

        {/* Web Beta & KYC Status Notifications */}
        <div className="space-y-4 mb-8">
          <Card className="border-blue-500/50 bg-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="text-blue-500 text-xl">ℹ️</div>
                <div>
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    Web Beta - Limited Features
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your EGWallet account works on web and mobile. Web Beta: limited features until app launch. 
                    Transactions require admin approval for execution.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {user.kyc_status === 'pending' && (
            <Card className="border-yellow-500/50 bg-yellow-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-500 text-xl">⚠️</div>
                  <div>
                    <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
                      KYC Verification Required
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete KYC verification to send and receive money. Maximum wallet balance: $250,000.
                    </p>
                    <Button size="sm" variant="outline">Submit KYC Documents</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {user.kyc_status === 'approved' && (
            <Card className="border-green-500/50 bg-green-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl">✅</div>
                  <div>
                    <h3 className="font-semibold text-green-600 dark:text-green-400 mb-1">
                      KYC Verified
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your account is verified. You can send and receive money (pending admin approval during Web Beta).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {user.kyc_status === 'rejected' && (
            <Card className="border-red-500/50 bg-red-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="text-red-500 text-xl">❌</div>
                  <div>
                    <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">
                      KYC Verification Failed
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your KYC verification was rejected. Please resubmit with correct information.
                    </p>
                    <Button size="sm" variant="outline">Resubmit KYC</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Balance Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Your Balances
              </CardTitle>
              <CardDescription>Available funds across all currencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(user.balance || {}).map(([currency, amount]) => (
                  <div key={currency} className="bg-muted rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">{currency}</div>
                    <div className="text-2xl font-bold">
                      {amount.toFixed(2)}
                    </div>
                  </div>
                ))}
                {Object.keys(user.balance || {}).length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No balances yet. Receive money to get started!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Send Money</CardTitle>
              <CardDescription>Transfer to another E.G. Wallet user</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/send">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Send Money
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receive Money</CardTitle>
              <CardDescription>Your unique wallet ID</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">Wallet ID</div>
                <div className="font-mono font-semibold">{user.id}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Share this ID to receive money
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {transactions.length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Total transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest activity</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading transactions...
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet. Start by sending or receiving money!
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.slice(0, 10).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-full p-2 ${
                          tx.type === "send"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-green-500/10 text-green-500"
                        }`}
                      >
                        {tx.type === "send" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {tx.type === "send" ? "Sent" : "Received"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {tx.type === "send" ? `To: ${tx.to}` : `From: ${tx.from}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-semibold ${
                          tx.type === "send" ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {tx.type === "send" ? "-" : "+"}
                        {tx.amount.toFixed(2)} {tx.currency}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {tx.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  )
}
