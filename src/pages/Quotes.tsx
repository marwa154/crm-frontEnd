import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit, Trash2, X, Plus, Download, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Status = 'brouillon' | 'envoyé' | 'accepté' | 'refusé';

interface Quote {
  _id: string;
  clientId: { _id: string; fullName: string; company: string };
  userId: { _id: string; name: string ,email:string};
  codeUnique: string;
  totalHT: number;
  tva: number;
  totalTTC: number;
  status: Status;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    clientId: string;
    totalHT: number;
    tva: number;
    status: Status;
    notes: string;
  }>({
    clientId: '',
    totalHT: 0,
    tva: 20,
    status: 'brouillon',
    notes: '',
  });

  const navigate = useNavigate();

  //  Fonction pour générer le PDF du devis
  const generateQuotePDF = (quote: Quote) => {
    const doc = new jsPDF();

    //  Couleurs cohérentes avec ton thème (bleu, orange, turquoise)
    const primaryColor: [number, number, number] = [41, 128, 185]; // bleu
    const accentColor: [number, number, number] = [243, 156, 18]; // orange
    const textColor: [number, number, number] = [44, 62, 80];
    const lightGray: [number, number, number] = [236, 240, 241];

    // 🧾 Titre principal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.text('DEVIS', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.text(`Code unique : ${quote.codeUnique}`, 105, 28, { align: 'center' });

    // 🧍 ÉMETTEUR
    doc.setFillColor(...lightGray);
    doc.rect(14, 35, 90, 35, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('ÉMETTEUR', 16, 42);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    let y = 48;
  if (quote.userId?.name) {
    doc.text(quote.userId.name, 16, y);
    y += 5;
  }
  
  if (quote.userId?.email) {
    doc.text(`Email: ${quote.userId.email}`, 16, y);
  } 

    // 👤 CLIENT
    doc.setFillColor(...lightGray);
    doc.rect(110, 35, 90, 35, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('CLIENT', 112, 42);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    y = 48;
    doc.text(quote.clientId.fullName, 112, y);
    y += 5;
    doc.text(`Entreprise : ${quote.clientId.company}`, 112, y);
    y += 5;
    doc.text(`Statut : ${quote.status}`, 112, y);
    y += 5;
    doc.text(`Date : ${new Date(quote.createdAt).toLocaleDateString('fr-FR')}`, 112, y);

    // 📋 Tableau des montants
    const tableStartY = 80;
    autoTable(doc, {
      startY: tableStartY,
      head: [['Description', 'Montant HT (DT)', 'TVA (%)', 'Montant TTC (DT)']],
      body: [
        [
          quote.notes || 'Aucune note',
          quote.totalHT.toFixed(2),
          quote.tva.toFixed(2),
          quote.totalTTC.toFixed(2),
        ],
      ],
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
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

    // 💰 Totaux
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...accentColor);
    doc.text('TOTAL TTC :', 130, finalY);
    doc.text(`${quote.totalTTC.toFixed(2)} DT`, 195, finalY, { align: 'right' });

    // 🖋️ Signature
    const signatureY = Math.max(finalY + 40, 240);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text('Signature client :', 14, signatureY);
    doc.line(14, signatureY + 2, 80, signatureY + 2);
    doc.text('Signature entreprise :', 130, signatureY);
    doc.line(130, signatureY + 2, 196, signatureY + 2);

    // 📄 Pied de page
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Ce devis est généré automatiquement et reste valable jusqu’à sa validation.', 105, 285, { align: 'center' });

    doc.save(`Devis_${quote.codeUnique}.pdf`);
  };


  // 🟢 Couleur des statuts
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepté': return 'bg-green-100 text-green-700 border-green-200';
      case 'envoyé': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'brouillon': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'refusé': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // 🟢 Récupérer tous les devis
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/devis', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuotes(res.data);
          console.log(res.data)
      } catch (err) {
        console.error('Erreur récupération devis :', err);
      }
    };
    fetchQuotes();
  }, []);

  const filteredQuotes = quotes.filter((q) => {
    const clientName = q.clientId?.fullName ?? '';
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesSearch =
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.notes ?? '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenModal = (quote?: Quote) => {
    if (quote) {
      setFormData({
        clientId: quote.clientId._id,
        totalHT: quote.totalHT,
        tva: quote.tva,
        status: quote.status,
        notes: quote.notes,
      });
      setEditingId(quote._id);
    } else {
      setFormData({
        clientId: '',
        totalHT: 0,
        tva: 20,
        status: 'brouillon',
        notes: '',
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  // 🟢 Création ou modification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        const res = await axios.put(
          `http://localhost:5000/api/devis/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuotes(quotes.map((q) => (q._id === editingId ? res.data.devis : q)));
      } else {
        const res = await axios.post(
          'http://localhost:5000/api/devis/create',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuotes([...quotes, res.data.devis]);
      }

      setShowModal(false);
      setEditingId(null);
      navigate('/quotes');
    } catch (err) {
      console.error('Erreur sauvegarde devis :', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/devis/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuotes(quotes.filter((q) => q._id !== id));
    } catch (err) {
      console.error('Erreur suppression devis :', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-slate-900">Devis</h2>
        <button
          onClick={() => navigate('/createQuotes')}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" /> Nouveau devis
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
            <option value="brouillon">Brouillon</option>
            <option value="envoyé">Envoyé</option>
            <option value="accepté">Accepté</option>
            <option value="refusé">Refusé</option>
          </select>
        </div>

        <div className="grid gap-4">
          {filteredQuotes.map((quote) => (
            <div key={quote._id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="text-blue-600 font-bold text-lg">{quote.codeUnique}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{quote.clientId?.fullName ?? "Client inconnu"}</h3>
                    <div className="flex items-center space-x-3 text-sm text-slate-600 mt-1">
                      <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Montant HT: {quote.totalHT.toFixed(2)} DT</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{quote.notes}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end space-x-4 sm:space-x-0">
                  <div className="text-right">
                    <p className="font-bold text-xl text-slate-900">{quote.totalTTC.toFixed(2)} DT</p>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded border mt-2 ${getStatusColor(
                        quote.status
                      )}`}
                    >
                      {quote.status}
                    </span>
                  </div>

                  <div className="flex space-x-2 sm:mt-3">
                    {quote && quote.status === "accepté" && (
  <button
    type="button"
    onClick={() => navigate("/createInvoices", { state: { quote } })}
    className="ml-2 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
    title="Créer facture à partir de ce devis"
  >
    <FileText size={18} />
  </button>
)}
                    <button
                      onClick={() => generateQuotePDF(quote)}
                      className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
             
                       onClick={() => navigate('/createQuotes', { state: { quoteToEdit: quote } })}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(quote._id)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
