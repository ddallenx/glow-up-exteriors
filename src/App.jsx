import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { TransitionProvider } from './components/Transition'
import Layout from './components/Layout'
import Home from './pages/Home'

const WindowWashing = lazy(() => import('./pages/WindowWashing'))
const PressureWashing = lazy(() => import('./pages/PressureWashing'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <TransitionProvider>
      <Suspense fallback={<div className="min-h-screen bg-midnight" />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="window-washing" element={<WindowWashing />} />
            <Route path="pressure-washing" element={<PressureWashing />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </TransitionProvider>
  )
}
