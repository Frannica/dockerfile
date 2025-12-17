"use client"

import { Send, TrendingUp, Shield, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Send,
    title: "Instant Transfers",
    description: "Send money across currencies instantly with real-time exchange rates.",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Rates",
    description: "Get the best exchange rates updated every minute from global markets.",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your funds are protected with military-grade encryption and 2FA.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "AI-powered support available round the clock in multiple languages.",
  },
]

export function Features() {
  return (
    <section id="features" className="container px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Everything You Need
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Powerful features to manage your multi-currency finances with ease
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <feature.icon className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
