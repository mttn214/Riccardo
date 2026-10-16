import React, { useState } from 'react';
import { useAdminStore } from '../../hooks/useAdminStore';
import { PortfolioItem } from '../../data/content';
import {
  Image,
  Plus,
  Edit,
  Trash2,
  Filter,
  Eye,
  Sparkles,
  Trophy,
  Scissors,
  Wand2,
  Calendar,
  Layers,
  ChevronDown,
  X,
  Upload,
  Check
} from 'lucide-react';

export const AdminPortfolioTab: React.FC = () => {
  const { portfolio, store } = useAdminStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<PortfolioItem['category']>('Balayage & Farba');
  const [formYear, setFormYear] = useState('2026');
  const [formCollection, setFormCollection] = useState('Riccardo Atelier Collection');
  const [formImage, setFormImage] = useState('');
  const [formBeforeImage, setFormBeforeImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTechnique, setFormTechnique] = useState('');
  const [formFormula, setFormFormula] = useState('');
  const [formTools, setFormTools] = useState('');
  const [formAwards, setFormAwards] = useState('');

  const categories = [
    'Balayage & Farba',
    'Precízne Strihy',
    'Umenie Fúkanej & Styling',
    'Svadobné & Spoločenské',
  ];

  const filteredItems = portfolio.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  const openCreateModal = () => {
    setIsCreatingNew(true);
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('Balayage & Farba');
    setFormYear('2026');
    setFormCollection('Riccardo Atelier & Academy');
    setFormImage('/images/riccardo/richard_conka_hda_1.jpg');
    setFormBeforeImage('');
    setFormDescription('');
    setFormTechnique('');
    setFormFormula('');
    setFormTools('Termokefa Riccardo, iontový fén, prémiová stylingová kozmetika');
    setFormAwards('');
  };

  const openEditModal = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsCreatingNew(false);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormYear(item.year);
    setFormCollection(item.collection);
    setFormImage(item.image);
    setFormBeforeImage(item.beforeImage || '');
    setFormDescription(item.description);
    setFormTechnique(item.technique);
    setFormFormula(item.formula || '');
    setFormTools(item.toolsUsed);
    setFormAwards(item.awardsWon || '');
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'main' | 'before') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      if (field === 'main') {
        setFormImage(base64);
      } else {
        setFormBeforeImage(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formImage.trim()) return;

    const itemToSave: PortfolioItem = {
      id: editingItem ? editingItem.id : `port-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      year: formYear.trim() || '2026',
      collection: formCollection.trim(),
      image: formImage.trim(),
      beforeImage: formBeforeImage.trim() || undefined,
      hasBeforeAfter: Boolean(formBeforeImage.trim()),
      description: formDescription.trim(),
      technique: formTechnique.trim(),
      formula: formFormula.trim() || undefined,
      toolsUsed: formTools.trim() || 'Profesionálne stylingové nástroje',
      awardsWon: formAwards.trim() || undefined
    };

    store.savePortfolioItem(itemToSave);
    setIsCreatingNew(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    store.deletePortfolioItem(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-850">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Galéria & Portfólio premien
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Spravujte fotografie účesov, techniky fúkanej, balayage receptúry a pred/po premeny.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-zinc-500 appearance-none cursor-pointer"
            >
              <option value="all">Všetky kategórie ({portfolio.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-all active:scale-95 shadow-lg flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Pridať fotografiu</span>
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-all overflow-hidden flex flex-col justify-between group shadow-xl"
          >
            {/* Image Preview */}
            <div className="relative h-56 bg-zinc-900 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

              {/* Category pill */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-200 backdrop-blur-md">
                  {item.category}
                </span>

                {item.hasBeforeAfter && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 backdrop-blur-md">
                    Pred / Po
                  </span>
                )}
              </div>

              {/* Awards badge if any */}
              {item.awardsWon && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-[10px] text-amber-300 font-medium bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-amber-500/30 truncate">
                  <Trophy className="w-3 h-3 shrink-0 text-amber-400" />
                  <span className="truncate">{item.awardsWon}</span>
                </div>
              )}
            </div>

            {/* Info Body */}
            <div className="p-4 space-y-2.5 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white leading-snug group-hover:text-zinc-200">
                  {item.title}
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{item.collection}</p>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.formula && (
                <div className="p-2 rounded-xl bg-zinc-900/70 border border-zinc-850 text-[10px] text-zinc-300 font-mono">
                  <span className="text-zinc-500 block">Receptúra:</span>
                  <span className="truncate block">{item.formula}</span>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="p-3 bg-zinc-900/50 border-t border-zinc-850 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setPreviewItem(item)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Náhľad</span>
              </button>

              <button
                type="button"
                onClick={() => openEditModal(item)}
                className="p-1.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Upraviť dielo"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setDeleteConfirmId(item.id)}
                className="p-1.5 rounded-xl bg-zinc-850 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Vymazať dielo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Photo Modal */}
      {(isCreatingNew || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-7 space-y-5 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  {editingItem ? 'Upraviť fotografiu v portfóliu' : 'Pridať nové dielo do portfólia'}
                </h2>
                <p className="text-xs text-zinc-400">
                  Vyplňte detaily, techniku a receptúru pre vystavenie na webe.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingItem(null);
                }}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Názov diela / účesu *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="napr. Žitná Symfónia"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Kategória *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-zinc-500 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Year & Collection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Rok tvorby</label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="2026"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-zinc-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Kolekcia</label>
                  <input
                    type="text"
                    value={formCollection}
                    onChange={(e) => setFormCollection(e.target.value)}
                    placeholder="napr. Riccardo Atelier"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              {/* Main Image URL / File Upload */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-850">
                <label className="text-zinc-300 font-medium block">Hlavná fotografia (URL alebo súbor) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="/images/riccardo/... alebo https://..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 text-white p-2 rounded-xl focus:outline-none text-xs font-mono"
                  />
                  <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Nahrať</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, 'main')}
                    />
                  </label>
                </div>

                {formImage && (
                  <div className="mt-2 h-28 w-28 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950">
                    <img src={formImage} alt="Náhľad" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Optional Before Image */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-850">
                <label className="text-zinc-400 font-medium block">Fotografia PRED (Voliteľné pre porovnanie pred/po)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formBeforeImage}
                    onChange={(e) => setFormBeforeImage(e.target.value)}
                    placeholder="URL fotografie pred premenou..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 text-white p-2 rounded-xl focus:outline-none text-xs font-mono"
                  />
                  <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Nahrať</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, 'before')}
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Popis diela</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Stručný umelecký popis účesu..."
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* Technique & Formula */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Použitá technika</label>
                  <input
                    type="text"
                    value={formTechnique}
                    onChange={(e) => setFormTechnique(e.target.value)}
                    placeholder="napr. AirTouch, fúkaná termokefou"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Farebná receptúra (Recept)</label>
                  <input
                    type="text"
                    value={formFormula}
                    onChange={(e) => setFormFormula(e.target.value)}
                    placeholder="napr. 9.12 + 10.21 (1.9%)"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-zinc-500 font-mono"
                  />
                </div>
              </div>

              {/* Tools & Awards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Použité nástroje</label>
                  <input
                    type="text"
                    value={formTools}
                    onChange={(e) => setFormTools(e.target.value)}
                    placeholder="napr. Termálna kefa Riccardo, žehlička"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Ocenenie (ak vyhralo)</label>
                  <input
                    type="text"
                    value={formAwards}
                    onChange={(e) => setFormAwards(e.target.value)}
                    placeholder="napr. Víťaz: Czech & Slovak Hairdressing Awards"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-zinc-850 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Zrušiť
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-lg cursor-pointer"
                >
                  {editingItem ? 'Uložiť zmeny' : 'Vložiť do portfólia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-zinc-800 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-semibold text-white">Odstrániť fotografiu?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Naozaj si želáte vymazať túto fotografiu z portfólia? Táto zmena je trvalá.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
              >
                Zrušiť
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
              >
                Potvrdiť vymazanie
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Item Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl bg-zinc-950 border border-zinc-800 p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="max-h-[60vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img src={previewItem.image} alt={previewItem.title} className="max-h-[60vh] w-auto object-contain" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                  {previewItem.category}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">{previewItem.year}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{previewItem.title}</h3>
              <p className="text-xs text-zinc-300 mt-1">{previewItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
