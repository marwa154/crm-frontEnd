import { useState } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';

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
      <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h2 className="text-2xl font-bold text-slate-900">Gestion des utilisateurs</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-600 rounded-lg sm:w-auto hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvel utilisateur
        </button>
      </div>

      <div className="p-4 bg-white border shadow-sm sm:p-6 rounded-xl border-slate-200">
        <div className="relative mb-6">
          <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par email ou nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-sm font-semibold text-left text-slate-700">Nom</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-slate-700">Email</th>
                <th className="hidden px-4 py-3 text-sm font-semibold text-left text-slate-700 lg:table-cell">Rôle</th>
                <th className="hidden px-4 py-3 text-sm font-semibold text-left text-slate-700 lg:table-cell">Clients</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-slate-700">Statut</th>
                <th className="px-4 py-3 text-sm font-semibold text-right text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-3 bg-blue-100 rounded-full">
                        <span className="font-semibold text-blue-600">{user.fullName.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium truncate text-slate-900">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm truncate text-slate-600">{user.email}</td>
                  <td className="hidden px-4 py-4 text-sm lg:table-cell">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role === 'admin' ? 'Admin' : 'Employé'}
                    </span>
                  </td>
                  <td className="hidden px-4 py-4 text-sm text-slate-600 lg:table-cell">{user.clientsManaged}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleOpenModal(user)} className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 md:hidden">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 border rounded-lg bg-slate-50 border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1">
                  <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-full">
                    <span className="font-semibold text-blue-600">{user.fullName.charAt(0)}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 my-8 bg-white shadow-xl rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Modifier' : 'Nouvel'} utilisateur</h3>
              <button onClick={handleCloseModal} className="p-1 rounded hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">Nom complet</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'employee' })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="employee">Employé</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div className="flex flex-col justify-end gap-3 mt-6 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="order-2 px-4 py-2 border rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50 sm:order-1"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="order-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 sm:order-2"
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
