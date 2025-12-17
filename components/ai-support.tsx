"use client"

import { useState } from "react"
import { Bot, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

export function AISupport() {
  const { language } = useLanguage()
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return

    const userMessage = message
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setMessage("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, language }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let aiMessage = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value)
          aiMessage += chunk
          
          setChatMessages((prev) => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            
            if (lastMessage && lastMessage.role === "assistant") {
              lastMessage.content = aiMessage
            } else {
              newMessages.push({ role: "assistant", content: aiMessage })
            }
            
            return newMessages
          })
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="support" className="container px-4 py-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          24/7 AI-Powered Support
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get instant answers to your questions in multiple languages. Our AI assistant 
          is trained to help with account management, transactions, and more.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Chat with AI Assistant</CardTitle>
          <CardDescription>
            Ask anything about E.G. Wallet features, currencies, limits, or security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chat Messages */}
            <div className="min-h-[300px] max-h-[400px] overflow-y-auto space-y-4 p-4 border rounded-lg bg-muted/30">
              {chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Start a conversation by sending a message</p>
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                disabled={loading}
              />
              <Button onClick={sendMessage} disabled={loading || !message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
