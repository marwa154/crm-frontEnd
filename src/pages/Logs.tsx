import { useEffect, useState } from 'react';
import { Search, Download } from 'lucide-react';
import axios from 'axios';
  import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface LogEntry {
  _id: string;
  userId: any;
  name: any;
  typeAction: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'EXPORT';
  module: string;
  targetId: string;
  description: string;
  newValue?: any;
  dateAction: string;
}

export default function Logs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const token = localStorage.getItem('token');

  const fetchLogs = async (token: string) => {
    try {
      const res = await axios.get('http://localhost:5000/api/jounalisation/getall', {
        headers: { Authorization: `Bearer ${token}` },
        params: { t: Date.now() },
      });
     
      return res.data;
    } catch (err) {
      console.error('Erreur récupération logs:', err);
      return [];
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchLogs(token).then((data) => setLogs(data));
  }, [token]);

 const filteredLogs = logs.filter((log) => {
  // Récupérer le nom de l'utilisateur si userId est un objet, sinon utiliser l'ID
  const userName = typeof log.userId === 'object' ? log.userId.name : log.userId;
  const term = searchTerm.toLowerCase();

  return (
    userName?.toLowerCase().includes(term) ||
    log.description.toLowerCase().includes(term) ||
    log.module.toLowerCase().includes(term)
  );
});

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CREATE': return 'bg-green-100 text-green-700';
      case 'UPDATE': return 'bg-blue-100 text-blue-700';
      case 'DELETE': return 'bg-red-100 text-red-700';
      case 'LOGIN': return 'bg-amber-100 text-amber-700';
      case 'EXPORT': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'CREATE': return 'Création';
      case 'UPDATE': return 'Modification';
      case 'DELETE': return 'Suppression';
      case 'LOGIN': return 'Connexion';
      case 'EXPORT': return 'Export';
      default: return type;
    }
  };


// ...

const handleExport = () => {
  if (filteredLogs.length === 0) {
    alert("Aucun log à exporter !");
    return;
  }

  // Transformer les logs en tableau simple
  const exportData = filteredLogs.map((log) => ({
    Utilisateur: typeof log.userId === "object" ? log.userId.name : log.userId,
    Module: log.module,
    Type: getTypeLabel(log.typeAction),
    Description: log.description,
    Date: new Date(log.dateAction).toLocaleString(),
  }));

  // Créer la feuille Excel
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");

  // Générer le fichier
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(blob, `logs_${new Date().toISOString().split("T")[0]}.xlsx`);
};


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-700">Journal des actions</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button onClick={handleExport} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Download size={18} />
            Exporter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Utilisateur</th>
              <th className="py-3 px-4 text-left">Module</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{typeof log.userId === 'object' ? log.userId.name : log.userId}</td>
                    
                  <td className="py-3 px-4">{log.module}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(log.typeAction)}`}>
                      {getTypeLabel(log.typeAction)}
                    </span>
                  </td>
                  <td className="py-3 px-4">{log.description}</td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(log.dateAction).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Aucun log trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
