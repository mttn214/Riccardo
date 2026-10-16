import React, { useState } from 'react';
import { useAdminStore } from '../../hooks/useAdminStore';
import { COMPANY_DETAILS } from '../../data/content';
import { AdminDashboardTab } from './AdminDashboardTab';
import { AdminCoursesTab } from './AdminCoursesTab';
import { AdminParticipantsTab } from './AdminParticipantsTab';
import { AdminPortfolioTab } from './AdminPortfolioTab';
import { AdminInquiriesTab } from './AdminInquiriesTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminSeminarModal } from './AdminSeminarModal';
import { AdminAddParticipantModal } from './AdminAddParticipantModal';
import { Seminar } from '../../data/content';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Image,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Plus,
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

type AdminTab = 'dashboard' | 'courses' | 'participants' | 'portfolio' | 'inquiries' | 'settings';

export const AdminLayout: React.FC = () => {
  const { seminars, participants, inquiries, portfolio, store } = useAdminStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isAddSeminarOpen, setIsAddSeminarOpen] = useState(false);
  const [seminarToEdit, setSeminarToEdit] = useState<Seminar | null>(null);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [participantFilterSeminarId, setParticipantFilterSeminarId] = useState<string | null>(null);

  const unreadInquiries = inquiries.filter((i) => i.status === 'unread').length;

  const handleEditSeminar = (seminar: Seminar) => {
    setSeminarToEdit(seminar);
    setIsAddSeminarOpen(true);
  };

  const handleViewParticipants = (seminarId: string) => {
    setParticipantFilterSeminarId(seminarId);
    setActiveTab('participants');
  };

  const handleLogout = () => {
    store.logout();
  };

  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Prehľad',
      icon: LayoutDashboard,
    },
    {
      id: 'courses' as AdminTab,
      label: 'Kurzy & Semináre',
      icon: GraduationCap,
      count: seminars.length,
    },
    {
      id: 'participants' as AdminTab,
      label: 'Zoznam účastníkov',
      icon: Users,
      count: participants.length,
    },
    {
      id: 'portfolio' as AdminTab,
      label: 'Galéria & Fotky',
      icon: Image,
      count: portfolio.length,
    },
    {
      id: 'inquiries' as AdminTab,
      label: 'Dopyty & Správy',
      icon: MessageSquare,
      badge: unreadInquiries > 0 ? unreadInquiries : undefined,
    },
    {
      id: 'settings' as AdminTab,
      label: 'Bezpečnosť & Nastavenia',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex font-sans selection:bg-white selection:text-black">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-zinc-950 border-r border-zinc-850 p-5 shrink-0 h-screen sticky top-0">
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono uppercase text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Portál</span>
            </div>
            <h2 className="text-sm font-semibold tracking-tight text-white uppercase block pt-1">
              HAIR SALON <span className="font-extrabold">RICCARDO</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono">
              {COMPANY_DETAILS.legalName}
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'participants') {
                      setParticipantFilterSeminarId(null);
                    }
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-850 text-white font-semibold shadow-md ring-1 ring-white/10'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300">
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && !item.badge && (
                    <span className="text-[10px] font-mono text-zinc-500">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-zinc-850/80 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span>Zobraziť web</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-zinc-900/50 hover:bg-red-950/40 border border-zinc-850 hover:border-red-500/30 text-zinc-400 hover:text-red-300 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Odhlásiť sa</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-zinc-950/90 border-b border-zinc-850 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 hidden sm:inline">
              Administrácia • {COMPANY_DETAILS.legalName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Relácia aktívna</span>
            </span>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Verejný web</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Odhlásiť sa"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-zinc-950 border-b border-zinc-850 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                    if (item.id === 'participants') {
                      setParticipantFilterSeminarId(null);
                    }
                  }}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-between ${
                    isActive ? 'bg-zinc-850 text-white font-semibold' : 'text-zinc-400 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900 text-purple-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Tab Content Body */}
        <main className="p-4 sm:p-8 flex-1">
          {activeTab === 'dashboard' && (
            <AdminDashboardTab
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAddCourse={() => {
                setSeminarToEdit(null);
                setIsAddSeminarOpen(true);
              }}
              onOpenAddParticipant={() => setIsAddParticipantOpen(true)}
            />
          )}

          {activeTab === 'courses' && (
            <AdminCoursesTab
              onOpenAddModal={() => {
                setSeminarToEdit(null);
                setIsAddSeminarOpen(true);
              }}
              onEditSeminar={handleEditSeminar}
              onViewParticipants={handleViewParticipants}
            />
          )}

          {activeTab === 'participants' && (
            <AdminParticipantsTab
              initialSeminarId={participantFilterSeminarId}
              onOpenAddModal={() => setIsAddParticipantOpen(true)}
            />
          )}

          {activeTab === 'portfolio' && <AdminPortfolioTab />}

          {activeTab === 'inquiries' && <AdminInquiriesTab />}

          {activeTab === 'settings' && <AdminSettingsTab />}
        </main>
      </div>

      {/* Seminar Add/Edit Modal */}
      <AdminSeminarModal
        isOpen={isAddSeminarOpen}
        onClose={() => {
          setIsAddSeminarOpen(false);
          setSeminarToEdit(null);
        }}
        seminarToEdit={seminarToEdit}
      />

      {/* Participant Add Modal */}
      <AdminAddParticipantModal
        isOpen={isAddParticipantOpen}
        onClose={() => setIsAddParticipantOpen(false)}
        defaultSeminarId={participantFilterSeminarId || seminars[0]?.id}
      />
    </div>
  );
};
