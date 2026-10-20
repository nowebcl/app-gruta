import React, { useState, useEffect, useMemo } from 'react';
import { formatCLP, formatDate, STATUS_STYLES } from '../utils/formatters';
import {
  ArrowLeft,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Plus,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export default function ClientDetailView({
  client,
  quotes = [],
  invoices = [],
  onBack,
  onOpenNewQuoteForClient,
  onOpenNewFinanceForClient,
  onSelectQuote,
  onMarkAsPaid,
}) {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'quotes' | 'invoices'

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onBack();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  if (!client) return null;

  const statusStyle =
    STATUS_STYLES[client.status] || STATUS_STYLES['Proyecto Activo'];

  // Associated quotes for this client
  const clientQuotes = useMemo(() => {
    return quotes.filter(
      (q) =>
        (q.company && q.company.toLowerCase() === client.company.toLowerCase()) ||
        (q.rut && client.rut && q.rut.replace(/\./g, '') === client.rut.replace(/\./g, ''))
    );
  }, [quotes, client]);

  // Associated invoices for this client
  const clientInvoices = useMemo(() => {
    return invoices.filter(
      (inv) =>
        inv.client &&
        inv.client.toLowerCase() === client.company.toLowerCase()
    );
  }, [invoices, client]);

  const totalQuotesAmount = useMemo(() => {
    return clientQuotes.reduce((acc, q) => acc + q.totalAmount, 0);
  }, [clientQuotes]);

  const totalProjectsBudget = useMemo(() => {
    return (client.projects || []).reduce((acc, p) => acc + (p.budget || 0), 0);
  }, [client]);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* TOP NAVIGATION & ACTIONS BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Return button and Title Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 rounded-xl font-semibold text-xs transition-colors cursor-pointer active:scale-95 shrink-0"
            title="Volver (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver</span>
            <kbd className="hidden lg:inline text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300 text-slate-500">
              Esc
            </kbd>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                Clientes /
              </span>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                {client.company}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                {client.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              RUT: {client.rut} • {client.service}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 justify-end">
          <button
            type="button"
            onClick={() => onOpenNewQuoteForClient(client)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs text-slate-700 transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-red-600" />
            <span>Nueva Cotización</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenNewFinanceForClient(client)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Emitir Factura</span>
          </button>
        </div>
      </div>

      {/* HERO BANNER & CONTACT INFO */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Top Company Identity & Direct Contact */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xl sm:text-2xl shadow-xs shrink-0">
              {client.company.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {client.company}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Contacto Principal: <strong className="text-slate-900">{client.name}</strong>
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {client.city || 'Puerto Montt, Región de Los Lagos'}
                </span>
                <span>•</span>
                <span className="font-mono">RUT: {client.rut}</span>
              </div>
            </div>
          </div>

          {/* Quick Direct Communication Buttons */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto">
            <a
              href={`tel:${client.phone}`}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-xs text-slate-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{client.phone}</span>
            </a>
            <a
              href={`mailto:${client.email}`}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-xs text-slate-700 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>{client.email}</span>
            </a>
          </div>
        </div>

        {/* 4 KPI METRICS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Facturado Histórico
            </span>
            <span className="text-base sm:text-xl font-extrabold text-slate-900 block mt-1">
              {formatCLP(client.totalBilled || 0)}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              Cuenta al día
            </span>
          </div>

          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Proyectos Registrados
            </span>
            <span className="text-base sm:text-xl font-extrabold text-slate-900 block mt-1">
              {client.projects?.length || 0} Obras
            </span>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              Presupuesto: {formatCLP(totalProjectsBudget)}
            </span>
          </div>

          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Cotizaciones Emitidas
            </span>
            <span className="text-base sm:text-xl font-extrabold text-slate-900 block mt-1">
              {clientQuotes.length} Propuestas
            </span>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              Total: {formatCLP(totalQuotesAmount)}
            </span>
          </div>

          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Especialidad Principal
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900 block mt-1 truncate">
              {client.service}
            </span>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              Maestranza Industrial
            </span>
          </div>
        </div>
      </div>

      {/* SECTION TABS: Obras / Cotizaciones / Facturas */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        {/* Navigation Tabs Header */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 px-4 sm:px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'border-red-600 text-red-600 bg-white rounded-t-xl -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Obras & Faenas ({client.projects?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'quotes'
                ? 'border-red-600 text-red-600 bg-white rounded-t-xl -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Cotizaciones ({clientQuotes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'invoices'
                ? 'border-red-600 text-red-600 bg-white rounded-t-xl -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Facturas ({clientInvoices.length})</span>
          </button>
        </div>

        {/* TAB 1: OBRAS & PROYECTOS */}
        {activeTab === 'projects' && (
          <div className="p-5 sm:p-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Historial de Obras y Trabajos en Terreno
              </h3>
              <button
                type="button"
                onClick={() => onOpenNewQuoteForClient(client)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar nueva obra</span>
              </button>
            </div>

            {client.projects && client.projects.length > 0 ? (
              <div className="space-y-3">
                {client.projects.map((prj) => (
                  <div
                    key={prj.id}
                    className="p-4 sm:p-5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                          {prj.id}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {prj.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-xs flex-wrap">
                        <span>Supervisor a cargo: <strong className="text-slate-700">{prj.supervisor}</strong></span>
                        <span>•</span>
                        <span>Fecha inicio: {formatDate(prj.date)}</span>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 shrink-0">
                      <span className="font-extrabold text-slate-900 text-base font-mono">
                        {formatCLP(prj.budget)}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 mt-1">
                        {prj.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-400 text-xs">
                No hay proyectos registrados aún para este cliente.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COTIZACIONES */}
        {activeTab === 'quotes' && (
          <div className="p-5 sm:p-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Cotizaciones Técnicas & Propuestas Económicas
              </h3>
              <button
                type="button"
                onClick={() => onOpenNewQuoteForClient(client)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Emitir nueva cotización</span>
              </button>
            </div>

            {clientQuotes.length > 0 ? (
              <div className="space-y-3">
                {clientQuotes.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => onSelectQuote(q)}
                    className="p-4 sm:p-5 bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs cursor-pointer group"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-red-600 bg-red-50 border border-red-200/80 px-2.5 py-0.5 rounded-lg">
                          {q.folio}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-red-600 transition-colors truncate">
                          {q.project}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-xs flex-wrap">
                        <span>Especialidad: {q.service}</span>
                        <span>•</span>
                        <span>Emitida: {formatDate(q.date)}</span>
                        <span>•</span>
                        <span>Validez: {q.validDays} días</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 shrink-0">
                      <div className="text-left md:text-right">
                        <span className="font-extrabold text-slate-900 text-base font-mono block">
                          {formatCLP(q.totalAmount)}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 mt-1 inline-block">
                          {q.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-400 group-hover:text-red-600 font-semibold text-xs">
                        <span className="hidden sm:inline">Ver Ficha</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-400 text-xs">
                No hay cotizaciones emitidas a este cliente todavía.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FACTURAS */}
        {activeTab === 'invoices' && (
          <div className="p-5 sm:p-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Documentos Tributarios & Cuentas por Cobrar
              </h3>
              <button
                type="button"
                onClick={() => onOpenNewFinanceForClient(client)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Emitir nueva factura</span>
              </button>
            </div>

            {clientInvoices.length > 0 ? (
              <div className="space-y-3">
                {clientInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 sm:p-5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-0.5 rounded-lg">
                          {inv.folio}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm truncate">
                          {inv.description}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-xs flex-wrap">
                        <span>Emisión: {formatDate(inv.date)}</span>
                        <span>•</span>
                        <span>Vencimiento: {formatDate(inv.dueDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 shrink-0">
                      <div className="text-left md:text-right">
                        <span className="font-extrabold text-slate-900 text-base font-mono block">
                          {formatCLP(inv.amount)}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border mt-1 inline-block ${
                            inv.status === 'Pagado'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                              : 'bg-amber-50 text-amber-700 border-amber-200/70'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>

                      {inv.status !== 'Pagado' && onMarkAsPaid && (
                        <button
                          type="button"
                          onClick={() => onMarkAsPaid(inv.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Marcar Pagada</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-400 text-xs">
                No hay facturas registradas para este cliente todavía.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
