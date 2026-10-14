'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'

// ---- Wedding Details ----
const W = {
  a: 'Aadhya',
  b: 'Vishnu',
  date: '2027-03-20T10:30:00+05:30',
  dateText: '20 March 2027',
  day: 'Saturday',
  city: 'Kochi, Kerala',
  whatsapp: '910000000000',
  venue: 'Grand Leela Palace',
  venueAddress: 'Marine Drive, Kochi, Kerala 682031',
  googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Marine+Drive+Kochi+Kerala',
  appleMapsUrl: 'https://maps.apple.com/?daddr=Marine+Drive+Kochi+Kerala',
  calendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Aadhya+%26+Vishnu%27s+Wedding&dates=20270320T050000Z/20270320T160000Z&details=Join+us+to+celebrate+the+wedding+of+Aadhya+and+Vishnu+at+Grand+Leela+Palace%2C+Marine+Drive%2C+Kochi.&location=Grand+Leela+Palace%2C+Marine+Drive%2C+Kochi',
  tag: '#AadhyaWedsVishnu'
}

const EVENTS = [
  {
    name: 'Haldi',
    date: '18 March',
    time: '10:00 am',
    theme: 'Sunny Yellow',
    hall: 'Poolside Lawn'
  },
  {
    name: 'Mehendi',
    date: '19 March',
    time: '4:00 pm',
    theme: 'Emerald Green',
    hall: 'Royal Courtyard'
  },
  {
    name: 'Wedding',
    date: '20 March',
    time: '10:30 am',
    theme: 'Kasavu & Gold',
    hall: 'The Grand Mandap'
  },
  {
    name: 'Reception',
    date: '20 March',
    time: '7:00 pm',
    theme: 'Evening Glamour',
    hall: 'Imperial Ballroom'
  }
]

const MOMENTS = [
  {
    year: '2019',
    title: 'The First Spark',
    desc: 'Campus memories & long talks under rain-washed trees',
    image: '/images/story_1.jpg'
  },
  {
    year: '2021',
    title: 'First Journey',
    desc: 'Exploring the misty hills & serene Kerala backwaters',
    image: '/images/story_2.jpg'
  },
  {
    year: '2026',
    title: 'She Said Yes',
    desc: 'A golden sunset promise sealed with endless smiles',
    image: '/images/story_3.jpg'
  },
  {
    year: '2027',
    title: 'Forever Begins',
    desc: 'Two families unite, and our forever chapter unfolds',
    image: '/images/story_4.jpg'
  }
]

const N = 7

const PETALS = Array.from({ length: 16 }, (_, i) => ({
  l: (i * 61 + 7) % 100,
  d: 14 + (i % 5) * 3,
  z: (i * 2.2) % 14,
  s: 0.65 + (i % 4) * 0.2,
  sway: 18 + (i % 4) * 8,
  r: (i % 2 === 0 ? 1 : -1) * 360
}))

const BITS = Array.from({ length: 24 }, (_, i) => ({
  x: Math.cos(i * 0.261) * (80 + (i % 4) * 35),
  y: Math.sin(i * 0.261) * (80 + (i % 4) * 35)
}))

const wa = (t) => `https://wa.me/${W.whatsapp}?text=${encodeURIComponent(t)}`
const ease = [0.22, 1, 0.36, 1]

function Panel({ p, i, bg, children }) {
  const t = useTransform(p, (v) => (v - i / (N - 1)) * (N - 1))
  return (
    <section
      className="relative h-[100dvh] w-screen shrink-0 overflow-hidden"
      style={{
        background: bg,
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        minWidth: '100vw',
        maxWidth: '100vw'
      }}
    >
      {children(t)}
    </section>
  )
}

function Par({ t, a = 100, className = '', children }) {
  const [factor, setFactor] = useState(1)

  useEffect(() => {
    const updateFactor = () => {
      const w = window.innerWidth
      if (w < 640) setFactor(0.2)
      else if (w < 1024) setFactor(0.45)
      else setFactor(1)
    }
    updateFactor()
    window.addEventListener('resize', updateFactor)
    return () => window.removeEventListener('resize', updateFactor)
  }, [])

  const currentA = a * factor
  const x = useTransform(t, [-1, 0, 1], [currentA, 0, -currentA])
  return (
    <motion.div style={{ x, willChange: 'transform' }} className={className}>
      {children}
    </motion.div>
  )
}

