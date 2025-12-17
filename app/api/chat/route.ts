import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const walletInfo: Record<string, string> = {
  en: `E.G. Wallet is a multi-currency digital wallet supporting XAF, XOF, NGN, GHS, ZAR, CNY, USD, and EUR. 
Key features:
- Send and receive money across 8 currencies
- Real-time exchange rates
- Virtual cards for secure online payments
- 24/7 AI-powered support
- Bank-level security with encryption
- Transaction limits: $10,000 daily, $50,000 monthly
- Instant transfers within the platform
- No hidden fees on currency exchange`,
  
  es: `E.G. Wallet es una billetera digital multi-moneda que soporta XAF, XOF, NGN, GHS, ZAR, CNY, USD y EUR.
Características principales:
- Enviar y recibir dinero en 8 monedas
- Tasas de cambio en tiempo real
- Tarjetas virtuales para pagos online seguros
- Soporte IA 24/7
- Seguridad bancaria con encriptación
- Límites de transacción: $10,000 diarios, $50,000 mensuales
- Transferencias instantáneas en la plataforma
- Sin tarifas ocultas en cambio de divisas`,
  
  fr: `E.G. Wallet est un portefeuille numérique multi-devises supportant XAF, XOF, NGN, GHS, ZAR, CNY, USD et EUR.
Fonctionnalités clés:
- Envoyer et recevoir de l'argent dans 8 devises
- Taux de change en temps réel
- Cartes virtuelles pour paiements en ligne sécurisés
- Support IA 24/7
- Sécurité bancaire avec cryptage
- Limites de transaction: 10 000$ par jour, 50 000$ par mois
- Transferts instantanés sur la plateforme
- Pas de frais cachés sur l'échange de devises`,
  
  ru: `E.G. Wallet - это мультивалютный цифровой кошелек с поддержкой XAF, XOF, NGN, GHS, ZAR, CNY, USD и EUR.
Основные функции:
- Отправка и получение денег в 8 валютах
- Курсы обмена в реальном времени
- Виртуальные карты для безопасных онлайн-платежей
- ИИ-поддержка 24/7
- Банковская безопасность с шифрованием
- Лимиты транзакций: $10,000 в день, $50,000 в месяц
- Мгновенные переводы внутри платформы
- Без скрытых комиссий за обмен валюты`,
  
  zh: `E.G. Wallet 是一款支持 XAF、XOF、NGN、GHS、ZAR、CNY、USD 和 EUR 的多币种数字钱包。
主要特点：
- 在8种货币间发送和接收资金
- 实时汇率
- 用于安全在线支付的虚拟卡
- 24/7 AI支持
- 银行级加密安全
- 交易限额：每日$10,000，每月$50,000
- 平台内即时转账
- 货币兑换无隐藏费用`,
}

