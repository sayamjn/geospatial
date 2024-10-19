import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import Navigation from '../components/Navigation'


export const metadata = {
  title: 'Geospatial Web Application',
  description: 'Manage and visualize geospatial data',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navigation />
          <main className="container mx-auto mt-8 px-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}