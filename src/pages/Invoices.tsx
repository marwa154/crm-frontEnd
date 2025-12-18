import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Plus, Edit, Trash2, X, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
  import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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



const generateInvoicePDF = (invoice: any) => {
  const doc = new jsPDF();


  const primaryColor: [number, number, number] = [41, 128, 185]; // bleu
  const accentColor: [number, number, number] = [243, 156, 18]; // orange
  const textColor: [number, number, number] = [44, 62, 80];
  const lightGray: [number, number, number] = [236, 240, 241];

 
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.text("FACTURE", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");
  doc.text(`Numéro : ${invoice.invoiceNumber}`, 105, 28, { align: "center" });

  
  doc.setFillColor(...lightGray);
  doc.rect(14, 35, 90, 35, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("ÉMETTEUR", 16, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  let y = 48;
  if (invoice.userId?.name) {
    doc.text(invoice.userId.name, 16, y);
    y += 5;
  }
  if (invoice.userId?.email) {
    doc.text(`Email: ${invoice.userId.email}`, 16, y);
  }

  //  CLIENT
  doc.setFillColor(...lightGray);
  doc.rect(110, 35, 90, 35, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CLIENT", 112, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  y = 48;
  doc.text(invoice.clientId?.fullName || "Nom inconnu", 112, y);
  y += 5;
  if (invoice.clientId?.company)
    doc.text(`Entreprise : ${invoice.clientId.company}`, 112, y);
  y += 5;
  doc.text(`Date : ${new Date(invoice.invoiceDate).toLocaleDateString("fr-FR")}`, 112, y);
  y += 5;
  doc.text(`Statut : ${invoice.status}`, 112, y);

  //  Tableau des produits / services
  const tableStartY = 80;
  const tableData =
    invoice.lignes && invoice.lignes.length > 0
      ? invoice.lignes.map((ligne: any) => [
          ligne.description || "—",
          ligne.quantite || 1,
          ligne.prixUnitaire?.toFixed(2) || "0.00",
          ligne.totalLigne?.toFixed(2) || "0.00",
        ])
      : [["Aucune ligne", "", "", ""]];

  autoTable(doc, {
    startY: tableStartY,
    head: [["Description", "Quantité", "Prix Unitaire (DT)", "Total (DT)"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: textColor,
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Totaux
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...accentColor);
  doc.text("TOTAL TTC :", 130, finalY);
  doc.text(`${invoice.totalTTC?.toFixed(2)} DT`, 195, finalY, { align: "right" });

  // Signature
  const signatureY = Math.max(finalY + 40, 240);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...textColor);
  doc.text("Signature client :", 14, signatureY);
  doc.line(14, signatureY + 2, 80, signatureY + 2);
  doc.text("Signature entreprise :", 130, signatureY);
  doc.line(130, signatureY + 2, 196, signatureY + 2);

  //  Pied de page
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Ce document est une facture générée automatiquement et ne peut être modifié après validation.",
    105,
    285,
    { align: "center" }
  );

  doc.save(`Facture_${invoice.invoiceNumber}.pdf`);
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

  // Supprimer une facture
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

  //  Filtrer les factures
  //  Filtrer les factures
const filteredFactures = factures.filter((f) => {
  const clientName =
    typeof f.clientId === "object" ? f.clientId.fullName.toLowerCase() : "";
  const invoiceNumber = f.invoiceNumber?.toLowerCase() || "";
  const status = f.status?.toLowerCase() || "";
  const totalTTC = f.totalTTC ? f.totalTTC.toString() : "";
  // Convertir la date en string locale (ex: "12/11/2025")
  const invoiceDate = f.invoiceDate
    ? new Date(f.invoiceDate).toLocaleDateString("fr-FR")
    : "";

  // Vérifier si le terme de recherche correspond à l’un des champs
  return (
    clientName.includes(searchTerm.toLowerCase()) ||
    invoiceNumber.includes(searchTerm.toLowerCase()) ||
    invoiceDate.includes(searchTerm.toLowerCase()) || // 🔹 recherche par date
    status.includes(searchTerm.toLowerCase()) ||
       totalTTC.includes(searchTerm)
  );
});


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

                <td className="py-3 px-3">{new Date(f.invoiceDate ?? "").toLocaleDateString()}</td>
                <td className="py-3 px-3">{f.totalTTC.toFixed(2)} DT</td>
                <td className="py-3 px-3 capitalize"><span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      f.status.toLowerCase() === "payée"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {f.status}
  </span></td>
                <td className="py-3 px-3 text-right space-x-2">
                  <button
    onClick={() => generateInvoicePDF(f)}
    className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Download className="w-4 h-4" />

</button>
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
