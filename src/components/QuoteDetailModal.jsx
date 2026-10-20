import React, { useState } from 'react';
import Modal from './Modal';
import { formatCLP, formatDate } from '../utils/formatters';
import { GRUTA_COMPANY_DATA } from '../data/mockData';
import {
  Download,
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
} from 'lucide-react';

export default function QuoteDetailModal({
  isOpen,
  onClose,
  quote,
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
- ${quote.notes || 'Trabajos ejecutados bajo estrictas normas de control de calidad y soldadura.'}
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
    const headers = ['Item', 'Descripcion Tecnica', 'Cantidad', 'Unidad', 'Precio Unitario (CLP)', 'Total (CLP)'];
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

    const fileType = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
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

  return (
    <>
      <Modal
        isOpen={isOpen && !isEmailModalOpen}
        onClose={onClose}
        title={`Cotización Formal ${quote.folio}`}
        subtitle={`${quote.company} • ${quote.project}`}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6 text-xs">
          {/* Action Header Bar (No-Print) */}
          <div className="no-print p-3 sm:p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
              {/* Copy template button */}
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-800 transition-colors cursor-pointer shadow-xs active:scale-95"
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

              {/* Send email button */}
              <button
                type="button"
                onClick={handleOpenEmailModal}
                className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-semibold transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Enviar Mail</span>
              </button>

              {/* Download PDF button */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-800 transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Bajar PDF</span>
              </button>

              {/* Export to Excel */}
              <button
                type="button"
                onClick={handleExportExcel}
                className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-800 transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Excel (.csv)</span>
              </button>
            </div>

            {/* Status indicator */}
            <div className="flex items-center justify-between sm:justify-end">
              <span className="text-[10px] text-slate-400 sm:hidden">Estado:</span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {quote.status}
              </span>
            </div>
          </div>

          {/* Clean White Formal Sheet Document (A4 Printable Layout) */}
          <div className="bg-white p-6 sm:p-10 border border-slate-200/90 rounded-2xl shadow-xs space-y-6 print-container text-slate-800">
            {/* Header Document: Logo Gruta + Company Data */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-start gap-4">
                <img
                  src="/logo-gruta.webp"
                  alt="Maestranza La Gruta"
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails
                    e.target.style.display = 'none';
                  }}
                />
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    {GRUTA_COMPANY_DATA.name}
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {GRUTA_COMPANY_DATA.slogan}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    RUT: <strong className="text-slate-800">{GRUTA_COMPANY_DATA.rut}</strong> • {GRUTA_COMPANY_DATA.address}, {GRUTA_COMPANY_DATA.city}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Fono: {GRUTA_COMPANY_DATA.phone} • {GRUTA_COMPANY_DATA.email} • {GRUTA_COMPANY_DATA.website}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Cotización Formal
                  </span>
                  <span className="text-base font-mono font-bold text-red-600 block mt-0.5">
                    {quote.folio}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
                  <p>Emisión: <strong>{formatDate(quote.date)}</strong></p>
                  <p>Validez: <strong>{quote.validDays} días ({formatDate(quote.validUntil)})</strong></p>
                </div>
              </div>
            </div>

            {/* Client and Project Info Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Datos del Cliente
                </span>
                <p className="font-bold text-slate-900 text-sm">{quote.company}</p>
                <p className="text-slate-600 mt-0.5">RUT: {quote.rut}</p>
                <p className="text-slate-600">Contacto: {quote.clientName}</p>
                <p className="text-slate-600">Correo: {quote.email} • {quote.phone}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Obra / Requerimiento
                </span>
                <p className="font-bold text-slate-900 text-sm">{quote.project}</p>
                <p className="text-slate-600 mt-0.5">División: {quote.service}</p>
                <p className="text-slate-600">Plazo de Entrega: {quote.deliveryDays} días hábiles</p>
                <p className="text-slate-600">Lugar de faena: Puerto Montt / Región de Los Lagos</p>
              </div>
            </div>

            {/* Quotation Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-12">Ítem</th>
                    <th className="py-2.5 px-4">Descripción Técnica de Obra / Maestranza</th>
                    <th className="py-2.5 px-3 text-center">Cant.</th>
                    <th className="py-2.5 px-3 text-center">Unidad</th>
                    <th className="py-2.5 px-4 text-right">P. Unitario</th>
                    <th className="py-2.5 px-4 text-right">Total (CLP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {quote.items.map((item) => (
                    <tr key={item.item} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 text-center font-mono text-slate-500">
                        {item.item}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item.desc}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">
                        {item.qty.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-500">
                        {item.unit}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-700 font-mono">
                        {formatCLP(item.unitPrice, false)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                        {formatCLP(item.total, false)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary & Technical Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Technical notes & terms */}
              <div className="space-y-2 text-xs text-slate-600">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Condiciones Técnicas & Garantías
                </span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-[11px]">
                  {quote.notes}
                </p>
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <p>• Pago: 50% anticipo al emitir OC y 50% contra entrega.</p>
                  <p>• Ensayos y soldadura calificada según norma AWS D1.1.</p>
                </div>
              </div>

              {/* Totals Table */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal Neto:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {formatCLP(quote.netAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>IVA (19%):</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {formatCLP(quote.ivaAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-900 text-sm font-bold pt-2 border-t border-slate-200">
                  <span>TOTAL GENERAL:</span>
                  <span className="font-mono text-base text-slate-900">
                    {formatCLP(quote.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-center gap-6 text-[11px] text-slate-500">
              <div className="w-48 border-t border-slate-300 pt-2">
                <p className="font-semibold text-slate-800">Maestranza La Gruta SpA</p>
                <p>Gerencia Técnica & Obras</p>
              </div>

              <div className="w-48 border-t border-slate-300 pt-2">
                <p className="font-semibold text-slate-800">{quote.company}</p>
                <p>Aceptación & V°B° Cliente</p>
              </div>
            </div>
          </div>

          {/* Attached Files Section (Planos, Cubicaciones, Especificaciones) */}
          <div className="no-print p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-slate-900 text-xs">
                  Archivos Adjuntos (Planos, Cubicaciones Excel & PDF)
                </span>
              </div>

              {/* Upload file input */}
              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-xs text-slate-700 cursor-pointer shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Subir Archivo (.xlsx / .pdf)</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".xlsx,.xls,.pdf,.dwg"
                  className="hidden"
                />
              </label>
            </div>

            {quote.files && quote.files.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quote.files.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
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
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar archivo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic">
                No hay archivos adjuntos en esta cotización. Puedes subir memorias de cálculo o cubicaciones.
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal: Enviar Directo a un Correo Electrónico */}
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

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <a
                    href={`mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                    className="text-slate-600 hover:text-slate-900 font-semibold underline decoration-slate-300 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir en mi cliente de correo (Outlook/Gmail)</span>
                  </a>

                  <div className="flex items-center gap-2">
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
                      <span>Enviar Ahora al Cliente</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </form>
        </Modal>
      )}
    </>
  );
}
