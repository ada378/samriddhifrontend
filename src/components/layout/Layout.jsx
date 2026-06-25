import { Outlet, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './Header'
import Footer from './Footer'
import MobileNav from './MobileNav'
import CompareBar from '../common/CompareBar'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, paddingTop: isHome ? 0 : 'var(--page-padding, var(--header-height))' }}>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} theme="light" newestOnTop />
      <CompareBar />
      <MobileNav />
    </div>
  )
}
