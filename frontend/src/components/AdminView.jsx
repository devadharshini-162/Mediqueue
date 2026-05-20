import { useState, useEffect } from 'react'
import { api } from '../api'
import { PhoneCall, CheckCircle, XCircle, Trash2, RefreshCw, Clock } from 'lucide-react'

export default function AdminView() {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTokens = async () => {
    try {
      const data = await api.getTokens();
      setTokens(data);
      setError('');
    } catch (err) {
      setError('Failed to refresh queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'call') await api.callToken(id);
      if (action === 'serve') await api.serveToken(id);
      if (action === 'skip') await api.skipToken(id);
      if (action === 'delete') await api.deleteToken(id);
      fetchTokens();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'WAITING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CALLED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'SERVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'SKIPPED': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Queue Management</h2>
          <p className="text-sm text-slate-500">Auto-refreshing every 10s</p>
        </div>
        <button 
          onClick={fetchTokens}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
          title="Force Refresh"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      <div className="card !p-0 overflow-hidden border-none shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Token</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic">
                    {loading ? 'Loading queue...' : 'No tokens in queue today'}
                  </td>
                </tr>
              ) : (
                tokens.map((token) => (
                  <tr key={token.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-hospital-700">#{token.tokenNumber}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{token.patientName}</td>
                    <td className="px-6 py-4 text-slate-600">{token.doctorName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(token.status)}`}>
                        {token.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(token.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {token.status === 'WAITING' && (
                          <button 
                            onClick={() => handleAction(token.id, 'call')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Call Patient"
                          >
                            <PhoneCall size={18} />
                          </button>
                        )}
                        {(token.status === 'WAITING' || token.status === 'CALLED') && (
                          <button 
                            onClick={() => handleAction(token.id, 'serve')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Mark Served"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {(token.status === 'WAITING' || token.status === 'CALLED') && (
                          <button 
                            onClick={() => handleAction(token.id, 'skip')}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Mark Skipped"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleAction(token.id, 'delete')}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
         <StatCard label="Waiting" count={tokens.filter(t => t.status === 'WAITING').length} color="amber" />
         <StatCard label="Called" count={tokens.filter(t => t.status === 'CALLED').length} color="blue" />
         <StatCard label="Served" count={tokens.filter(t => t.status === 'SERVED').length} color="emerald" />
         <StatCard label="Skipped" count={tokens.filter(t => t.status === 'SKIPPED').length} color="rose" />
      </div>
    </div>
  );
}

function StatCard({ label, count, color }) {
  const colors = {
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[color]} text-center shadow-sm`}>
      <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">{label}</p>
      <p className="text-2xl font-black">{count}</p>
    </div>
  );
}
