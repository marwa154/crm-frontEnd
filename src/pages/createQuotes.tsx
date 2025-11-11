import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Select, { SingleValue } from "react-select";

interface Client {
  _id: string;
  fullName: string;
  company: string;
}

interface QuoteLine {
  tempId: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  totalLigne: number;
}
interface OptionType {
  value: string;
  label: string;
}



interface QuoteToEdit {
  _id: string;
  clientId: {
    _id: string;
    fullName: string;
    company: string;
  };
  notes: string;
  lignes: {
    description: string;
    quantite: number;
    prixUnitaire: number;
    totalLigne: number;
  }[];
  totalHT: number;
  tva: number;
  status: string;
}


export default function QuoteForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const quoteToEdit: QuoteToEdit | undefined = location.state?.quoteToEdit;






  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const filteredClients = clients.filter(client =>
  client.fullName.toLowerCase().includes(clientSearch.toLowerCase()) ||
  client.company.toLowerCase().includes(clientSearch.toLowerCase())
);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [lines, setLines] = useState<QuoteLine[]>([
    { tempId: "1", description: "", quantite: 1, prixUnitaire: 0, totalLigne: 0 },
  ]);
 const [status, setStatus] = useState<string>("brouillon");
 const clientOptions: OptionType[] = clients.map((c) => ({
  value: c._id,
  label: `${c.fullName} (${c.company})`,
}));

const selectedOption = selectedClient
  ? clientOptions.find((o) => o.value === selectedClient) || null
  : null;

  

  const [createdAt] = useState<string>(new Date().toISOString().split("T")[0]);
  const [totalHT, setTotalHT] = useState<number>(0);

  // Charger les clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/clients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data);
      } catch (error) {
        console.error("Erreur chargement clients:", error);
      }
    };
    fetchClients();
  }, []);

  // Pré-remplir le formulaire si on édite un devis
 


