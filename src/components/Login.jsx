import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { GRUTA_COMPANY_DATA } from '../data/mockData';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickDemo = () => {
    setEmail('admin@gruta.cl');
    setPassword('admin123');
    setError('');
    
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: 'Oscar Palma',
        email: 'admin@gruta.cl',
        role: 'Administrador General',
        company: 'Maestranza La Gruta SpA',
      });
    }, 250);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: email.split('@')[0],
        email: email,
        role: 'Administrador General',
        company: 'Maestranza La Gruta SpA',
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-red-600 selection:text-white">
      {/* Background subtle fine grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header with Gruta Logo */}
        <div className="flex flex-col items-center text-center">
          <img
            src="/logo-gruta.webp"
            alt="Maestranza La Gruta"
            className="h-16 sm:h-20 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Card */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xs border border-slate-200/90 rounded-2xl sm:px-10">
            
            {/* Quick Demo Access Button: RED */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <button
                type="button"
                onClick={handleQuickDemo}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <span>⚡ Autollenar Credenciales Demo</span>
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2 font-mono">
                admin@gruta.cl • Acceso rápido
              </p>
            </div>

            {/* Standard Login Form */}
            <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ej. usuario@gruta.cl"
                    className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Contraseña
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">demo: admin123</span>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Iniciar Sesión</span>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer notice */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>Puerto Montt • {GRUTA_COMPANY_DATA.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
