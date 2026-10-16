import React, { useState } from 'react';
import { useAdminStore } from '../../hooks/useAdminStore';
import { InquiryMessage } from '../../services/adminStore';
import {
  Mail,
  Clock,
  CheckCircle2,
  Phone,
  Trash2,
  Calendar,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';

export const AdminInquiriesTab: React.FC = () => {
  const { inquiries, store } = useAdminStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryMessage | null>(null);

  const filteredInquiries = inquiries.filter((inq) => {
    if (filterType !== 'all' && inq.type !== filterType) return false;
    if (filterStatus !== 'all' && inq.status !== filterStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        (inq.phone && inq.phone.toLowerCase().includes(q)) ||
        (inq.subject && inq.subject.toLowerCase().includes(q)) ||
        (inq.message && inq.message.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const handleStatusChange = (id: string, status: InquiryMessage['status']) => {
    store.updateInquiryStatus(id, status);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Naozaj si želáte vymazať túto správu?')) {
      store.deleteInquiry(id);
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-850">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Dopyty & Kontaktné správy
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Správy z kontaktného formulára salónu a záujemcovia o vypredané semináre vo VIP Waitliste.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">
            Spolu: <strong className="text-white">{inquiries.length}</strong> správ
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-850">
        <div className="sm:col-span-4">
          <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Typ správy</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl p-2.5 focus:outline-none cursor-pointer"
          >
            <option value="all">Všetky typy ({inquiries.length})</option>
            <option value="contact">Kontaktný formulár salónu</option>
            <option value="waitlist">VIP Waitlist na semináre</option>
          </select>
        </div>

        <div className="sm:col-span-4">
          <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Stav vybavenia</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl p-2.5 focus:outline-none cursor-pointer"
          >
            <option value="all">Všetky stavy</option>
            <option value="unread">Neprečítané</option>
            <option value="read">Prečítané</option>
            <option value="resolved">Vybavené</option>
          </select>
        </div>

        <div className="sm:col-span-4">
          <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Hľadať</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="Meno, email, text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 text-white pl-9 pr-3 py-2.5 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredInquiries.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500 font-mono bg-zinc-950 rounded-2xl border border-zinc-850">
            Žiadne správy nevyhovujú zvoleným kritériám.
          </div>
        ) : (
          filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              onClick={() => {
                setSelectedInquiry(inq);
                if (inq.status === 'unread') {
                  store.updateInquiryStatus(inq.id, 'read');
                }
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                inq.status === 'unread'
                  ? 'bg-zinc-900/90 border-purple-500/40 shadow-lg ring-1 ring-purple-500/10'
                  : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                      inq.type === 'waitlist'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {inq.type === 'waitlist' ? 'VIP Waitlist' : 'Kontakt'}
                  </span>

                  <span className="text-xs font-bold text-white">{inq.name}</span>
                  <span className="text-[11px] text-zinc-400 font-mono">{inq.submittedAt}</span>

                  <span
                    className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ml-auto sm:ml-0 ${
                      inq.status === 'unread'
                        ? 'bg-amber-500/20 text-amber-300'
                        : inq.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {inq.status === 'unread' ? 'Nové' : inq.status === 'resolved' ? 'Vybavené' : 'Prečítané'}
                  </span>
                </div>

                <div className="text-xs font-semibold text-zinc-200">
                  {inq.subject || inq.seminarTitle || 'Správa bez predmetu'}
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {inq.message || 'Záujem o zaradenie do poradovníka.'}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-zinc-500 font-mono pt-1">
                  <span>{inq.email}</span>
                  {inq.phone && <span>• {inq.phone}</span>}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                <a
                  href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'Odpoveď od Hair Salon Riccardo')}`}
                  className="px-3 py-1.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Odpovedať</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleStatusChange(inq.id, inq.status === 'resolved' ? 'read' : 'resolved')}
                  className={`p-2 rounded-xl border transition-colors ${
                    inq.status === 'resolved'
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                      : 'bg-zinc-850 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  title={inq.status === 'resolved' ? 'Označiť ako nevybavené' : 'Označiť za vybavené'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(inq.id)}
                  className="p-2 rounded-xl bg-zinc-850 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition-colors"
                  title="Vymazať správu"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-zinc-850 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {selectedInquiry.type === 'waitlist' ? 'VIP Waitlist dopyt' : 'Kontaktná správa'}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedInquiry.name}</h3>
                <p className="text-xs text-zinc-500 font-mono">{selectedInquiry.submittedAt}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-850 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Email:</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-white hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                {selectedInquiry.phone && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Telefón:</span>
                    <a href={`tel:${selectedInquiry.phone.replace(/\s+/g, '')}`} className="text-white hover:underline">
                      {selectedInquiry.phone}
                    </a>
                  </div>
                )}
                {selectedInquiry.seminarTitle && (
                  <div className="flex justify-between pt-1 border-t border-zinc-800">
                    <span className="text-zinc-500">Požadovaný seminár:</span>
                    <span className="text-zinc-200">{selectedInquiry.seminarTitle}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-zinc-400 font-medium block">Text správy:</span>
                <div className="p-4 rounded-xl bg-zinc-900 text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message || 'Záujem o termín kurzu.'}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-850 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleStatusChange(selectedInquiry.id, selectedInquiry.status === 'resolved' ? 'read' : 'resolved')}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  selectedInquiry.status === 'resolved'
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{selectedInquiry.status === 'resolved' ? 'Vrátiť do nevybavených' : 'Označiť za vybavené'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-850 text-zinc-300 text-xs hover:bg-zinc-800"
              >
                Zavrieť
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
