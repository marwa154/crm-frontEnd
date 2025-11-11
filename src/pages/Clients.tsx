import { useState } from "react";
import { Search, Plus, Mail, Phone, Edit, Trash2, X } from "lucide-react";
import { useClients } from "../hooks/clientsHooks/useClients";
import { useCreateClient } from "../hooks/clientsHooks/useCreateClient";
import { useUpdateClient } from "../hooks/clientsHooks/useUpdateClient";
import { useDeleteClient } from "../hooks/clientsHooks/useDeleteClient";

interface Client {
  _id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
}

export default function Clients() {
  const [showError, setShowError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    postalCode: "",
  });

  const {
    data: clients,
    isPending: isLoadingClients,
    isError: isErrorClients,
  } = useClients();

  const {
    mutate: createClient,
    isPending: isCreatingClient,
    isSuccess: isCreateClientSuccess,
    isError: isCreateClientError,
  } = useCreateClient();

  const {
    mutate: updateClient,
    isPending: isUpdatingClient,
    isSuccess: isUpdateClientSuccess,
    isError: isUpdateClientError,
  } = useUpdateClient();

  const { mutate: deleteClient } = useDeleteClient();

  const filteredClients = clients?.filter(
    (client) =>
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setFormData(client);
      setEditingId(client._id);
    } else {
      setFormData({
        fullName: "",
        company: "",
        email: "",
        phone: "",
        city: "",
        address: "",
        postalCode: "",
      });
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
    updateClient(
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
    createClient(formData, {
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
    deleteClient(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h2 className="text-2xl font-bold text-slate-900">Clients</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg sm:w-auto hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau client
        </button>
      </div>

      <div className="p-4 bg-white border shadow-sm sm:p-6 rounded-xl border-slate-200">
        <div className="relative mb-6">
          <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {isLoadingClients && (
          <p className="text-slate-600">Chargement des clients...</p>
        )}

        {isErrorClients && (
          <div className="mb-4 text-red-600">
            <p>Échec du chargement des clients.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 mt-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        )}

        {!isLoadingClients && !isErrorClients && (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-sm font-semibold text-left text-slate-700">
                      Nom
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-left text-slate-700">
                      Société
                    </th>
                    <th className="hidden px-4 py-3 text-sm font-semibold text-left text-slate-700 lg:table-cell">
                      Email
                    </th>
                    <th className="hidden px-4 py-3 text-sm font-semibold text-left text-slate-700 lg:table-cell">
                      Téléphone
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-left text-slate-700">
                      Ville
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-right text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients?.map((client) => (
                    <tr
                      key={client._id}
                      className="transition-colors border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-3 bg-blue-100 rounded-full">
                            <span className="text-sm font-semibold text-blue-600">
                              {client.fullName.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm font-medium truncate text-slate-900">
                            {client.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="hidden px-4 py-4 text-sm truncate text-slate-700 sm:table-cell">
                        {client.company}
                      </td>
                      <td className="hidden px-4 py-4 text-sm truncate text-slate-600 lg:table-cell">
                        {client.email}
                      </td>
                      <td className="hidden px-4 py-4 text-sm text-slate-600 lg:table-cell">
                        {client.phone}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {client.city}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleOpenModal(client)}
                            className="p-2 transition-colors rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(client._id)}
                            className="p-2 transition-colors rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50"
                          >
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
              {filteredClients?.map((client) => (
                <div
                  key={client._id}
                  className="p-4 border rounded-lg bg-slate-50 border-slate-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-full">
                        <span className="font-semibold text-blue-600">
                          {client.fullName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {client.fullName}
                        </p>
                        <p className="text-sm text-slate-600">
                          {client.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(client)}
                        className="p-2 text-slate-600 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client._id)}
                        className="p-2 text-slate-600 hover:text-red-600"
                      >
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
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 my-8 bg-white shadow-xl rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {editingId ? "Modifier" : "Nouveau"} client
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {(isCreateClientError || isUpdateClientError) && showError && (
                <div className="flex items-center gap-2 px-3 py-2 mt-2 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856A2 2 0 0020 17.09L13.947 4.911a2 2 0 00-3.894 0L4 17.09A2 2 0 005.062 19z" />
                  </svg>
                  <span>Un problème est survenu, merci de réessayer</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="block mb-1 text-sm font-medium text-slate-700">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>

                  <label className="block mb-1 text-sm font-medium text-slate-700">
                    Société
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="block mb-1 text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>

                <label className="block mb-1 text-sm font-medium text-slate-700">
                  Adresse
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="block mb-1 text-sm font-medium text-slate-700">
                    Ville
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>

                  <label className="block mb-1 text-sm font-medium text-slate-700">
                    Code postal
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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

                  {editingId
                    ? isUpdatingClient
                      ? "Mise à jour..."
                      : "Modifier"
                    : isCreatingClient
                      ? "Ajout..."
                      : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
