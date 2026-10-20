import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Building,
  User,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  Briefcase,
  Layers,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { formatCLP, STATUS_STYLES } from '../utils/formatters';
import { SERVICE_OPTIONS, CLIENT_STATUS_OPTIONS } from '../data/mockData';

export default function ClientsView({
  clients,
  onOpenNewClient,
  onSelectClient,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedService, setSelectedService] = useState('Todos');

  // Filter clients dynamically
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.rut.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'Todos' || c.status === selectedStatus;

      const matchesService =
        selectedService === 'Todos' || c.service === selectedService;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [clients, searchTerm, selectedStatus, selectedService]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Toolbar: Search, Filters & Action */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, empresa o RUT (ej. 76.840...)"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          />
        </div>

        {/* Filter Badges & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="Todos">Todos los Estados ({clients.length})</option>
              {CLIENT_STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Service Select */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="Todos">Todos los Servicios</option>
              {SERVICE_OPTIONS.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          </div>

          {/* New Client Button */}
          <button
            type="button"
            onClick={onOpenNewClient}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* 2. Fast Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['Todos', ...CLIENT_STATUS_OPTIONS].map((status) => {
          const count =
            status === 'Todos'
              ? clients.length
              : clients.filter((c) => c.status === status).length;
          const isSelected = selectedStatus === status;

          return (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
              }`}
            >
              <span>{status}</span>
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

      {/* 3. Clients Cards Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const statusStyle =
              STATUS_STYLES[client.status] || STATUS_STYLES['Proyecto Activo'];
            const activeProjects = client.projects?.length || 0;

            return (
              <div
                key={client.id}
                onClick={() => onSelectClient(client)}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Top: Company Name and Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-slate-700 transition-colors truncate">
                        {client.company}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-mono font-medium text-slate-500">
                          {client.rut}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-slate-500 truncate">
                          {client.city}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${statusStyle.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      {client.status}
                    </span>
                  </div>

                  {/* Service Pill */}
                  <div className="mt-3.5">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                      {client.service}
                    </span>
                  </div>

                  {/* Contact Info with 1-tap mobile calling & emailing */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2 truncate">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-800">{client.name}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={`mailto:${client.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-500 hover:text-red-600 truncate underline-offset-2 hover:underline"
                      >
                        {client.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={`tel:${client.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-600 hover:text-red-600 font-medium underline-offset-2 hover:underline"
                      >
                        {client.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Metrics & Action Link */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Facturado Total
                    </span>
                    <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                      {formatCLP(client.totalBilled || 0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                    <span>
                      {activeProjects} {activeProjects === 1 ? 'obra' : 'obras'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/90 text-slate-400 text-xs">
          No se encontraron clientes que coincidan con los filtros seleccionados.
        </div>
      )}
    </div>
  );
}
