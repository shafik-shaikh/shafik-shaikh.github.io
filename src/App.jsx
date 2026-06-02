import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CryptoTracker from './pages/demos/CryptoTracker'
import StockDashboard from './pages/demos/StockDashboard'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo/crypto" element={<CryptoTracker />} />
        <Route path="/demo/stocks" element={<StockDashboard />} />
      </Routes>
    </HashRouter>
  )
}
