'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'

// ---- Edit your wedding details here ----
const W = { a: 'Aadhya', b: 'Vishnu', date: '2027-03-20T10:30:00+05:30', dateText: '20 March 2027', day: 'Saturday', city: 'Kochi, Kerala', whatsapp: '910000000000', venue: 'Venue name, Street, Kochi, Kerala', maps: 'https://www.google.com/maps/search/?api=1&query=Kochi', tag: '#AadhyaWedsVishnu' }
const EVENTS = [['Haldi', '18 March', '10:00 am'], ['Mehendi', '19 March', '4:00 pm'], ['Wedding', '20 March', '10:30 am'], ['Reception', '20 March', '7:00 pm']]
const MOMENTS = [['2019', 'We met'], ['2021', 'First trip together'], ['2026', 'The proposal'], ['2027', 'Forever begins']]
const N = 7
const PETALS = Array.from({ length: 16 }, (_, i) => ({
  l: (i * 61 + 7) % 100,
  d: 14 + (i % 5) * 3,
  z: (i * 2.2) % 14,
  s: 0.65 + (i % 4) * 0.2,
  sway: 18 + (i % 4) * 8,
  r: (i % 2 === 0 ? 1 : -1) * 360
}))
const BITS = Array.from({ length: 20 }, (_, i) => ({ x: Math.cos(i * .314) * (90 + (i % 3) * 40), y: Math.sin(i * .314) * (90 + (i % 3) * 40) }))
const wa = (t) => `https://wa.me/${W.whatsapp}?text=${encodeURIComponent(t)}`
const ease = [0.22, 1, 0.36, 1]

function Panel({ p, i, bg, children }) {
  const t = useTransform(p, (v) => (v - i / (N - 1)) * (N - 1))
  return <section className="relative h-[100dvh] w-screen shrink-0 overflow-hidden" style={{ background: bg }}>{children(t)}</section>
}
function Par({ t, a = 100, className = '', children }) {
  const x = useTransform(t, [-1, 0, 1], [a, 0, -a])
  return <motion.div style={{ x, willChange: 'transform' }} className={className}>{children}</motion.div>
}
function Branch({ t, className }) {
  const d = useTransform(t, [-.85, 0], [0, 1], { clamp: true })
  return (
    <svg viewBox="0 0 200 400" className={className} fill="none" stroke="#B58A5A" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <motion.path d="M20 390C70 300 50 190 140 90" style={{ pathLength: d }} />
      {['M52 300Q12 290 14 250Q54 256 52 300Z', 'M62 250Q104 244 108 206Q66 208 62 250Z', 'M84 200Q44 188 48 150Q86 156 84 200Z', 'M108 150Q150 142 152 104Q112 108 108 150Z', 'M130 108Q100 80 112 50Q142 70 130 108Z'].map((l, k) => <motion.path key={k} d={l} style={{ pathLength: d, opacity: d }} />)}
    </svg>
  )
}
function Digit({ v }) {
  return (
    <span className="relative inline-block h-[1.05em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={v}
          initial={{ y: '100%', opacity: 0.3 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0.3 }}
          transition={{ duration: 0.55, ease }}
          className="inline-block"
        >
          {v}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
function Countdown() {
  const [n, setN] = useState(null)
  useEffect(() => { const f = () => setN(Math.max(0, new Date(W.date) - Date.now())); f(); const i = setInterval(f, 1000); return () => clearInterval(i) }, [])
  if (n === null) return null
  return <div className="grid grid-cols-4 gap-3 md:gap-10">{[['Days', Math.floor(n / 864e5)], ['Hours', Math.floor(n / 36e5) % 24], ['Mins', Math.floor(n / 6e4) % 60], ['Secs', Math.floor(n / 1e3) % 60]].map(([l, v]) => <div key={l} className="text-center"><p className="font-display text-[14vw] leading-none md:text-[8rem]"><Digit v={String(v).padStart(2, '0')} /></p><p className="mt-2 text-xs tracking-[.25em] opacity-70">{l.toUpperCase()}</p></div>)}</div>
}
const Tilt = ({ children, className }) => {
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 22, mass: 0.5 }), ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 22, mass: 0.5 })
  return <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, willChange: 'transform' }} onPointerMove={(e) => { const b = e.currentTarget.getBoundingClientRect(); ry.set(((e.clientX - b.left) / b.width - .5) * 12); rx.set(-((e.clientY - b.top) / b.height - .5) * 12) }} onPointerLeave={() => { rx.set(0); ry.set(0) }} className={className}>{children}</motion.div>
}
const Ph = ({ label, className = '', style }) => <div className={`relative overflow-hidden bg-[#E9C4BC] ${className}`} style={style}><div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_14px,rgba(74,15,31,.06)_14px_28px)]" /><span className="absolute bottom-4 left-0 right-0 text-center text-xs tracking-[.2em] text-wine/50">{label}</span></div>