function Branch({ t, className }) {
  const d = useTransform(t, [-0.85, 0], [0, 1], { clamp: true })
  return (
    <svg viewBox="0 0 200 400" className={className} fill="none" stroke="#B58A5A" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <motion.path d="M20 390C70 300 50 190 140 90" style={{ pathLength: d }} />
      {[
        'M52 300Q12 290 14 250Q54 256 52 300Z',
        'M62 250Q104 244 108 206Q66 208 62 250Z',
        'M84 200Q44 188 48 150Q86 156 84 200Z',
        'M108 150Q150 142 152 104Q112 108 108 150Z',
        'M130 108Q100 80 112 50Q142 70 130 108Z'
      ].map((l, k) => (
        <motion.path key={k} d={l} style={{ pathLength: d, opacity: d }} />
      ))}
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
  useEffect(() => {
    const f = () => setN(Math.max(0, new Date(W.date) - Date.now()))
    f()
    const i = setInterval(f, 1000)
    return () => clearInterval(i)
  }, [])
  if (n === null) return null
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-6 md:gap-8 max-w-xl mx-auto w-full">
      {[
        ['Days', Math.floor(n / 864e5)],
        ['Hours', Math.floor(n / 36e5) % 24],
        ['Mins', Math.floor(n / 6e4) % 60],
        ['Secs', Math.floor(n / 1e3) % 60]
      ].map(([l, v]) => (
        <div key={l} className="text-center">
          <p className="font-display font-light text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-none">
            <Digit v={String(v).padStart(2, '0')} />
          </p>
          <p className="mt-2 text-[10px] sm:text-xs tracking-[.25em] font-royal opacity-80 uppercase">{l}</p>
        </div>
      ))}
    </div>
  )
}

const Tilt = ({ children, className }) => {
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 22, mass: 0.5 })
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 22, mass: 0.5 })
  const [canTilt, setCanTilt] = useState(false)

  useEffect(() => {
    setCanTilt(window.matchMedia('(pointer: fine)').matches)
  }, [])

  if (!canTilt) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, willChange: 'transform' }}
      onPointerMove={(e) => {
        const b = e.currentTarget.getBoundingClientRect()
        ry.set(((e.clientX - b.left) / b.width - 0.5) * 12)
        rx.set(-((e.clientY - b.top) / b.height - 0.5) * 12)
      }}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.2 })
  const sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.2 })
  const [fine, setFine] = useState(false), [big, setBig] = useState(false)

  useEffect(() => {
    setFine(window.matchMedia('(pointer:fine)').matches)
    const m = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setBig(!!e.target.closest?.('a,button,input,textarea'))
    }
    window.addEventListener('pointermove', m, { passive: true })
    return () => window.removeEventListener('pointermove', m)
  }, [])

  return fine ? (
    <motion.div style={{ x, y: sy, willChange: 'transform' }} className="pointer-events-none fixed left-0 top-0 z-[400] -ml-4 -mt-4">
      <motion.div animate={{ scale: big ? 2.2 : 1 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }} className="h-8 w-8 rounded-full border border-champ bg-champ/20 mix-blend-difference" />
    </motion.div>
  ) : null
}

