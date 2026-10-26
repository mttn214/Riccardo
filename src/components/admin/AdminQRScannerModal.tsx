import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useAdminStore } from '../../hooks/useAdminStore';
import { Participant } from '../../services/adminStore';
import { formatPrice } from '../../utils/currency';
import {
  Camera,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  CreditCard,
  Banknote,
  UserCheck,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  Building2,
  Calendar,
  CloudCheck,
  ShieldCheck,
  Volume2,
  VolumeX,
  ChevronRight
} from 'lucide-react';

interface AdminQRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminQRScannerModal: React.FC<AdminQRScannerModalProps> = ({ isOpen, onClose }) => {
  const { participants, store } = useAdminStore();
  const [manualQuery, setManualQuery] = useState('');
  const [scannedTicketCode, setScannedTicketCode] = useState<string | null>(null);
  const [activeParticipant, setActiveParticipant] = useState<Participant | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [settleMethod, setSettleMethod] = useState<'Hotovosť' | 'POS Terminál'>('Hotovosť');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader-container';

  // Play audio chime via Web Audio API
  const playChime = (type: 'success' | 'alert') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(329.63, audioCtx.currentTime); // E4
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch {
      // AudioContext not available or blocked
    }
  };

  // Vibration feedback for mobile
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([80, 40, 80]);
      } catch {
        // Ignored
      }
    }
  };

  // Handle scanned or selected ticket
  const handleSelectTicket = (ticketCode: string) => {
    const cleanCode = ticketCode.trim();
    setScannedTicketCode(cleanCode);

    // Find in participants
    const found = participants.find(
      (p) =>
        p.ticketCode.toLowerCase() === cleanCode.toLowerCase() ||
        p.id.toLowerCase() === cleanCode.toLowerCase()
    );

    if (found) {
      setActiveParticipant(found);
      playChime('success');
      triggerHaptic();
      setSyncFeedback('Vstupenka overená v zozname');
    } else {
      setActiveParticipant(null);
      playChime('alert');
      setSyncFeedback(`Kód "${cleanCode}" nebol nájdený v lokálnej databáze. Skontrolujte kód.`);
    }
  };

  // Start Camera QR Scanner
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const startScanner = async () => {
      try {
        setCameraError(null);
        // Wait a tick for container element to mount
        await new Promise((r) => setTimeout(r, 200));
        const el = document.getElementById(scannerContainerId);
        if (!el || !isMounted) return;

        const html5QrCode = new Html5Qrcode(scannerContainerId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // Success QR callback
            handleSelectTicket(decodedText);
          },
          () => {
            // Ignore scan frame misses
          }
        );

        if (isMounted) {
          setIsCameraActive(true);
        }
      } catch (err: any) {
        if (isMounted) {
          setIsCameraActive(false);
          setCameraError(
            err?.message ||
              'Kamera nie je dostupná alebo nebol udelený prístup. Môžete použiť ručné vyhľadanie kódu.'
          );
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch(() => {});
        scannerRef.current = null;
      }
      setIsCameraActive(false);
    };
  }, [isOpen]);

  // Keep activeParticipant synced when store changes
  useEffect(() => {
    if (activeParticipant) {
      const fresh = participants.find((p) => p.id === activeParticipant.id);
      if (fresh) setActiveParticipant(fresh);
    }
  }, [participants]);

  // Perform Check-in action
  const handleToggleCheckIn = async () => {
    if (!activeParticipant) return;
    setIsSyncing(true);
    const newStatus = store.toggleCheckIn(activeParticipant.id);
    playChime(newStatus ? 'success' : 'alert');
    triggerHaptic();

    setSyncFeedback(
      newStatus
        ? 'Účastník bol označený ako PRÍTOMNÝ a zaznamenaný v cloude.'
        : 'Príchod účastníka bol zrušený.'
    );
    setTimeout(() => setIsSyncing(false), 500);
  };

  // Perform Settle Balance action (Doplatok 280 €)
  const handleSettleBalance = async () => {
    if (!activeParticipant) return;
    setIsSyncing(true);
    store.settleBalance(activeParticipant.id, `Doplatok na mieste (${settleMethod})`);
    playChime('success');
    triggerHaptic();

    setSyncFeedback(
      `Doplatok ${formatPrice(activeParticipant.amountRemainingEUR || 280, 'EUR')} bol úspešne prijatý (${settleMethod}) a zapísaný do Supabase.`
    );
    setTimeout(() => setIsSyncing(false), 500);
  };

  if (!isOpen) return null;

  // Filtered participants for manual search
  const searchResults = manualQuery.trim()
    ? participants.filter((p) => {
        const q = manualQuery.toLowerCase();
        return (
          p.ticketCode.toLowerCase().includes(q) ||
          p.fullName.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          (p.phone && p.phone.toLowerCase().includes(q)) ||
          (p.salonName && p.salonName.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto text-white">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
                <span>Overenie vstupenky & Check-in</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                  Supabase Live
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Skenujte QR kód z PDF / peňaženky účastníka alebo zadajte kód.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Stlmiť zvukový signál' : 'Zapnúť zvukový signál'}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* CAMERA VIEWFINDER SECTION */}
          <div className="relative rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
            {cameraError ? (
              <div className="p-6 text-center max-w-sm">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-xs text-zinc-300 mb-3">{cameraError}</p>
                <p className="text-[11px] text-zinc-500">
                  Pre overenie použite vyhľadávacie pole nižšie zadaním mena alebo kódu vstupenky.
                </p>
              </div>
            ) : (
              <div className="w-full relative flex flex-col items-center">
                <div
                  id={scannerContainerId}
                  className="w-full max-w-[340px] aspect-square overflow-hidden rounded-xl"
                />
                {isCameraActive && (
                  <div className="absolute bottom-2 text-center pointer-events-none">
                    <span className="text-[11px] px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-zinc-300 border border-zinc-800">
                      Namierte kameru na QR kód vstupenky
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MANUAL CODE & SEARCH INPUT */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 flex items-center justify-between">
              <span>Ručné vyhľadanie účastníka alebo kódu</span>
              <span className="text-[11px] text-zinc-500">Kód, Meno, Email alebo Telefón</span>
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={manualQuery}
                onChange={(e) => {
                  setManualQuery(e.target.value);
                  if (e.target.value.trim().length >= 3) {
                    const found = store.lookupParticipant(e.target.value);
                    if (found) {
                      setActiveParticipant(found);
                      setScannedTicketCode(found.ticketCode);
                    }
                  }
                }}
                placeholder="Napr. RIC-VERIFIED-CLOUD-001 alebo Čonka..."
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 transition-colors"
              />
              {manualQuery && (
                <button
                  onClick={() => setManualQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick dropdown suggestions when searching manually */}
            {searchResults.length > 0 && !activeParticipant && (
              <div className="mt-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800/60 max-h-48 overflow-y-auto">
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      handleSelectTicket(p.ticketCode);
                      setManualQuery('');
                    }}
                    className="w-full p-3 text-left hover:bg-zinc-800/60 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                        {p.fullName}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {p.salonName || p.city || 'Súkromná osoba'} • Kód: {p.ticketCode}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                        p.amountRemainingEUR === 0
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {p.amountRemainingEUR === 0 ? 'Zaplatené' : `Doplatok: ${p.amountRemainingEUR} €`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ACTIVE VERIFIED PARTICIPANT CARD */}
          {activeParticipant && (
            <div className="rounded-2xl border border-zinc-700/80 bg-zinc-900/90 p-5 space-y-5 animate-in fade-in duration-200">
              
              {/* Participant Profile & Code */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-white tracking-tight">
                      {activeParticipant.fullName}
                    </h4>
                    {activeParticipant.checkedIn ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Prítomný
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        Čaká na vstup
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {activeParticipant.salonName && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-zinc-500" />
                        {activeParticipant.salonName}
                      </span>
                    )}
                    {activeParticipant.city && (
                      <span>{activeParticipant.city}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-zinc-500" />
                      {activeParticipant.phone}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
                    Kód vstupenky
                  </span>
                  <span className="text-sm font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block mt-0.5">
                    {activeParticipant.ticketCode}
                  </span>
                </div>
              </div>

              {/* Seminar & Ticket info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                  <span className="text-[10px] uppercase text-zinc-500 block font-medium">Seminár</span>
                  <span className="font-semibold text-white block mt-0.5">{activeParticipant.seminarTitle}</span>
                  <span className="text-zinc-400 block">{activeParticipant.seminarDates}</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                  <span className="text-[10px] uppercase text-zinc-500 block font-medium">Stav úhrady</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-sm font-bold text-white">
                      {formatPrice(activeParticipant.amountPaidEUR || 0, 'EUR')} uhradené
                    </span>
                    <span className="text-zinc-500">z {formatPrice(activeParticipant.tierPriceEUR || 380, 'EUR')}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">
                    {activeParticipant.paymentStatus}
                  </span>
                </div>
              </div>

              {/* PAYMENT BALANCE ALERT & SETTLE ACTION */}
              {activeParticipant.amountRemainingEUR > 0 ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                        Potrebné doplatiť: {formatPrice(activeParticipant.amountRemainingEUR, 'EUR')}
                      </h5>
                      <p className="text-xs text-amber-200/80 mt-0.5">
                        Účastník uhradil pri rezervácii zálohu {formatPrice(activeParticipant.amountPaidEUR, 'EUR')}. Zvyšnú sumu doplatí na mieste.
                      </p>
                    </div>
                  </div>

                  {/* Settle Form */}
                  <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSettleMethod('Hotovosť')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          settleMethod === 'Hotovosť'
                            ? 'bg-amber-400 text-black font-semibold'
                            : 'bg-zinc-800 text-zinc-300 hover:text-white'
                        }`}
                      >
                        Hotovosť
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettleMethod('POS Terminál')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          settleMethod === 'POS Terminál'
                            ? 'bg-amber-400 text-black font-semibold'
                            : 'bg-zinc-800 text-zinc-300 hover:text-white'
                        }`}
                      >
                        POS Terminál
                      </button>
                    </div>

                    <button
                      onClick={handleSettleBalance}
                      disabled={isSyncing}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-all active:scale-95 shadow-md flex items-center gap-1.5"
                    >
                      <Banknote className="w-4 h-4" />
                      <span>Prijať doplatok {formatPrice(activeParticipant.amountRemainingEUR, 'EUR')}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Plná suma 100% uhradená. Žiadny doplatok nie je požadovaný.</span>
                </div>
              )}

              {/* CHECK-IN PRIMARY BUTTON */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleToggleCheckIn}
                  disabled={isSyncing}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${
                    activeParticipant.checkedIn
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold'
                  }`}
                >
                  {activeParticipant.checkedIn ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Zrušiť príchod (Označiť ako neprítomný)</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-5 h-5" />
                      <span>Potvrdiť príchod (Check-in do cloudu)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveParticipant(null);
                    setScannedTicketCode(null);
                    setManualQuery('');
                  }}
                  className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
                >
                  Ďalší
                </button>
              </div>

              {/* Live sync status banner */}
              {syncFeedback && (
                <div className="text-[11px] text-zinc-400 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {syncFeedback}
                  </span>
                  <span className="text-[10px] text-zinc-500">Frankfurt EÚ</span>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-zinc-900/60 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
          <span>Hair Salon Riccardo • Prezenčná kontrola</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
          >
            Zatvoriť
          </button>
        </div>

      </div>
    </div>
  );
};
