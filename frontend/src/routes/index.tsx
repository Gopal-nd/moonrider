import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'

export default function App() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (user?.email) {
      navigate({ to: '/dashboard' })
    }
  }, [user, navigate])

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">MoonRider</h1>
              </div>
              <div className="flex items-center space-x-4">
                {!user?.email && (
                  <Button asChild>
                    <Link to="/sign-in">Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!user?.email ? (
            // Not logged in state
            <div className="text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Welcome to MoonRider
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Your comprehensive business management dashboard for products, orders, customers, and analytics.
                </p>
                <div className="space-y-4">
                  <Button size="lg" asChild>
                    <Link to="/sign-in">Get Started - Sign In</Link>
                  </Button>
                  <div className="text-sm text-gray-500">
                    Sign in to access your dashboard
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Logged in state (should redirect, but fallback content)
            <div className="text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Welcome back, {user.name}!
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Redirecting you to your dashboard...
                </p>
                <Button size="lg" asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </GoogleOAuthProvider>
  )
}

export const Route = createFileRoute('/')({
  component: App,
})
