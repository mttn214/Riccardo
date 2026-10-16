import React from 'react';
import { useAdminStore } from '../../hooks/useAdminStore';
import { formatPrice } from '../../utils/currency';
import {
  Users,
  GraduationCap,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Calendar,
  AlertCircle,
  Plus,
  ShieldCheck,
  Building2,
  Search,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface AdminDashboardTabProps {
  onNavigateTab: (tab: 'courses' | 'participants' | 'portfolio' | 'inquiries' | 'settings') => void;
  onOpenAddCourse: () => void;
  onOpenAddParticipant: () => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  onNavigateTab,
  onOpenAddCourse,
  onOpenAddParticipant,
}) => {
  const { seminars, participants, inquiries, portfolio, auditLogs } = useAdminStore();

  // Metrics calculation
  const totalSeminars = seminars.length;
  const totalSeats = seminars.reduce((acc, s) => acc + s.totalSeats, 0);
  const availableSeats = seminars.reduce((acc, s) => acc + s.availableSeats, 0);
  const occupiedSeats = totalSeats - availableSeats;
  const occupancyRate = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  const totalRevenue = participants.reduce((acc, p) => acc + (p.amountPaidEUR || 0), 0);
  const totalOutstanding = participants.reduce((acc, p) => acc + (p.amountRemainingEUR || 0), 0);
  const checkedInCount = participants.filter((p) => p.checkedIn).length;

  const unreadInquiries = inquiries.filter((i) => i.status === 'unread').length;
  const recentParticipants = [...participants].slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Welcome & Quick Actions - Seamless without border lines */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Prehľad akadémie & salónu
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Riadiace centrum pre vzdelávacie semináre, účastníkov a tvorbu Richarda Čonku.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenAddParticipant}
            className="px-4 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-400" />
            <span>Zapísať účastníka</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddCourse}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-all active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nový seminár</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards - Seamless tonal elevation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Tržby */}
        <div className="p-5 rounded-3xl bg-zinc-900/40 space-y-3 relative overflow-hidden transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium">Uhradené tržby</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
              {formatPrice(totalRevenue, 'EUR')}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 flex items-center justify-between">
              <span>Zostáva doplatiť na mieste:</span>
              <strong className="text-zinc-300 font-mono">{formatPrice(totalOutstanding, 'EUR')}</strong>
            </div>
          </div>
          <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-700"
              style={{
                width: `${totalRevenue + totalOutstanding > 0 ? (totalRevenue / (totalRevenue + totalOutstanding)) * 100 : 0}%`
              }}
            />
          </div>
        </div>

        {/* 2. Zaregistrovaní účastníci */}
        <div className="p-5 rounded-3xl bg-zinc-900/40 space-y-3 relative overflow-hidden transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium">Registrovaní účastníci</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
              {participants.length} <span className="text-sm font-normal text-zinc-500">kaderníkov</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 flex items-center justify-between">
              <span>Skontrolovaná prezenčka:</span>
              <strong className="text-blue-400 font-mono">{checkedInCount} prítomných</strong>
            </div>
          </div>
          <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${participants.length > 0 ? (checkedInCount / participants.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* 3. Obsadenosť kurzov */}
        <div className="p-5 rounded-3xl bg-zinc-900/40 space-y-3 relative overflow-hidden transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium">Obsadenosť kapacít</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
              {occupancyRate}%
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 flex items-center justify-between">
              <span>Voľné miesta spolu:</span>
              <strong className="text-amber-400 font-mono">{availableSeats} z {totalSeats}</strong>
            </div>
          </div>
          <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* 4. Dopyty & Správy */}
        <div
          onClick={() => onNavigateTab('inquiries')}
          className="p-5 rounded-3xl bg-zinc-900/40 space-y-3 relative overflow-hidden transition-all cursor-pointer hover:bg-zinc-900/60"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium">Dopyty & Waitlist</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
              <span>{inquiries.length}</span>
              {unreadInquiries > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 font-mono font-medium">
                  {unreadInquiries} nové
                </span>
              )}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 flex items-center justify-between">
              <span>Fotografie v galérii:</span>
              <strong className="text-zinc-300 font-mono">{portfolio.length} diel</strong>
            </div>
          </div>
          <div className="text-[11px] text-purple-400 font-medium flex items-center gap-1">
            <span>Zobraziť správy</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Active Seminars & Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active Seminars Status */}
        <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-white" />
              <h3 className="text-sm font-semibold text-white">Stav vzdelávacích kurzov</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('courses')}
              className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Všetky kurzy ({totalSeminars})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {seminars.map((seminar) => {
              const semOccupied = seminar.totalSeats - seminar.availableSeats;
              const semRate = seminar.totalSeats > 0 ? Math.round((semOccupied / seminar.totalSeats) * 100) : 0;
              const isSoldOut = seminar.availableSeats === 0;

              return (
                <div
                  key={seminar.id}
                  className="p-4 rounded-2xl bg-zinc-950/60 space-y-2.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-semibold text-white leading-tight">
                        {seminar.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1 font-mono">
                        <span className="text-zinc-300">{seminar.city}</span>
                        <span>•</span>
                        <span>{seminar.dates}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        isSoldOut
                          ? 'bg-red-500/10 text-red-400'
                          : seminar.availableSeats <= 2
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {isSoldOut ? 'Vypredané' : `Voľné ${seminar.availableSeats} m.`}
                    </span>
                  </div>

                  {/* Seat Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                      <span>Obsadené {semOccupied} z {seminar.totalSeats} miest</span>
                      <span>{semRate}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSoldOut ? 'bg-red-400' : semRate >= 80 ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${semRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recent Registrations Feed */}
        <div className="p-6 rounded-3xl bg-zinc-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-white" />
              <h3 className="text-sm font-semibold text-white">Posledné rezervácie účastníkov</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('participants')}
              className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Zoznam účastníkov ({participants.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {recentParticipants.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 font-mono">
                Zatiaľ žiadne záznamy účastníkov.
              </div>
            ) : (
              recentParticipants.map((part) => (
                <div
                  key={part.id}
                  className="p-3.5 rounded-2xl bg-zinc-950/60 flex items-center justify-between gap-3 transition-all"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white truncate">
                        {part.fullName}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                        {part.ticketCode}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {part.salonName ? `${part.salonName} (${part.city})` : part.email}
                    </div>

                    <div className="text-[10px] text-zinc-500 mt-1 font-mono truncate">
                      {part.seminarTitle.slice(0, 36)}...
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold font-mono text-white">
                      {part.amountPaidEUR} €
                    </div>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full inline-block mt-1 ${
                        part.paymentStatus.includes('Plná suma')
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : part.paymentStatus.includes('záloha')
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {part.paymentStatus.includes('Plná suma')
                        ? 'Zaplatené'
                        : part.paymentStatus.includes('záloha')
                        ? 'Záloha'
                        : 'Prevod'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* System Security & Operator Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Prevádzkovateľ systému: <strong>ZETEREM s.r.o.</strong> • IČO: 47 520 817 • DIČ: 2023950863
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">
          Oficiálny systém certifikácie Hairstylist Riccardo
        </span>
      </div>
    </div>
  );
};
