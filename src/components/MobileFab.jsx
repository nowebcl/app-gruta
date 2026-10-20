import React, { useState } from 'react';
import { Plus, X, FileText, UserPlus, Receipt, ArrowRight } from 'lucide-react';

export default function MobileFab({ onOpenNewQuote, onOpenNewClient, onOpenNewFinance }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (callback) => {
    setIsOpen(false);
    callback();
  };

  return (
    <>
      {/* Quick Actions Sheet Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        />
      )}

      {/* Quick Actions Bottom Sheet */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Acciones rápidas"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[28px] border-t border-slate-200/90 shadow-2xl p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-300"
        >
          {/* Drag Pill */}
          <div className="flex justify-center -mt-1 pb-3">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Acción Rápida
              </h3>
              <p className="text-[11px] text-slate-500">
                Creación directa para Maestranza La Gruta
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {/* 1. Nueva Cotización */}
            <button
              type="button"
              onClick={() => handleAction(onOpenNewQuote)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-red-50/60 active:scale-[0.98] border border-slate-200/80 transition-all text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                    Nueva Cotización Formal
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Cubicación, ítems de maestranza, PDF y mail
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* 2. Nuevo Cliente */}
            <button
              type="button"
              onClick={() => handleAction(onOpenNewClient)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-[0.98] border border-slate-200/80 transition-all text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Nuevo Cliente / Contratista
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Registrar constructora, RUT y contacto
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* 3. Nueva Factura */}
            <button
              type="button"
              onClick={() => handleAction(onOpenNewFinance)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-[0.98] border border-slate-200/80 transition-all text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Nueva Factura / Cobro
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Emitir estado de pago o factura tributaria
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => {
          try {
            if ('vibrate' in navigator) navigator.vibrate(10);
          } catch {}
          setIsOpen(!isOpen);
        }}
        aria-label="Menú de acciones rápidas"
        className={`lg:hidden fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-4 z-40 w-12.5 h-12.5 rounded-full flex items-center justify-center text-white shadow-xl shadow-red-600/30 transition-all duration-200 active:scale-90 cursor-pointer no-print ${
          isOpen ? 'bg-slate-900 rotate-45' : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </>
  );
}