export default function Site() {
  const containerRef = useRef(null)
  const audioRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [idx, setIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [yes, setYes] = useState(true)
  const [guests, setGuests] = useState(2)
  const [name, setName] = useState('')
  const [burst, setBurst] = useState(0)
  const [showMapModal, setShowMapModal] = useState(false)
  const [copiedToast, setCopiedToast] = useState(false)

  // Native horizontal scroll progress inside the container
  const { scrollXProgress } = useScroll({ container: containerRef })

  // Auto-open curtain or open on tap
  useEffect(() => {
    const t = setTimeout(() => {
      setReady(true)
    }, 2200)
    return () => clearTimeout(t)
  }, [])

  // Audio control
  const toggleAudio = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  const handleOpenCurtain = () => {
    setReady(true)
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  // Smooth scroll to slide
  const go = (targetIdx) => {
    const el = containerRef.current
    if (el) {
      const panelWidth = el.clientWidth || window.innerWidth
      el.scrollTo({
        left: targetIdx * panelWidth,
        behavior: 'smooth'
      })
      setIdx(targetIdx)
    }
  }

  // Real-time active index sync & wheel scroll support
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const left = el.scrollLeft
          const width = el.clientWidth || window.innerWidth
          if (width > 0) {
            const calculatedIdx = Math.min(N - 1, Math.max(0, Math.round(left / width)))
            setIdx(calculatedIdx)
          }
          ticking = false
        })
        ticking = true
      }
    }

    // Smooth desktop vertical wheel -> horizontal scroll
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        el.scrollBy({
          left: e.deltaY * 1.1,
          behavior: 'auto'
        })
      }
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('wheel', onWheel)
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        go(Math.min(N - 1, idx + 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        go(Math.max(0, idx - 1))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [idx])

  const send = (e) => {
    e.preventDefault()
    setBurst((b) => b + 1)
    setTimeout(() => {
      window.open(
        wa(`Hi, this is ${name}.\n${yes ? `I will joyfully attend with ${guests} guest${guests > 1 ? 's' : ''}.` : 'I regret that I cannot attend.'}`),
        '_blank'
      )
    }, 700)
  }

  // Share invitation handler
  const shareInvitation = () => {
    const shareData = {
      title: "Aadhya & Vishnu's Wedding Invitation",
      text: "Together with their families, Aadhya & Vishnu joyfully invite you to celebrate their wedding on 20 March 2027 in Kochi, Kerala. #AadhyaWedsVishnu",
      url: window.location.href
    }
    if (navigator.share) {
      navigator.share(shareData).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopiedToast(true)
        setTimeout(() => setCopiedToast(false), 2500)
      })
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <Cursor />

      {/* Background Audio */}
      <audio ref={audioRef} src="/bgm.mp3" loop preload="metadata" />

      {/* Toast Notification */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[300] rounded-full bg-champ px-6 py-2.5 text-xs font-royal tracking-widest text-wine shadow-xl uppercase"
          >
            Invitation link copied!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Map Modal */}
      <AnimatePresence>
        {showMapModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMapModal(false)}
            className="fixed inset-0 z-[350] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-champ/50 bg-wine text-ivory shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-champ/20 px-6 py-4">
                <div>
                  <h3 className="font-display italic text-2xl text-champ">{W.venue}</h3>
                  <p className="font-royal text-xs tracking-wider text-ivory/70">{W.venueAddress}</p>
                </div>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="h-9 w-9 rounded-full border border-champ/40 flex items-center justify-center text-sm text-champ hover:bg-champ/20 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Embedded Live Map */}
              <div className="relative h-72 sm:h-96 w-full bg-black/40">
                <iframe
                  title="Venue Location Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=76.26%2C9.96%2C76.29%2C9.99&layer=mapnik&marker=9.978%2C76.278"
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              </div>

              {/* Modal Footer / Navigation Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-champ/20 p-5 bg-wine/95">
                <div className="text-xs font-sans text-ivory/70 space-y-1">
                  <p>✈️ Airport: ~32 km (45 mins) | 🚆 Station: ~3.5 km (10 mins)</p>
                  <p>🅿️ Complimentary Valet Parking available</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={W.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-champ px-5 py-2.5 text-xs font-royal tracking-widest text-wine font-medium transition-all hover:bg-champ/90 active:scale-95 uppercase"
                  >
                    Google Maps ↗
                  </a>
                  <a
                    href={W.appleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-champ/50 px-5 py-2.5 text-xs font-royal tracking-widest text-champ transition-all hover:bg-champ/15 active:scale-95 uppercase"
                  >
                    Apple Maps ↗
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entrance Curtain */}
      <AnimatePresence>
        {!ready && (
          <motion.div
            key="curtain"
            onClick={handleOpenCurtain}
            className="fixed inset-0 z-[250] flex cursor-pointer select-none items-center justify-center text-ivory"
            exit={{ opacity: 0, transition: { duration: 0.9, delay: 0.25, ease: [0.65, 0, 0.35, 1] } }}
          >
            {[0, 1].map((s) => (
              <motion.div
                key={s}
                className="absolute inset-y-0 bg-wine will-change-transform"
                style={{ [s ? 'right' : 'left']: 0, width: '50.2%' }}
                exit={{ x: s ? '100%' : '-100%' }}
                transition={{ duration: 1.25, ease: [0.77, 0, 0.175, 1] }}
              />
            ))}
            <motion.div
              className="relative px-4 text-center"
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
            >
              <svg viewBox="0 0 120 120" className="mx-auto h-28 w-28 sm:h-32 sm:w-32" fill="none" stroke="#D8B98A" strokeWidth="1.5">
                <motion.circle cx="60" cy="60" r="54" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }} />
                <motion.circle cx="60" cy="60" r="46" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2, ease: [0.65, 0, 0.35, 1] }} />
              </svg>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease }}
                className="absolute inset-0 grid place-items-center font-script text-5xl sm:text-6xl text-[#D8B98A]"
              >
                {W.a[0]} &amp; {W.b[0]}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7, ease }}
                className="mt-6 text-[10px] sm:text-xs tracking-[.45em] font-royal uppercase"
              >
                A Wedding Invitation
              </motion.p>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ delay: 1, duration: 2.2, repeat: Infinity }}
                className="mt-6 inline-block text-[10px] tracking-[.3em] font-royal text-[#D8B98A] uppercase"
              >
                Tap anywhere to enter
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Rose Petals */}
      {PETALS.map((q, i) => (
        <motion.svg
          key={i}
          viewBox="-12 -12 24 40"
          className="pointer-events-none fixed top-0 z-[50] w-3.5 sm:w-4 will-change-transform"
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

      {/* Native Horizontal Scroll Container with Snap */}
      <div
        ref={containerRef}
        className="no-scrollbar flex h-[100dvh] w-screen overflow-x-auto overflow-y-hidden select-none"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          touchAction: 'pan-x'
        }}
      >
        {/* Panel 0: Cover */}
        <Panel p={scrollXProgress} i={0} bg="#F4D9D3">
          {(t) => (
            <>
              {/* Couple Hero Arch */}
              <Par t={t} a={-60} className="absolute left-1/2 top-[8dvh] sm:top-[10dvh] -translate-x-1/2 md:left-[64%]">
                <motion.div
                  initial={{ clipPath: 'inset(100% 0 0 0)' }}
                  animate={ready ? { clipPath: 'inset(0% 0 0 0)' } : {}}
                  transition={{ duration: 1.5, delay: 0.2, ease }}
                  className="h-[46dvh] sm:h-[54dvh] md:h-[68dvh] w-[min(74vw,340px)] md:w-[min(38vw,420px)] rounded-t-[999px] overflow-hidden shadow-2xl border border-champ/40 relative"
                >
                  <motion.div initial={{ scale: 1.25 }} animate={ready ? { scale: 1 } : {}} transition={{ duration: 1.8, ease }} className="h-full w-full">
                    <img src="/hero.jpg" alt={`${W.a} and ${W.b}`} className="h-full w-full rounded-t-[999px] object-cover object-center" />
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={ready ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 1.3, delay: 0.8, ease }}
                  className="pointer-events-none absolute -inset-2.5 sm:-inset-3 rounded-t-[999px] border border-champ/70"
                />
              </Par>

              {/* Names and Date */}
              <Par t={t} a={100} className="absolute bottom-[6dvh] sm:bottom-[8dvh] left-5 sm:left-8 z-10 md:left-16">
                <h1 className="font-display italic leading-[.86] text-wine font-light" aria-label={`${W.a} and ${W.b}`}>
                  {[W.a, `& ${W.b}`].map((n, k) => (
                    <span key={n} className="block overflow-hidden pb-[.08em] text-[16vw] sm:text-[13vw] md:text-[6.8vw] lg:text-[7.5rem]">
                      <motion.span
                        initial={{ y: '105%' }}
                        animate={ready ? { y: 0 } : {}}
                        transition={{ duration: 1.3, delay: 0.5 + k * 0.25, ease }}
                        className={`block ${k ? 'font-script not-italic text-champ font-normal' : 'font-light'}`}
                      >
                        {n}
                      </motion.span>
                    </span>
                  ))}
                </h1>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={ready ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.4, duration: 1, ease }}
                  className="mt-3 sm:mt-4 text-xs sm:text-sm tracking-[.3em] font-royal font-medium text-wine/80 uppercase"
                >
                  {W.dateText} · {W.city}
                </motion.p>
              </Par>

              {/* Rotating Save The Date Badge */}
              <motion.svg
                viewBox="0 0 200 200"
                className="absolute right-3 sm:right-5 top-20 sm:top-24 w-20 sm:w-28 md:right-16 md:w-36 will-change-transform"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                aria-hidden
              >
                <path id="c" d="M100 100m-70 0a70 70 0 1 1 140 0a70 70 0 1 1-140 0" fill="none" />
                <text fontSize="14" letterSpacing="4" fill="#B58A5A" fontFamily="var(--font-royal)">
                  <textPath href="#c">SAVE THE DATE • 20.03.2027 • SAVE THE DATE •</textPath>
                </text>
              </motion.svg>

              <Branch t={t} className="absolute -left-4 top-20 sm:top-24 h-52 sm:h-64 opacity-80 md:left-8" />

              {/* Scroll / Swipe Prompt */}
              <motion.button
                onClick={() => go(1)}
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-6 right-6 cursor-pointer text-xs sm:text-sm tracking-[.3em] font-royal text-wine/80 transition-colors hover:text-champ uppercase"
              >
                SWIPE →
              </motion.button>
            </>
          )}
        </Panel>

        {/* Panel 1: Invitation Text */}
        <Panel p={scrollXProgress} i={1} bg="#FBF6F0">
          {(t) => (
            <>
              <Branch t={t} className="absolute right-4 sm:right-6 top-8 sm:top-10 h-56 sm:h-72 rotate-12 md:right-24" />
              <Branch t={t} className="absolute bottom-6 left-4 sm:left-6 h-52 sm:h-64 -rotate-[150deg]" />
              <Par t={t} a={90} className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-8 text-center">
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="font-ml font-medium text-lg sm:text-2xl md:text-3xl text-wine/90 leading-relaxed max-w-xl"
                >
                  ഞങ്ങളുടെ വിവാഹത്തിലേക്ക് ഹൃദയപൂർവ്വം ക്ഷണിക്കുന്നു
                </motion.p>
                <p className="mt-6 sm:mt-8 font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-champ">
                  Together with their families
                </p>
                <p className="mt-6 sm:mt-8 max-w-xl font-display font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl italic leading-snug text-wine/90">
                  request the honour of your presence as they begin their forever.
                </p>
              </Par>
            </>
          )}
        </Panel>

        {/* Panel 2: Bride & Groom (Real Photos) */}
        <Panel p={scrollXProgress} i={2} bg="#4A0F1F">
          {(t) => (
            <div className="flex h-full flex-row items-center justify-center gap-3 sm:gap-8 md:gap-16 px-4 sm:px-8 text-ivory">
              {/* Bride Card */}
              <Par t={t} a={80} className="text-center group">
                <div className="relative mx-auto aspect-[3/4] w-[42vw] max-w-[160px] sm:max-w-[210px] md:max-w-[270px] lg:max-w-[300px] overflow-hidden rounded-t-[999px] rounded-b-2xl border-2 border-champ/60 shadow-2xl shadow-black/40">
                  <img
                    src="/images/bride.jpg"
                    alt={W.a}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine/50 via-transparent to-transparent opacity-60" />
                </div>
                <h3 className="mt-3 sm:mt-4 font-display font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic text-champ">{W.a}</h3>
                <p className="mt-1 font-royal text-[10px] sm:text-xs md:text-sm text-ivory/80 tracking-[.18em] uppercase">Daughter of Mr. &amp; Mrs. Name</p>
              </Par>

              {/* Center Heart Divider */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="shrink-0 text-champ flex flex-col items-center justify-center"
              >
                <svg viewBox="0 0 60 60" className="w-8 sm:w-10 md:w-16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M30 50C8 34 10 14 22 14C27 14 30 18 30 22C30 18 33 14 38 14C50 14 52 34 30 50Z" fill="currentColor" fillOpacity="0.15" />
                </svg>
              </motion.div>

              {/* Groom Card */}
              <Par t={t} a={-80} className="text-center group">
                <div className="relative mx-auto aspect-[3/4] w-[42vw] max-w-[160px] sm:max-w-[210px] md:max-w-[270px] lg:max-w-[300px] overflow-hidden rounded-t-[999px] rounded-b-2xl border-2 border-champ/60 shadow-2xl shadow-black/40">
                  <img
                    src="/images/groom.jpg"
                    alt={W.b}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine/50 via-transparent to-transparent opacity-60" />
                </div>
                <h3 className="mt-3 sm:mt-4 font-display font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic text-champ">{W.b}</h3>
                <p className="mt-1 font-royal text-[10px] sm:text-xs md:text-sm text-ivory/80 tracking-[.18em] uppercase">Son of Mr. &amp; Mrs. Name</p>
              </Par>
            </div>
          )}
        </Panel>

        {/* Panel 3: Our Story (Photo Milestones) */}
        <Panel p={scrollXProgress} i={3} bg="#FBF6F0">
          {(t) => (
            <div className="flex h-full flex-col justify-center px-4 sm:px-10 md:px-16 max-w-7xl mx-auto w-full">
              <Par t={t} a={90}>
                <div className="flex items-baseline justify-between mb-4 sm:mb-6">
                  <h2 className="font-display font-light text-4xl sm:text-6xl md:text-7xl lg:text-8xl italic text-wine">Our story</h2>
                  <span className="font-royal text-[10px] sm:text-xs tracking-[.25em] text-champ uppercase hidden sm:inline-block">The Journey of Two Souls</span>
                </div>
              </Par>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {MOMENTS.map((m, k) => (
                  <Par key={m.year} t={t} a={30 + k * 20}>
                    <div className="group relative overflow-hidden rounded-2xl bg-white p-2.5 sm:p-3.5 shadow-md border border-champ/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      {/* Photo Thumbnail */}
                      <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-xl bg-ivory">
                        <img
                          src={m.image}
                          alt={m.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <span className="absolute top-2 left-2 rounded-full bg-wine/85 backdrop-blur-sm px-2.5 py-0.5 text-[10px] sm:text-xs font-royal font-semibold text-champ tracking-wider shadow-sm">
                          {m.year}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="mt-2.5 sm:mt-3 px-1">
                        <h4 className="font-display font-medium text-sm sm:text-base text-wine tracking-wide">
                          {m.title}
                        </h4>
                        <p className="mt-0.5 text-[10px] sm:text-xs text-wine/70 font-sans leading-relaxed line-clamp-2">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  </Par>
                ))}
              </div>
            </div>
          )}
        </Panel>

        {/* Panel 4: Celebrations & Dress Codes */}
        <Panel p={scrollXProgress} i={4} bg="#F4D9D3">
          {(t) => (
            <div className="flex h-full flex-col justify-center px-4 sm:px-8 md:px-16 max-w-7xl mx-auto w-full">
              <Par t={t} a={90}>
                <div className="flex items-baseline justify-between mb-4 sm:mb-6">
                  <h2 className="font-display font-light text-4xl sm:text-6xl md:text-7xl lg:text-8xl italic text-wine">Celebrations</h2>
                  <span className="font-royal text-[10px] sm:text-xs tracking-[.25em] text-wine/60 uppercase hidden sm:inline-block">Order of Events</span>
                </div>
              </Par>
              
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4 md:gap-5">
                {EVENTS.map((ev, k) => (
                  <Par key={ev.name} t={t} a={35 + k * 20}>
                    <Tilt className="rounded-[20px] sm:rounded-[24px] md:rounded-[28px] bg-ivory p-3.5 sm:p-5 md:p-6 shadow-lg border border-champ/25 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-script text-3xl sm:text-4xl md:text-5xl text-champ">{ev.name}</p>
                          <span className="h-2 w-2 rounded-full bg-champ/70" />
                        </div>
                        <p className="font-royal text-xs sm:text-sm tracking-[.2em] text-wine/75 uppercase mt-3 sm:mt-4">{ev.date}</p>
                        <p className="font-display font-normal text-lg sm:text-2xl md:text-3xl italic text-wine mt-0.5">{ev.time}</p>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-champ/20 space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-wine/80">
                          <span className="opacity-60">📍</span>
                          <span className="truncate">{ev.hall}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-wine/90">
                          <span className="opacity-60">👗</span>
                          <span className="truncate">{ev.theme}</span>
                        </div>
                      </div>
                    </Tilt>
                  </Par>
                ))}
              </div>
            </div>
          )}
        </Panel>

        {/* Panel 5: Countdown, Venue & Google Maps Integration */}
        <Panel p={scrollXProgress} i={5} bg="#4A0F1F">
          {(t) => (
            <Par t={t} a={90} className="flex h-full flex-col items-center justify-center px-4 sm:px-8 text-center text-ivory max-w-4xl mx-auto w-full">
              <p className="mb-3 sm:mb-5 text-[11px] sm:text-xs tracking-[.45em] font-royal text-champ uppercase">COUNTING DOWN</p>
              
              {/* Live Countdown */}
              <Countdown />

              {/* Venue Card with Transit Info & Google Maps */}
              <div className="mt-6 sm:mt-8 w-full rounded-2xl sm:rounded-3xl border border-champ/30 bg-wine/80 p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                  <div>
                    <h3 className="font-display italic text-2xl sm:text-3xl text-champ">{W.venue}</h3>
                    <p className="mt-1 font-royal text-xs sm:text-sm tracking-wider text-ivory/80">{W.venueAddress}</p>
                    
                    {/* Transit Badges */}
                    <div className="mt-3 flex flex-wrap gap-2 text-[10px] sm:text-xs text-ivory/70">
                      <span className="rounded-full bg-white/10 px-2.5 py-1">✈️ COK Airport: 32 km (~45m)</span>
                      <span className="rounded-full bg-white/10 px-2.5 py-1">🚆 Ernakulam South: 3.5 km</span>
                      <span className="rounded-full bg-white/10 px-2.5 py-1">🅿️ Complimentary Valet</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => setShowMapModal(true)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full bg-champ px-5 py-2.5 text-[11px] sm:text-xs tracking-[.2em] font-royal text-wine font-medium shadow-md transition-all hover:bg-champ/90 active:scale-95 uppercase"
                    >
                      <span>📍 View Live Map</span>
                    </button>
                    <a
                      href={W.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-full border border-champ/60 px-5 py-2.5 text-[11px] sm:text-xs tracking-[.18em] font-royal text-champ transition-all hover:bg-champ/15 active:scale-95 uppercase"
                    >
                      <span>Directions</span>
                      <span>↗</span>
                    </a>
                    <a
                      href={W.calendarUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hidden sm:inline-flex items-center justify-center gap-1 rounded-full border border-white/30 px-5 py-2 text-[10px] tracking-[.15em] font-royal text-ivory/80 transition-all hover:bg-white/10 uppercase"
                    >
                      <span>📅 Add to Calendar</span>
                    </a>
                  </div>
                </div>
              </div>
            </Par>
          )}
        </Panel>

        {/* Panel 6: RSVP & Share */}
        <Panel p={scrollXProgress} i={6} bg="#FBF6F0">
          {(t) => (
            <div className="relative flex h-full flex-col items-center justify-center px-4 sm:px-6 text-center w-full max-w-lg mx-auto">
              <Par t={t} a={80}>
                <h2 className="font-display font-light text-4xl sm:text-6xl md:text-7xl lg:text-8xl italic text-wine">Will you join us?</h2>
              </Par>

              <form onSubmit={send} className="relative mt-5 sm:mt-7 w-full space-y-3 sm:space-y-4 text-left">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border-b-2 border-wine/30 bg-transparent py-2 sm:py-2.5 text-base sm:text-lg placeholder:text-wine/40 transition-colors focus:border-wine focus:outline-none"
                />
                
                <div className="flex gap-2.5">
                  {[
                    [true, 'Joyfully accept'],
                    [false, 'Regretfully decline']
                  ].map(([v, l]) => (
                    <button
                      type="button"
                      key={l}
                      onClick={() => setYes(v)}
                      className={`flex-1 rounded-full py-2.5 text-xs tracking-wider ring-1 ring-wine transition-all duration-300 ${yes === v ? 'bg-wine text-ivory shadow-md' : 'hover:bg-wine/5 text-wine'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                {yes && (
                  <div className="flex items-center justify-between gap-4 py-1">
                    <span className="text-xs sm:text-sm tracking-wider text-wine/90">Number of Guests</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Fewer"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-1 ring-wine flex items-center justify-center text-base transition-colors hover:bg-wine/10 active:scale-95"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-display text-2xl text-wine">{guests}</span>
                      <button
                        type="button"
                        aria-label="More"
                        onClick={() => setGuests(guests + 1)}
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-1 ring-wine flex items-center justify-center text-base transition-colors hover:bg-wine/10 active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div className="relative pt-1 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 rounded-full bg-wine px-6 py-3 text-ivory text-xs font-royal tracking-[.2em] shadow-md transition-all duration-300 hover:opacity-95 hover:shadow-lg active:scale-95 uppercase"
                  >
                    SEND RSVP VIA WHATSAPP
                  </button>
                  
                  <button
                    type="button"
                    onClick={shareInvitation}
                    className="w-full sm:w-auto rounded-full border border-wine/40 px-5 py-3 text-wine text-xs font-royal tracking-widest transition-all hover:bg-wine/5 active:scale-95 uppercase flex items-center justify-center gap-1.5"
                  >
                    <span>📤 Share</span>
                  </button>

                  {burst > 0 && (
                    <div className="pointer-events-none absolute left-1/2 top-1/2">
                      {BITS.map((b, i) => (
                        <motion.span
                          key={`${burst}${i}`}
                          initial={{ x: 0, y: 0, opacity: 1, scale: 0.8 }}
                          animate={{ x: b.x, y: b.y, opacity: 0, scale: 1.2, rotate: i * 45 }}
                          transition={{ duration: 1.3, ease }}
                          className="absolute h-2.5 w-2.5 rounded-sm bg-champ"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </form>

              {/* Blessing Note & Tag */}
              <p className="mt-6 text-[11px] sm:text-xs text-wine/60 font-serif italic max-w-xs">
                "Your presence, love and prayers are the greatest gifts we could ever receive."
              </p>
              <p className="mt-3 font-script text-3xl sm:text-4xl text-champ">{W.tag}</p>
            </div>
          )}
        </Panel>
      </div>

      {/* Top Header Navigation (Monogram, Audio Toggle, Share, Page Counter) */}
      <div className="pointer-events-none fixed inset-x-4 top-[max(14px,env(safe-area-inset-top))] z-[60] flex items-center justify-between text-xs tracking-[.2em] mix-blend-difference md:inset-x-10">
        <span className="font-script text-3xl sm:text-4xl text-white pointer-events-auto cursor-pointer" onClick={() => go(0)}>
          {W.a[0]} &amp; {W.b[0]}
        </span>
        
        <div className="flex items-center gap-2.5 sm:gap-4 pointer-events-auto">
          {/* Audio BGM Button */}
          <button
            onClick={toggleAudio}
            aria-label="Toggle background music"
            className="flex items-center gap-1.5 rounded-full border border-white/40 px-3 py-1.5 text-[11px] font-royal text-white transition-all hover:bg-white/20 active:scale-95"
          >
            <span className="flex items-end gap-0.5 h-3">
              {[0.4, 1, 0.6, 0.9].map((scale, i) => (
                <motion.span
                  key={i}
                  animate={isPlaying ? { height: ['3px', `${12 * scale}px`, '3px'] } : { height: '3px' }}
                  transition={isPlaying ? { duration: 0.8 + i * 0.2, repeat: Infinity, ease: 'easeInOut' } : {}}
                  className="w-0.5 bg-white rounded-full inline-block"
                />
              ))}
            </span>
            <span className="tracking-widest uppercase text-[10px] hidden sm:inline">{isPlaying ? 'Music' : 'Music Off'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={shareInvitation}
            aria-label="Share invitation"
            className="flex items-center gap-1 rounded-full border border-white/40 px-2.5 py-1.5 text-[11px] font-royal text-white transition-all hover:bg-white/20 active:scale-95"
          >
            <span>📤</span>
            <span className="tracking-wider uppercase text-[10px] hidden sm:inline">Share</span>
          </button>

          <span className="text-white text-xs sm:text-sm font-royal font-light tracking-widest">
            {String(idx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Floating Side Arrow Navigation (iPad & Desktop) */}
      {idx > 0 && (
        <button
          onClick={() => go(idx - 1)}
          aria-label="Previous page"
          className="fixed left-3 top-1/2 -translate-y-1/2 z-[60] hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md transition-all hover:bg-black/50 hover:scale-110 active:scale-95"
        >
          ←
        </button>
      )}
      {idx < N - 1 && (
        <button
          onClick={() => go(idx + 1)}
          aria-label="Next page"
          className="fixed right-3 top-1/2 -translate-y-1/2 z-[60] hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md transition-all hover:bg-black/50 hover:scale-110 active:scale-95"
        >
          →
        </button>
      )}

      {/* Bottom Pagination Dots */}
      <div
        style={{ bottom: 'max(14px, env(safe-area-inset-bottom))' }}
        className="fixed left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-4 py-2.5 backdrop-blur-md"
      >
        {Array.from({ length: N }, (_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full bg-white transition-all duration-300 ease-out ${idx === i ? 'w-6 opacity-100' : 'w-2 opacity-45 hover:opacity-80'}`}
          />
        ))}
      </div>

      {/* Bottom Progress Bar */}
      <motion.div
        style={{ scaleX: scrollXProgress }}
        className="fixed inset-x-0 bottom-0 z-[60] h-[3px] origin-left bg-champ will-change-transform"
      />
    </MotionConfig>
  )
}