// Charger le quoteToEdit quand les clients sont prêts
useEffect(() => {
  // Si pas de devis à éditer, rien à faire
  if (!quoteToEdit) return;

  // Assurer que les clients sont chargés
  if (clients.length === 0) return;

  // Sélectionner le client si c'est un objet ou un string
  if (typeof quoteToEdit.clientId === "string") {
    setSelectedClient(quoteToEdit.clientId);
  } else if (quoteToEdit.clientId?._id) {
    setSelectedClient(quoteToEdit.clientId._id);
  }

  // Notes
  setDescription(quoteToEdit.notes || "");

  // Lignes du devis
  const quoteLines = quoteToEdit.lignes || [];
  if (quoteLines.length > 0) {
    const mappedLines = quoteLines.map((line: any) => ({
      tempId: Date.now().toString() + Math.random(),
      description: line.description || "",
      quantite: line.quantite || 0,
      prixUnitaire: line.prixUnitaire || 0,
      totalLigne: line.totalLigne || 0,
    }));
    setLines(mappedLines);

    // Total recalculé
    const total = mappedLines.reduce((sum, line) => sum + line.totalLigne, 0);
    setTotalHT(total);
  } else {
    // Si pas de lignes, initialiser une ligne vide
    setLines([{ tempId: "1", description: "", quantite: 1, prixUnitaire: 0, totalLigne: 0 }]);
    setTotalHT(0);
  }

  // Status
  setStatus(quoteToEdit.status || "brouillon");
}, [quoteToEdit, clients]);














  const addLine = () => {
    setLines([
      ...lines,
      { tempId: Date.now().toString(), description: "", quantite: 1, prixUnitaire: 0, totalLigne: 0 },
    ]);
  };

  const removeLine = (tempId: string) => {
    if (lines.length > 1) setLines(lines.filter((line) => line.tempId !== tempId));
  };

  const updateLine = (tempId: string, field: keyof QuoteLine, value: string | number) => {
    const newLines = lines.map((line) => {
      if (line.tempId === tempId) {
        const updated = { ...line, [field]: value };
        if (field === "quantite" || field === "prixUnitaire") {
          updated.totalLigne = updated.quantite * updated.prixUnitaire;
        }
        return updated;
      }
      return line;
    });
    setLines(newLines);
    const total = newLines.reduce((sum, line) => sum + line.totalLigne, 0);
    setTotalHT(total);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return alert("Veuillez sélectionner un client.");

    try {
      const token = localStorage.getItem("token");
      const userId = "690e6452d7037020f831e5f5"; // Remplacer par l'ID réel de l'utilisateur
      const devisData = {
        clientId: selectedClient,
        userId,
        status,
        lignes: lines
          .filter((line) => line.description.trim() !== "")
          .map((line) => ({
            description: line.description,
            quantite: line.quantite,
            prixUnitaire: line.prixUnitaire,
            totalLigne: line.totalLigne,
          })),
        totalHT,
        tva: 20,
        notes: description,
      };

      if (quoteToEdit?._id) {
        // Modification
        await axios.put(`http://localhost:5000/api/devis/${quoteToEdit._id}`, devisData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Devis modifié avec succès !");
      } else {
        // Création
        await axios.post("http://localhost:5000/api/devis/create", devisData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Devis créé avec succès !");
      }

      navigate("/quotes");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du devis :", error);
      alert("Erreur lors de l'enregistrement du devis");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {quoteToEdit ? "Modifier un devis" : "Créer un devis"}
      </h2>

      {/* Sélection client */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Sélectionner un client *</label>
      <Select
  options={clientOptions}
  value={selectedOption}
  onChange={(option: SingleValue<OptionType>) => {
    if (!option) return setSelectedClient("");
    setSelectedClient(option.value);
  }}
  isClearable
  placeholder="Rechercher un client..."
/>

      </div>













      {/* Description / Notes */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Description / Notes</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          rows={3}
          placeholder="Informations supplémentaires pour le devis"
        />
      </div>

      {/* Lignes */}
      <div className="mb-4 flex justify-between items-center">
        <div>Status:<select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
>
  <option value="brouillon">Brouillon</option>
  <option value="envoyé">Envoyé</option>
  <option value="accepté">Accepté</option>
  <option value="refusé">Refusé</option>
</select>
</div>
        <div>Date: <span className="font-semibold">{createdAt}</span></div>
        <button
          type="button"
          onClick={addLine}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <Plus size={18} /> Ajouter un article / service
        </button>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Description</th>
              <th className="border px-4 py-2 text-center">Quantité</th>
              <th className="border px-4 py-2 text-right">Prix unitaire (DT)</th>
              <th className="border px-4 py-2 text-right">Total (DT)</th>
              <th className="border px-4 py-2 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.tempId}>
                <td className="border px-2 py-2">
                  <input
                    type="text"
                    value={line.description}
                    onChange={(e) => updateLine(line.tempId, "description", e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border px-2 py-2">
                  <input
                    type="number"
                    value={line.quantite}
                    onChange={(e) => updateLine(line.tempId, "quantite", parseFloat(e.target.value) || 0)}
                    className="w-full text-center border px-2 py-1 rounded"
                  />
                </td>
                <td className="border px-2 py-2">
                  <input
                    type="number"
                    value={line.prixUnitaire}
                    onChange={(e) => updateLine(line.tempId, "prixUnitaire", parseFloat(e.target.value) || 0)}
                    className="w-full text-right border px-2 py-1 rounded"
                  />
                </td>
                <td className="border px-4 py-2 text-right font-medium">{line.totalLigne.toFixed(2)}</td>
                <td className="border px-2 py-2 text-center">
                  <button type="button" onClick={() => removeLine(line.tempId)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right text-xl font-bold mb-6">
        Total HT: {totalHT.toFixed(2)} DT
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Enregistrer le devis
      </button>
    </form>
  );
}
