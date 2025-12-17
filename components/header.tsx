"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Wallet, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user, signOut } = useAuth()

  const handleSignOut = () => {
    signOut()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <span className="text-xl font-bold">E.G. Wallet</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#currencies" className="text-sm font-medium hover:text-primary transition-colors">
                Currencies
              </Link>
              <Link href="#security" className="text-sm font-medium hover:text-primary transition-colors">
                Security
              </Link>
              <Link href="#support" className="text-sm font-medium hover:text-primary transition-colors">
                Support
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                <LayoutDashboard className="h-4 w-4 inline mr-1" />
                Dashboard
              </Link>
              <Link href="/send" className="text-sm font-medium hover:text-primary transition-colors">
                Send Money
              </Link>
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
            </>
          )}
          <LanguageSwitcher />
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 flex flex-col gap-4">
            {!isAuthenticated ? (
              <>
                <Link 
                  href="#features" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="#currencies" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Currencies
                </Link>
                <Link 
                  href="#security" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Security
                </Link>
                <Link 
                  href="#support" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Support
                </Link>
                <Button className="w-full" asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            ) : (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/send" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Send Money
                </Link>
                <Button className="w-full" variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
