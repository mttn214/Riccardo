import React, { useState, useEffect } from 'react';
import { Seminar, TicketTier } from '../../data/content';
import { useAdminStore } from '../../hooks/useAdminStore';
import {
  GraduationCap,
  X,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  Layers,
  Upload,
  DollarSign,
  Check
} from 'lucide-react';

interface AdminSeminarModalProps {
  isOpen: boolean;
  onClose: () => void;
  seminarToEdit?: Seminar | null;
}

export const AdminSeminarModal: React.FC<AdminSeminarModalProps> = ({
  isOpen,
  onClose,
  seminarToEdit,
}) => {
  const { store } = useAdminStore();

  const [title, setTitle] = useState('');
  const [city, setCity] = useState('Lučenec');
  const [country, setCountry] = useState('Slovensko');
  const [venue, setVenue] = useState('Atelier Hair Salon Riccardo, J. Kármána 30');
  const [dates, setDates] = useState('');
  const [category, setCategory] = useState<Seminar['category']>('Umenie Fúkanej');
  const [duration, setDuration] = useState('2 dni (14 hodín intenzívnej praxe)');
  const [totalSeats, setTotalSeats] = useState(6);
  const [availableSeats, setAvailableSeats] = useState(6);
  const [image, setImage] = useState('/images/riccardo/richard_conka_hda_1.jpg');
  const [description, setDescription] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([
    'Správna biomechanika a ergonómia rúk pri napínaní prameňa',
    'Technika fixácie vlasu studeným vzduchom pre 72-hodinovú trvácnosť',
    'Fúkané Riccardo Glam Waves výhradne cez okrúhlu termálnu kefu bez kulmy'
  ]);
  const [tiers, setTiers] = useState<TicketTier[]>([
    {
      id: 'tier-default-master',
      name: 'Hands-On Masterpass',
      priceEUR: 380,
      description: 'Kompletný 2-dňový praktický tréning s osobnou asistenciou Richarda Čonku.',
      recommended: true,
      features: [
        'Miesto v komornej skupine max 6 účastníkov',
        'Práca na cvičnej hlave aj živej modelke',
        'Termokefa Riccardo v cene',
        'Oficiálny certifikát Riccardo Academy'
      ]
    }
  ]);

  useEffect(() => {
    if (seminarToEdit) {
      setTitle(seminarToEdit.title);
      setCity(seminarToEdit.city);
      setCountry(seminarToEdit.country || 'Slovensko');
      setVenue(seminarToEdit.venue);
      setDates(seminarToEdit.dates);
      setCategory(seminarToEdit.category);
      setDuration(seminarToEdit.duration);
      setTotalSeats(seminarToEdit.totalSeats);
      setAvailableSeats(seminarToEdit.availableSeats);
      setImage(seminarToEdit.image);
      setDescription(seminarToEdit.description);
      setLearningOutcomes(seminarToEdit.learningOutcomes || []);
      setTiers(seminarToEdit.tiers || []);
    } else {
      setTitle('');
      setCity('Lučenec');
      setCountry('Slovensko');
      setVenue('Atelier Hair Salon Riccardo, J. Kármána 30');
      setDates('15. – 16. Február 2027');
      setCategory('Umenie Fúkanej');
      setDuration('2 dni (14 hodín)');
      setTotalSeats(6);
      setAvailableSeats(6);
      setImage('/images/riccardo/richard_conka_hda_1.jpg');
      setDescription('');
    }
  }, [seminarToEdit, isOpen]);

  if (!isOpen) return null;

  const handleOutcomeChange = (index: number, val: string) => {
    const next = [...learningOutcomes];
    next[index] = val;
    setLearningOutcomes(next);
  };

  const handleAddOutcome = () => {
    setLearningOutcomes([...learningOutcomes, '']);
  };

  const handleRemoveOutcome = (index: number) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  const handleTierChange = (index: number, field: keyof TicketTier, val: any) => {
    const next = [...tiers];
    next[index] = { ...next[index], [field]: val };
    setTiers(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dates.trim() || !city.trim()) return;

    const newSeminar: Seminar = {
      id: seminarToEdit ? seminarToEdit.id : `sem-${Date.now()}`,
      title: title.trim(),
      city: city.trim(),
      country: country.trim() || 'Slovensko',
      venue: venue.trim(),
      dates: dates.trim(),
      category,
      duration: duration.trim(),
      totalSeats: Number(totalSeats),
      availableSeats: Number(availableSeats),
      image: image.trim(),
      description: description.trim(),
      learningOutcomes: learningOutcomes.filter((o) => o.trim().length > 0),
      schedule: seminarToEdit?.schedule || [
        {
          day: '1. Deň: Teória, dynamika tepla & live ukážky',
          morning: '09:30 – 13:00: Úvod a rozbor techník na modelkách.',
          afternoon: '14:00 – 18:00: Praktický hands-on tréning na cvičných hlavách.'
        },
        {
          day: '2. Deň: Práca na živých modelkách & Certifikácia',
          morning: '09:30 – 13:00: Účastníci fúkajú živé modelky.',
          afternoon: '14:00 – 17:30: Korekcia detailov, fotenie a odovzdanie certifikátov.'
        }
      ],
      includedItems: seminarToEdit?.includedItems || [
        'Termálna kefa z limitovanej edície Riccardo',
        'Pracovné skriptá a manuál techník',
        'Oficiálny akreditovaný certifikát Riccardo Academy',
        'Gurmánsky obed a občerstvenie'
      ],
      tiers: tiers.length > 0 ? tiers : [
        {
          id: 'tier-default',
          name: 'Hands-On Masterpass',
          priceEUR: 380,
          description: 'Kompletný praktický tréning s certifikátom.',
          recommended: true,
          features: ['Osobná asistencia Richarda Čonku', 'Certifikát', 'Termokefa v cene']
        }
      ]
    };

    store.saveSeminar(newSeminar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-7 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {seminarToEdit ? 'Upraviť seminár' : 'Vytvoriť nový vzdelávací kurz'}
              </h2>
              <p className="text-xs text-zinc-400">Nastavte parametre kurzu, kapacity a ceny vstupeniek.</p>
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
          {/* Title */}
          <div className="space-y-1">
            <label className="text-zinc-300 font-medium">Názov seminára *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="napr. Umenie Fúkanej & Signature Vlny: Masterclass"
              className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-zinc-500 font-medium text-sm"
            />
          </div>

          {/* Category, City, Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Kategória *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="Umenie Fúkanej">Umenie Fúkanej</option>
                <option value="Precízny Strih">Precízny Strih</option>
                <option value="Balayage & Blond">Balayage & Blond</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Mesto konania *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Lučenec, Bratislava, Košice..."
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Termín konania *</label>
              <input
                type="text"
                required
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                placeholder="napr. 11. – 12. Január 2027"
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Venue & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Miesto / Salón *</label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Atelier Hair Salon Riccardo..."
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Trvanie kurzu</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="2 dni (14 hodín)"
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Total Seats & Available Seats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-850">
            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Celková kapacita (miest)</label>
              <input
                type="number"
                min={1}
                max={50}
                value={totalSeats}
                onChange={(e) => setTotalSeats(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-2 rounded-xl focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Aktuálne voľné miesta</label>
              <input
                type="number"
                min={0}
                max={totalSeats}
                value={availableSeats}
                onChange={(e) => setAvailableSeats(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-2 rounded-xl focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <label className="text-zinc-300 font-medium">Titulná fotografia (URL)</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/riccardo/richard_conka_hda_1.jpg"
              className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none font-mono text-xs"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-zinc-300 font-medium">Podrobný popis seminára</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Podrobný prehľad kurzu a filozofie výučby..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none"
            />
          </div>

          {/* Tiers / Packages Pricing */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-850">
            <div className="flex items-center justify-between">
              <span className="text-zinc-200 font-semibold">Cenové balíčky (Vstupenky)</span>
              <button
                type="button"
                onClick={() =>
                  setTiers([
                    ...tiers,
                    {
                      id: `tier-${Date.now()}`,
                      name: 'VIP Balíček',
                      priceEUR: 450,
                      description: 'Rozšírená účasť',
                      features: ['Certifikát', 'Individuálny feedback']
                    }
                  ])
                }
                className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Pridať cenovú hladinu</span>
              </button>
            </div>

            {tiers.map((t, idx) => (
              <div key={t.id || idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
                <input
                  type="text"
                  value={t.name}
                  onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                  placeholder="Názov balíčka"
                  className="flex-1 bg-zinc-900 border border-zinc-800 text-white p-2 rounded-lg text-xs"
                />
                <div className="w-24 relative">
                  <input
                    type="number"
                    value={t.priceEUR}
                    onChange={(e) => handleTierChange(idx, 'priceEUR', Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2 pr-6 rounded-lg text-xs font-mono font-bold text-right"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">€</span>
                </div>
                {tiers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setTiers(tiers.filter((_, i) => i !== idx))}
                    className="p-1.5 text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Action buttons */}
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
              {seminarToEdit ? 'Uložiť zmeny seminára' : 'Vytvoriť seminár'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
