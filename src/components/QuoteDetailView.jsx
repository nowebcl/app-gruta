import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { formatCLP, formatDate } from '../utils/formatters';
import { GRUTA_COMPANY_DATA } from '../data/mockData';
import {
  ArrowLeft,
  Mail,
  Copy,
  Printer,
  FileSpreadsheet,
  FileText,
  Upload,
  Check,
  Paperclip,
  Trash2,
  ExternalLink,
  Building,
  Calendar,
  Clock,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

export default function QuoteDetailView({
  quote,
  onBack,
  onSendEmail,
  onAddFileToQuote,
  onRemoveFileFromQuote,
}) {
  const [copied, setCopied] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState(quote?.email || '');
  const [emailSubject, setEmailSubject] = useState(
    `Cotización Formal ${quote?.folio} | Maestranza La Gruta`
  );
  const [emailBody, setEmailBody] = useState('');
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && !isEmailModalOpen) {
        onBack();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, isEmailModalOpen]);

  if (!quote) return null;

  // Generate plain text template for quick copy-pasting
  const generateEmailTemplate = () => {
    return `Estimada/o ${quote.clientName},
${quote.company}

Junto con saludar cordialmente, desde Maestranza La Gruta (Puerto Montt) adjuntamos la propuesta técnica y comercial formal solicitada:

• Folio de Cotización: ${quote.folio}
• Proyecto u Obra: ${quote.project}
• Especialidad: ${quote.service}
• Fecha de Emisión: ${formatDate(quote.date)}
• Validez de la Oferta: ${quote.validDays} días (hasta ${formatDate(quote.validUntil)})
• Plazo de Ejecución: ${quote.deliveryDays} días hábiles

RESUMEN DE MONTOS (CLP):
--------------------------------------------------
Subtotal Neto: ${formatCLP(quote.netAmount)}
IVA (19%):     ${formatCLP(quote.ivaAmount)}
TOTAL GENERAL: ${formatCLP(quote.totalAmount)}
--------------------------------------------------

CONDICIONES TÉCNICAS Y COMERCIALES:
- ${quote.notes || 'Trabajos ejecutados bajo estrictas normas de control de calidad y soldadura AWS D1.1.'}
- Forma de pago: 50% anticipo al confirmar orden de compra y 50% contra entrega de obras a conformidad.
- Cuenta bancaria: ${GRUTA_COMPANY_DATA.bankInfo.bank} | ${GRUTA_COMPANY_DATA.bankInfo.accountType} N° ${GRUTA_COMPANY_DATA.bankInfo.accountNumber} | RUT: ${GRUTA_COMPANY_DATA.bankInfo.rut}

Quedamos a su entera disposición ante cualquier consulta técnica o coordinación en faena.

Saludos cordiales,

${GRUTA_COMPANY_DATA.name}
${GRUTA_COMPANY_DATA.slogan}
Fono: ${GRUTA_COMPANY_DATA.phone}
Email: ${GRUTA_COMPANY_DATA.email} | ${GRUTA_COMPANY_DATA.managementEmail}
Dirección: ${GRUTA_COMPANY_DATA.address}, ${GRUTA_COMPANY_DATA.city}
Web: ${GRUTA_COMPANY_DATA.website}`;
  };

  // Copy template directly to clipboard
  const handleCopyTemplate = () => {
    const text = generateEmailTemplate();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Trigger browser print for PDF download
  const handleDownloadPDF = () => {
    window.print();
  };

  // Export current quotation items to clean Excel CSV
  const handleExportExcel = () => {
    const headers = [
      'Item',
      'Descripcion Tecnica',
      'Cantidad',
      'Unidad',
      'Precio Unitario (CLP)',
      'Total (CLP)',
    ];
    const rows = quote.items.map((it) => [
      it.item,
      `"${it.desc.replace(/"/g, '""')}"`,
      it.qty,
      it.unit,
      it.unitPrice,
      it.total,
    ]);

    rows.push([]);
    rows.push(['', '', '', '', 'Subtotal Neto', quote.netAmount]);
    rows.push(['', '', '', '', 'IVA (19%)', quote.ivaAmount]);
    rows.push(['', '', '', '', 'TOTAL GENERAL', quote.totalAmount]);

    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${quote.folio}_Maestranza_Gruta.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle file upload simulation
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType =
      file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
        ? 'excel'
        : file.name.endsWith('.pdf')
        ? 'pdf'
        : 'dwg';

    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const newFile = {
      name: file.name,
      size: sizeFormatted,
      type: fileType,
      date: new Date().toISOString().split('T')[0],
    };

    onAddFileToQuote(quote.id, newFile);
  };

  // Open direct email modal
  const handleOpenEmailModal = () => {
    setEmailTo(quote.email);
    setEmailSubject(`Cotización Formal ${quote.folio} | Maestranza La Gruta`);
    setEmailBody(generateEmailTemplate());
    setIsEmailModalOpen(true);
    setEmailSentSuccess(false);
  };

  // Confirm direct email sending
  const handleConfirmSendEmail = (e) => {
    e.preventDefault();
    onSendEmail(quote.id, emailTo);
    setEmailSentSuccess(true);
    setTimeout(() => {
      setIsEmailModalOpen(false);
      setEmailSentSuccess(false);
    }, 1500);
  };

  const getStatusBadge = () => {
    switch (quote.status) {
      case 'Aprobada':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Enviada al Cliente':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'Borrador':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* TOP NAVIGATION & ACTIONS BAR (No-Print) */}
      <div className="no-print bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
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
                Cotizaciones /
              </span>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                {quote.folio}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge()}`}
              >
                {quote.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {quote.company} • {quote.project}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 justify-end">
          {/* Copy Template */}
          <button
            type="button"
            onClick={handleCopyTemplate}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs text-slate-700 transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copiar Texto</span>
              </>
            )}
          </button>

          {/* Send Direct Email */}
          <button
            type="button"
            onClick={handleOpenEmailModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Enviar Correo</span>
          </button>

          {/* Print / Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs text-slate-700 transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Descargar PDF</span>
          </button>

          {/* Export to Excel */}
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs text-slate-700 transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel (.csv)</span>
          </button>
        </div>
      </div>

      {/* DOCUMENT CANVAS: Formal Technical Sheet (A4 Printable Layout) */}
      <div className="bg-white p-6 sm:p-12 lg:p-14 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-sm space-y-8 print-container text-slate-800 max-w-5xl mx-auto">
        
        {/* Header Document: Logo Gruta + Company Data */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="flex items-start gap-4">
            <img
              src="/logo-gruta.webp"
              alt="Maestranza La Gruta"
              className="h-14 sm:h-16 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="space-y-0.5">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {GRUTA_COMPANY_DATA.name}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                {GRUTA_COMPANY_DATA.slogan}
              </p>
              <p className="text-xs text-slate-500 pt-1">
                RUT: <strong className="text-slate-800">{GRUTA_COMPANY_DATA.rut}</strong> • {GRUTA_COMPANY_DATA.address}, {GRUTA_COMPANY_DATA.city}
              </p>
              <p className="text-xs text-slate-500">
                Fono: {GRUTA_COMPANY_DATA.phone} • Correo: {GRUTA_COMPANY_DATA.email} • {GRUTA_COMPANY_DATA.website}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 w-full sm:w-auto">
            <div className="inline-block bg-slate-50 border border-slate-200/90 rounded-2xl px-5 py-3 w-full sm:w-auto">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Cotización Técnica Formal
              </span>
              <span className="text-xl font-mono font-extrabold text-red-600 block mt-0.5">
                {quote.folio}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-2.5 space-y-1">
              <p>Fecha Emisión: <strong className="text-slate-800">{formatDate(quote.date)}</strong></p>
              <p>Validez de Oferta: <strong className="text-slate-800">{quote.validDays} días ({formatDate(quote.validUntil)})</strong></p>
            </div>
          </div>
        </div>

        {/* Client & Project Cards (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="p-4 sm:p-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400 uppercase tracking-wider text-[10px] font-bold mb-2">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>Datos del Cliente / Contratista</span>
            </div>
            <p className="font-bold text-slate-900 text-sm sm:text-base">{quote.company}</p>
            <p className="text-slate-600">RUT: <span className="font-semibold text-slate-800">{quote.rut}</span></p>
            <p className="text-slate-600">Atención a: <span className="font-semibold text-slate-800">{quote.clientName}</span></p>
            <p className="text-slate-600">Email: {quote.email} • Fono: {quote.phone}</p>
          </div>

          <div className="p-4 sm:p-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400 uppercase tracking-wider text-[10px] font-bold mb-2">
              <FileCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Proyecto u Obra en Faena</span>
            </div>
            <p className="font-bold text-slate-900 text-sm sm:text-base">{quote.project}</p>
            <p className="text-slate-600">Especialidad: <span className="font-semibold text-slate-800">{quote.service}</span></p>
            <p className="text-slate-600">Plazo de Fabricación / Ejecución: <span className="font-semibold text-slate-800">{quote.deliveryDays} días hábiles</span></p>
            <p className="text-slate-600">Lugar de Entrega / Faena: Puerto Montt / Región de Los Lagos</p>
          </div>
        </div>

        {/* Quotation Items Table (Wide & Responsive) */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-center w-14">Ítem</th>
                <th className="py-3 px-5">Descripción Técnica de Obra / Maestranza</th>
                <th className="py-3 px-4 text-center">Cant.</th>
                <th className="py-3 px-4 text-center">Unidad</th>
                <th className="py-3 px-5 text-right">P. Unitario (CLP)</th>
                <th className="py-3 px-5 text-right">Total (CLP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {quote.items.map((item) => (
                <tr key={item.item} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 text-center font-mono text-slate-500 font-bold">
                    {item.item}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">
                    {item.desc}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-700 font-semibold">
                    {item.qty.toLocaleString('es-CL')}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-500">
                    {item.unit}
                  </td>
                  <td className="py-3.5 px-5 text-right text-slate-700 font-mono">
                    {formatCLP(item.unitPrice, false)}
                  </td>
                  <td className="py-3.5 px-5 text-right font-bold text-slate-900 font-mono text-sm">
                    {formatCLP(item.total, false)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary & Technical Conditions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          {/* Technical terms & guarantees */}
          <div className="lg:col-span-7 space-y-3 text-xs text-slate-600">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Condiciones Técnicas, Plazos & Garantías
            </span>
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 leading-relaxed text-xs">
              <p className="text-slate-800 font-medium">
                {quote.notes || 'Trabajos ejecutados bajo estrictas normas de control de calidad y tolerancias dimensionales.'}
              </p>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1">
                <p>• Procedimientos de soldadura calificados según norma internacional <strong>AWS D1.1</strong>.</p>
                <p>• Tratamiento anticorrosivo y esquema de pintura epóxica según especificaciones de ingeniería.</p>
                <p>• Forma de pago: 50% anticipo al emitir Orden de Compra y 50% contra entrega a entera conformidad.</p>
                <p>• Transferencia bancaria a <strong>{GRUTA_COMPANY_DATA.bankInfo.bank}</strong>, Cta. Cte. N° {GRUTA_COMPANY_DATA.bankInfo.accountNumber}, RUT: {GRUTA_COMPANY_DATA.bankInfo.rut}.</p>
              </div>
            </div>
          </div>

          {/* Totals Table */}
          <div className="lg:col-span-5">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal Neto:</span>
                <span className="font-mono font-semibold text-slate-900 text-sm">
                  {formatCLP(quote.netAmount)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>IVA (19%):</span>
                <span className="font-mono font-semibold text-slate-900 text-sm">
                  {formatCLP(quote.ivaAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-900 font-bold pt-3 border-t border-slate-200">
                <span className="text-sm">TOTAL GENERAL:</span>
                <span className="font-mono text-lg sm:text-xl text-red-600 font-extrabold">
                  {formatCLP(quote.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Block */}
        <div className="pt-12 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs text-slate-500">
          <div className="border-t border-slate-300 pt-3">
            <p className="font-bold text-slate-800 text-sm">Maestranza La Gruta SpA</p>
            <p className="text-[11px] mt-0.5">Gerencia Técnica & Departamento de Obras</p>
            <p className="text-[10px] text-slate-400 mt-1">Puerto Montt, Chile</p>
          </div>

          <div className="border-t border-slate-300 pt-3">
            <p className="font-bold text-slate-800 text-sm">{quote.company}</p>
            <p className="text-[11px] mt-0.5">Aceptación y V°B° Cliente / Firma Autorizada</p>
            <p className="text-[10px] text-slate-400 mt-1">Fecha: _____ / _____ / 2026</p>
          </div>
        </div>
      </div>

      {/* ATTACHED FILES & TECHNICAL DOSSIER (No-Print) */}
      <div className="no-print max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-slate-500" />
            <h3 className="font-bold text-slate-900 text-sm">
              Archivos Técnicos Adjuntos (Planos DWG, Cubicaciones Excel & Memorias PDF)
            </h3>
          </div>

          {/* Upload file input */}
          <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-xs text-slate-700 cursor-pointer shadow-xs transition-colors">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Subir Archivo (.xlsx / .pdf / .dwg)</span>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".xlsx,.xls,.pdf,.dwg"
              className="hidden"
            />
          </label>
        </div>

        {quote.files && quote.files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {quote.files.map((file, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {file.type === 'excel' ? (
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {file.size} • {formatDate(file.date)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveFileFromQuote(quote.id, file.name)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Eliminar archivo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-xs italic">
            No hay planos o memorias adjuntas en esta cotización. Puedes subir cubicaciones o especificaciones técnicas arriba.
          </p>
        )}
      </div>

      {/* QUICK MODAL: Direct Email Sending */}
      {isEmailModalOpen && (
        <Modal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          title={`Enviar Cotización ${quote.folio} por Correo`}
          subtitle={`Emisión directa para ${quote.company}`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleConfirmSendEmail} className="space-y-4 text-xs">
            {emailSentSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <h4 className="font-bold text-emerald-900 text-sm">
                  ¡Cotización enviada exitosamente!
                </h4>
                <p className="text-emerald-700 text-xs">
                  Se envió una copia formal a <strong>{emailTo}</strong> con los datos de Maestranza La Gruta.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Destinatario (Email del Cliente) *
                  </label>
                  <input
                    type="email"
                    required
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Asunto del Mensaje *
                  </label>
                  <input
                    type="text"
                    required
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Cuerpo del Correo (Plantilla Oficial Gruta)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Puedes editar el texto antes de enviar
                    </span>
                  </div>
                  <textarea
                    rows={10}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 font-mono text-slate-700 leading-relaxed"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <a
                    href={`mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                    className="text-slate-600 hover:text-slate-900 font-semibold underline decoration-slate-300 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir en Outlook / Gmail</span>
                  </a>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEmailModalOpen(false)}
                      className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Enviar Ahora</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
}
