import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Mail,
  Printer,
  FileSpreadsheet,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { formatCLP, formatDate } from '../utils/formatters';
import { GRUTA_COMPANY_DATA } from '../data/mockData';

export default function QuotesView({
  quotes,
  onOpenNewQuote,
  onSelectQuote,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Todas');
  const [quickCopiedId, setQuickCopiedId] = useState(null);

  // Filter quotes by search and active tab
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesSearch =
        q.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.service.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'Todas') return true;
      if (activeTab === 'Enviadas') return q.status === 'Enviada al Cliente';
      if (activeTab === 'Aprobadas') return q.status === 'Aprobada';
      if (activeTab === 'Borrador') return q.status === 'Borrador';

      return true;
    });
  }, [quotes, searchTerm, activeTab]);

  // Financial summary
  const summary = useMemo(() => {
    const totalQuoted = quotes.reduce((acc, q) => acc + q.totalAmount, 0);
    const approvedCount = quotes.filter((q) => q.status === 'Aprobada').length;
    const sentCount = quotes.filter((q) => q.status === 'Enviada al Cliente').length;
    const draftCount = quotes.filter((q) => q.status === 'Borrador').length;
    return { totalQuoted, approvedCount, sentCount, draftCount };
  }, [quotes]);

  // Export all quotations to clean Excel CSV
  const handleExportAllToExcel = () => {
    const headers = [
      'Folio',
      'Fecha',
      'Validez (Dias)',
      'Empresa',
      'RUT',
      'Contacto',
      'Email',
      'Servicio',
      'Proyecto',
      'Monto Neto (CLP)',
      'IVA 19% (CLP)',
      'Total General (CLP)',
      'Estado',
    ];

    const rows = quotes.map((q) => [
      q.folio,
      q.date,
      q.validDays,
      `"${q.company.replace(/"/g, '""')}"`,
      q.rut,
      `"${q.clientName.replace(/"/g, '""')}"`,
      q.email,
      `"${q.service.replace(/"/g, '""')}"`,
      `"${q.project.replace(/"/g, '""')}"`,
      q.netAmount,
      q.ivaAmount,
      q.totalAmount,
      `"${q.status}"`,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cotizaciones_Maestranza_Gruta_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Quick copy message text for any row
  const handleQuickCopy = (quote, e) => {
    e.stopPropagation();
    const text = `Estimada/o ${quote.clientName} (${quote.company}),
Adjuntamos cotización formal ${quote.folio} de Maestranza La Gruta para la obra: ${quote.project}.
Total: ${formatCLP(quote.totalAmount)} (Neto: ${formatCLP(quote.netAmount)} + IVA).
Plazo: ${quote.deliveryDays} días. Validez: ${quote.validDays} días.
Contacto: ${GRUTA_COMPANY_DATA.phone} | ${GRUTA_COMPANY_DATA.email} | www.gruta.cl`;

    navigator.clipboard.writeText(text);
    setQuickCopiedId(quote.id);
    setTimeout(() => setQuickCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Total Cotizado
          </span>
          <div className="text-base sm:text-xl font-bold text-slate-900 mt-1 sm:mt-2">
            {formatCLP(summary.totalQuoted)}
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 block truncate">
            {quotes.length} propuestas
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Aprobadas
          </span>
          <div className="text-base sm:text-xl font-bold text-emerald-700 mt-1 sm:mt-2">
            {summary.approvedCount} obras
          </div>
          <span className="text-[10px] sm:text-[11px] text-emerald-600/80 font-medium mt-0.5 block truncate">
            Listas para taller
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            En Negociación
          </span>
          <div className="text-base sm:text-xl font-bold text-amber-700 mt-1 sm:mt-2">
            {summary.sentCount} enviadas
          </div>
          <span className="text-[10px] sm:text-[11px] text-amber-600 font-medium mt-0.5 block truncate">
            Por confirmar
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Borradores
          </span>
          <div className="text-base sm:text-xl font-bold text-slate-700 mt-1 sm:mt-2">
            {summary.draftCount} fichas
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 block truncate">
            En cubicación
          </span>
        </div>
      </div>

      {/* 2. TOOLBAR: SEARCH, TABS & ACTION BUTTONS */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por folio, cliente, empresa o proyecto..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            />
          </div>

          {/* Action buttons (full PC features accessible on mobile) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
            {/* Export Excel button */}
            <button
              type="button"
              onClick={handleExportAllToExcel}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs active:scale-95"
              title="Descargar lista completa en Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exportar Excel</span>
            </button>

            {/* Red Action Button */}
            <button
              type="button"
              onClick={onOpenNewQuote}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Cotización</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto text-xs">
          {['Todas', 'Enviadas', 'Aprobadas', 'Borrador'].map((tab) => {
            const isSelected = activeTab === tab;
            const count =
              tab === 'Todas'
                ? quotes.length
                : tab === 'Enviadas'
                ? quotes.filter((q) => q.status === 'Enviada al Cliente').length
                : tab === 'Aprobadas'
                ? quotes.filter((q) => q.status === 'Aprobada').length
                : quotes.filter((q) => q.status === 'Borrador').length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/90'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. QUOTATIONS: MOBILE NATIVE CARD FEED & DESKTOP TABLE */}
      {/* Mobile Card Feed */}
      <div className="block lg:hidden space-y-3">
        {filteredQuotes.map((quote) => {
          const isApproved = quote.status === 'Aprobada';
          const isSent = quote.status === 'Enviada al Cliente';

          return (
            <div
              key={quote.id}
              onClick={() => onSelectQuote(quote)}
              className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 cursor-pointer active:scale-[0.98] transition-all"
            >
              {/* Card Header: Folio & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-red-600 bg-red-50 border border-red-200/70 px-2 py-0.5 rounded-lg">
                    {quote.folio}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatDate(quote.date)}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    isApproved
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isSent
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {quote.status}
                </span>
              </div>

              {/* Company & Project */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                  {quote.company}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                  {quote.project}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                    {quote.service}
                  </span>
                  <span>•</span>
                  <span>Entrega: {quote.deliveryDays}d</span>
                </div>
              </div>

              {/* Amount Highlight */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total con IVA</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatCLP(quote.totalAmount)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Neto: {formatCLP(quote.netAmount, false)}
                </div>
              </div>

              {/* Complete Mobile Actions Row: 100% PC capabilities on phone */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1.5">
                  {/* 1. Copy Template */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickCopy(quote, e)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-700 rounded-xl transition-all"
                    title="Copiar plantilla para correo"
                  >
                    {quickCopiedId === quote.id ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-600" />
                    )}
                  </button>

                  {/* 2. Direct Mail */}
                  <button
                    type="button"
                    onClick={() => onSelectQuote(quote)}
                    className="p-2 bg-red-50 hover:bg-red-100 active:scale-90 text-red-600 rounded-xl transition-all"
                    title="Enviar directo por correo"
                  >
                    <Mail className="w-4 h-4" />
                  </button>

                  {/* 3. PDF Sheet */}
                  <button
                    type="button"
                    onClick={() => onSelectQuote(quote)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-700 rounded-xl transition-all"
                    title="Ver PDF / Imprimir"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                {/* 4. Full Dossier / Items */}
                <button
                  type="button"
                  onClick={() => onSelectQuote(quote)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
                >
                  Ver Ficha
                </button>
              </div>
            </div>
          );
        })}

        {filteredQuotes.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200/90 text-center text-slate-400 text-xs">
            No se encontraron cotizaciones bajo el criterio seleccionado.
          </div>
        )}
      </div>

      {/* Desktop Interactive Table */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Folio / Emisión</th>
                <th className="py-3.5 px-5">Cliente & Empresa</th>
                <th className="py-3.5 px-5">Obra / Proyecto</th>
                <th className="py-3.5 px-5 text-right">Monto Total</th>
                <th className="py-3.5 px-5 text-center">Estado</th>
                <th className="py-3.5 px-5 text-right">Acciones Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredQuotes.map((quote) => {
                const isApproved = quote.status === 'Aprobada';
                const isSent = quote.status === 'Enviada al Cliente';

                return (
                  <tr
                    key={quote.id}
                    onClick={() => onSelectQuote(quote)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    {/* Folio */}
                    <td className="py-3.5 px-5">
                      <div className="font-mono text-slate-900 font-bold group-hover:text-red-600 transition-colors">
                        {quote.folio}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {formatDate(quote.date)} (Validez {quote.validDays}d)
                      </div>
                    </td>

                    {/* Client */}
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900">
                        {quote.company}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {quote.clientName} • {quote.email}
                      </div>
                    </td>

                    {/* Project */}
                    <td className="py-3.5 px-5 max-w-xs">
                      <div className="font-semibold text-slate-800 truncate">
                        {quote.project}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {quote.service} • Entrega {quote.deliveryDays} días
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-5 text-right font-mono">
                      <div className="font-bold text-slate-900 text-xs">
                        {formatCLP(quote.totalAmount)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Neto: {formatCLP(quote.netAmount, false)} + IVA
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isSent
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>

                    {/* Quick Action Buttons */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Copy template snippet */}
                        <button
                          type="button"
                          onClick={(e) => handleQuickCopy(quote, e)}
                          title="Copiar texto de cotización para pegar en correo"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          {quickCopiedId === quote.id ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Send Email Directly */}
                        <button
                          type="button"
                          onClick={() => onSelectQuote(quote)}
                          title="Enviar directo a su correo"
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>

                        {/* Download PDF */}
                        <button
                          type="button"
                          onClick={() => onSelectQuote(quote)}
                          title="Descargar en PDF / Imprimir"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* View full sheet */}
                        <button
                          type="button"
                          onClick={() => onSelectQuote(quote)}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                        >
                          Ver Plantilla
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredQuotes.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs">
            No se encontraron cotizaciones bajo el criterio seleccionado.
          </div>
        )}
      </div>
    </div>
  );
}
