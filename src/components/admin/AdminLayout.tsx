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
  ChevronRight,
  Sun,
  Moon,
  Camera
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminTheme } from '../../context/AdminThemeContext';
import { AdminQRScannerModal } from './AdminQRScannerModal';

type AdminTab = 'dashboard' | 'courses' | 'participants' | 'portfolio' | 'inquiries' | 'settings';

export const AdminLayout: React.FC = () => {
  const { theme, toggleTheme } = useAdminTheme();
  const { seminars, participants, inquiries, portfolio, store } = useAdminStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeUser = store.getActiveUser();

  // Modals state
  const [isAddSeminarOpen, setIsAddSeminarOpen] = useState(false);
  const [seminarToEdit, setSeminarToEdit] = useState<Seminar | null>(null);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [participantFilterSeminarId, setParticipantFilterSeminarId] = useState<string | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

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
    <div className={`min-h-screen flex font-sans selection:bg-white selection:text-black transition-colors duration-200 ${theme === 'light' ? 'admin-theme-light bg-[#f8f9fa] text-zinc-900' : 'admin-theme-dark bg-black text-zinc-100'}`}>
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-zinc-950/90 p-5 shrink-0 h-screen sticky top-0">
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-mono uppercase text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Portál</span>
            </div>
            <div className="flex items-center gap-3 pt-0.5">
              <img
                src="/images/riccardo/official_logo_dark_square.png"
                alt="Hair Salon Riccardo"
                className="w-10 h-10 rounded-full object-contain bg-zinc-950 p-0.5 border border-zinc-800 shadow-md shrink-0"
              />
              <div className="min-w-0">
                <h2 className="text-xs font-bold tracking-wider text-white uppercase block leading-tight truncate">
                  RICCARDO
                </h2>
                <p className="text-[10px] text-zinc-400 truncate">
                  Hair Salon & Academy
                </p>
                <p className="text-[9px] text-zinc-500 font-mono truncate">
                  {COMPANY_DETAILS.legalName}
                </p>
              </div>
            </div>
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
                      ? 'bg-white/10 text-white font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300">
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

        {/* Active Logged-in User Badge */}
        <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center shrink-0">
              {activeUser.name.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{activeUser.name}</p>
              <p className="text-[10px] text-zinc-400 font-mono truncate">{activeUser.email}</p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
            <span className="truncate">{activeUser.roleTitle}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Aktívna relácia" />
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="w-full py-2.5 px-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-between transition-colors"
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
            className="w-full py-2.5 px-3 rounded-xl bg-zinc-900/40 hover:bg-red-950/40 text-zinc-400 hover:text-red-300 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Odhlásiť sa</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-zinc-950/70 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 hidden sm:inline">
              Administrácia • {COMPANY_DETAILS.legalName}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick QR Check-in trigger */}
            <button
              type="button"
              onClick={() => setIsQRScannerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
              title="Otvoriť QR Skener prezenčnej kontroly"
            >
              <Camera className="w-3.5 h-3.5 text-black" />
              <span className="hidden sm:inline">QR Check-in</span>
            </button>

            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Relácia aktívna</span>
            </span>

            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-zinc-200/80 hover:bg-zinc-300 text-zinc-900 shadow-sm'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white'
              }`}
              title={theme === 'light' ? 'Prepnúť do tmavého režimu' : 'Prepnúť do svetlého režimu'}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-zinc-700" />
                  <span className="text-[11px] font-medium hidden sm:inline">Tmavý</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-medium hidden sm:inline">Svetlý</span>
                </>
              )}
            </button>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Verejný web</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Odhlásiť sa"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-zinc-950 p-4 space-y-2">
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

      {/* QR Scanner & Check-in Modal */}
      <AdminQRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />
    </div>
  );
};
