import { useState } from 'react'
import PatientView from './components/PatientView'
import AdminView from './components/AdminView'
import { LayoutDashboard, UserCircle, Stethoscope } from 'lucide-react'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-hospital-600 p-2 rounded-lg text-white">
                <Stethoscope size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Medi<span className="text-hospital-600">Queue</span>
              </h1>
            </div>

            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all"
            >
              {isAdmin ? (
                <>
                  <UserCircle size={20} />
                  <span>Patient View</span>
                </>
              ) : (
                <>
                  <LayoutDashboard size={20} />
                  <span>Admin Dashboard</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-in fade-in duration-500">
          {isAdmin ? <AdminView /> : <PatientView />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} MediQueue Hospital Systems. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
