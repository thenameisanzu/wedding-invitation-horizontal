import './globals.css'
import { Playfair_Display, Pinyon_Script, Jost, Noto_Serif_Malayalam } from 'next/font/google'
const display = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-display' })
const script = Pinyon_Script({ subsets: ['latin'], weight: '400', variable: '--font-script' })
const body = Jost({ subsets: ['latin'], variable: '--font-body' })
const ml = Noto_Serif_Malayalam({ subsets: ['malayalam'], weight: ['400', '600'], variable: '--font-ml' })
export const metadata = { title: 'Aadhya and Vishnu, a wedding invitation', description: 'Join us on 20 March 2027.' }
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#F4D9D3' }
export default function RootLayout({ children }) {
  return (<html lang="en" className={`${display.variable} ${script.variable} ${body.variable} ${ml.variable}`}><body>{children}</body></html>)
}
