import { TrendingUp, Users, FileText, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Clients', value: '248', change: '+12%', icon: Users, color: 'blue' },
    { label: 'Devis en cours', value: '32', change: '+5%', icon: FileText, color: 'amber' },
    { label: 'Factures payées', value: '156', change: '+23%', icon: DollarSign, color: 'green' },
    { label: 'Revenus totaux', value: '€245,890', change: '+18%', icon: TrendingUp, color: 'violet' },
  ];

  const recentQuotes = [
    { id: '001', client: 'Société ABC', amount: '€5,200', status: 'Envoyé', date: '2025-11-03' },
    { id: '002', client: 'Entreprise XYZ', amount: '€8,450', status: 'Accepté', date: '2025-11-02' },
    { id: '003', client: 'Tech Solutions', amount: '€3,100', status: 'Brouillon', date: '2025-11-01' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepté': return 'bg-green-100 text-green-700';
      case 'Envoyé': return 'bg-blue-100 text-blue-700';
      case 'Brouillon': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Tableau de bord</h2>
        <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm">
          <option>Ce mois</option>
          <option>Cette semaine</option>
          <option>Aujourd'hui</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Devis récents</h3>
          <div className="space-y-3">
            {recentQuotes.map((quote) => (
              <div key={quote.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{quote.client}</p>
                  <p className="text-sm text-slate-600">Devis #{quote.id} - {quote.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 mb-1">{quote.amount}</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Ventes mensuelles</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 45, 78, 52, 88, 72, 95, 60, 85, 70, 92, 80].map((height, i) => (
              <div key={i} className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                   style={{ height: `${height}%` }}
                   title={`Mois ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-600">
            <span>Jan</span>
            <span>Déc</span>
          </div>
        </div>
      </div>
    </div>
  );
}
