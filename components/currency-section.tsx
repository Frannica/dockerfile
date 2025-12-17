"use client"

import { useEffect, useState } from "react"
import { ArrowRightLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const currencies = [
  { code: "XAF", name: "Central African CFA Franc", flag: "🇨🇲" },
  { code: "XOF", name: "West African CFA Franc", flag: "🇸🇳" },
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬" },
  { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
]

export function CurrencySection() {
  const [rates, setRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/exchange-rates")
      .then((res) => res.json())
      .then((data) => {
        setRates(data.rates)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch rates:", error)
        setLoading(false)
      })
  }, [])

  return (
    <section id="currencies" className="container px-4 py-24 bg-muted/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Supported Currencies
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Trade seamlessly across 8 major currencies with real-time exchange rates
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {currencies.map((currency) => (
          <Card key={currency.code} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currency.flag}</span>
                <div>
                  <CardTitle className="text-xl">{currency.code}</CardTitle>
                  <CardDescription>{currency.name}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : (
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">
                    1 USD = {rates[currency.code]?.toFixed(2) || "N/A"} {currency.code}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
