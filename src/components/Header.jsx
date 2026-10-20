import React, { useState } from 'react';
import {
  Bell,
  Plus,
  MapPin,
  ExternalLink,
  LogOut,
  X,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import { GRUTA_COMPANY_DATA } from '../data/mockData';

export default function Header({
  activeView,
  selectedQuote,
  selectedClient,
  onBack,
  setIsMobileOpen,
  onOpenNewQuote,
  onOpenNewFinance,
  pendingCount,
  user,
  onLogout,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileProfile, setShowMobileProfile] = useState(false);

  const getViewInfo = () => {
    if (selectedQuote) {
      return {
        mobileTitle: selectedQuote.folio,
        title: `Cotización Formal ${selectedQuote.folio}`,
        subtitle: `${selectedQuote.company} • ${selectedQuote.project}`,
      };
    }
    if (selectedClient) {
      return {
        mobileTitle: selectedClient.company,
        title: selectedClient.company,
        subtitle: `Ficha de Cliente & Historial de Obras • RUT: ${selectedClient.rut}`,
      };
    }

    switch (activeView) {
      case 'dashboard':
        return {
          mobileTitle: 'Inicio',
          title: 'Panel General de Control',
          subtitle: 'Métricas financieras, cotizaciones activas y faenas en ejecución',
        };
      case 'quotes':
        return {
          mobileTitle: 'Cotizaciones',
          title: 'Cotizaciones Técnicas & Plantillas',
          subtitle: 'Propuestas de maestranza, envío directo por mail, PDF y exportación',
        };
      case 'crm':
        return {
          mobileTitle: 'Clientes',
          title: 'Clientes Corporativos & Obras',
          subtitle: 'Directorio de contratistas, proyectos en ejecución y estados',
        };
      case 'finances':
        return {
          mobileTitle: 'Finanzas',
          title: 'Finanzas & Facturación',
          subtitle: 'Control de cuentas por cobrar, estados de pago y documentos tributarios',
        };
      default:
        return { mobileTitle: 'La Gruta', title: 'Dashboard', subtitle: 'Maestranza La Gruta' };
    }
  };

  const { mobileTitle, title, subtitle } = getViewInfo();

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 transition-all no-print select-none">
        <div className="flex items-center justify-between gap-3">
          
          {/* MOBILE APP TOP BAR (Clean, spacious, uncluttered) */}
          <div className="flex lg:hidden items-center gap-2.5 min-w-0">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="p-1 -ml-1 text-slate-700 hover:text-slate-900 rounded-lg transition-colors cursor-pointer shrink-0"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <img
                src="/logo-gruta.webp"
                alt="La Gruta"
                className="h-8 w-auto object-contain shrink-0"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="min-w-0">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight truncate">
                {mobileTitle}
              </h1>
            </div>
          </div>

          {/* DESKTOP TOP BAR: Title & Subtitle */}
          <div className="hidden lg:flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Volver"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight sm:text-lg">
                  {title}
                </h1>
              </div>
              <p className="text-xs text-slate-500">
                {subtitle}
              </p>
            </div>
          </div>

          {/* RIGHT ACTIONS: Clean & Minimal */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Chilean Indicators (UF & Dólar) */}
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-200/70 rounded-xl text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-400 font-normal">UF:</span>
                <span className="font-semibold text-slate-800">$38.450</span>
              </div>
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-normal">Dólar:</span>
                <span className="font-semibold text-slate-800">$965</span>
              </div>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer active:scale-90"
                title="Notificaciones"
                aria-label="Notificaciones"
              >
                <Bell className="w-4.5 h-4.5" />
                {pendingCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-40 text-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 font-bold text-slate-900">
                      <span>Avisos de Obras & Cobranza</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200/60 font-semibold">
                        {pendingCount} pendientes
                      </span>
                    </div>
                    <div className="py-2 space-y-1.5">
                      <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
                        <p className="font-semibold text-slate-800">
                          Factura FACT-2024-084 vencida
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Distribuidora Logística Central ($3.200.000 CLP)
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
                        <p className="font-semibold text-slate-800">
                          Cotización COT-2024-114 enviada
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Agrícola El Roble - Hangar 1.200m² ($22.600.000 CLP)
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile User Avatar (Clean, 1 tap opens profile sheet) */}
            <button
              type="button"
              onClick={() => setShowMobileProfile(true)}
              className="lg:hidden w-8.5 h-8.5 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center active:scale-90 shadow-xs cursor-pointer"
              aria-label="Perfil y opciones"
            >
              OP
            </button>

            {/* Desktop Primary Action Button: RED */}
            <button
              type="button"
              onClick={onOpenNewQuote}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Cotización</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE USER PROFILE & APP SETTINGS BOTTOM SHEET */}
      {showMobileProfile && (
        <>
          <div
            onClick={() => setShowMobileProfile(false)}
            className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          />
          <div
            role="dialog"
            aria-label="Perfil y configuración"
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[28px] border-t border-slate-200/90 shadow-2xl p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-300"
          >
            {/* Drag Handle */}
            <div className="flex justify-center -mt-1 pb-3">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-red-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  OP
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {user?.name || 'Oscar Palma'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {user?.email || 'admin@gruta.cl'} • Administrador General
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileProfile(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chilean Economic Indicators widget inside Profile */}
            <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Mercado Financiero Chile</span>
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200/60">
                  En Línea
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">UF Hoy</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">$38.450</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Dólar Observado</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">$965</span>
                </div>
              </div>
            </div>

            {/* Company Info Card */}
            <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>{GRUTA_COMPANY_DATA.name}</span>
                <span className="text-[10px] text-red-600 bg-red-50 border border-red-200/70 px-1.5 py-0.5 rounded font-mono">
                  {GRUTA_COMPANY_DATA.rut}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Alto Bonito, Puerto Montt</span>
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-slate-500">Sitio Web:</span>
                <a
                  href="https://www.gruta.cl"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-red-600 hover:underline flex items-center gap-1"
                >
                  <span>gruta.cl</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-4 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowMobileProfile(false);
                  if (onLogout) onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-xs font-bold transition-colors cursor-pointer active:scale-[0.98]"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