export async function POST(request: NextRequest) {
  try {
    const { message, language = 'en' } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const info = walletInfo[language] || walletInfo.en
    
    // Simulate AI response based on message content
    let response = ''
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('currency') || lowerMessage.includes('currencies') || lowerMessage.includes('moneda')) {
      response = language === 'es' 
        ? 'E.G. Wallet soporta 8 monedas: XAF (Franco CFA de África Central), XOF (Franco CFA de África Occidental), NGN (Naira Nigeriana), GHS (Cedi Ghanés), ZAR (Rand Sudafricano), CNY (Yuan Chino), USD (Dólar Estadounidense), y EUR (Euro).'
        : language === 'fr'
        ? 'E.G. Wallet supporte 8 devises: XAF (Franc CFA d\'Afrique Centrale), XOF (Franc CFA d\'Afrique de l\'Ouest), NGN (Naira Nigérian), GHS (Cedi Ghanéen), ZAR (Rand Sud-Africain), CNY (Yuan Chinois), USD (Dollar Américain), et EUR (Euro).'
        : language === 'ru'
        ? 'E.G. Wallet поддерживает 8 валют: XAF (Франк КФА Центральной Африки), XOF (Франк КФА Западной Африки), NGN (Нигерийская Найра), GHS (Ганский Седи), ZAR (Южноафриканский Ранд), CNY (Китайский Юань), USD (Доллар США) и EUR (Евро).'
        : language === 'zh'
        ? 'E.G. Wallet 支持8种货币：XAF（中非法郎）、XOF（西非法郎）、NGN（尼日利亚奈拉）、GHS（加纳塞地）、ZAR（南非兰特）、CNY（人民币）、USD（美元）和EUR（欧元）。'
        : 'E.G. Wallet supports 8 currencies: XAF (Central African CFA Franc), XOF (West African CFA Franc), NGN (Nigerian Naira), GHS (Ghanaian Cedi), ZAR (South African Rand), CNY (Chinese Yuan), USD (US Dollar), and EUR (Euro).'
    } else if (lowerMessage.includes('limit') || lowerMessage.includes('límite') || lowerMessage.includes('лимит')) {
      response = language === 'es'
        ? 'Los límites de transacción son: $10,000 USD por día y $50,000 USD por mes. Para aumentar los límites, complete la verificación KYC.'
        : language === 'fr'
        ? 'Les limites de transaction sont: 10 000$ USD par jour et 50 000$ USD par mois. Pour augmenter les limites, complétez la vérification KYC.'
        : language === 'ru'
        ? 'Лимиты транзакций: $10,000 USD в день и $50,000 USD в месяц. Для увеличения лимитов пройдите верификацию KYC.'
        : language === 'zh'
        ? '交易限额为：每天$10,000美元，每月$50,000美元。要提高限额，请完成KYC验证。'
        : 'Transaction limits are: $10,000 USD per day and $50,000 USD per month. To increase limits, complete KYC verification.'
    } else if (lowerMessage.includes('fee') || lowerMessage.includes('cost') || lowerMessage.includes('tarifa') || lowerMessage.includes('комиссия')) {
      response = language === 'es'
        ? 'E.G. Wallet no cobra tarifas ocultas en el cambio de divisas. Las transferencias dentro de la plataforma son instantáneas y gratuitas. Pueden aplicarse tarifas estándar de la red para retiros bancarios.'
        : language === 'fr'
        ? 'E.G. Wallet ne facture pas de frais cachés sur l\'échange de devises. Les transferts au sein de la plateforme sont instantanés et gratuits. Des frais de réseau standard peuvent s\'appliquer pour les retraits bancaires.'
        : language === 'ru'
        ? 'E.G. Wallet не взимает скрытые комиссии за обмен валюты. Переводы внутри платформы мгновенные и бесплатные. При выводе на банковский счет могут применяться стандартные сетевые комиссии.'
        : language === 'zh'
        ? 'E.G. Wallet 在货币兑换上不收取隐藏费用。平台内转账是即时且免费的。银行提款可能会产生标准网络费用。'
        : 'E.G. Wallet charges no hidden fees on currency exchange. Transfers within the platform are instant and free. Standard network fees may apply for bank withdrawals.'
    } else if (lowerMessage.includes('security') || lowerMessage.includes('safe') || lowerMessage.includes('seguridad') || lowerMessage.includes('безопасность')) {
      response = language === 'es'
        ? 'E.G. Wallet utiliza encriptación de nivel bancario, autenticación de dos factores (2FA), y monitoreo de transacciones 24/7 para mantener sus fondos seguros. Todos los datos están encriptados en tránsito y en reposo.'
        : language === 'fr'
        ? 'E.G. Wallet utilise un cryptage de niveau bancaire, l\'authentification à deux facteurs (2FA) et la surveillance des transactions 24/7 pour sécuriser vos fonds. Toutes les données sont cryptées en transit et au repos.'
        : language === 'ru'
        ? 'E.G. Wallet использует банковское шифрование, двухфакторную аутентификацию (2FA) и круглосуточный мониторинг транзакций для защиты ваших средств. Все данные шифруются при передаче и хранении.'
        : language === 'zh'
        ? 'E.G. Wallet 使用银行级加密、双因素认证（2FA）和24/7交易监控来保护您的资金安全。所有数据在传输和存储时都经过加密。'
        : 'E.G. Wallet uses bank-level encryption, two-factor authentication (2FA), and 24/7 transaction monitoring to keep your funds safe. All data is encrypted in transit and at rest.'
    } else {
      response = info
    }

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Simulate streaming by chunking the response
        const words = response.split(' ')
        let index = 0
        
        const interval = setInterval(() => {
          if (index < words.length) {
            const chunk = words[index] + ' '
            controller.enqueue(encoder.encode(chunk))
            index++
          } else {
            clearInterval(interval)
            controller.close()
          }
        }, 50)
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
