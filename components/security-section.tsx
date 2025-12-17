"use client"

import { Shield, Lock, Eye, Smartphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data is encrypted with AES-256 encryption, ensuring your information stays private.",
  },
  {
    icon: Smartphone,
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security with 2FA via SMS or authenticator apps.",
  },
  {
    icon: Eye,
    title: "24/7 Monitoring",
    description: "Our systems monitor all transactions in real-time to detect suspicious activity.",
  },
  {
    icon: Shield,
    title: "Fraud Protection",
    description: "Protected against unauthorized access with advanced fraud detection systems.",
  },
]

export function SecuritySection() {
  return (
    <section id="security" className="container px-4 py-24 bg-muted/50">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Bank-Level Security
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your money and personal information are protected by the same security 
          measures used by major financial institutions
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {securityFeatures.map((feature, index) => (
          <Card key={index} className="border-2">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 max-w-3xl mx-auto">
        <div className="bg-card border rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">Security Guarantee</h3>
          <p className="text-muted-foreground mb-6">
            E.G. Wallet is compliant with international financial regulations and standards. 
            Your funds are insured and protected against unauthorized transactions.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>PCI DSS Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
