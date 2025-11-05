import { useState } from 'react';
import { Building2 } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, password: string, role: 'admin' | 'employee') => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'employee' as 'admin' | 'employee'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        return;
      }
      alert('Compte créé avec succès!');
      setIsSignup(false);
    } else {
      onLogin(formData.email, formData.password, formData.role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mini CRM</h1>
          <p className="text-slate-600">Gérez vos clients et vos ventes efficacement</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex mb-6 bg-slate-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isSignup ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isSignup ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                  Nom complet
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="Jean Dupont"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                placeholder="vous@exemple.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                placeholder="••••••••"
              />
            </div>

            {isSignup && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
                    Rôle
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'employee' })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  >
                    <option value="employee">Employé</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all"
            >
              {isSignup ? "S'inscrire" : 'Se connecter'}
            </button>
          </form>

          {!isSignup && (
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Mot de passe oublié?
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
