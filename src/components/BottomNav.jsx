import React from 'react';
import { LayoutDashboard, FileText, Users, Receipt } from 'lucide-react';

export default function BottomNav({ activeView, onNavigate, counts }) {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Resumen',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'quotes',
      label: 'Cotizar',
      icon: FileText,
      badge: counts?.quotes > 0 ? counts.quotes : null,
      badgeColor: 'bg-red-600',
    },
    {
      id: 'crm',
      label: 'Clientes',
      icon: Users,
      badge: counts?.clients > 0 ? counts.clients : null,
      badgeColor: 'bg-slate-700',
    },
    {
      id: 'finances',
      label: 'Finanzas',
      icon: Receipt,
      badge: counts?.pendingInvoices > 0 ? counts.pendingInvoices : null,
      badgeColor: 'bg-amber-500',
    },
  ];

  const handleTabClick = (tabId) => {
    if (tabId === activeView) return;
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch {
      // ignore
    }
    onNavigate(tabId);
  };

  return (
    <nav
      aria-label="Navegación inferior móvil"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] no-print select-none"
    >
      <div className="grid grid-cols-4 items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-150 relative cursor-pointer active:scale-90 ${
                isActive ? 'text-red-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1 rounded-xl transition-all duration-200 ${
                    isActive ? 'bg-red-50 text-red-600 scale-105 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Badge Counter */}
                {tab.badge && (
                  <span
                    className={`absolute -top-1 -right-2 min-w-4.5 h-4.5 px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white ${
                      tab.badgeColor || 'bg-red-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] tracking-tight mt-0.5 leading-tight ${
                  isActive ? 'text-slate-900 font-bold' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>

              {/* Active Dot Pill */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
