import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, FileText, AlertCircle, CheckCircle, Trash2 } from "lucide-react";

interface Notification {
  _id: string;
  type: "SUCCESS" | "warning" | "info" | "default";
  message: string;
  createdAt: string;
  read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  //  Token et utilisateur
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userId: string | null = user?._id || null;

  //  Récupérer les notifications
  const fetchNotifications = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          params: { userId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sortedNotifications = res.data.sort(
        (a: Notification, b: Notification) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Erreur chargement notifications :", error);
    } finally {
      setLoading(false);
    }
  };

  //  Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      await axios.put(
        "http://localhost:5000/api/notifications/readAll",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Erreur lors du marquage :", error);
    }
  };

  //  Supprimer une notification
  const deleteNotification = async (id: string) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/notifications/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Erreur suppression notification :", error);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  //  Icône selon type
  const getIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case "info":
        return <FileText className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  //  Couleur fond
  const getBgColor = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return "bg-green-50";
      case "warning":
        return "bg-amber-50";
      case "info":
        return "bg-blue-50";
      default:
        return "bg-slate-50";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <p className="text-center text-slate-600 mt-8">
        Chargement...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-slate-600 mt-1">
              Vous avez {unreadCount} notification
              {unreadCount > 1 ? "s" : ""} non lue
              {unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
        {/* {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Tout marquer comme lu
          </button>
        )} */}
      </div>

      {/* Liste notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
        {notifications.map((notification) => {
          const dateObj = new Date(notification.createdAt);
          const date = dateObj.toLocaleDateString("fr-FR");
          const time = dateObj.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={notification._id}
              className={`p-4 hover:bg-slate-50 transition-colors ${
                !notification.read ? "bg-blue-50/30" : ""
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getBgColor(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-slate-900 capitalize">
                    {notification.type === "warning"
                      ? "Avertissement"
                      : notification.type === "SUCCESS"
                      ? "Succès"
                      : "Information"}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-slate-500 mt-2">{date} à {time}</p>
                </div>

                <div className="flex items-center space-x-2">
                  {!notification.read && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}

                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Supprimer cette notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Aucune notification */}
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
