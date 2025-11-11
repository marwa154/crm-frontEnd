import { useState } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { useCreateUser } from '../hooks/userHooks/useCreateUser';
import { useUsers } from '../hooks/userHooks/useUsers';
import { useUpdateUser } from '../hooks/userHooks/useUpdateUser';
import { useDeleteUser } from '../hooks/userHooks/useDeleteUser';

interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'employee';
}

export default function Users() {
  const [showError, setShowError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'employee' as 'admin' | 'employee',
  });

  const { data: users, isPending: isLoadingUsers, isError: isErrorUsers } = useUsers();

  const {
    mutate: createUser,
    isPending: isCreatingUser,
    isSuccess: isCreateUserSuccess,
    isError: isCreateUserError
  } = useCreateUser();

  const {
    mutate: updateUser,
    isPending: isUpdatingUser,
    isSuccess: isUpdateUserSuccess,
    isError: isUpdateUserError
  } = useUpdateUser();

  const {
    mutate: deleteUser,
    isPending: isDeletingUser,
    isError: isDeleteUserError
  } = useDeleteUser();

  console.log(editingId)
  const filteredUsers = users?.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (user?: User) => {
    if (user) {
      setFormData({ email: user.email, name: user.name, password: user.password, role: user.role });
      setEditingId(user._id);
    } else {
      setFormData({ email: '', name: '', password: '', role: 'employee' });
      setEditingId(null);
    }
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setShowError(false);
  };
  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (editingId) {
    updateUser(
      { id: editingId, data: formData },
      {
        onSuccess: () => {
          handleCloseModal();
        },
        onError: () => {
          setShowError(true);
        },
      }
    );
  } else {
    createUser(formData, {
      onSuccess: () => {
        handleCloseModal();
      },
      onError: () => {
        setShowError(true);
      },
    });
  }
};


  const handleDelete = (id: string) => {
    deleteUser(id);
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

        {isLoadingUsers && (
          <p className="text-slate-600">Loading users...</p>
        )}

        {isErrorUsers && (
          <div className="mb-4 text-red-600">
            <p>Failed to load users.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 mt-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoadingUsers && !isErrorUsers && (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-sm font-semibold text-left text-slate-700">Nom</th>
                    <th className="px-4 py-3 text-sm font-semibold text-left text-slate-700">Email</th>
                    <th className="hidden px-4 py-3 text-sm font-semibold text-left text-slate-700 lg:table-cell">Rôle</th>
                    <th className="px-4 py-3 text-sm font-semibold text-right text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers?.map((user) => (
                    <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-3 bg-blue-100 rounded-full">
                            <span className="font-semibold text-blue-600">{user.name.charAt(0)}</span>
                          </div>
                          <span className="text-sm font-medium truncate text-slate-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm truncate text-slate-600">{user.email}</td>
                      <td className="hidden px-4 py-4 text-sm lg:table-cell">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role === 'admin' ? 'Admin' : 'Employé'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => handleOpenModal(user)} className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(user._id)} className="p-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50">
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
              {filteredUsers?.map((user) => (
                <div key={user._id} className="p-4 border rounded-lg bg-slate-50 border-slate-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-full">
                        <span className="font-semibold text-blue-600">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleOpenModal(user)} className="p-2 text-slate-600 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user._id)} className="p-2 text-slate-600 hover:text-red-600">
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
              {(isCreateUserError || isUpdateUserError) && showError && (
                <div className="flex items-center gap-2 px-3 py-2 mt-2 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856A2 2 0 0020 17.09L13.947 4.911a2 2 0 00-3.894 0L4 17.09A2 2 0 005.062 19z" />
                  </svg>
                  <span>Un problème est survenu, merci de réessayer</span>
                </div>
              )}

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">Nom complet</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <label className="block mb-1 text-sm font-medium text-slate-700">Mot de passe</label>
                <input
                  type="password"
                  required={!editingId}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  disabled={isCreatingUser || isUpdatingUser}
                >
                  {editingId
                    ? isUpdatingUser
                      ? 'Mise à jour...'
                      : 'Modifier'
                    : isCreatingUser
                      ? 'Ajout...'
                      : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
