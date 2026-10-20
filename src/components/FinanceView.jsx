import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Check,
  Eye,
} from 'lucide-react';
import { formatCLP, formatDate, STATUS_STYLES } from '../utils/formatters';
import Modal from './Modal';

export default function FinanceView({
  invoices,
  onOpenNewFinance,
  onMarkAsPaid,
}) {
  const [activeTab, setActiveTab] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoiceForVoucher, setSelectedInvoiceForVoucher] = useState(null);

  // Financial summary metrics
  const summary = useMemo(() => {
    let totalBilled = 0;
    let totalPaid = 0;
    let totalPending = 0;
    let totalOverdue = 0;

    invoices.forEach((inv) => {
      totalBilled += inv.amount;
      if (inv.status === 'Pagado') {
        totalPaid += inv.amount;
      } else if (inv.status === 'Pendiente') {
        totalPending += inv.amount;
      } else if (inv.status === 'Atrasado') {
        totalOverdue += inv.amount;
      }
    });

    return { totalBilled, totalPaid, totalPending, totalOverdue };
  }, [invoices]);

  // Filtered invoices according to active tab and search query
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.service.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'Todas') return true;
      if (activeTab === 'Por Cobrar') return inv.status === 'Pendiente';
      if (activeTab === 'Pagadas') return inv.status === 'Pagado';
      if (activeTab === 'Vencidas') return inv.status === 'Atrasado';

      return true;
    });
  }, [invoices, activeTab, searchTerm]);

  // Tab counters
  const counts = {
    Todas: invoices.length,
    'Por Cobrar': invoices.filter((i) => i.status === 'Pendiente').length,
    Pagadas: invoices.filter((i) => i.status === 'Pagado').length,
    Vencidas: invoices.filter((i) => i.status === 'Atrasado').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. TOP FINANCIAL SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Facturado */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <span>Total Emitido</span>
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
          </div>
          <div className="text-base sm:text-xl font-bold text-slate-900 mt-1 sm:mt-2">
            {formatCLP(summary.totalBilled)}
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 block truncate">
            {invoices.length} documentos
          </span>
        </div>

        {/* Total Recaudado / Pagado */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <span>Recaudado</span>
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-xl font-bold text-emerald-700 mt-1 sm:mt-2">
            {formatCLP(summary.totalPaid)}
          </div>
          <span className="text-[10px] sm:text-[11px] text-emerald-600/80 font-medium mt-0.5 block truncate">
            {counts.Pagadas} liquidados
          </span>
        </div>

        {/* Cuentas por Cobrar */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <span>Por Cobrar</span>
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-xl font-bold text-amber-700 mt-1 sm:mt-2">
            {formatCLP(summary.totalPending)}
          </div>
          <span className="text-[10px] sm:text-[11px] text-amber-600 font-medium mt-0.5 block truncate">
            {counts['Por Cobrar']} en plazo
          </span>
        </div>

        {/* Vencidas / Atrasadas */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <span>Vencidas</span>
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-xl font-bold text-rose-700 mt-1 sm:mt-2">
            {formatCLP(summary.totalOverdue)}
          </div>
          <span className="text-[10px] sm:text-[11px] text-rose-600 font-medium mt-0.5 block truncate">
            {counts.Vencidas} atrasadas
          </span>
        </div>
      </div>

      {/* 2. TOOLBAR & FILTER TABS */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        
        {/* Top bar: Search & CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por folio, cliente, empresa o servicio..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
          </div>

          {/* Action button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenNewFinance}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Factura / Cobro</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto text-xs">
          {['Todas', 'Por Cobrar', 'Pagadas', 'Vencidas'].map((tab) => {
            const isSelected = activeTab === tab;
            const count = counts[tab];

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
                    isSelected
                      ? 'bg-slate-800 text-slate-300'
                      : tab === 'Vencidas' && count > 0
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. INVOICES & COLLECTIONS: MOBILE NATIVE CARDS & DESKTOP TABLE */}
      {/* Mobile Card Feed */}
      <div className="block lg:hidden space-y-3">
        {filteredInvoices.map((inv) => {
          const statusStyle = STATUS_STYLES[inv.status] || STATUS_STYLES.Pendiente;
          const isPaid = inv.status === 'Pagado';

          return (
            <div
              key={inv.id}
              onClick={() => setSelectedInvoiceForVoucher(inv)}
              className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 cursor-pointer active:scale-[0.98] transition-all"
            >
              {/* Header: Folio & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {inv.folio}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {inv.type}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle.bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                  {inv.status}
                </span>
              </div>

              {/* Company & Concept */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                  {inv.company}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                  {inv.concept}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                    {inv.service}
                  </span>
                  <span>•</span>
                  <span>Vence: <strong className={inv.status === 'Atrasado' ? 'text-rose-600' : 'text-slate-700'}>{formatDate(inv.dueDate)}</strong></span>
                </div>
              </div>

              {/* Amount & Quick Actions */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Monto a Liquidar</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatCLP(inv.amount)}
                  </span>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {isPaid ? (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200/60">
                      <Check className="w-3.5 h-3.5" />
                      <span>Liquidado</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onMarkAsPaid(inv.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold active:scale-95 transition-all shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Marcar Pagado</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceForVoucher(inv)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors active:scale-95"
                    title="Ver comprobante"
                  >
                    <Eye className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredInvoices.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200/90 text-center text-slate-400 text-xs">
            No se encontraron documentos bajo el criterio de búsqueda actual.
          </div>
        )}
      </div>

      {/* Desktop Interactive Table */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Folio / Tipo</th>
                <th className="py-3.5 px-5">Cliente & Empresa</th>
                <th className="py-3.5 px-5">Servicio / Concepto</th>
                <th className="py-3.5 px-5 text-right">Monto (CLP)</th>
                <th className="py-3.5 px-5">Emisión</th>
                <th className="py-3.5 px-5">Vencimiento</th>
                <th className="py-3.5 px-5 text-center">Estado</th>
                <th className="py-3.5 px-5 text-right">Acción Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredInvoices.map((inv) => {
                const statusStyle =
                  STATUS_STYLES[inv.status] || STATUS_STYLES.Pendiente;
                const isPaid = inv.status === 'Pagado';

                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Folio */}
                    <td className="py-3.5 px-5">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceForVoucher(inv)}
                        className="font-mono text-slate-900 font-bold hover:underline cursor-pointer block text-left"
                        title="Ver detalle del comprobante"
                      >
                        {inv.folio}
                      </button>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {inv.type}
                      </span>
                    </td>

                    {/* Client */}
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900">
                        {inv.company}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {inv.clientName}
                      </div>
                    </td>

                    {/* Concept & Service */}
                    <td className="py-3.5 px-5 max-w-xs">
                      <div className="font-semibold text-slate-800 truncate">
                        {inv.service}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5" title={inv.concept}>
                        {inv.concept}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-5 text-right font-bold text-slate-900">
                      {formatCLP(inv.amount)}
                    </td>

                    {/* Issue Date */}
                    <td className="py-3.5 px-5 text-slate-500">
                      {formatDate(inv.issueDate)}
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-5">
                      <span
                        className={`text-xs ${
                          inv.status === 'Atrasado'
                            ? 'font-bold text-rose-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {formatDate(inv.dueDate)}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusStyle.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {inv.status}
                      </span>
                    </td>

                    {/* Quick Action Button: "Marcar como pagado" */}
                    <td className="py-3.5 px-5 text-right">
                      {isPaid ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50/60 px-2 py-1 rounded-lg">
                          <Check className="w-3.5 h-3.5" />
                          <span>Liquidado</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onMarkAsPaid(inv.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95 group/btn"
                          title="Hacer clic para marcar como pagado en tiempo real"
                        >
                          <Check className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                          <span>Marcar Pagado</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs">
            No se encontraron documentos bajo el criterio de búsqueda actual.
          </div>
        )}
      </div>

      {/* 4. MODAL: DETALLE DE COMPROBANTE TRIBUTARIO / COTIZACIÓN */}
      {selectedInvoiceForVoucher && (
        <Modal
          isOpen={Boolean(selectedInvoiceForVoucher)}
          onClose={() => setSelectedInvoiceForVoucher(null)}
          title={`Detalle Tributario • ${selectedInvoiceForVoucher.folio}`}
          subtitle="Comprobante interno emitido por GRUTA Maestranza & Obras"
          maxWidth="max-w-xl"
        >
          <div className="space-y-5 text-xs">
            {/* Header Voucher Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Documento Comercial
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedInvoiceForVoucher.type}
                </h4>
                <p className="font-mono text-slate-600 font-semibold mt-0.5">
                  {selectedInvoiceForVoucher.folio}
                </p>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    STATUS_STYLES[selectedInvoiceForVoucher.status]?.bg || ''
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      STATUS_STYLES[selectedInvoiceForVoucher.status]?.dot || ''
                    }`}
                  />
                  {selectedInvoiceForVoucher.status}
                </span>
              </div>
            </div>

            {/* Information Rows */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                  Cliente / Razón Social
                </span>
                <span className="font-bold text-slate-900 block text-xs">
                  {selectedInvoiceForVoucher.company}
                </span>
                <span className="text-slate-500 block text-[11px] mt-0.5">
                  Atención: {selectedInvoiceForVoucher.clientName}
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                  Especialidad
                </span>
                <span className="font-bold text-slate-900 block text-xs">
                  {selectedInvoiceForVoucher.service}
                </span>
                <span className="text-slate-500 block text-[11px] mt-0.5">
                  División Maestranza & Montaje
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                  Fecha de Emisión
                </span>
                <span className="font-bold text-slate-900 block text-xs">
                  {formatDate(selectedInvoiceForVoucher.issueDate)}
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                  Fecha de Vencimiento
                </span>
                <span className="font-bold text-slate-900 block text-xs">
                  {formatDate(selectedInvoiceForVoucher.dueDate)}
                </span>
              </div>
            </div>

            {/* Item Concept */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Concepto de Obra o Fabricación
              </span>
              <p className="font-medium text-slate-800 text-xs">
                {selectedInvoiceForVoucher.concept}
              </p>
            </div>

            {/* Amount details */}
            <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">
                  Total a Pagar (CLP)
                </span>
                <span className="text-xl font-bold">
                  {formatCLP(selectedInvoiceForVoucher.amount)}
                </span>
              </div>

              {selectedInvoiceForVoucher.status !== 'Pagado' && (
                <button
                  type="button"
                  onClick={() => {
                    onMarkAsPaid(selectedInvoiceForVoucher.id);
                    setSelectedInvoiceForVoucher(null);
                  }}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Marcar Pagado Ahora</span>
                </button>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Comprobante</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedInvoiceForVoucher(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
