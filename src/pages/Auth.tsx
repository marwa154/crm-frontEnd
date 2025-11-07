import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';

export default function Auth() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'employee' as 'admin' | 'employee'
  });

  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-600 rounded-xl">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-slate-900">Mini CRM</h1>
          <p className="text-slate-600">Gérez vos clients et vos ventes efficacement</p>
        </div>

        <div className="p-8 bg-white shadow-xl rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-slate-700">
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
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-slate-700">
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



            <button
              type="submit"
              className="w-full px-4 py-3 font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
              Mot de passe oublié?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
