import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface Ligne {
  description: string;
  quantite: number;
  prixUnitaire: number;
  totalLigne: number;
}

interface Facture {
  _id?: string;
  invoiceNumber: string;
  clientId: string;
  userId: string;
  devisId?: string;
  dueDate: string;
  tva: number;
  totalHT: number;
  totalTTC: number;
  lignes: Ligne[];
  status: string;
  description?: string;
}

export default function CreateInvoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const existingFacture = location.state?.facture || null;
  const devisFromState =   location.state?.quote|| null;
    const isNewInvoice = location.state?.mode === "new"; // true si on vient du bouton "Nouvelle facture"

  const [clients, setClients] = useState<any[]>([]);
  const [formData, setFormData] = useState<Facture>({
    invoiceNumber: `FAC-${Date.now()}`,
    clientId: "",
    userId: "",
    devisId: "",
    dueDate: new Date().toISOString().slice(0, 10),
    tva: 19,
    totalHT: 0,
    totalTTC: 0,
    lignes: [{ description: "", quantite: 1, prixUnitaire: 0, totalLigne: 0 }],
    status: "Non payée",
    description: "",
  });

  const token = localStorage.getItem("token");

  // 🔹 Charger les clients depuis la base
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/clients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(res.data);
      } catch (err) {
        console.error("Erreur chargement clients :", err);
      }
    };
    fetchClients();
  }, [token]);

  // 🔹 Pré-remplir les champs selon le contexte
  useEffect(() => {
    if (existingFacture) {
      // Modification facture
      setFormData({
        ...existingFacture,
        dueDate: existingFacture.dueDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      });
    } else if (devisFromState) {
      // Création depuis un devis
      setFormData({
        invoiceNumber: `FAC-${Date.now()}`,
        clientId: devisFromState.clientId?._id || "",
        userId: devisFromState.userId?._id || "",
        devisId: devisFromState._id || "",
        dueDate: new Date().toISOString().slice(0, 10),
        tva: devisFromState.tva ?? 19,
        totalHT: devisFromState.totalHT ?? 0,
        totalTTC: devisFromState.totalTTC ?? 0,
        lignes: devisFromState.lignes || [],
        status: "Non payée",
        description: devisFromState.description || "",
      });
    } else if (isNewInvoice) {
      // Création manuelle sans devis
      setFormData({
        invoiceNumber: `FAC-${Date.now()}`,
        clientId: "",
        userId: "",
        devisId: "",
        dueDate: new Date().toISOString().slice(0, 10),
        tva: 19,
        totalHT: 0,
        totalTTC: 0,
        lignes: [{ description: "", quantite: 1, prixUnitaire: 0, totalLigne: 0 }],
        status: "Non payée",
        description: "",
      });
    }
  }, [existingFacture, devisFromState, isNewInvoice]);

  // 🔹 Calcul automatique du total HT/TTC
  useEffect(() => {
    const totalHT = formData.lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0);
    const totalTTC = totalHT + (totalHT * formData.tva) / 100;
    setFormData((prev) => ({ ...prev, totalHT, totalTTC }));
  }, [formData.lignes, formData.tva]);

  // 🔹 Gestion lignes
  const updateLine = (index: number, field: keyof Ligne, value: any) => {
    const newLines = [...formData.lignes];
    (newLines[index][field] as any) = value;
    newLines[index].totalLigne = newLines[index].quantite * newLines[index].prixUnitaire;
    setFormData({ ...formData, lignes: newLines });
  };

  const addLine = () => {
    setFormData({
      ...formData,
      lignes: [...formData.lignes, { description: "", quantite: 1, prixUnitaire: 0, totalLigne: 0 }],
    });
  };

  const removeLine = (index: number) => {
    setFormData({ ...formData, lignes: formData.lignes.filter((_, i) => i !== index) });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Récupérer l'userId depuis le localStorage (stocké lors du login)
  const userId = "690e6452d7037020f831e5f5";

  // Préparer les lignes
  const lignes = formData.lignes.map((l) => ({
    ...l,
    description: l.description || "Nouveau produit/service", // jamais vide
    totalLigne: l.quantite * l.prixUnitaire,
  }));

  const payload = {
    ...formData,
    userId: userId,           // indispensable
    devisId: formData.devisId || undefined, // undefined si pas de devis
    lignes,
  };

  try {
    if (existingFacture?._id) {
      await axios.put(`http://localhost:5000/api/facture/${existingFacture._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Facture mise à jour !");
    } else {
      await axios.post("http://localhost:5000/api/facture/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Facture créée !");
    }
    navigate("/invoices");
  } catch (err: any) {
    console.error("Erreur création facture :", err.response?.data || err);
    alert("Erreur lors de la sauvegarde !");
  }
};

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl space-y-4">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {existingFacture ? "Modifier une facture" : "Créer une facture"}
      </h2>

      {/* Client */}
      <div>
        <label className="block mb-1 font-medium">Client *</label>
        <select
          value={formData.clientId}
          onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">-- Sélectionner un client --</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>
              {c.fullName} ({c.company})
            </option>
          ))}
        </select>
      </div>

      {/* Devis */}
      {!isNewInvoice && (
        <div>
          <label className="block mb-1 font-medium">Devis associé</label>
          <input type="text"   value={devisFromState?.codeUnique  || ""} disabled className="w-full p-2 border rounded" />
        </div>
      )}

      {/* Lignes */}
      <div>
        <label className="block mb-1 font-medium">Lignes de facture</label>
        <table className="w-full border-collapse mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Description</th>
              <th className="border px-4 py-2 text-center">Quantité</th>
              <th className="border px-4 py-2 text-right">Prix unitaire</th>
              <th className="border px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {formData.lignes.map((line, i) => (
              <tr key={i}>
                <td className="border px-2 py-2">
                  <input
                    type="text"
                    value={line.description}
                    onChange={(e) => updateLine(i, "description", e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                    disabled={existingFacture || devisFromState} // disable si modification ou depuis devis
                  />
                </td>
                <td className="border px-2 py-2">
                  <input
                    type="number"
                    value={line.quantite}
                    onChange={(e) => updateLine(i, "quantite", parseFloat(e.target.value))}
                    className="w-full text-center border px-2 py-1 rounded"
                    disabled={existingFacture || devisFromState}
                  />
                </td>
                <td className="border px-2 py-2">
                  <input
                    type="number"
                    value={line.prixUnitaire}
                    onChange={(e) => updateLine(i, "prixUnitaire", parseFloat(e.target.value))}
                    className="w-full text-right border px-2 py-1 rounded"
                    disabled={existingFacture || devisFromState}
                  />
                </td>
                <td className="border px-4 py-2 text-right font-medium">{line.totalLigne.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!existingFacture && !devisFromState && (
          <button type="button" onClick={addLine} className="px-3 py-1 bg-blue-500 text-white rounded">
            Ajouter une ligne
          </button>
        )}
      </div>

      {/* Description et statut */}
      <div>
        <label className="block mb-1 font-medium">Notes</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Statut</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="Non payée">Non payée</option>
          <option value="Payée">Payée</option>
        </select>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {existingFacture ? "Mettre à jour" : "Créer la facture"}
      </button>
    </form>
  );
}
