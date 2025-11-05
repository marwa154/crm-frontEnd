import { useState } from 'react';
import { Search, Plus, Mail, Phone, Building, Edit, Trash2, X } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  zipcode: string;
}

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    zipcode: '',
  });
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'Jean Dupont', company: 'Société ABC', email: 'jean@abc.com', phone: '01 23 45 67 89', city: 'Paris', address: '123 Rue de Paris', zipcode: '75001' },
    { id: 2, name: 'Marie Martin', company: 'Entreprise XYZ', email: 'marie@xyz.com', phone: '01 98 76 54 32', city: 'Lyon', address: '456 Rue de Lyon', zipcode: '69001' },
    { id: 3, name: 'Pierre Durand', company: 'Tech Solutions', email: 'pierre@tech.com', phone: '01 11 22 33 44', city: 'Marseille', address: '789 Rue Tech', zipcode: '13001' },
  ]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setFormData(client);
      setEditingId(client.id);
    } else {
      setFormData({ name: '', company: '', email: '', phone: '', city: '', address: '', zipcode: '' });
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
      setClients(clients.map(c => c.id === editingId ? { ...formData, id: editingId } : c));
    } else {
      setClients([...clients, { ...formData, id: Date.now() }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    setClients(clients.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-slate-900">Clients</h2>
        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau client
        </button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Nom</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Société</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 hidden lg:table-cell">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 hidden lg:table-cell">Téléphone</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Ville</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">{client.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-slate-900 text-sm truncate">{client.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-700 hidden sm:table-cell truncate">{client.company}</td>
                  <td className="py-4 px-4 text-sm text-slate-600 hidden lg:table-cell truncate">{client.email}</td>
                  <td className="py-4 px-4 text-sm text-slate-600 hidden lg:table-cell">{client.phone}</td>
                  <td className="py-4 px-4 text-sm text-slate-700">{client.city}</td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleOpenModal(client)} className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(client.id)} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
          {filteredClients.map((client) => (
            <div key={client.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">{client.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{client.name}</p>
                    <p className="text-sm text-slate-600">{client.company}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleOpenModal(client)} className="p-2 text-slate-600 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(client.id)} className="p-2 text-slate-600 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-slate-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {client.email}
                </div>
                <div className="flex items-center text-slate-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {client.phone}
                </div>
                <div className="text-slate-600">{client.city}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Modifier' : 'Nouveau'} client</h3>
              <button onClick={handleCloseModal} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Société</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Code postal</label>
                  <input
                    type="text"
                    required
                    value={formData.zipcode}
                    onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  {editingId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
