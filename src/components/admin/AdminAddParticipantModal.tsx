import React, { useState } from 'react';
import { useAdminStore } from '../../hooks/useAdminStore';
import { Participant } from '../../services/adminStore';
import {
  Users,
  X,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface AdminAddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSeminarId?: string;
}

export const AdminAddParticipantModal: React.FC<AdminAddParticipantModalProps> = ({
  isOpen,
  onClose,
  defaultSeminarId,
}) => {
  const { seminars, store } = useAdminStore();

  const [seminarId, setSeminarId] = useState<string>(defaultSeminarId || seminars[0]?.id || '');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+421 ');
  const [salonName, setSalonName] = useState('');
  const [city, setCity] = useState('');
  const [experience, setExperience] = useState('3–5 rokov');
  const [paymentOption, setPaymentOption] = useState<'full' | 'deposit'>('full');
  const [paymentMethod, setPaymentMethod] = useState('Hotovosť na salóne');
  const [amountPaidEUR, setAmountPaidEUR] = useState<number>(380);
  const [billingType, setBillingType] = useState<'personal' | 'salon'>('personal');
  const [companyName, setCompanyName] = useState('');
  const [ico, setIco] = useState('');
  const [dic, setDic] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('Manuálny zápis z administrácie');

  if (!isOpen) return null;

  const currentSeminar = seminars.find((s) => s.id === seminarId) || seminars[0];
  const currentTier = currentSeminar?.tiers[0] || { id: 'tier-default', name: 'Standard', priceEUR: 380 };

  const handleSeminarChange = (newSemId: string) => {
    setSeminarId(newSemId);
    const sem = seminars.find((s) => s.id === newSemId);
    if (sem && sem.tiers[0]) {
      setAmountPaidEUR(paymentOption === 'deposit' ? 100 : sem.tiers[0].priceEUR);
    }
  };

  const handlePaymentOptionChange = (opt: 'full' | 'deposit') => {
    setPaymentOption(opt);
    if (opt === 'deposit') {
      setAmountPaidEUR(100);
    } else {
      setAmountPaidEUR(currentTier.priceEUR);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !seminarId) return;

    const remaining = Math.max(0, currentTier.priceEUR - Number(amountPaidEUR));
    const randomTicket = `RIC-${(currentSeminar.city || 'LUC').slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const paymentStatus: Participant['paymentStatus'] =
      Number(amountPaidEUR) >= currentTier.priceEUR
        ? 'Uhradené (Plná suma)'
        : Number(amountPaidEUR) > 0
        ? 'Uhradená záloha (100 €)'
        : 'Čaká na prevod / faktúru';

    store.addParticipant({
      seminarId: currentSeminar.id,
      seminarTitle: currentSeminar.title,
      seminarDates: currentSeminar.dates,
      seminarCity: currentSeminar.city,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      salonName: salonName.trim() || undefined,
      city: city.trim() || undefined,
      experience,
      tierId: currentTier.id,
      tierName: currentTier.name,
      tierPriceEUR: currentTier.priceEUR,
      paymentOption,
      amountPaidEUR: Number(amountPaidEUR),
      amountRemainingEUR: remaining,
      paymentMethod,
      paymentStatus,
      ticketCode: randomTicket,
      billingType,
      companyName: billingType === 'salon' ? companyName.trim() : undefined,
      ico: billingType === 'salon' ? ico.trim() : undefined,
      dic: billingType === 'salon' ? dic.trim() : undefined,
      billingAddress: billingType === 'salon' ? billingAddress.trim() : undefined,
      notes: notes.trim() || undefined,
      internalNotes: internalNotes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-7 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Manuálny zápis účastníka na kurz
              </h2>
              <p className="text-xs text-zinc-400">Pridajte účastníka prijatého telefonicky alebo v salóne.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Seminar Select */}
          <div className="space-y-1">
            <label className="text-zinc-300 font-medium">Vyberte seminár *</label>
            <select
              value={seminarId}
              onChange={(e) => handleSeminarChange(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none cursor-pointer text-xs"
            >
              {seminars.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.city} • {s.dates}) — voľné {s.availableSeats} m.
                </option>
              ))}
            </select>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Meno a priezvisko *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="napr. Michaela Kováčová"
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Emailová adresa *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vas@email.sk"
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Phone & Salon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Telefónne číslo *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+421 9xx xxx xxx"
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Názov salónu / Mesto</label>
              <input
                type="text"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                placeholder="napr. Hair Studio Banská Bystrica"
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Payment & Amount */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-3">
            <span className="text-zinc-200 font-semibold block">Platobné informácie</span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-400">Režim úhrady</label>
                <select
                  value={paymentOption}
                  onChange={(e) => handlePaymentOptionChange(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="full">Plná suma ({currentTier.priceEUR} €)</option>
                  <option value="deposit">Záloha 100 €</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Uhradená suma (€)</label>
                <input
                  type="number"
                  value={amountPaidEUR}
                  onChange={(e) => setAmountPaidEUR(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2 rounded-xl focus:outline-none font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Spôsob úhrady</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="Hotovosť na salóne">Hotovosť na salóne</option>
                  <option value="Prevod na bankový účet">Prevod na bankový účet</option>
                  <option value="Platobná karta (Terminál / Stripe)">Platobná karta</option>
                  <option value="Apple Pay">Apple Pay</option>
                  <option value="Faktúra na salón (Splatnosť)">Faktúra (Splatnosť)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="space-y-1">
            <label className="text-zinc-300 font-medium">Interná poznámka tímu</label>
            <input
              type="text"
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="napr. Platil v salóne, potrebuje certifikát vopred..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-zinc-850 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
            >
              Zrušiť
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-lg cursor-pointer"
            >
              Zapísať účastníka
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
