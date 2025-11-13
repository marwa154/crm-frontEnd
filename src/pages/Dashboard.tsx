
import { TrendingUp, Users, FileText, DollarSign } from 'lucide-react';
import { useStats } from '../hooks/statsHooks/useStats';
import { useDevis } from '../hooks/devisHooks/useDevis';

export default function Dashboard() {
  const { data: statsNumber } = useStats()
  const { data: devis } = useDevis()
  const stats = [
    { label: 'Total Clients', value: statsNumber?.totalClients, change: statsNumber?.evolution?.clients, icon: Users, color: 'blue' },
    { label: 'Devis accepté', value: statsNumber?.devisAcceptes, change: statsNumber?.evolution?.devis, icon: FileText, color: 'amber' },
    { label: 'Factures payées', value: statsNumber?.facturesPayees, change: statsNumber?.evolution?.factures, icon: DollarSign, color: 'green' },
    { label: 'Revenus totaux', value: `${statsNumber?.revenusTotaux}Dt`, change: statsNumber?.evolution?.revenus, icon: TrendingUp, color: 'violet' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepté': return 'bg-green-100 text-green-700';
      case 'envoyé': return 'bg-blue-100 text-blue-700';
      case 'brouillon': return 'bg-slate-100 text-slate-700';
      case 'refusé': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };


  const totalVentesAnnee = statsNumber?.ventesMensuelles?.reduce((sum:number, mois:any) => sum + mois.total, 0) || 0;
  const ventesAvecPourcentage = statsNumber?.ventesMensuelles?.map((mois:any )=> ({
    ...mois,
    pourcentage: totalVentesAnnee > 0 ? (mois.total / totalVentesAnnee) * 100 : 0
  })) || [];


  return (
    <div className="space-y-6">
      {/* <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Tableau de bord</h2>
        <select className="px-4 py-2 text-sm border rounded-lg border-slate-300">
          <option>Ce mois</option>
          <option>Cette semaine</option>
          <option>Aujourd'hui</option>
        </select>
      </div> */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats?.map((stat) => (
          <div key={stat.label} className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <h3 className="mb-1 text-2xl font-bold text-slate-900">{stat.value}</h3>
            <p className="text-sm text-slate-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Devis récents</h3>
          <div className="space-y-3">
            {devis?.slice(0, 5).map((quote) => (
              <div key={quote._id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">{quote.clientId.fullName}</p>
                  <p className="text-sm text-slate-600">{quote.codeUnique} - {quote.createdAt.split("T")[0]}</p>
                </div>
                <div className="text-right">
                  <p className="mb-1 font-semibold text-slate-900">{quote.totalHT}Dt</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Ventes mensuelles</h3>
          <div className="flex items-end justify-between h-64 space-x-2">
            {ventesAvecPourcentage?.map((v:any, i:number) => (
              <div key={i} className="flex-1 transition-colors bg-blue-500 rounded-t cursor-pointer hover:bg-blue-600"
                style={{ height: `${v.pourcentage}%` }}
                title={`Mois ${v.nomMois
                  }: ${v.total}Dt`}
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
