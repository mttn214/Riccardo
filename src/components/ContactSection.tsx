import React, { useState } from 'react';
import { STYLIST_PROFILE } from '../data/content';
import { ChevronDown, ArrowUpRight, Check } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './SocialIcons';
import { sendFormNotification } from '../services/formService';

export const ContactSection: React.FC = () => {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Otázka k seminárom',
    message: ''
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Musím si na praktický seminár doniesť vlastné pomôcky?",
      a: "Na seminároch zabezpečujeme cvičné hlavy a stojany. Odporúčame si priniesť vlastné obľúbené nožnice, hrebene a fén. Na seminári 'Umenie fúkanej' dostáva každý účastník v cene našu špeciálnu termálnu kefu Riccardo."
    },
    {
      q: "Získam po ukončení seminára oficiálny certifikát?",
      a: "Áno, každý absolvent obdrží oficiálny certifikát Riccardo Academy podpísaný Richardom Čonkom."
    },
    {
      q: "Kde v Lučenci presne nájdem Hair Salon Riccardo?",
      a: "Salón sa nachádza na adrese J. Kármána 1727/30 v Lučenci (priestory rodinného domu pod nadjazdom). Pred salónom je bezplatné a pohodlné parkovanie."
    },
    {
      q: "Ako prebieha úhrada a storno podmienky?",
      a: "Po online rezervácii uhradíte zálohu alebo vystavíme faktúru pre váš salón na IČO. Bezplatný presun alebo storno termínu je možný najneskôr 14 dní pred konaním."
    }
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await sendFormNotification({
      formType: 'Kontaktná správa',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      'Predmet správy': formData.subject,
      'Text správy': formData.message
    });
    setIsSubmitting(false);
    setFormSent(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: 'Otázka k seminárom', message: '' });
      setFormSent(false);
    }, 5000);
  };

  return (
    <section id="kontakt" className="py-24 sm:py-32 bg-black border-t border-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium block mb-2">
            Kontakt & Salón
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-tight mb-4">
            Hair Salon Riccardo.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Máte otázku k seminárom alebo záujem o individuálne školenie pre váš salón? Napíšte nám alebo sa zastavte v Lučenci.
          </p>
        </div>

        {/* 2-Column Clean Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          
          {/* Left Column: Direct Info (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-4 pb-4 border-b border-zinc-850">
              <img
                src="/images/riccardo/salon_logo_wall.jpg"
                alt="Hair Salon Riccardo"
                className="w-14 h-14 rounded-full object-cover border border-zinc-700 filter brightness-[1.08] contrast-[1.1] shadow-xl"
              />
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight">Hair Salon Riccardo</h3>
                <span className="text-xs text-zinc-400">Ateliér Richarda Čonku v Lučenci</span>
              </div>
            </div>

            <div className="space-y-6 text-sm text-zinc-300">
              <div>
                <span className="text-xs uppercase tracking-wider text-zinc-500 block mb-1 font-medium">
                  Adresa salónu
                </span>
                <strong className="text-white text-base font-medium block">
                  {STYLIST_PROFILE.address}
                </strong>
                <span className="text-xs text-zinc-500 block mt-0.5">
                  (Rodinný dom pod nadjazdom, bezplatné parkovanie)
                </span>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-zinc-500 block mb-1 font-medium">
                  Telefón
                </span>
                <a
                  href={`tel:${STYLIST_PROFILE.phone.replace(/\s+/g, '')}`}
                  className="text-white hover:text-zinc-300 text-base font-medium transition-colors"
                >
                  {STYLIST_PROFILE.phone}
                </a>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-zinc-500 block mb-1 font-medium">
                  Otváracie hodiny
                </span>
                <span className="text-zinc-300 block">
                  Pondelok – Piatok: 08:30 – 17:00
                </span>
                <span className="text-xs text-zinc-500 block mt-0.5">
                  Víkendy: Autorské semináre podľa harmonogramu
                </span>
              </div>

              {/* Social Channels */}
              <div className="pt-2">
                <span className="text-xs uppercase tracking-wider text-zinc-500 block mb-3 font-medium">
                  Sociálne siete
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={STYLIST_PROFILE.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>@hair_riccardo</span>
                  </a>

                  <a
                    href={STYLIST_PROFILE.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
                  >
                    <FacebookIcon className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>

              {/* Google Maps link */}
              <div>
                <a
                  href={STYLIST_PROFILE.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors group"
                >
                  <span>Otvoriť v Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-zinc-950 border border-zinc-850">
              <h3 className="text-xl font-semibold text-white tracking-tight mb-6">
                Napíšte nám správu
              </h3>

              {formSent ? (
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-2">
                  <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center mx-auto mb-2">
                    <Check className="w-4 h-4" />
                  </span>
                  <h4 className="text-white font-medium text-sm">
                    Správa bola odoslaná
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Ďakujeme. Richard Čonka alebo náš tím vás bude čoskoro kontaktovať.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                        Meno a priezvisko
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Meno a priezvisko"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-11 w-full bg-zinc-900 border border-zinc-800 text-white px-4 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="vas@email.sk"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-11 w-full bg-zinc-900 border border-zinc-800 text-white px-4 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                        Telefón
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+421 9xx xxx xxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-11 w-full bg-zinc-900 border border-zinc-800 text-white px-4 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                        Predmet
                      </label>
                      <div className="relative">
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="h-11 w-full bg-zinc-900 border border-zinc-800 text-white px-4 pr-10 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-zinc-500 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="Otázka k seminárom" className="bg-zinc-900 text-white">Otázka k seminárom</option>
                          <option value="Záujem o školenie tímu v našom salóne" className="bg-zinc-900 text-white">Záujem o školenie tímu v našom salóne</option>
                          <option value="Iná požiadavka" className="bg-zinc-900 text-white">Iná požiadavka</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-zinc-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1.5 font-medium">
                      Správa
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Vaša správa..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all active:scale-95 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Odosielam správu...' : 'Odoslať správu'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Minimal FAQ Accordion */}
        <div className="max-w-3xl">
          <h3 className="text-xl font-semibold text-white tracking-tight mb-6">
            Časté otázky
          </h3>

          <div className="divide-y divide-zinc-850 border-y border-zinc-850">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="py-5">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left flex items-center justify-between gap-4 group"
                  >
                    <span className="text-base text-zinc-200 font-medium tracking-tight group-hover:text-white transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed pr-8">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
