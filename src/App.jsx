import React, { useState, useEffect, useMemo } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import QuotesView from './components/QuotesView';
import ClientsView from './components/ClientsView';
import FinanceView from './components/FinanceView';
import NewClientModal from './components/NewClientModal';
import NewFinanceModal from './components/NewFinanceModal';
import NewQuoteModal from './components/NewQuoteModal';
import ClientDetailView from './components/ClientDetailView';
import QuoteDetailView from './components/QuoteDetailView';
import BottomNav from './components/BottomNav';
import MobileFab from './components/MobileFab';
import {
  INITIAL_CLIENTS,
  INITIAL_INVOICES,
  INITIAL_QUOTES,
} from './data/mockData';
import { Check, X } from 'lucide-react';

const STORAGE_KEY_AUTH = 'gruta_auth_user';
const STORAGE_KEY_CLIENTS = 'gruta_clients_data';
const STORAGE_KEY_INVOICES = 'gruta_invoices_data';
const STORAGE_KEY_QUOTES = 'gruta_quotes_data';

export default function App() {
  // 1. Authentication State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 2. Clients, Invoices and Quotations State
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLIENTS);
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INVOICES);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [quotes, setQuotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUOTES);
      return saved ? JSON.parse(saved) : INITIAL_QUOTES;
    } catch {
      return INITIAL_QUOTES;
    }
  });

  // LocalStorage sync
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(quotes));
  }, [quotes]);

  // 3. Navigation State with View Transitions API (Modern Web Guidance)
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'quotes' | 'crm' | 'finances'
  const [previousView, setPreviousView] = useState('quotes');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (view) => {
    const update = () => {
      setSelectedQuoteForDetail(null);
      setSelectedClientForDetail(null);
      setActiveView(view);
      window.scrollTo(0, 0);
    };

    if (!document.startViewTransition) {
      update();
    } else {
      document.startViewTransition(update);
    }
  };

  // 4. Modals and Detail Views State
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isNewFinanceOpen, setIsNewFinanceOpen] = useState(false);
  const [isNewQuoteOpen, setIsNewQuoteOpen] = useState(false);
  const [selectedClientForDetail, setSelectedClientForDetail] = useState(null);
  const [selectedQuoteForDetail, setSelectedQuoteForDetail] = useState(null);
  const [initialClientForFinance, setInitialClientForFinance] = useState(null);

  // Transition Handlers for Full-Screen Instant Views
  const handleSelectQuote = (quote, fromView = activeView) => {
    setPreviousView(fromView);
    const update = () => {
      setSelectedQuoteForDetail(quote);
      setSelectedClientForDetail(null);
      window.scrollTo(0, 0);
    };

    if (!document.startViewTransition) {
      update();
    } else {
      document.startViewTransition(update);
    }
  };

  const handleBackFromQuote = () => {
    const update = () => {
      setSelectedQuoteForDetail(null);
      if (previousView) {
        setActiveView(previousView);
      }
    };

    if (!document.startViewTransition) {
      update();
    } else {
      document.startViewTransition(update);
    }
  };

  const handleSelectClient = (client, fromView = activeView) => {
    setPreviousView(fromView);
    const update = () => {
      setSelectedClientForDetail(client);
      setSelectedQuoteForDetail(null);
      window.scrollTo(0, 0);
    };

    if (!document.startViewTransition) {
      update();
    } else {
      document.startViewTransition(update);
    }
  };

  const handleBackFromClient = () => {
    const update = () => {
      setSelectedClientForDetail(null);
      if (previousView) {
        setActiveView(previousView);
      }
    };

    if (!document.startViewTransition) {
      update();
    } else {
      document.startViewTransition(update);
    }
  };

  // 5. Toast Feedback State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers: Authentication
  const handleLogin = (userData) => {
    setUser(userData);
    showToast(`Bienvenido a Maestranza La Gruta, ${userData.name}`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  };

  // Handlers: CRM Clients
  const handleAddClient = (newClient) => {
    setClients((prev) => [newClient, ...prev]);
    showToast(`Cliente "${newClient.company}" registrado`);
  };

  // Handlers: Quotations
  const handleAddQuote = (newQuote) => {
    setQuotes((prev) => [newQuote, ...prev]);
    showToast(`Cotización ${newQuote.folio} creada exitosamente`);
  };

  const handleSendQuoteEmail = (quoteId, targetEmail) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteId) {
          return { ...q, status: 'Enviada al Cliente', email: targetEmail };
        }
        return q;
      })
    );
    if (selectedQuoteForDetail && selectedQuoteForDetail.id === quoteId) {
      setSelectedQuoteForDetail((prev) => ({
        ...prev,
        status: 'Enviada al Cliente',
        email: targetEmail,
      }));
    }
    showToast(`Cotización enviada con éxito a ${targetEmail}`);
  };

  const handleAddFileToQuote = (quoteId, newFile) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteId) {
          return {
            ...q,
            files: [...(q.files || []), newFile],
          };
        }
        return q;
      })
    );
    // Also update selected modal if active
    if (selectedQuoteForDetail && selectedQuoteForDetail.id === quoteId) {
      setSelectedQuoteForDetail((prev) => ({
        ...prev,
        files: [...(prev.files || []), newFile],
      }));
    }
    showToast(`Archivo "${newFile.name}" adjuntado a la cotización`);
  };

  const handleRemoveFileFromQuote = (quoteId, fileName) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteId) {
          return {
            ...q,
            files: (q.files || []).filter((f) => f.name !== fileName),
          };
        }
        return q;
      })
    );
    if (selectedQuoteForDetail && selectedQuoteForDetail.id === quoteId) {
      setSelectedQuoteForDetail((prev) => ({
        ...prev,
        files: (prev.files || []).filter((f) => f.name !== fileName),
      }));
    }
    showToast('Archivo eliminado de la cotización');
  };

  // Handlers: Finances
  const handleAddInvoice = (newInvoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);
    showToast(`Documento ${newInvoice.folio} emitido`);
  };

  const handleMarkAsPaid = (invoiceId) => {
    const today = new Date().toISOString().split('T')[0];
    let markedFolio = '';

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          markedFolio = inv.folio;
          return {
            ...inv,
            status: 'Pagado',
            paidDate: today,
          };
        }
        return inv;
      })
    );

    showToast(`Factura ${markedFolio} liquidada como Pagada`);
  };

  const pendingInvoicesCount = useMemo(() => {
    return invoices.filter((i) => i.status === 'Pendiente' || i.status === 'Atrasado').length;
  }, [invoices]);

  // If user is not logged in, render the clean Login view
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-5 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700/60 animate-in fade-in slide-in-from-bottom-2 duration-200 no-print">
          <div className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Sidebar Navigation (Desktop) */}
      <div className="no-print">
        <Sidebar
          activeView={activeView}
          setActiveView={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
          user={user}
          onLogout={handleLogout}
          counts={{
            clients: clients.length,
            quotes: quotes.length,
            pendingInvoices: pendingInvoicesCount,
          }}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-68'
        }`}
      >
        {/* Top Header */}
        <Header
          activeView={activeView}
          selectedQuote={selectedQuoteForDetail}
          selectedClient={selectedClientForDetail}
          onBack={
            selectedQuoteForDetail
              ? handleBackFromQuote
              : selectedClientForDetail
              ? handleBackFromClient
              : null
          }
          setIsMobileOpen={setIsMobileMenuOpen}
          onOpenNewQuote={() => setIsNewQuoteOpen(true)}
          onOpenNewFinance={() => {
            setInitialClientForFinance(null);
            setIsNewFinanceOpen(true);
          }}
          pendingCount={pendingInvoicesCount}
          user={user}
          onLogout={handleLogout}
        />

        {/* View Router */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-28 lg:pb-8">
          {selectedQuoteForDetail ? (
            <QuoteDetailView
              quote={selectedQuoteForDetail}
              onBack={handleBackFromQuote}
              onSendEmail={handleSendQuoteEmail}
              onAddFileToQuote={handleAddFileToQuote}
              onRemoveFileFromQuote={handleRemoveFileFromQuote}
            />
          ) : selectedClientForDetail ? (
            <ClientDetailView
              client={selectedClientForDetail}
              quotes={quotes}
              invoices={invoices}
              onBack={handleBackFromClient}
              onOpenNewQuoteForClient={(client) => {
                setIsNewQuoteOpen(true);
              }}
              onOpenNewFinanceForClient={(client) => {
                setInitialClientForFinance(client);
                setIsNewFinanceOpen(true);
              }}
              onSelectQuote={(quote) => handleSelectQuote(quote, 'crm')}
              onMarkAsPaid={handleMarkAsPaid}
            />
          ) : (
            <>
              {activeView === 'dashboard' && (
                <DashboardView
                  invoices={invoices}
                  clients={clients}
                  quotes={quotes}
                  onNavigateToQuotes={() => handleNavigate('quotes')}
                  onNavigateToFinances={() => handleNavigate('finances')}
                  onNavigateToClients={() => handleNavigate('crm')}
                  onSelectQuote={(quote) => handleSelectQuote(quote, 'dashboard')}
                  onOpenNewQuote={() => setIsNewQuoteOpen(true)}
                />
              )}

              {activeView === 'quotes' && (
                <QuotesView
                  quotes={quotes}
                  onOpenNewQuote={() => setIsNewQuoteOpen(true)}
                  onSelectQuote={(quote) => handleSelectQuote(quote, 'quotes')}
                />
              )}

              {activeView === 'crm' && (
                <ClientsView
                  clients={clients}
                  onOpenNewClient={() => setIsNewClientOpen(true)}
                  onSelectClient={(client) => handleSelectClient(client, 'crm')}
                />
              )}

              {activeView === 'finances' && (
                <FinanceView
                  invoices={invoices}
                  onOpenNewFinance={() => {
                    setInitialClientForFinance(null);
                    setIsNewFinanceOpen(true);
                  }}
                  onMarkAsPaid={handleMarkAsPaid}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Native Bottom Navigation Bar for Mobile */}
      <BottomNav
        activeView={activeView}
        onNavigate={handleNavigate}
        counts={{
          quotes: quotes.length,
          clients: clients.length,
          pendingInvoices: pendingInvoicesCount,
        }}
      />

      {/* Mobile Floating Action Button (FAB) & Quick Actions */}
      {!selectedQuoteForDetail && !selectedClientForDetail && (
        <MobileFab
          onOpenNewQuote={() => setIsNewQuoteOpen(true)}
          onOpenNewClient={() => setIsNewClientOpen(true)}
          onOpenNewFinance={() => {
            setInitialClientForFinance(null);
            setIsNewFinanceOpen(true);
          }}
        />
      )}

      {/* Modal: New Client */}
      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
        onAddClient={handleAddClient}
      />

      {/* Modal: New Quote (Formal Proposal) */}
      <NewQuoteModal
        isOpen={isNewQuoteOpen}
        onClose={() => setIsNewQuoteOpen(false)}
        clients={clients}
        onAddQuote={handleAddQuote}
      />

      {/* Modal: New Finance / Invoice */}
      <NewFinanceModal
        isOpen={isNewFinanceOpen}
        onClose={() => setIsNewFinanceOpen(false)}
        clients={clients}
        onAddInvoice={handleAddInvoice}
        initialClient={initialClientForFinance}
      />
    </div>
  );
}
