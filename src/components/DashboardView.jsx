import React, { useState } from 'react';
import {
  DollarSign,
  Clock,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  AlertCircle,
  Mail,
  Printer,
  Copy,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { formatCLP, formatDate, STATUS_STYLES } from '../utils/formatters';
import { MONTHLY_FINANCIALS, GRUTA_COMPANY_DATA } from '../data/mockData';

export default function DashboardView({
  invoices,
  clients,
  quotes = [],
  onNavigateToQuotes,
  onNavigateToFinances,
  onNavigateToClients,
  onSelectQuote,
  onOpenNewQuote,
}) {
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [copiedQuoteId, setCopiedQuoteId] = useState(null);

  // Compute live dynamic totals
  const totalBilled = invoices
    .filter((inv) => inv.status === 'Pagado')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPending = invoices
    .filter((inv) => inv.status === 'Pendiente' || inv.status === 'Atrasado')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const activeProjectsCount = clients
    .filter((c) => c.status === 'Proyecto Activo')
    .length;

  // Recent payments
  const recentPayments = invoices
    .filter((inv) => inv.status === 'Pagado')
    .slice(0, 5);

  // Quick copy message text directly from dashboard
  const handleCopyQuoteMessage = (q, e) => {
    e.stopPropagation();
    const text = `Estimada/o ${q.clientName} (${q.company}),
Adjuntamos la cotización formal ${q.folio} de Maestranza La Gruta para: ${q.project}.
Total: ${formatCLP(q.totalAmount)} (Neto: ${formatCLP(q.netAmount)} + IVA).
Plazo de Entrega: ${q.deliveryDays} días. Validez: ${q.validDays} días.
Datos: ${GRUTA_COMPANY_DATA.phone} | ${GRUTA_COMPANY_DATA.email} | www.gruta.cl`;

    navigator.clipboard.writeText(text);
    setCopiedQuoteId(q.id);
    setTimeout(() => setCopiedQuoteId(null), 2500);
  };

  // Service distribution
  const serviceDistribution = [
    { name: 'Estructuras Metálicas & Galpones', pct: 42, color: 'bg-red-600', amount: '$20.370.000' },
    { name: 'Montaje Industrial & Piping', pct: 28, color: 'bg-slate-800', amount: '$13.580.000' },
    { name: 'Corte Láser & Plegado CNC', pct: 18, color: 'bg-slate-600', amount: '$8.730.000' },
    { name: 'Obras Civiles & Fundaciones', pct: 12, color: 'bg-slate-400', amount: '$5.820.000' },
  ];

  const maxIngreso = Math.max(...MONTHLY_FINANCIALS.map((m) => m.ingresos));

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      
      {/* MOBILE CHILEAN MARKET STRIP (Clean & Native Widget) */}
      <div className="block lg:hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white p-3.5 rounded-2xl shadow-sm border border-slate-700/60">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-tight">Indicadores Chile</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Puerto Montt</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-700/60 font-mono text-xs">
          <div className="bg-slate-800/80 p-2 rounded-xl flex items-center justify-between">
            <span className="text-slate-400 font-sans text-[11px]">UF:</span>
            <span className="font-bold text-white">$38.450</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl flex items-center justify-between">
            <span className="text-slate-400 font-sans text-[11px]">Dólar:</span>
            <span className="font-bold text-white">$965</span>
          </div>
        </div>
      </div>
      
      {/* 1. TOP KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Facturación
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-base sm:text-2xl font-bold text-slate-900 tracking-tight">
              {formatCLP(totalBilled || 48500000)}
            </div>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
              <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                +14.2%
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 hidden sm:inline">vs mes anterior</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Por Cobrar
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200/60">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-base sm:text-2xl font-bold text-slate-900 tracking-tight">
              {formatCLP(totalPending || 12200000)}
            </div>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
              <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">
                <AlertCircle className="w-3 h-3 mr-0.5" />
                3 por vencer
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Obras Activas
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-base sm:text-2xl font-bold text-slate-900 tracking-tight">
              {activeProjectsCount} faenas
            </div>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-slate-500">
              <span className="font-medium text-slate-700">4 maestranza</span>
              <span>•</span>
              <span className="text-slate-400">4 terreno</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Conversión
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-200/60">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-base sm:text-2xl font-bold text-slate-900 tracking-tight">
              68.4%
            </div>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
              <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-red-700 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-200/60">
                <CheckCircle2 className="w-3 h-3 mr-0.5" />
                17 cerradas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REQUISITO CLAVE: SECCIÓN DE COTIZACIONES EN EL DASHBOARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Cotizaciones & Propuestas Técnicas
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                Maestranza La Gruta
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Envía directo por mail al cliente, descarga en PDF, o copia la plantilla lista con los datos oficiales de la empresa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigateToQuotes}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Ver todas ({quotes.length})
            </button>
            <button
              type="button"
              onClick={onOpenNewQuote}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Cotización</span>
            </button>
          </div>
        </div>

        {/* Quotations Quick Action Rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quotes.slice(0, 3).map((q) => (
            <div
              key={q.id}
              onClick={() => onSelectQuote(q)}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all bg-white cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-xs font-bold text-red-600">
                    {q.folio}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {q.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-xs mt-2 group-hover:text-red-600 transition-colors truncate">
                  {q.company}
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {q.project}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Total con IVA:</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {formatCLP(q.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Direct Action Bar inside card */}
              <div
                className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 1. Copiar Plantilla */}
                <button
                  type="button"
                  onClick={(e) => handleCopyQuoteMessage(q, e)}
                  title="Copiar plantilla para pegar en mail"
                  className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  {copiedQuoteId === q.id ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>

                {/* 2. Enviar por Mail */}
                <button
                  type="button"
                  onClick={() => onSelectQuote(q)}
                  title="Enviar directo a su correo"
                  className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  <Mail className="w-3 h-3" />
                  <span>Enviar</span>
                </button>

                {/* 3. Descargar PDF */}
                <button
                  type="button"
                  onClick={() => onSelectQuote(q)}
                  title="Descargar en PDF / Imprimir"
                  className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  <Printer className="w-3 h-3 text-slate-500" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MAIN FINANCIAL CHART & SERVICE DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 6-Month Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Ingresos vs. Costos de Obra
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evolución mensual histórica (Mayo - Octubre en CLP)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-600" />
                <span>Facturación</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-200" />
                <span>Costos Directos</span>
              </div>
            </div>
          </div>

          <div className="pt-6 pb-2">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {MONTHLY_FINANCIALS.map((item, idx) => {
                const ingresoHeight = (item.ingresos / maxIngreso) * 100;
                const costoHeight = (item.costos / maxIngreso) * 100;
                const isHovered = hoveredMonth === idx;

                return (
                  <div
                    key={item.month}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setHoveredMonth(idx)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    onClick={() => setHoveredMonth(hoveredMonth === idx ? null : idx)}
                  >
                    {isHovered && (
                      <div className="absolute -top-16 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                        <div className="font-semibold">{item.month} 2024</div>
                        <div className="text-slate-300">
                          Ingresos: {formatCLP(item.ingresos, false)}
                        </div>
                        <div className="text-slate-400">
                          Costos: {formatCLP(item.costos, false)}
                        </div>
                        <div className="text-emerald-400 font-semibold border-t border-slate-700/60 mt-0.5 pt-0.5">
                          Margen: {item.ratio} ({formatCLP(item.margen, false)})
                        </div>
                      </div>
                    )}

                    <div className="w-full max-w-[48px] flex items-end justify-center gap-1.5 h-full">
                      <div
                        style={{ height: `${ingresoHeight}%` }}
                        className="w-1/2 bg-red-600 rounded-t-md transition-all duration-300 group-hover:bg-red-700"
                      />
                      <div
                        style={{ height: `${costoHeight}%` }}
                        className="w-1/2 bg-slate-200 rounded-t-md transition-all duration-300 group-hover:bg-slate-300"
                      />
                    </div>

                    <span className="text-xs font-semibold text-slate-500 mt-3 group-hover:text-slate-900 transition-colors">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[11px]">Promedio Mensual</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  $42.700.000
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[11px]">Margen Operativo</span>
                <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
                  34.1%
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50">
                <span className="text-slate-400 block text-[11px]">Crecimiento Q3/Q4</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  +33.9%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Revenue Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Líneas de Negocio
              </h2>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Distribución
              </span>
            </div>

            <div className="space-y-4 mt-4">
              {serviceDistribution.map((serv) => (
                <div key={serv.name}>
                  <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1.5">
                    <span className="truncate pr-2">{serv.name}</span>
                    <span className="text-slate-500 shrink-0">{serv.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${serv.color}`}
                      style={{ width: `${serv.pct}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {serv.amount} CLP contratados
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onNavigateToClients}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <span>Ver contratistas por división</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. RECENT MOVEMENTS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Últimos Pagos Recibidos
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Movimientos bancarios y facturas cobradas recientemente
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToFinances}
            className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <span>Ver todas las facturas</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile View: Clean Payment Cards */}
        <div className="block sm:hidden divide-y divide-slate-100">
          {recentPayments.map((p) => {
            const statusStyle = STATUS_STYLES[p.status] || STATUS_STYLES.Pagado;
            return (
              <div key={p.id} className="p-4 space-y-2 active:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {p.folio}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {p.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{p.company}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{p.concept}</p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-xs">
                  <span className="text-slate-400 text-[10px]">{formatDate(p.paidDate || p.issueDate)}</span>
                  <span className="font-bold text-slate-900 font-mono">{formatCLP(p.amount)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Full Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Folio / Doc</th>
                <th className="py-3 px-6">Cliente / Empresa</th>
                <th className="py-3 px-6">Concepto de Obra</th>
                <th className="py-3 px-6 text-right">Monto Recibido</th>
                <th className="py-3 px-6">Fecha Pago</th>
                <th className="py-3 px-6 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {recentPayments.map((p) => {
                const statusStyle = STATUS_STYLES[p.status] || STATUS_STYLES.Pagado;
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3.5 px-6 font-mono text-slate-800 font-semibold">
                      {p.folio}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-slate-900">
                        {p.company}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {p.clientName}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 max-w-xs truncate">
                      {p.concept}
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                      {formatCLP(p.amount)}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">
                      {formatDate(p.paidDate || p.issueDate)}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusStyle.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
