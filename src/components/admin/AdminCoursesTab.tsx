import React, { useState } from 'react';
import { useAdminStore } from '../../hooks/useAdminStore';
import { Seminar, TicketTier } from '../../data/content';
import { formatPrice } from '../../utils/currency';
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Eye,
  Clock,
  Tag,
  DollarSign,
  ChevronDown,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AdminCoursesTabProps {
  onOpenAddModal: () => void;
  onEditSeminar: (seminar: Seminar) => void;
  onViewParticipants: (seminarId: string) => void;
}

export const AdminCoursesTab: React.FC<AdminCoursesTabProps> = ({
  onOpenAddModal,
  onEditSeminar,
  onViewParticipants,
}) => {
  const { seminars, participants, store } = useAdminStore();
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const cities = Array.from(new Set(seminars.map((s) => s.city)));

  const filteredSeminars = seminars.filter((s) => {
    if (selectedCity !== 'all' && s.city !== selectedCity) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    store.deleteSeminar(id);
    setDeleteConfirmId(null);
  };

  const handleSeatAdjust = (seminarId: string, delta: number) => {
    store.updateAvailableSeats(seminarId, delta);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-850">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Správa seminárov & kurzov
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Vytvárajte nové termíny, upravujte kapacity miest, ceny balíčkov a obsah výučby.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* City Filter */}
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-zinc-500 appearance-none cursor-pointer"
            >
              <option value="all">Všetky mestá ({seminars.length})</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-all active:scale-95 shadow-lg flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Pridať nový kurz</span>
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSeminars.map((seminar) => {
          const semParticipants = participants.filter((p) => p.seminarId === seminar.id);
          const occupied = seminar.totalSeats - seminar.availableSeats;
          const isSoldOut = seminar.availableSeats === 0;
          const minPrice = Math.min(...seminar.tiers.map((t) => t.priceEUR));

          return (
            <div
              key={seminar.id}
              className="rounded-3xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-all flex flex-col justify-between overflow-hidden group shadow-xl"
            >
              {/* Image & Badges */}
              <div className="relative h-44 overflow-hidden bg-zinc-900">
                <img
                  src={seminar.image}
                  alt={seminar.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-zinc-200 backdrop-blur-md">
                    {seminar.category}
                  </span>

                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full backdrop-blur-md ${
                      isSoldOut
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : seminar.availableSeats <= 2
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {isSoldOut ? 'Vypredané' : `${seminar.availableSeats} voľných miest`}
                  </span>
                </div>

                {/* Bottom info on image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{seminar.city}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{seminar.dates}</span>
                  </div>
                </div>
              </div>

              {/* Seminar Body */}
              <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-white leading-snug group-hover:text-zinc-200 transition-colors">
                    {seminar.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {seminar.description}
                  </p>
                </div>

                {/* Seats and Occupancy Gauge */}
                <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-850/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-zinc-400 font-mono text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Obsadenosť:</span>
                    </span>
                    <strong className="text-white">
                      {occupied} / {seminar.totalSeats} ({semParticipants.length} prihlásených)
                    </strong>
                  </div>

                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSoldOut ? 'bg-red-400' : 'bg-emerald-400'
                      }`}
                      style={{
                        width: `${seminar.totalSeats > 0 ? (occupied / seminar.totalSeats) * 100 : 0}%`,
                      }}
                    />
                  </div>

                  {/* Seat Adjuster Buttons */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500">
                    <span>Rýchla úprava voľných miest:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSeatAdjust(seminar.id, -1)}
                        disabled={seminar.availableSeats <= 0}
                        title="Znížiť voľné miesta"
                        className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40 flex items-center justify-center font-mono font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono text-white font-bold">
                        {seminar.availableSeats}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSeatAdjust(seminar.id, 1)}
                        disabled={seminar.availableSeats >= seminar.totalSeats}
                        title="Zvýšiť voľné miesta"
                        className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40 flex items-center justify-center font-mono font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price and Tiers */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-850/80">
                  <div className="text-zinc-400">
                    Cena od: <strong className="text-white font-mono text-sm">{minPrice} €</strong>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {seminar.tiers.length} {seminar.tiers.length === 1 ? 'balíček' : 'balíčky'}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-zinc-900/50 border-t border-zinc-850 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onViewParticipants(seminar.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Účastníci ({semParticipants.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEditSeminar(seminar)}
                  className="p-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Upraviť seminár"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(seminar.id)}
                  className="p-2 rounded-xl bg-zinc-850 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Odstrániť seminár"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-zinc-800 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-semibold text-white">Odstrániť seminár?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Naozaj si želáte natrvalo odstrániť tento vzdelávací kurz? Táto akcia je nevratná.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Zrušiť
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Potvrdiť vymazanie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