function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100), sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.2 }), sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.2 })
  const [fine, setFine] = useState(false), [big, setBig] = useState(false)
  useEffect(() => { setFine(matchMedia('(pointer:fine)').matches); const m = (e) => { x.set(e.clientX); y.set(e.clientY); setBig(!!e.target.closest?.('a,button,input,textarea')) }; addEventListener('pointermove', m, { passive: true }); return () => removeEventListener('pointermove', m) }, [])
  return fine ? <motion.div style={{ x: sx, y: sy, willChange: 'transform' }} className="pointer-events-none fixed left-0 top-0 z-[400] -ml-4 -mt-4"><motion.div animate={{ scale: big ? 2.2 : 1 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }} className="h-8 w-8 rounded-full border border-champ bg-champ/20 mix-blend-difference" /></motion.div> : null
}

export default function Site() {
  const ref = useRef(null)
  const [ready, setReady] = useState(false), [idx, setIdx] = useState(0)
  const [yes, setYes] = useState(true), [guests, setGuests] = useState(2), [name, setName] = useState(''), [burst, setBurst] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 25, mass: 0.55, restDelta: 0.0001 })
  const x = useTransform(p, [0, 1], ['0vw', `-${(N - 1) * 100}vw`])
  const bar = useTransform(p, [0, 1], [0, 1])
  useEffect(() => { document.body.style.overflow = ready ? '' : 'hidden'; if (ready) scrollTo(0, 0) }, [ready])
  useEffect(() => { const t = setTimeout(() => setReady(true), 3000); return () => clearTimeout(t) }, [])
  useEffect(() => {
    let to, touch = false
    const snap = () => {
      if (touch || !ref.current) return
      const el = ref.current, tot = el.offsetHeight - innerHeight
      if (tot <= 0) return
      const pr = (scrollY - el.offsetTop) / tot
      if (pr < 0 || pr > 1) return
      scrollTo({ top: el.offsetTop + (Math.round(pr * (N - 1)) / (N - 1)) * tot, behavior: 'smooth' })
    }
    const f = () => {
      clearTimeout(to)
      to = setTimeout(snap, 450)
      const el = ref.current
      if (el) {
        const tot = el.offsetHeight - innerHeight
        if (tot > 0) setIdx(Math.round(((scrollY - el.offsetTop) / tot) * (N - 1)))
      }
    }
    const w = (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) scrollBy({ top: e.deltaX }) }
    const ts = () => (touch = true), te = () => { touch = false; f() }
    const k = (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') go(Math.min(N - 1, Math.max(0, idx + (e.key === 'ArrowRight' ? 1 : -1)))) }
    addEventListener('scroll', f, { passive: true }); addEventListener('wheel', w, { passive: true }); addEventListener('touchstart', ts, { passive: true }); addEventListener('touchend', te, { passive: true }); addEventListener('keydown', k)
    return () => { clearTimeout(to); removeEventListener('scroll', f); removeEventListener('wheel', w); removeEventListener('touchstart', ts); removeEventListener('touchend', te); removeEventListener('keydown', k) }
  }, [idx])
  const go = (i) => { const el = ref.current; if (el) scrollTo({ top: el.offsetTop + (i / (N - 1)) * (el.offsetHeight - innerHeight), behavior: 'smooth' }) }
  const send = (e) => { e.preventDefault(); setBurst((b) => b + 1); setTimeout(() => open(wa(`Hi, this is ${name}.\n${yes ? `I will joyfully attend with ${guests} guest${guests > 1 ? 's' : ''}.` : 'I regret that I cannot attend.'}`), '_blank'), 700) }

  return (
    <MotionConfig reducedMotion="user">
      <Cursor />
      <AnimatePresence>{!ready && (
        <motion.div key="curtain" className="fixed inset-0 z-[250] flex items-center justify-center text-ivory" exit={{ opacity: 0, transition: { duration: 0.9, delay: 0.45, ease: [0.65, 0, 0.35, 1] } }}>
          {[0, 1].map((s) => <motion.div key={s} className="absolute inset-y-0 bg-wine will-change-transform" style={{ [s ? 'right' : 'left']: 0, width: '50.2%' }} exit={{ x: s ? '100%' : '-100%' }} transition={{ duration: 1.35, ease: [0.77, 0, 0.175, 1] }} />)}
          <motion.div className="relative text-center" exit={{ opacity: 0, scale: 1.15 }} transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}>
            <svg viewBox="0 0 120 120" className="mx-auto h-32 w-32" fill="none" stroke="#D8B98A" strokeWidth="1.5"><motion.circle cx="60" cy="60" r="54" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }} /><motion.circle cx="60" cy="60" r="46" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, delay: .25, ease: [0.65, 0, 0.35, 1] }} /></svg>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9, duration: .9, ease }} className="absolute inset-0 grid place-items-center font-script text-5xl text-[#D8B98A]">{W.a[0]} &amp; {W.b[0]}</motion.p>
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: .8, ease }} className="mt-6 text-xs tracking-[.4em]">A WEDDING INVITATION</motion.p>
          </motion.div>
        </motion.div>)}</AnimatePresence>

      {PETALS.map((q, i) => (
        <motion.svg
          key={i}
          viewBox="-12 -12 24 40"
          className="pointer-events-none fixed top-0 z-[50] w-4 will-change-transform"
          style={{ left: `${q.l}%`, scale: q.s }}
          initial={{ y: '-10vh', opacity: 0 }}
          animate={{
            y: '110vh',
            opacity: [0, 0.75, 0.75, 0],
            rotate: [0, q.r],
            x: [0, q.sway, -q.sway, q.sway * 0.6, 0]
          }}
          transition={{
            duration: q.d,
            delay: -q.z,
            repeat: Infinity,
            ease: 'linear'
          }}
          aria-hidden
        >
          <path d="M0 0C10 -10 20 0 10 18C0 26 -10 14 0 0Z" fill="#E7A9B2" opacity=".7" />
        </motion.svg>
      ))}

      <div ref={ref} style={{ height: `${N * 100}vh` }} className="relative">
        <div className="sticky top-0 h-[100dvh] overflow-hidden">
          <motion.div style={{ x, willChange: 'transform' }} className="flex h-full">
            <Panel p={p} i={0} bg="#F4D9D3">{(t) => (<>
              <Par t={t} a={-60} className="absolute left-1/2 top-[11dvh] -translate-x-1/2 md:left-[64%]">
                <motion.div initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={ready ? { clipPath: 'inset(0% 0 0 0)' } : {}} transition={{ duration: 1.6, delay: .2, ease }} className="h-[56dvh] w-[min(76vw,400px)] rounded-t-[999px] md:h-[72dvh]">
                  <motion.div initial={{ scale: 1.35 }} animate={ready ? { scale: 1 } : {}} transition={{ duration: 2, ease }} className="h-full w-full">
                    <img src="/hero.jpg" alt={`${W.a} and ${W.b}`} className="h-full w-full rounded-t-[999px] object-cover object-center" />
                  </motion.div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: .92 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1.4, delay: 1, ease }} className="pointer-events-none absolute -inset-3 rounded-t-[999px] border border-champ" />
              </Par>
              <Par t={t} a={160} className="absolute bottom-[9dvh] left-5 z-10 md:left-16">
                <h1 className="font-display italic leading-[.82] text-wine" aria-label={`${W.a} and ${W.b}`}>
                  {[W.a, `& ${W.b}`].map((n, k) => <span key={n} className="block overflow-hidden pb-[.1em] text-[22vw] md:text-[11rem]"><motion.span initial={{ y: '105%' }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1.4, delay: .6 + k * .25, ease }} className={`block ${k ? 'font-script not-italic text-champ' : ''}`}>{n}</motion.span></span>)}
                </h1>
                <motion.p initial={{ opacity: 0, y: 8 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.8, duration: 1, ease }} className="mt-4 text-sm tracking-[.3em]">{W.dateText.toUpperCase()}  ·  {W.city.toUpperCase()}</motion.p>
              </Par>
              <motion.svg viewBox="0 0 200 200" className="absolute right-4 top-24 w-24 md:right-16 md:w-36 will-change-transform" animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} aria-hidden><path id="c" d="M100 100m-70 0a70 70 0 1 1 140 0a70 70 0 1 1-140 0" fill="none" /><text fontSize="17" letterSpacing="3" fill="#B58A5A"><textPath href="#c">save the date • 20.03.2027 • save the date •</textPath></text></motion.svg>
              <Branch t={t} className="absolute -left-4 top-24 h-64 opacity-80 md:left-8" />
              <motion.p animate={{ x: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-6 right-6 text-sm tracking-[.3em]">SCROLL →</motion.p>
            </>)}</Panel>

            <Panel p={p} i={1} bg="#FBF6F0">{(t) => (<>
              <Branch t={t} className="absolute right-6 top-10 h-72 rotate-12 md:right-24" />
              <Branch t={t} className="absolute bottom-6 left-6 h-64 -rotate-[150deg]" />
              <Par t={t} a={120} className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                <p className="font-ml text-xl md:text-3xl">ഞങ്ങളുടെ വിവാഹത്തിലേക്ക് ഹൃദയപൂർവ്വം ക്ഷണിക്കുന്നു</p>
                <p className="mt-8 font-script text-6xl text-champ md:text-8xl">Together with their families</p>
                <p className="mt-8 max-w-xl font-display text-3xl italic leading-snug md:text-5xl">request the honour of your presence as they begin their forever.</p>
              </Par></>)}</Panel>

            <Panel p={p} i={2} bg="#4A0F1F">{(t) => { return (<div className="flex h-full flex-col items-center justify-center gap-6 px-5 text-ivory md:flex-row md:gap-16">
              <Par t={t} a={260} className="text-center"><Ph label="BRIDE PHOTO" className="mx-auto aspect-[3/4] w-[38vw] max-w-[300px] rounded-[999px_999px_20px_20px]" /><p className="mt-4 font-display text-4xl italic md:text-6xl">{W.a}</p><p className="text-sm opacity-70">Daughter of Mr. and Mrs. Name</p></Par>
              <motion.svg viewBox="0 0 60 60" className="w-12 text-champ md:w-20 will-change-transform" fill="none" stroke="currentColor" strokeWidth="1.5" animate={{ scale: [1, 1.14, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}><path d="M30 50C8 34 10 14 22 14C27 14 30 18 30 22C30 18 33 14 38 14C50 14 52 34 30 50Z" /></motion.svg>
              <Par t={t} a={-260} className="text-center"><Ph label="GROOM PHOTO" className="mx-auto aspect-[3/4] w-[38vw] max-w-[300px] rounded-[999px_999px_20px_20px]" /><p className="mt-4 font-display text-4xl italic md:text-6xl">{W.b}</p><p className="text-sm opacity-70">Son of Mr. and Mrs. Name</p></Par>
            </div>) }}</Panel>

            <Panel p={p} i={3} bg="#FBF6F0">{(t) => (<div className="flex h-full flex-col justify-center px-6 md:px-20">
              <Par t={t} a={140}><h2 className="font-display text-6xl italic md:text-9xl">Our story</h2></Par>
              <div className="relative mt-12 grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-4">
                <div className="absolute left-0 right-0 top-2 hidden h-px bg-champ/50 md:block" />
                {MOMENTS.map(([y, m], k) => <Par key={y} t={t} a={60 + k * 60}><motion.span initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: k * .12, duration: .6, ease }} className="relative block h-4 w-4 rounded-full bg-champ shadow-sm" /><p className="mt-4 font-display text-5xl italic text-champ">{y}</p><p className="mt-1 text-lg">{m}</p></Par>)}
              </div></div>)}</Panel>

            <Panel p={p} i={4} bg="#F4D9D3">{(t) => (<div className="flex h-full flex-col justify-center px-5 md:px-16">
              <Par t={t} a={140}><h2 className="font-display text-6xl italic md:text-9xl">Celebrations</h2></Par>
              <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">{EVENTS.map(([n, d, tm], k) => <Par key={n} t={t} a={80 + k * 70}><Tilt className="rounded-[28px] bg-ivory p-5 shadow-xl md:p-8"><p className="font-script text-4xl text-champ md:text-5xl">{n}</p><p className="mt-6 text-sm tracking-[.2em]">{d.toUpperCase()}</p><p className="font-display text-3xl italic md:text-4xl">{tm}</p></Tilt></Par>)}</div></div>)}</Panel>

            <Panel p={p} i={5} bg="#4A0F1F">{(t) => (<Par t={t} a={160} className="flex h-full flex-col items-center justify-center px-5 text-center text-ivory">
              <p className="mb-8 text-xs tracking-[.4em]">COUNTING DOWN</p><Countdown />
              <p className="mt-12 max-w-md text-lg">{W.venue}</p><a href={W.maps} target="_blank" rel="noreferrer" className="mt-6 rounded-full border border-champ px-8 py-4 text-champ transition-colors duration-300 hover:bg-champ/10">Open in Google Maps</a></Par>)}</Panel>

            <Panel p={p} i={6} bg="#FBF6F0">{(t) => (<div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
              <Par t={t} a={140}><h2 className="font-display text-6xl italic md:text-8xl">Will you join us?</h2></Par>
              <form onSubmit={send} className="relative mt-8 w-full max-w-md space-y-4 text-left">
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full border-b-2 border-wine/40 bg-transparent py-3 text-xl placeholder:text-wine/40 transition-colors focus:border-wine" />
                <div className="flex gap-3">{[[true, 'Joyfully accept'], [false, 'Regretfully decline']].map(([v, l]) => <button type="button" key={l} onClick={() => setYes(v)} className={`flex-1 rounded-full py-3 ring-1 ring-wine transition-all duration-300 ${yes === v ? 'bg-wine text-ivory shadow-md' : 'hover:bg-wine/5'}`}>{l}</button>)}</div>
                {yes && <div className="flex items-center gap-4"><span>Guests</span><button type="button" aria-label="Fewer" onClick={() => setGuests(Math.max(1, guests - 1))} className="h-11 w-11 rounded-full ring-1 ring-wine transition-colors hover:bg-wine/10">−</button><span className="w-6 text-center font-display text-3xl">{guests}</span><button type="button" aria-label="More" onClick={() => setGuests(guests + 1)} className="h-11 w-11 rounded-full ring-1 ring-wine transition-colors hover:bg-wine/10">+</button></div>}
                <div className="relative inline-block"><button className="rounded-full bg-wine px-10 py-4 text-ivory shadow-md transition-all duration-300 hover:opacity-95 hover:shadow-lg active:scale-95">Send my RSVP</button>{burst > 0 && <div className="pointer-events-none absolute left-1/2 top-1/2">{BITS.map((b, i) => <motion.span key={`${burst}${i}`} initial={{ x: 0, y: 0, opacity: 1, scale: .8 }} animate={{ x: b.x, y: b.y, opacity: 0, scale: 1.2, rotate: i * 45 }} transition={{ duration: 1.3, ease }} className="absolute h-2.5 w-2.5 rounded-sm bg-champ" />)}</div>}</div>
              </form>
              <p className="mt-10 font-script text-4xl text-champ">{W.tag}</p>
            </div>)}</Panel>
          </motion.div>

          <div className="absolute inset-x-5 top-[max(16px,env(safe-area-inset-top))] z-[60] flex items-center justify-between text-xs tracking-[.2em] mix-blend-difference md:inset-x-12"><span className="font-script text-2xl text-white">{W.a[0]} &amp; {W.b[0]}</span><span className="text-white">{String(idx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span></div>
          <div style={{ bottom: 'max(14px, env(safe-area-inset-bottom))' }} className="absolute left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/25 px-4 py-3 backdrop-blur-md">{Array.from({ length: N }, (_, i) => <button key={i} onClick={() => go(i)} aria-label={`Page ${i + 1}`} className={`h-2 rounded-full bg-white transition-all duration-300 ease-out ${idx === i ? 'w-6 opacity-100' : 'w-2 opacity-50 hover:opacity-80'}`} />)}</div>
          <motion.div style={{ scaleX: bar }} className="absolute inset-x-0 bottom-0 z-[60] h-[3px] origin-left bg-champ will-change-transform" />
        </div>
      </div>
    </MotionConfig>
  )
}

