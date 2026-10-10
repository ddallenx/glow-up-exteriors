import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import SmoothScroll from './SmoothScroll'
import PageBackdrop from './PageBackdrop'

export default function Layout() {
  const { pathname } = useLocation()
  return (
    <>
      <a href="#main" className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-white px-5 py-3 text-sm font-bold text-navy transition-transform focus:translate-y-0">Skip to content</a>
      <SmoothScroll />
      <PageBackdrop />
      <Nav />
      <main id="main" key={pathname}><Outlet /></main>
      <Footer />
    </>
  )
}
