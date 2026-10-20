import React, { useState } from 'react';
import Modal from './Modal';
import { formatCLP } from '../utils/formatters';
import { SERVICE_OPTIONS } from '../data/mockData';
import { Plus, Receipt, Calendar, Building, DollarSign, FileText } from 'lucide-react';

export default function NewFinanceModal({
  isOpen,
  onClose,
  clients,
  onAddInvoice,
  initialClient,
}) {
  const [formData, setFormData] = useState({
    type: 'Factura Electrónica',
    folio: `FACT-2024-${Math.floor(120 + Math.random() * 880)}`,
    clientId: initialClient ? initialClient.id : (clients[0]?.id || ''),
    service: initialClient ? initialClient.service : SERVICE_OPTIONS[0],
    concept: '',
    amount: '',
    issueDate: new Date().toISOString().split('T')[0],
    termDays: '30',
    status: 'Pendiente',
  });

  const [errors, setErrors] = useState({});

  const handleTypeChange = (type) => {
    const prefix = type === 'Cotización Formal' ? 'COT' : 'FACT';
    setFormData((prev) => ({
      ...prev,
      type,
      folio: `${prefix}-2024-${Math.floor(120 + Math.random() * 880)}`,
    }));
  };

  const handleClientChange = (e) => {
    const selectedId = e.target.value;
    const client = clients.find((c) => c.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      clientId: selectedId,
      service: client ? client.service : prev.service,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.concept.trim()) newErrors.concept = 'El concepto u obra es requerido';
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Ingresa un monto válido en CLP';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const client = clients.find((c) => c.id === formData.clientId) || clients[0];
    const issue = new Date(formData.issueDate);
    const due = new Date(issue);
    due.setDate(due.getDate() + parseInt(formData.termDays, 10));

    const newInvoice = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      folio: formData.folio,
      clientId: client.id,
      clientName: client.name,
      company: client.company,
      service: formData.service,
      concept: formData.concept.trim(),
      amount: parseInt(formData.amount.toString().replace(/\D/g, ''), 10),
      issueDate: formData.issueDate,
      dueDate: due.toISOString().split('T')[0],
      status: formData.status,
      paidDate: formData.status === 'Pagado' ? formData.issueDate : null,
      type: formData.type,
    };

    onAddInvoice(newInvoice);
    onClose();

    // Reset
    setFormData({
      type: 'Factura Electrónica',
      folio: `FACT-2024-${Math.floor(120 + Math.random() * 880)}`,
      clientId: clients[0]?.id || '',
      service: SERVICE_OPTIONS[0],
      concept: '',
      amount: '',
      issueDate: new Date().toISOString().split('T')[0],
      termDays: '30',
      status: 'Pendiente',
    });
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Emitir Nueva Factura o Cotización"
      subtitle="Genera un registro comercial con seguimiento de cobro y vencimiento"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Document Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Tipo de Documento Comercial
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('Factura Electrónica')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                formData.type === 'Factura Electrónica'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="font-semibold text-xs">Factura Electrónica</div>
              <div
                className={`text-[11px] mt-0.5 ${
                  formData.type === 'Factura Electrónica'
                    ? 'text-slate-300'
                    : 'text-slate-400'
                }`}
              >
                Cobro formal con IVA
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('Cotización Formal')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                formData.type === 'Cotización Formal'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="font-semibold text-xs">Cotización Formal</div>
              <div
                className={`text-[11px] mt-0.5 ${
                  formData.type === 'Cotización Formal'
                    ? 'text-slate-300'
                    : 'text-slate-400'
                }`}
              >
                Presupuesto previo de obra
              </div>
            </button>
          </div>
        </div>

        {/* Folio & Client Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Folio Asignado
            </label>
            <input
              type="text"
              name="folio"
              value={formData.folio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, folio: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Cliente / Contratista *
            </label>
            <select
              value={formData.clientId}
              onChange={handleClientChange}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company} ({c.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Service & Concept */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Línea de Servicio
            </label>
            <select
              value={formData.service}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, service: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
            >
              {SERVICE_OPTIONS.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Concepto / Detalle de la Obra *
            </label>
            <input
              type="text"
              placeholder="ej. Suministro y montaje de perfiles soldables Hito 1"
              value={formData.concept}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, concept: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            {errors.concept && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.concept}</p>
            )}
          </div>
        </div>

        {/* Amount & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Monto Total (CLP) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                $
              </div>
              <input
                type="number"
                placeholder="12500000"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="w-full pl-7 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold"
              />
            </div>
            {errors.amount && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Fecha de Emisión
            </label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, issueDate: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Plazo de Pago (Días)
            </label>
            <select
              value={formData.termDays}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, termDays: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="0">Al Contado / Inmediato</option>
              <option value="15">15 Días</option>
              <option value="30">30 Días (Estándar)</option>
              <option value="60">60 Días</option>
            </select>
          </div>
        </div>

        {/* Initial Status */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-800 block">
              Estado Inicial del Cobro
            </span>
            <span className="text-[11px] text-slate-500">
              Marca si el pago ya fue transferido o queda por cobrar
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, status: 'Pendiente' }))
              }
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                formData.status === 'Pendiente'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Pendiente
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, status: 'Pagado' }))
              }
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                formData.status === 'Pagado'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Pagado
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-center active:scale-95"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Crear Documento
          </button>
        </div>
      </form>
    </Modal>
  );
}
