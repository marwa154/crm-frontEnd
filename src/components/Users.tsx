import { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Toggle2 } from 'lucide-react';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'admin' | 'employee';
  status: 'active' | 'inactive';
  createdAt: string;
  clientsManaged: number;
}

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: 'employee' as 'admin' | 'employee',
  });
  const [users, setUsers] = useState<User[]>([
    { id: 1, email: 'admin@crm.com', fullName: 'Admin CRM', role: 'admin', status: 'active', createdAt: '2025-01-15', clientsManaged: 0 },
    { id: 2, email: 'jean.dupont@crm.com', fullName: 'Jean Dupont', role: 'employee', status: 'active', createdAt: '2025-02-01', clientsManaged: 12 },
    { id: 3, email: 'marie.martin@crm.com', fullName: 'Marie Martin', role: 'employee', status: 'active', createdAt: '2025-02-15', clientsManaged: 8 },
    { id: 4, email: 'pierre.bernard@crm.com', fullName: 'Pierre Bernard', role: 'employee', status: 'inactive', createdAt: '2025-03-01', clientsManaged: 5 },
  ]);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (user?: User) => {
    if (user) {
      setFormData({ email: user.email, fullName: user.fullName, role: user.role });
      setEditingId(user.id);
    } else {
      setFormData({ email: '', fullName: '', role: 'employee' });
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
      setUsers(users.map(u => u.id === editingId ? { ...u, ...formData } : u));
    } else {
      setUsers([...users, {
        id: Date.now(),
        ...formData,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        clientsManaged: 0
      }]);
    }
    handleCloseModal();
  };

  const handleToggleStatus = (id: number) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-slate-900">Gestion des utilisateurs</h2>
        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvel utilisateur
        </button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par email ou nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Nom</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 hidden lg:table-cell">Rôle</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 hidden lg:table-cell">Clients</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Statut</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-blue-600 font-semibold">{user.fullName.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-slate-900 text-sm truncate">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 truncate">{user.email}</td>
                  <td className="py-4 px-4 text-sm hidden lg:table-cell">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role === 'admin' ? 'Admin' : 'Employé'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 hidden lg:table-cell">{user.clientsManaged}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleOpenModal(user)} className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">{user.fullName.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{user.fullName}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleOpenModal(user)} className="p-2 text-slate-600 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-600 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="space-y-2">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role === 'admin' ? 'Admin' : 'Employé'}
                    </span>
                  </div>
                  <div className="text-slate-600">Clients: {user.clientsManaged}</div>
                </div>
                <button
                  onClick={() => handleToggleStatus(user.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {user.status === 'active' ? 'Actif' : 'Inactif'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Modifier' : 'Nouvel'} utilisateur</h3>
              <button onClick={handleCloseModal} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'employee' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="employee">Employé</option>
                  <option value="admin">Administrateur</option>
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
