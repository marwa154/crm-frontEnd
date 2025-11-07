import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react"; // npm install lucide-react

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <div className="flex justify-center mb-4">
          <Lock className="w-16 h-16 text-red-500" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          Accès refusé 🚫
        </h1>

        <p className="mb-6 text-gray-500">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 font-medium text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Retour
        </button>

        <div className="mt-6 text-sm text-gray-400">
          Si vous pensez que c'est une erreur, contactez l’administrateur du système.
        </div>
      </div>
    </div>
  );
}
