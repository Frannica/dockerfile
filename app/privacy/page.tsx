export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p className="text-muted-foreground mb-4">
          E.G. Wallet collects information that you provide directly to us, including personal information 
          such as your name, email address, phone number, and payment information when you create an account 
          or use our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p className="text-muted-foreground mb-4">
          We use the information we collect to provide, maintain, and improve our services, process transactions, 
          send you technical notices and support messages, and respond to your comments and questions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
        <p className="text-muted-foreground mb-4">
          We do not share your personal information with third parties except as described in this policy. 
          We may share information with service providers who perform services on our behalf, in compliance 
          with legal obligations, or to protect our rights.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
        <p className="text-muted-foreground mb-4">
          We implement appropriate technical and organizational measures to protect your personal information 
          against unauthorized access, alteration, disclosure, or destruction. This includes bank-level encryption 
          and secure data storage.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
        <p className="text-muted-foreground mb-4">
          You have the right to access, correct, or delete your personal information. You may also object to 
          or restrict certain processing of your information. To exercise these rights, please contact us at 
          privacy@egwallet.com.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
        <p className="text-muted-foreground">
          If you have any questions about this Privacy Policy, please contact us at privacy@egwallet.com.
        </p>
      </section>

      <p className="text-sm text-muted-foreground mt-12">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  )
}
