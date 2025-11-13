import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Plus, Edit, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Ligne {
  description: string;
  quantite: number;
  prixUnitaire: number;
  totalLigne: number;
}

interface Facture {
  _id?: string;
  invoiceNumber: string;
  clientId: any ;
  devisId?: string;
  userId: string;
  invoiceDate?: any;
  dueDate: any;
  status: string;
  tva: number;
  totalHT: number;
  totalTTC: number;
  lignes: Ligne[];
  description?: string;
}

export default function Factures() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFacture, setEditingFacture] = useState<Facture | null>(null);
   const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Facture>>({
    invoiceNumber: "",
    clientId: "",
    dueDate: "",
    tva: 19,
    lignes: [{ description: "", quantite: 1, prixUnitaire: 0, totalLigne: 0 }],
    status: "non payée",
    description: "",
  });

  const token = localStorage.getItem("token");

  // 🔹 Charger toutes les factures
  const fetchFactures = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/facture/getallfacture", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFactures(res.data);
    } catch (err) {
      console.error("Erreur chargement factures :", err);
    }
  };

  useEffect(() => {
    fetchFactures();
  }, []);

  

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFacture(null);
  };

  // 🔹 Ajouter ou modifier une facture
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFacture?._id) {
        await axios.put(`http://localhost:5000/api/facture/${editingFacture._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/facture/create", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await fetchFactures();
      handleCloseModal();
    } catch (err) {
      console.error("Erreur sauvegarde facture :", err);
    }
  };

  // 🔹 Supprimer une facture
  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette facture ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/facture/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFactures(factures.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Erreur suppression facture :", err);
    }
  };

  // 🔹 Filtrer les factures
  const filteredFactures = factures.filter(
    (f) =>
      f.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Factures</h2>
        <button
         onClick={() => navigate("/createInvoices", { state: { mode: "new" } })}

          className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle facture
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="relative mb-6">
          <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une facture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* TABLE */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-3 py-2 text-left">Numéro</th>
              <th className="px-3 py-2 text-left">Client</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Total TTC</th>
              <th className="px-3 py-2 text-left">Statut</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFactures.map((f) => (
              <tr key={f._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-3">{f.invoiceNumber}</td>
             <td className="px-3 py-3">
  {typeof f.clientId === "object"
    ? `${f.clientId.fullName} (${f.clientId.company})`
    : f.clientId}
</td>

                <td className="px-3 py-3">{new Date(f.invoiceDate ?? "").toLocaleDateString()}</td>
                <td className="px-3 py-3">{f.totalTTC.toFixed(2)} DT</td>
                <td className="px-3 py-3 capitalize">{f.status}</td>
                <td className="px-3 py-3 space-x-2 text-right">
                  <button
                     onClick={() => navigate("/createInvoices", { state: { facture: f } })}
                    className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(f._id!)}
                    className="p-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

   
      
    </div>
  );
}
