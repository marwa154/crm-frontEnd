import { useState } from 'react';
import { Search, Plus, Download, Edit, Trash2, X } from 'lucide-react';

interface Quote {
  id: string;
  client: string;
  date: string;
  amount: number;
  status: 'Brouillon' | 'Envoyé' | 'Accepté' | 'Refusé';
  items: number;
  description: string;
  taxRate: number;
}

export default function Quotes() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    client: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    items: 1,
    amount: 0,
    taxRate: 20,
    status: 'Brouillon' as const,
  });
  const [quotes, setQuotes] = useState<Quote[]>([
    { id: '001', client: 'Société ABC', date: '2025-11-03', amount: 5200, status: 'Envoyé', items: 3, description: 'Services de consulting', taxRate: 20 },
    { id: '002', client: 'Entreprise XYZ', date: '2025-11-02', amount: 8450, status: 'Accepté', items: 5, description: 'Développement logiciel', taxRate: 20 },
    { id: '003', client: 'Tech Solutions', date: '2025-11-01', amount: 3100, status: 'Brouillon', items: 2, description: 'Audit de sécurité', taxRate: 20 },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepté': return 'bg-green-100 text-green-700 border-green-200';
      case 'Envoyé': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Brouillon': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Refusé': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredQuotes = quotes.filter(q => {
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesSearch = q.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenModal = (quote?: Quote) => {
    if (quote) {
      setFormData({
        client: quote.client,
        date: quote.date,
        description: quote.description,
        items: quote.items,
        amount: quote.amount,
        taxRate: quote.taxRate,
        status: quote.status,
      });
      setEditingId(quote.id);
    } else {
      setFormData({
        client: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        items: 1,
        amount: 0,
        taxRate: 20,
        status: 'Brouillon',
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
      setQuotes(quotes.map(q => q.id === editingId ? { ...formData, id: editingId } : q));
    } else {
      setQuotes([...quotes, { ...formData, id: String(Math.max(...quotes.map(q => parseInt(q.id)), 0) + 1).padStart(3, '0') }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setQuotes(quotes.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-slate-900">Devis</h2>
        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau devis
        </button>
      </div>

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
            <option value="Brouillon">Brouillon</option>
            <option value="Envoyé">Envoyé</option>
            <option value="Accepté">Accepté</option>
            <option value="Refusé">Refusé</option>
          </select>
        </div>

        <div className="grid gap-4">
          {filteredQuotes.map((quote) => (
            <div key={quote.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="text-blue-600 font-bold text-lg">#{quote.id}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{quote.client}</h3>
                    <div className="flex items-center space-x-3 text-sm text-slate-600 mt-1">
                      <span>{quote.date}</span>
                      <span>•</span>
                      <span>{quote.items} article{quote.items > 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{quote.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end space-x-4 sm:space-x-0">
                  <div className="text-right">
                    <p className="font-bold text-xl text-slate-900">€{quote.amount.toFixed(2)}</p>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded border mt-2 ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </div>

                  <div className="flex space-x-2 sm:mt-3">
                    <button onClick={() => handleOpenModal(quote)} className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                      <Download className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(quote.id)} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
              <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Modifier' : 'Nouveau'} devis</h3>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Montant HT (€)</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Taux TVA (%)</label>
                  <input
                    type="number"
                    required
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre d'articles</label>
                  <input
                    type="number"
                    required
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600">Montant TTC: <span className="font-bold text-slate-900">€{(formData.amount * (1 + formData.taxRate / 100)).toFixed(2)}</span></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Brouillon">Brouillon</option>
                  <option value="Envoyé">Envoyé</option>
                  <option value="Accepté">Accepté</option>
                  <option value="Refusé">Refusé</option>
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
