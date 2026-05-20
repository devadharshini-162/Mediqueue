import { useState, useEffect } from 'react'
import { api } from '../api'
import { User, UserPlus, Clock, Ticket, CheckCircle2 } from 'lucide-react'

const DOCTORS = ["Dr. Kumar", "Dr. Priya", "Dr. Rajan", "Dr. Meena"]

export default function PatientView() {
  const [patientName, setPatientName] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentToken, setCurrentToken] = useState(null)
  const [queueInfo, setQueueInfo] = useState({ position: 0, waitTime: 0 })

  // Refresh queue position if token exists
  useEffect(() => {
    if (!currentToken) return;

    const interval = setInterval(async () => {
      try {
        const tokens = await api.getTokens();
        const activeTokens = tokens.filter(t => t.status === 'WAITING' || t.status === 'CALLED');
        const pos = activeTokens.findIndex(t => t.id === currentToken.id);
        
        if (pos !== -1) {
          setQueueInfo({
            position: pos + 1,
            waitTime: pos * 5
          });
        } else {
          // Check if it was served
          const myToken = tokens.find(t => t.id === currentToken.id);
          if (myToken && (myToken.status === 'SERVED' || myToken.status === 'SKIPPED')) {
             setCurrentToken(myToken);
          }
        }
      } catch (err) {
        console.error('Refresh error:', err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [currentToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    setLoading(true);
    setError('');
    try {
      const token = await api.registerToken(patientName, selectedDoctor);
      setCurrentToken(token);
      
      // Calculate initial queue info
      const tokens = await api.getTokens();
      const activeTokens = tokens.filter(t => t.status === 'WAITING' || t.status === 'CALLED');
      const pos = activeTokens.findIndex(t => t.id === token.id);
      
      setQueueInfo({
        position: pos !== -1 ? pos + 1 : 1,
        waitTime: pos !== -1 ? pos * 5 : 0
      });
      
      setPatientName('');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (currentToken) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <div className="card text-center space-y-4 border-2 border-hospital-200">
          <div className="mx-auto w-16 h-16 bg-hospital-100 text-hospital-600 rounded-full flex items-center justify-center">
            <Ticket size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Token Registered!</h2>
            <p className="text-slate-500">Hello {currentToken.patientName}, your token is ready.</p>
          </div>

          <div className="py-8 bg-hospital-50 rounded-2xl">
            <span className="text-6xl font-black text-hospital-600">
              #{currentToken.tokenNumber}
            </span>
            <p className="text-hospital-800 font-medium mt-2">{currentToken.doctorName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-1">
                <User size={16} />
                <span>Position</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{queueInfo.position}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-1">
                <Clock size={16} />
                <span>Wait Time</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{queueInfo.waitTime} min</p>
            </div>
          </div>

          <button 
            onClick={() => setCurrentToken(null)}
            className="w-full btn btn-secondary"
          >
            Register New Token
          </button>
        </div>

        {currentToken.status === 'SERVED' && (
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800">
            <CheckCircle2 className="text-emerald-500" />
            <p className="font-medium">You have been served. Thank you!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="bg-hospital-50 p-2 rounded-lg text-hospital-600">
            <UserPlus size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Get a Token</h2>
            <p className="text-sm text-slate-500">Enter details to join the queue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Patient Name</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. John Doe"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Select Doctor</label>
            <select
              className="input-field appearance-none bg-no-repeat bg-right"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundSize: '1.5rem' }}
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              {DOCTORS.map(doc => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Ticket size={20} />
                <span>Generate Token</span>
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400">
          * Estimated wait time is 5 minutes per token in queue
        </p>
      </div>
    </div>
  );
}
