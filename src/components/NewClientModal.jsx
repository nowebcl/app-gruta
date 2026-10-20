import React, { useState } from 'react';
import Modal from './Modal';
import { formatRUT } from '../utils/formatters';
import { SERVICE_OPTIONS, CLIENT_STATUS_OPTIONS } from '../data/mockData';
import { Plus, User, Building, Phone, Mail, FileText, MapPin } from 'lucide-react';

export default function NewClientModal({ isOpen, onClose, onAddClient }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    rut: '',
    phone: '',
    email: '',
    service: SERVICE_OPTIONS[0],
    status: CLIENT_STATUS_OPTIONS[0],
    city: '',
    initialProjectTitle: '',
    initialProjectBudget: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rut') {
      setFormData((prev) => ({ ...prev, rut: formatRUT(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre de contacto es requerido';
    if (!formData.company.trim()) newErrors.company = 'La empresa o razón social es requerida';
    if (!formData.rut.trim()) newErrors.rut = 'El RUT es requerido';
    if (!formData.email.trim()) newErrors.email = 'El correo es requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const budgetNum = parseInt(formData.initialProjectBudget.toString().replace(/\D/g, ''), 10) || 0;

    const newClient = {
      id: `cli-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      company: formData.company.trim(),
      rut: formData.rut.trim(),
      phone: formData.phone.trim() || '+56 9 0000 0000',
      email: formData.email.trim(),
      service: formData.service,
      status: formData.status,
      city: formData.city.trim() || 'Región Metropolitana, Chile',
      totalBilled: budgetNum,
      projects: formData.initialProjectTitle.trim()
        ? [
            {
              id: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
              title: formData.initialProjectTitle.trim(),
              status: formData.status === 'Proyecto Activo' ? 'En Planificación' : 'En Cotización',
              budget: budgetNum,
              date: new Date().toISOString().split('T')[0],
              supervisor: 'Ing. Fernando Soto',
            },
          ]
        : [],
    };

    onAddClient(newClient);
    onClose();

    // Reset form
    setFormData({
      name: '',
      company: '',
      rut: '',
      phone: '',
      email: '',
      service: SERVICE_OPTIONS[0],
      status: CLIENT_STATUS_OPTIONS[0],
      city: '',
      initialProjectTitle: '',
      initialProjectBudget: '',
    });
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Nuevo Cliente / Contratista"
      subtitle="Ingresa los antecedentes de la empresa y proyecto inicial de maestranza u obra"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company & RUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Empresa / Razón Social *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Building className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="ej. Constructora Andina SpA"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            {errors.company && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.company}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              RUT Empresa *
            </label>
            <input
              type="text"
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              placeholder="76.123.456-7"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            {errors.rut && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.rut}</p>
            )}
          </div>
        </div>

        {/* Contact Name & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nombre de Contacto *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ej. Rodrigo Henríquez"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Ciudad / Región
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="ej. Concepción, Región del Biobío"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Teléfono de Contacto
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+56 9 8765 4321"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Correo Electrónico *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contacto@empresa.cl"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Service & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Servicio de Interés Principal
            </label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {SERVICE_OPTIONS.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Estado Inicial en CRM
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {CLIENT_STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Initial Project Details */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Proyecto u Obra Inicial (Opcional)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Nombre de la Obra o Requerimiento
              </label>
              <input
                type="text"
                name="initialProjectTitle"
                value={formData.initialProjectTitle}
                onChange={handleChange}
                placeholder="ej. Fabricación Galpón 400m² con puente grúa"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Presupuesto Estimado (CLP)
              </label>
              <input
                type="number"
                name="initialProjectBudget"
                value={formData.initialProjectBudget}
                onChange={handleChange}
                placeholder="15000000"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
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
            Guardar Cliente
          </button>
        </div>
      </form>
    </Modal>
  );
}
