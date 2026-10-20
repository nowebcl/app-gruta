import React, { useState } from 'react';
import Modal from './Modal';
import { formatCLP } from '../utils/formatters';
import { SERVICE_OPTIONS } from '../data/mockData';
import { Plus, Trash2, FileSpreadsheet, Building, Calendar } from 'lucide-react';

export default function NewQuoteModal({ isOpen, onClose, clients, onAddQuote }) {
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [project, setProject] = useState('');
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [validDays, setValidDays] = useState(30);
  const [deliveryDays, setDeliveryDays] = useState(30);
  const [notes, setNotes] = useState(
    'Trabajos ejecutados bajo estrictas normas de control de calidad y soldadura AWS D1.1. Incluye certificados de calidad de materiales.'
  );

  const [items, setItems] = useState([
    {
      item: 1,
      desc: 'Fabricación y armado de perfiles estructurales de acero',
      qty: 1,
      unit: 'Global',
      unitPrice: 5000000,
      total: 5000000,
    },
  ]);

  const [errors, setErrors] = useState({});

  // Compute live totals
  const netAmount = items.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const ivaAmount = Math.round(netAmount * 0.19);
  const totalAmount = netAmount + ivaAmount;

  // Handle changing item field
  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      const target = { ...next[index], [field]: value };

      if (field === 'qty' || field === 'unitPrice') {
        const q = field === 'qty' ? parseFloat(value) || 0 : target.qty;
        const p = field === 'unitPrice' ? parseFloat(value) || 0 : target.unitPrice;
        target.total = Math.round(q * p);
      }

      next[index] = target;
      return next;
    });
  };

  // Add new item line
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        item: prev.length + 1,
        desc: '',
        qty: 1,
        unit: 'Unid',
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  // Remove item line
  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) =>
      prev
        .filter((_, idx) => idx !== index)
        .map((it, idx) => ({ ...it, item: idx + 1 }))
    );
  };

  // Submit quote
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!project.trim()) newErrors.project = 'El nombre de la obra es requerido';
    if (items.some((it) => !it.desc.trim())) {
      newErrors.items = 'Todas las líneas deben tener una descripción';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedClient = clients.find((c) => c.id === clientId) || clients[0];
    const today = new Date();
    const validUntilDate = new Date(today);
    validUntilDate.setDate(validUntilDate.getDate() + parseInt(validDays, 10));

    const newQuote = {
      id: `cot-${Date.now().toString().slice(-4)}`,
      folio: `COT-2024-${Math.floor(130 + Math.random() * 870)}`,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      company: selectedClient.company,
      rut: selectedClient.rut,
      email: selectedClient.email,
      phone: selectedClient.phone,
      project: project.trim(),
      service: service,
      date: today.toISOString().split('T')[0],
      validUntil: validUntilDate.toISOString().split('T')[0],
      validDays: parseInt(validDays, 10),
      deliveryDays: parseInt(deliveryDays, 10),
      status: 'Enviada al Cliente',
      notes: notes.trim(),
      items: items.map((it) => ({
        ...it,
        qty: Number(it.qty) || 1,
        unitPrice: Number(it.unitPrice) || 0,
        total: Number(it.total) || 0,
      })),
      netAmount,
      ivaAmount,
      totalAmount,
      files: [],
    };

    onAddQuote(newQuote);
    onClose();

    // Reset
    setProject('');
    setItems([
      {
        item: 1,
        desc: 'Fabricación y armado de perfiles estructurales de acero',
        qty: 1,
        unit: 'Global',
        unitPrice: 5000000,
        total: 5000000,
      },
    ]);
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nueva Cotización Formal"
      subtitle="Genera una propuesta comercial lista para enviar por mail y descargar en PDF"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Client & Service */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Cliente / Contratista *
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company} ({c.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Especialidad / División
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
            >
              {SERVICE_OPTIONS.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Nombre de la Obra o Proyecto *
          </label>
          <input
            type="text"
            required
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="ej. Fabricación de Estructura Galpón 600m² con perfiles IPE"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
          />
          {errors.project && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.project}</p>
          )}
        </div>

        {/* Items Breakdown Table */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs">
              Desglose de Partidas y Precios
            </span>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Partida</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200"
              >
                <div className="col-span-12 sm:col-span-6">
                  <input
                    type="text"
                    required
                    placeholder="Descripción técnica del trabajo..."
                    value={it.desc}
                    onChange={(e) => handleItemChange(idx, 'desc', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-medium"
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Cant"
                    value={it.qty}
                    onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-center font-medium"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <input
                    type="text"
                    placeholder="Unid"
                    value={it.unit}
                    onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-center font-medium"
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="P. Unit"
                    value={it.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-right font-mono font-medium"
                  />
                </div>

                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length === 1}
                    className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {errors.items && (
            <p className="text-[11px] text-rose-500">{errors.items}</p>
          )}

          {/* Totals Summary */}
          <div className="pt-2 flex justify-end">
            <div className="w-64 space-y-1 text-right text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal Neto:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {formatCLP(netAmount)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>IVA 19%:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {formatCLP(ivaAmount)}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1 text-sm">
                <span>Total Cotizado:</span>
                <span className="font-mono text-slate-900">{formatCLP(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Validity & Delivery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Validez de la Oferta (Días)
            </label>
            <input
              type="number"
              min="5"
              value={validDays}
              onChange={(e) => setValidDays(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Plazo de Ejecución (Días Hábiles)
            </label>
            <input
              type="number"
              min="1"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Condiciones Técnicas y Observaciones
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-center font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer active:scale-95"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Emitir Cotización</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
