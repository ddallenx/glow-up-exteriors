import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { TransitionProvider } from './components/Transition'
import Intro from './components/Intro'
import { introWanted } from './lib/intro'
import Layout from './components/Layout'
import Home from './pages/Home'

const WindowWashing = lazy(() => import('./pages/WindowWashing'))
const PressureWashing = lazy(() => import('./pages/PressureWashing'))
const Commercial = lazy(() => import('./pages/Commercial'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

const prefetch = () => [import('./pages/WindowWashing'), import('./pages/PressureWashing'), import('./pages/Commercial'), import('./pages/About'), import('./pages/Contact')]

export default function App() {
  const [booted, setBooted] = useState(!introWanted)
  useEffect(() => {
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1200))
    const id = idle(prefetch, { timeout: 2500 })
    return () => window.cancelIdleCallback?.(id)
  }, [])
  return (
    <TransitionProvider>
      {introWanted && <Intro onOpen={() => setBooted(true)} />}
      {booted && <Suspense fallback={<div className="min-h-screen bg-midnight" />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="window-washing" element={<WindowWashing />} />
            <Route path="pressure-washing" element={<PressureWashing />} />
            <Route path="commercial" element={<Commercial />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="quote" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>}
    </TransitionProvider>
  )
}
