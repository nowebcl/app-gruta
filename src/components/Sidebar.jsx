import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  Receipt,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { GRUTA_COMPANY_DATA } from '../data/mockData';

export default function Sidebar({
  activeView,
  setActiveView,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  user,
  onLogout,
  counts,
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Resumen General',
      icon: LayoutDashboard,
      badge: null,
      description: 'Métricas, KPIs y Gráficos',
    },
    {
      id: 'quotes',
      label: 'Cotizaciones & Plantillas',
      icon: FileText,
      badge: counts?.quotes || 3,
      badgeType: 'red',
      description: 'Propuestas formales, envío y exportación',
    },
    {
      id: 'crm',
      label: 'Clientes & Obras',
      icon: Users,
      badge: counts?.clients || 8,
      description: 'Gestión de Contratistas y Clientes',
    },
    {
      id: 'finances',
      label: 'Finanzas & Facturas',
      icon: Receipt,
      badge: counts?.pendingInvoices ? `${counts.pendingInvoices} por cobrar` : null,
      badgeType: 'warning',
      description: 'Facturación, Cobros y Flujo',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/90 transition-all duration-200 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-68'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header with Gruta Official Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <div className="flex items-center overflow-hidden">
            <img
              src="/logo-gruta.webp"
              alt="Maestranza La Gruta"
              className={`h-9 w-auto object-contain shrink-0 ${
                isCollapsed ? 'max-w-[36px] object-cover object-left' : ''
              }`}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Location badge (when expanded) */}
        {!isCollapsed && (
          <div className="px-3.5 py-2 mx-3 my-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span className="truncate">Alto Bonito, Puerto Montt</span>
            </div>
            <a
              href="https://www.gruta.cl"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-red-600 transition-colors"
              title="Abrir gruta.cl"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Navigation Section */}
        <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Módulos Principales
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveView(item.id);
                  setIsMobileOpen(false);
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative cursor-pointer
                  ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0 text-left">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-md font-semibold shrink-0 ${
                          isActive
                            ? 'bg-slate-800 text-slate-200'
                            : item.badgeType === 'red'
                            ? 'bg-red-50 text-red-600 border border-red-200/70'
                            : item.badgeType === 'warning'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Area: User Profile & Logout */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <div
            className={`flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 ${
              isCollapsed ? 'justify-center p-2' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-red-100 border border-red-200 flex items-center justify-center font-bold text-red-700 text-[11px] shrink-0">
              OP
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || 'Oscar Palma'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  Administrador • Gruta
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={onLogout}
              title="Cerrar sesión"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
