import React, { useState } from 'react';
import { useAdminStore } from '../../hooks/useAdminStore';
import { Participant } from '../../services/adminStore';
import { formatPrice } from '../../utils/currency';
import {
  Users,
  Search,
  Filter,
  Download,
  Printer,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Phone,
  Mail,
  Building2,
  Calendar,
  FileText,
  CreditCard,
  Edit,
  Trash2,
  ChevronDown,
  UserCheck,
  UserX,
  Sparkles,
  ShieldCheck,
  X,
  Camera,
  Banknote,
  FileDown,
  Loader2
} from 'lucide-react';
import { generateLuxuryTicketPDF } from '../../services/ticketService';
import { AdminQRScannerModal } from './AdminQRScannerModal';

interface AdminParticipantsTabProps {
  initialSeminarId?: string | null;
  onOpenAddModal: () => void;
}

export const AdminParticipantsTab: React.FC<AdminParticipantsTabProps> = ({
  initialSeminarId,
  onOpenAddModal,
}) => {
  const { participants, seminars, store } = useAdminStore();
  const [selectedSeminarId, setSelectedSeminarId] = useState<string>(initialSeminarId || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  // Active seminar object if specific seminar selected
  const activeSeminar = seminars.find((s) => s.id === selectedSeminarId);

  // Filter participants
  const filteredParticipants = participants.filter((p) => {
    // Seminar filter
    if (selectedSeminarId !== 'all' && p.seminarId !== selectedSeminarId) {
      return false;
    }

    // Status filter
    if (statusFilter === 'full' && !p.paymentStatus.includes('Plná suma')) return false;
    if (statusFilter === 'deposit' && !p.paymentStatus.includes('záloha')) return false;
    if (statusFilter === 'due' && (p.amountRemainingEUR || 0) <= 0) return false;
    if (statusFilter === 'transfer' && !p.paymentStatus.includes('prevod')) return false;
    if (statusFilter === 'checkedIn' && !p.checkedIn) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.fullName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        (p.salonName && p.salonName.toLowerCase().includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        p.ticketCode.toLowerCase().includes(q) ||
        p.seminarTitle.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Calculate statistics for the filtered list
  const totalRevenue = filteredParticipants.reduce((acc, p) => acc + (p.amountPaidEUR || 0), 0);
  const totalOutstanding = filteredParticipants.reduce((acc, p) => acc + (p.amountRemainingEUR || 0), 0);
  const checkedInCount = filteredParticipants.filter((p) => p.checkedIn).length;

  // Toggle check-in status
  const handleToggleCheckIn = (participantId: string) => {
    const updated = store.toggleCheckIn(participantId);
    if (selectedParticipant && selectedParticipant.id === participantId) {
      setSelectedParticipant({
        ...selectedParticipant,
        checkedIn: updated,
        checkedInAt: updated ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined
      });
    }
  };

  // Save internal notes
  const handleSaveInternalNotes = () => {
    if (!selectedParticipant) return;
    const updated = { ...selectedParticipant, internalNotes: editingNotes };
    store.updateParticipant(updated);
    setSelectedParticipant(updated);
    setIsEditingNotes(false);
  };

  // Download Luxury PDF Ticket for participant
  const handleDownloadTicketPDF = async (part: Participant) => {
    setIsGeneratingPDF(true);
    try {
      await generateLuxuryTicketPDF({
        confirmationCode: part.ticketCode,
        seminarTitle: part.seminarTitle,
        dates: part.seminarDates,
        city: part.seminarCity,
        venue: 'Atelier Hair Salon Riccardo, Lučenec',
        attendeeName: part.fullName,
        salonName: part.salonName,
        email: part.email,
        tierName: part.tierName,
        amountPaidEUR: part.amountPaidEUR,
        paymentMethod: part.paymentMethod,
        paymentStatus: part.paymentStatus
      });
    } catch (err) {
      console.error('Failed to generate PDF ticket:', err);
      alert('Chyba pri generovaní PDF vstupenky.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Settle balance in drawer with Supabase sync
  const handleSettleBalanceInDrawer = (part: Participant) => {
    const remaining = part.amountRemainingEUR || 280;
    if (window.confirm(`Označiť doplatok ${remaining} € ako prijatý na mieste pre účastníka ${part.fullName}? Údaj sa okamžite zapíše do Supabase cloudu.`)) {
      store.settleBalance(part.id, 'Hotovosť na mieste');
      const updated = {
        ...part,
        amountPaidEUR: part.tierPriceEUR || 380,
        amountRemainingEUR: 0,
        paymentStatus: 'Uhradené (Plná suma - doplatok na mieste)' as any,
        paymentMethod: 'Hotovosť na mieste'
      };
      setSelectedParticipant(updated);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Kód vstupenky',
      'Meno a priezvisko',
      'Email',
      'Telefón',
      'Salón',
      'Mesto',
      'Prax',
      'Názov seminára',
      'Termín',
      'Balíček',
      'Platobná metóda',
      'Stav platby',
      'Uhradené (€)',
      'Zostáva doplatiť (€)',
      'Stripe Payment Intent ID',
      'Prítomný na kurze',
      'Dátum registrácie',
      'Fakturačný subjekt',
      'IČO',
      'DIČ',
      'Poznámka'
    ];

    const rows = filteredParticipants.map((p) => [
      `"${p.ticketCode}"`,
      `"${p.fullName}"`,
      `"${p.email}"`,
      `"${p.phone}"`,
      `"${p.salonName || ''}"`,
      `"${p.city || ''}"`,
      `"${p.experience || ''}"`,
      `"${p.seminarTitle}"`,
      `"${p.seminarDates}"`,
      `"${p.tierName}"`,
      `"${p.paymentMethod}"`,
      `"${p.paymentStatus}"`,
      p.amountPaidEUR,
      p.amountRemainingEUR,
      `"${p.stripePaymentIntentId || ''}"`,
      p.checkedIn ? 'Áno' : 'Nie',
      `"${p.registeredAt}"`,
      `"${p.companyName || ''}"`,
      `"${p.ico || ''}"`,
      `"${p.dic || ''}"`,
      `"${(p.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `riccardo_ucastnici_${selectedSeminarId}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print attendance sheet
  const handlePrintSheet = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-850">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Zoznam účastníkov kurzov
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Prehľad prihlásených kaderníkov na jednotlivé masterclassy, prezenčná listina a platobné stavy.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsQRScannerOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all active:scale-95 shadow-lg flex items-center gap-1.5 cursor-pointer"
            title="Otvoriť QR Skener a overenie vstupeniek"
          >
            <Camera className="w-4 h-4 text-black" />
            <span>QR Skener & Check-in</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Exportovať do CSV / Excelu"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrintSheet}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Vytlačiť prezenčnú listinu"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span>Tlač prezenčky</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-all active:scale-95 shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Zapísať účastníka</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar - Borderless & Seamless */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-zinc-900/40 p-4 rounded-3xl">
        {/* Seminar Select */}
        <div className="sm:col-span-5 relative">
          <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
            Výber seminára
          </label>
          <div className="relative">
            <select
              value={selectedSeminarId}
              onChange={(e) => setSelectedSeminarId(e.target.value)}
              className="w-full bg-zinc-950/80 text-zinc-200 text-xs rounded-xl p-2.5 pr-8 focus:outline-none appearance-none cursor-pointer font-medium border-0"
            >
              <option value="all">Všetky semináre ({participants.length} účastníkov)</option>
              {seminars.map((s) => {
                const count = participants.filter((p) => p.seminarId === s.id).length;
                return (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.city}) — {count}/{s.totalSeats}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
            Stav úhrady / Účasť
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-zinc-950/80 text-zinc-200 text-xs rounded-xl p-2.5 focus:outline-none cursor-pointer border-0"
          >
            <option value="all">Všetky stavy ({filteredParticipants.length})</option>
            <option value="full">Plne uhradené</option>
            <option value="deposit">Uhradená záloha (100 €)</option>
            <option value="due">Iba doplatky na mieste (280 €)</option>
            <option value="transfer">Čaká na prevod / faktúru</option>
            <option value="checkedIn">Prítomní na kurze</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="sm:col-span-4">
          <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
            Vyhľadávanie účastníka
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="Meno, email, salón, kód..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/80 text-white pl-9 pr-3 py-2.5 rounded-xl text-xs focus:ring-1 focus:ring-white/20 outline-none transition-colors border-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Metrics Bar for Selected Seminar / Filter */}
      <div className="p-4 rounded-3xl bg-zinc-900/40 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <span className="text-zinc-500 block text-[10px]">Vybraných:</span>
            <strong className="text-white text-sm">{filteredParticipants.length} účastníkov</strong>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px]">Uhradené tržby:</span>
            <strong className="text-emerald-400 text-sm">{formatPrice(totalRevenue, 'EUR')}</strong>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px]">Doplatok na mieste:</span>
            <strong className="text-zinc-300 text-sm">{formatPrice(totalOutstanding, 'EUR')}</strong>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px]">Prezenčná účasť:</span>
            <strong className="text-blue-400 text-sm">
              {checkedInCount} / {filteredParticipants.length} prítomných
            </strong>
          </div>
        </div>

        {activeSeminar && (
          <div className="text-right text-[11px] text-zinc-400">
            Kapacita kurzu: <strong className="text-white">{activeSeminar.totalSeats - activeSeminar.availableSeats} / {activeSeminar.totalSeats}</strong> miest obsadených
          </div>
        )}
      </div>

      {/* Participants Table */}
      <div className="rounded-3xl bg-zinc-900/40 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/70 text-zinc-400 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Účasť</th>
                <th className="py-3.5 px-4">Kód / Dátum</th>
                <th className="py-3.5 px-4">Účastník & Salón</th>
                <th className="py-3.5 px-4">Kurz & Mesto</th>
                <th className="py-3.5 px-4">Balíček</th>
                <th className="py-3.5 px-4">Stav platby</th>
                <th className="py-3.5 px-4 text-right">Uhradené</th>
                <th className="py-3.5 px-4 text-right">Akcie</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.03]">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500 font-mono">
                    Žiadni účastníci nevyhovujú zadaným filtrom.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((part) => (
                  <tr
                    key={part.id}
                    className="hover:bg-zinc-900/40 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedParticipant(part);
                      setEditingNotes(part.internalNotes || '');
                      setIsEditingNotes(false);
                    }}
                  >
                    {/* Check-in toggle */}
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleToggleCheckIn(part.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          part.checkedIn
                            ? 'bg-blue-950/80 border-blue-500/50 text-blue-400 hover:bg-blue-900/80'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-300 hover:border-zinc-700'
                        }`}
                        title={part.checkedIn ? 'Označený ako prítomný (Kliknite pre zrušenie)' : 'Označiť ako prítomný'}
                      >
                        {part.checkedIn ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                      </button>
                    </td>

                    {/* Ticket Code & Reg Date */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-white font-semibold">{part.ticketCode}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{part.registeredAt.slice(0, 10)}</div>
                    </td>

                    {/* Name & Contact */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white group-hover:text-zinc-200">{part.fullName}</div>
                      <div className="text-[11px] text-zinc-400">
                        {part.salonName ? `${part.salonName} • ${part.city || ''}` : part.email}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{part.phone}</div>
                    </td>

                    {/* Course */}
                    <td className="py-3 px-4">
                      <div className="text-zinc-200 font-medium line-clamp-1">{part.seminarTitle}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{part.seminarCity} • {part.seminarDates}</div>
                    </td>

                    {/* Tier */}
                    <td className="py-3 px-4">
                      <span className="text-[11px] text-zinc-300 font-medium">{part.tierName}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full inline-block ${
                          part.paymentStatus.includes('Plná suma')
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : part.paymentStatus.includes('záloha')
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {part.paymentStatus.includes('Plná suma')
                          ? 'Zaplatené'
                          : part.paymentStatus.includes('záloha')
                          ? 'Záloha 100€'
                          : 'Prevod / Účet'}
                      </span>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5 truncate max-w-[130px]">
                        {part.paymentMethod}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-mono text-white font-bold">{part.amountPaidEUR} €</div>
                      {part.amountRemainingEUR > 0 && (
                        <div className="text-[10px] text-amber-400/90 font-mono">
                          +{part.amountRemainingEUR} € doplatok
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedParticipant(part);
                            setEditingNotes(part.internalNotes || '');
                          }}
                          className="p-1.5 rounded-lg hover:bg-zinc-850 text-zinc-400 hover:text-white transition-colors"
                          title="Zobraziť detail účastníka"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Naozaj chcete zmazať účastníka ${part.fullName}?`)) {
                              store.deleteParticipant(part.id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-950/60 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Vymazať účastníka"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participant Detail Drawer / Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-7 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-zinc-850 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                    {selectedParticipant.ticketCode}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                      selectedParticipant.checkedIn
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-zinc-850 text-zinc-400'
                    }`}
                  >
                    {selectedParticipant.checkedIn ? 'Prítomný na kurze' : 'Zatiaľ neprítomný'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5">{selectedParticipant.fullName}</h2>
                <p className="text-xs text-zinc-400">{selectedParticipant.seminarTitle}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedParticipant(null)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Contact Information */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 space-y-2.5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block font-semibold">
                  Kontaktné údaje
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-zinc-200">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <a href={`mailto:${selectedParticipant.email}`} className="hover:underline">
                      {selectedParticipant.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-200">
                    <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <a href={`tel:${selectedParticipant.phone.replace(/\s+/g, '')}`} className="hover:underline font-mono">
                      {selectedParticipant.phone}
                    </a>
                  </div>
                  {selectedParticipant.salonName && (
                    <div className="flex items-center gap-2 text-zinc-200">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{selectedParticipant.salonName} ({selectedParticipant.city || 'Neuvedené'})</span>
                    </div>
                  )}
                  {selectedParticipant.experience && (
                    <div className="text-[11px] text-zinc-400">
                      Dĺžka kaderníckej praxe: <strong className="text-zinc-200">{selectedParticipant.experience}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment & Billing */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 space-y-2.5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block font-semibold">
                  Platba & Finančné vysporiadanie
                </span>
                <div className="space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Balíček:</span>
                    <strong className="text-white">{selectedParticipant.tierName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Uhradená suma:</span>
                    <strong className="text-emerald-400">{selectedParticipant.amountPaidEUR} €</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Doplatok na mieste:</span>
                    <strong className="text-amber-400">{selectedParticipant.amountRemainingEUR} €</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400">Spôsob platby:</span>
                    <span className="text-zinc-200">{selectedParticipant.paymentMethod}</span>
                  </div>
                  {selectedParticipant.stripePaymentIntentId && (
                    <div className="text-[10px] text-zinc-500 truncate pt-1">
                      Stripe ID: {selectedParticipant.stripePaymentIntentId}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Invoicing / Company details if applicable */}
            {selectedParticipant.companyName && (
              <div className="p-4 rounded-2xl bg-zinc-900/60 space-y-2 text-xs">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block font-semibold">
                  Fakturačné údaje firmy
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
                  <div>
                    <span className="text-zinc-500 text-[10px] block">Obchodné meno:</span>
                    <span className="text-white">{selectedParticipant.companyName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block">IČO:</span>
                    <span className="text-white">{selectedParticipant.ico || 'Neuvedené'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block">DIČ / IČ DPH:</span>
                    <span className="text-white">{selectedParticipant.dic || 'Neuvedené'}</span>
                  </div>
                </div>
                {selectedParticipant.billingAddress && (
                  <div className="text-[11px] text-zinc-400 pt-1">
                    Fakturačná adresa: <span className="text-zinc-200">{selectedParticipant.billingAddress}</span>
                  </div>
                )}
              </div>
            )}

            {/* Customer Notes */}
            {selectedParticipant.notes && (
              <div className="p-3.5 rounded-2xl bg-zinc-900/40 text-xs">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                  Poznámka od účastníka:
                </span>
                <p className="text-zinc-300 italic">"{selectedParticipant.notes}"</p>
              </div>
            )}

            {/* Internal Admin Notes */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold">
                  Interné poznámky tímu Riccardo (Neverejné)
                </span>
                {!isEditingNotes && (
                  <button
                    type="button"
                    onClick={() => setIsEditingNotes(true)}
                    className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer"
                  >
                    Upraviť poznámku
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Sem zadajte internú poznámku (napr. alergie, špeciálne požiadavky na modelku, certifikát)..."
                    className="w-full bg-zinc-950 text-white p-2.5 rounded-xl text-xs focus:outline-none border-0"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingNotes(false)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
                    >
                      Zrušiť
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveInternalNotes}
                      className="px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200"
                    >
                      Uložiť poznámku
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-300 font-mono text-[11px]">
                  {selectedParticipant.internalNotes || 'Zatiaľ žiadne interné poznámky.'}
                </p>
              )}
            </div>

            {/* Quick Actions in Drawer */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {selectedParticipant.amountRemainingEUR > 0 && (
                <button
                  type="button"
                  onClick={() => handleSettleBalanceInDrawer(selectedParticipant)}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
                >
                  <Banknote className="w-4 h-4" />
                  <span>Prijať doplatok {selectedParticipant.amountRemainingEUR} € na mieste</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleDownloadTicketPDF(selectedParticipant)}
                disabled={isGeneratingPDF}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-zinc-200 hover:text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                {isGeneratingPDF ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5 text-zinc-400" />}
                <span>Stiahnuť VIP PDF Vstupenku</span>
              </button>
            </div>

            {/* Check-In Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-850">
              <button
                type="button"
                onClick={() => handleToggleCheckIn(selectedParticipant.id)}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  selectedParticipant.checkedIn
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                }`}
              >
                {selectedParticipant.checkedIn ? (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Zrušiť prezenčnú účasť</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Označiť účastníka za prítomného na kurze</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedParticipant(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Zavrieť detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner & Cloud Check-in Modal */}
      <AdminQRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />
    </div>
  );
};
