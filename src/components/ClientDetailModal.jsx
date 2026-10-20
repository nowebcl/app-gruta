import React from 'react';
import Modal from './Modal';
import { formatCLP, formatDate, STATUS_STYLES } from '../utils/formatters';
import {
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  ExternalLink,
  Plus,
  CheckCircle,
} from 'lucide-react';

export default function ClientDetailModal({
  isOpen,
  onClose,
  client,
  onOpenNewFinanceForClient,
}) {
  if (!client) return null;

  const statusStyle = STATUS_STYLES[client.status] || STATUS_STYLES['Proyecto Activo'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={client.company}
      subtitle={`Ficha de Cliente & Historial de Obras • RUT: ${client.rut}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Top Summary Bar */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-800 shadow-xs">
              <Building className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-base">{client.company}</h4>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                  {client.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Especialidad principal: <span className="font-semibold text-slate-700">{client.service}</span>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              Total Contratado Histórico
            </span>
            <span className="text-lg font-bold text-slate-900 block mt-0.5">
              {formatCLP(client.totalBilled || 0)}
            </span>
          </div>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <User className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Contacto</span>
            </div>
            <p className="font-semibold text-slate-800">{client.name}</p>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Phone className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Teléfono</span>
            </div>
            <a
              href={`tel:${client.phone}`}
              className="font-semibold text-slate-800 hover:text-slate-900 underline decoration-slate-300"
            >
              {client.phone}
            </a>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Mail className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Correo</span>
            </div>
            <a
              href={`mailto:${client.email}`}
              className="font-semibold text-slate-800 hover:text-slate-900 truncate block underline decoration-slate-300"
            >
              {client.email}
            </a>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Ubicación</span>
            </div>
            <p className="font-semibold text-slate-800 truncate">{client.city || 'Chile'}</p>
          </div>
        </div>

        {/* Project History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <h5 className="font-bold text-slate-900 text-sm">
                Historial de Proyectos & Obras ({client.projects?.length || 0})
              </h5>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenNewFinanceForClient(client);
              }}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Emitir Cotización para este cliente</span>
            </button>
          </div>

          {client.projects && client.projects.length > 0 ? (
            <div className="space-y-2.5">
              {client.projects.map((prj) => (
                <div
                  key={prj.id}
                  className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {prj.id}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {prj.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span>Supervisor: <strong className="text-slate-700">{prj.supervisor}</strong></span>
                      <span>•</span>
                      <span>Inicio: {formatDate(prj.date)}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <span className="font-bold text-slate-900 text-sm">
                      {formatCLP(prj.budget)}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 mt-0.5">
                      {prj.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 border border-slate-200/80 rounded-xl text-slate-400 text-xs">
              No hay proyectos registrados para este cliente aún.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center active:scale-95"
          >
            Cerrar Ficha
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenNewFinanceForClient) onOpenNewFinanceForClient(client);
            }}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Emitir Factura</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
