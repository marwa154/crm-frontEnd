import { Bell, FileText, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Facture en retard',
      message: 'La facture FAC-004 pour Innovation Co est en retard de paiement',
      date: '2025-11-04',
      time: '10:30',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Devis accepté',
      message: 'Le devis #002 a été accepté par Entreprise XYZ',
      date: '2025-11-03',
      time: '14:15',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Nouveau devis en attente',
      message: 'Le devis #003 pour Tech Solutions attend votre validation',
      date: '2025-11-02',
      time: '09:20',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Paiement reçu',
      message: 'La facture FAC-005 a été payée par Digital Plus',
      date: '2025-11-01',
      time: '16:45',
      read: true
    },
    {
      id: 5,
      type: 'warning',
      title: 'Échéance proche',
      message: 'La facture FAC-002 arrive à échéance dans 3 jours',
      date: '2025-10-31',
      time: '11:00',
      read: true
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'info': return <FileText className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50';
      case 'warning': return 'bg-amber-50';
      case 'info': return 'bg-blue-50';
      default: return 'bg-slate-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-slate-600 mt-1">
              Vous avez {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Tout marquer comme lu
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-slate-50 transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${getBgColor(notification.type)}`}>
                {getIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {notification.date} à {notification.time}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune notification</h3>
          <p className="text-slate-600">Vous êtes à jour avec toutes vos notifications</p>
        </div>
      )}
    </div>
  );
}
