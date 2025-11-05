import { useState } from 'react';
import { Search, Download, Filter } from 'lucide-react';

interface LogEntry {
  id: number;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  details: string;
  type: 'create' | 'update' | 'delete' | 'login' | 'export';
}

export default function Logs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const logs: LogEntry[] = [
    { id: 1, action: 'Connexion', user: 'admin@crm.com', target: 'Système', timestamp: '2025-11-04 14:30', details: 'Connexion réussie', type: 'login' },
    { id: 2, action: 'Ajout client', user: 'jean.dupont@crm.com', target: 'Jean Dupont (Société ABC)', timestamp: '2025-11-04 13:45', details: 'Nouveau client créé', type: 'create' },
    { id: 3, action: 'Modification client', user: 'marie.martin@crm.com', target: 'Marie Martin (Entreprise XYZ)', timestamp: '2025-11-04 12:20', details: 'Mise à jour des informations', type: 'update' },
    { id: 4, action: 'Création facture', user: 'jean.dupont@crm.com', target: 'FAC-001 (€5,200)', timestamp: '2025-11-04 11:15', details: 'Nouvelle facture générée', type: 'create' },
    { id: 5, action: 'Suppression devis', user: 'marie.martin@crm.com', target: 'Devis #003', timestamp: '2025-11-04 10:30', details: 'Devis supprimé du système', type: 'delete' },
    { id: 6, action: 'Export données', user: 'admin@crm.com', target: 'Clients (CSV)', timestamp: '2025-11-03 16:45', details: 'Export de 12 clients', type: 'export' },
    { id: 7, action: 'Connexion', user: 'marie.martin@crm.com', target: 'Système', timestamp: '2025-11-03 09:00', details: 'Connexion réussie', type: 'login' },
    { id: 8, action: 'Modification facture', user: 'jean.dupont@crm.com', target: 'FAC-002 (€8,450)', timestamp: '2025-11-02 15:20', details: 'Statut changé en payée', type: 'update' },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = actionFilter === 'all' || log.type === actionFilter;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'create': return 'bg-green-100 text-green-700';
      case 'update': return 'bg-blue-100 text-blue-700';
      case 'delete': return 'bg-red-100 text-red-700';
      case 'login': return 'bg-amber-100 text-amber-700';
      case 'export': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'create': return 'Création';
      case 'update': return 'Modification';
      case 'delete': return 'Suppression';
      case 'login': return 'Connexion';
      case 'export': return 'Export';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-slate-900">Journalisation (Logs)</h2>
        <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="w-5 h-5 mr-2" />
          Exporter les logs
        </button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher dans les logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="create">Création</option>
            <option value="update">Modification</option>
            <option value="delete">Suppression</option>
            <option value="login">Connexion</option>
            <option value="export">Export</option>
          </select>
        </div>

        <div className="overflow-x-auto hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date/Heure</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Action</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 hidden lg:table-cell">Utilisateur</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Cible</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 hidden lg:table-cell">Détails</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4 text-sm text-slate-600 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                      {getTypeLabel(log.type)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-700 hidden lg:table-cell truncate">{log.user}</td>
                  <td className="py-4 px-4 text-sm text-slate-700 truncate">{log.target}</td>
                  <td className="py-4 px-4 text-sm text-slate-600 hidden lg:table-cell">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {filteredLogs.map((log) => (
            <div key={log.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{log.action}</p>
                  <p className="text-xs text-slate-600 mt-1">{log.timestamp}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getTypeColor(log.type)}`}>
                  {getTypeLabel(log.type)}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium text-slate-700">Utilisateur:</span> <span className="text-slate-600">{log.user}</span></div>
                <div><span className="font-medium text-slate-700">Cible:</span> <span className="text-slate-600">{log.target}</span></div>
                <div><span className="font-medium text-slate-700">Détails:</span> <span className="text-slate-600">{log.details}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
