import { useState } from 'react';
import { Search, Plus, Download, Edit, Trash2, AlertCircle, X } from 'lucide-react';

interface Invoice {
  id: string;
  client: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Non payée' | 'Partiellement payée' | 'Payée' | 'En retard';
  description: string;
}

export default function Invoices() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    client: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: '',
    amount: 0,
    status: 'Non payée' as any,
  });
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'FAC-001', client: 'Société ABC', date: '2025-11-01', dueDate: '2025-11-30', amount: 5200, status: 'Payée', description: 'Services de consulting' },
    { id: 'FAC-002', client: 'Entreprise XYZ', date: '2025-10-28', dueDate: '2025-11-27', amount: 8450, status: 'Non payée', description: 'Développement logiciel' },
    { id: 'FAC-003', client: 'Tech Solutions', date: '2025-10-25', dueDate: '2025-11-24', amount: 3100, status: 'Partiellement payée', description: 'Audit de sécurité' },
    { id: 'FAC-004', client: 'Innovation Co', date: '2025-10-20', dueDate: '2025-10-20', amount: 6750, status: 'En retard', description: 'Consultation stratégique' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée': return 'bg-green-100 text-green-700 border-green-200';
      case 'Non payée': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Partiellement payée': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'En retard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesSearch = inv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const overdueInvoices = invoices.filter(inv => inv.status === 'En retard').length;

  const handleOpenModal = (invoice?: Invoice) => {
    if (invoice) {
      setFormData({
        client: invoice.client,
        date: invoice.date,
        dueDate: invoice.dueDate,
        description: invoice.description,
        amount: invoice.amount,
        status: invoice.status,
      });
      setEditingId(invoice.id);
    } else {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      setFormData({
        client: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        description: '',
        amount: 0,
        status: 'Non payée',
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setInvoices(invoices.map(inv => inv.id === editingId ? { ...formData, id: editingId } : inv));
    } else {
      const nextId = `FAC-${String(Math.max(...invoices.map(i => parseInt(i.id.split('-')[1])), 0) + 1).padStart(3, '0')}`;
      setInvoices([...invoices, { ...formData, id: nextId }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-slate-900">Factures</h2>
        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle facture
        </button>
      </div>

      {overdueInvoices > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">Factures en retard</h3>
            <p className="text-sm text-red-700 mt-1">
              Vous avez {overdueInvoices} facture{overdueInvoices > 1 ? 's' : ''} en retard de paiement
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="Payée">Payée</option>
            <option value="Non payée">Non payée</option>
            <option value="Partiellement payée">Partiellement payée</option>
            <option value="En retard">En retard</option>
          </select>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Numéro</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Client</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 hidden lg:table-cell">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 hidden lg:table-cell">Échéance</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Montant</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Statut</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4 font-medium text-slate-900">{invoice.id}</td>
                  <td className="py-4 px-4 text-sm text-slate-700">{invoice.client}</td>
                  <td className="py-4 px-4 text-sm text-slate-600 hidden lg:table-cell">{invoice.date}</td>
                  <td className="py-4 px-4 text-sm text-slate-600 hidden lg:table-cell">{invoice.dueDate}</td>
                  <td className="py-4 px-4 font-semibold text-slate-900">€{invoice.amount.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded border ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleOpenModal(invoice)} className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(invoice.id)} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-900">{invoice.id} - {invoice.client}</p>
                  <p className="text-xs text-slate-600 mt-1">{invoice.date} - Échéance: {invoice.dueDate}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded border ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">€{invoice.amount.toFixed(2)}</p>
                <div className="flex space-x-2">
                  <button onClick={() => handleOpenModal(invoice)} className="p-2 text-slate-600 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-600 hover:text-green-600">
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(invoice.id)} className="p-2 text-slate-600 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Modifier' : 'Nouvelle'} facture</h3>
              <button onClick={handleCloseModal} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date de facturation</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date d'échéance</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Montant (€)</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Non payée">Non payée</option>
                  <option value="Partiellement payée">Partiellement payée</option>
                  <option value="Payée">Payée</option>
                  <option value="En retard">En retard</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 order-2 sm:order-1"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 order-1 sm:order-2"
                >
                  {editingId ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
