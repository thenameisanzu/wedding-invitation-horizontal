import './globals.css'
import { Cormorant_Garamond, Great_Vibes, Cinzel, Montserrat, Noto_Serif_Malayalam } from 'next/font/google'

const display = Cormorant_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap'
})

const script = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script',
  display: 'swap'
})

const royal = Cinzel({
  subsets: ['latin'],
  variable: '--font-royal',
  display: 'swap'
})

const body = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap'
})

const ml = Noto_Serif_Malayalam({
  subsets: ['malayalam'],
  weight: ['400', '600'],
  variable: '--font-ml',
  display: 'swap'
})

export const metadata = {
  metadataBase: new URL('https://aadhya-vishnu-wedding.com'),
  title: 'Aadhya & Vishnu — Wedding Invitation',
  description: 'Together with their families, Aadhya & Vishnu request the honour of your presence at their wedding celebration on 20 March 2027 in Kochi, Kerala.',
  openGraph: {
    title: 'Aadhya & Vishnu — Wedding Invitation',
    description: 'Join us to celebrate our wedding on 20 March 2027 in Kochi, Kerala. #AadhyaWedsVishnu',
    images: [
      {
        url: '/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Aadhya & Vishnu Wedding'
      }
    ],
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aadhya & Vishnu — Wedding Invitation',
    description: 'Join us on 20 March 2027 in Kochi, Kerala. #AadhyaWedsVishnu',
    images: ['/hero.jpg']
  }
}
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#F4D9D3' }

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${script.variable} ${royal.variable} ${body.variable} ${ml.variable}`}>
      <body>{children}</body>
    </html>
  )
}
