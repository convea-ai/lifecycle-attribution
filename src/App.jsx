import { Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'

// Simple test component
const TestComponent = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Lifecycle Attribution Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          React app is working! Loading main dashboard...
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-green-600">✓ React is rendering</p>
          <p className="text-green-600">✓ Tailwind CSS is working</p>
          <p className="text-green-600">✓ Router is functional</p>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}

export default App 