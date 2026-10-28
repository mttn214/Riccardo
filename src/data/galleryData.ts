export interface GalleryPhoto {
  id: string;
  image: string;
  title: string;
  category: 'Školenia' | 'Súťaže' | 'Portfólio';
  subcategory: 'Umenie fúkanej' | 'Precízny strih' | 'Balayage & Farba' | 'Avantgarda' | 'Gala & Prehliadky' | 'Akadémia Lučenec';
  description: string;
}

// 1. Školenia a Semináre (Edukácia, Akadémia v Lučenci, Hands-On tréningy, Pódiové ukážky)
export const SEMINAR_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "sem-gal-1",
    image: "/images/riccardo/gallery/riccardo_art_06.jpg",
    title: "Ateliérový styling a osobná konzultácia",
    category: "Školenia",
    subcategory: "Akadémia Lučenec",
    description: "Richard Čonka pri precíznej úprave vlasov a individuálnom prístupe k forme účesu v salóne v Lučenci."
  },
  {
    id: "sem-gal-2",
    image: "/images/riccardo/gallery/riccardo_art_01.jpg",
    title: "Hands-on tréning v zákulisí",
    category: "Školenia",
    subcategory: "Umenie fúkanej",
    description: "Osobná asistencia Richarda Čonku pri stylingu objemových kučier a technike fixácie."
  },
  {
    id: "sem-gal-3",
    image: "/images/riccardo/gallery/riccardo_art_05.jpg",
    title: "Anatomické sekcionovanie vlasov",
    category: "Školenia",
    subcategory: "Precízny strih",
    description: "Praktická ukážka presného delenia sekcií hrebeňom pred strihaním na živej modelke."
  },
  {
    id: "sem-gal-4",
    image: "/images/riccardo/gallery/riccardo_art_16.jpg",
    title: "Pódiový masterclass: Geometria strihu",
    category: "Školenia",
    subcategory: "Precízny strih",
    description: "Živá prezentácia strihu krátkej formy pred publikom kaderníkov."
  },
  {
    id: "sem-gal-5",
    image: "/images/riccardo/gallery/riccardo_art_64.jpg",
    title: "Pódiový styling a tvarovanie objemu",
    category: "Školenia",
    subcategory: "Umenie fúkanej",
    description: "Práca na scéne pred publikom kaderníkov – vytvorenie ikonického objemu a zrkadlového lesku."
  },
  {
    id: "sem-gal-6",
    image: "/images/riccardo/gallery/riccardo_art_26.jpg",
    title: "Osobná korekcia ťahu kefou",
    category: "Školenia",
    subcategory: "Umenie fúkanej",
    description: "Detailné nastavenie biomechaniky rúk pri nadvihovaní vlasov od korienkov."
  },
  {
    id: "sem-gal-7",
    image: "/images/riccardo/gallery/riccardo_art_37.jpg",
    title: "Majster remesla: Richard Čonka",
    category: "Školenia",
    subcategory: "Akadémia Lučenec",
    description: "Vášeň pre dokonalú geometriu a remeselnú precíznosť odovzdávaná ďalšej generácii kaderníkov."
  },
  {
    id: "sem-gal-8",
    image: "/images/riccardo/gallery/riccardo_art_07.jpg",
    title: "Tímová príprava a backstage styling",
    category: "Školenia",
    subcategory: "Akadémia Lučenec",
    description: "Zákulisná spolupráca a precízna príprava modeliek pred autorskou prehliadkou."
  }
];

// 2. Súťaže a Ocenenia (Czech & Slovak Hairdressing Awards, Gala prehliadky, Červený koberec)
export const AWARDS_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "aw-gal-1",
    image: "/images/riccardo/richard_conka_stage_award.jpg",
    title: "Prevzatie ocenenia Cena verejnosti SR",
    category: "Súťaže",
    subcategory: "Gala & Prehliadky",
    description: "Víťazná trofej Czech & Slovak Hairdressing Awards vo Forum Karlín v Prahe."
  },
  {
    id: "aw-gal-2",
    image: "/images/riccardo/gallery/riccardo_art_56.jpg",
    title: "Žitná Symfónia (Víťazná kolekcia CSHA)",
    category: "Súťaže",
    subcategory: "Avantgarda",
    description: "Ikonické dielo prepájajúce folklórnu identitu s vysokou geometriou účesu."
  },
  {
    id: "aw-gal-3",
    image: "/images/riccardo/gallery/riccardo_art_47.jpg",
    title: "Avant-Garde Volumetry (CSHA)",
    category: "Súťaže",
    subcategory: "Avantgarda",
    description: "Monumentálny haute coiffure objem ocenený na česko-slovenskej scéne."
  },
  {
    id: "aw-gal-4",
    image: "/images/riccardo/gallery/riccardo_art_12.jpg",
    title: "Červený koberec gala večera",
    category: "Súťaže",
    subcategory: "Gala & Prehliadky",
    description: "Richard Čonka a prehliadkový tím salónu s modelkami v couture róbach."
  },
  {
    id: "aw-gal-5",
    image: "/images/riccardo/gallery/riccardo_art_34.jpg",
    title: "Finále módnej galashow",
    category: "Súťaže",
    subcategory: "Gala & Prehliadky",
    description: "Veľkolepé finále prehliadky na pódiu pred stovkami divákov."
  },
  {
    id: "aw-gal-6",
    image: "/images/riccardo/gallery/riccardo_art_69.jpg",
    title: "MATRIX Hair Cup",
    category: "Súťaže",
    subcategory: "Gala & Prehliadky",
    description: "Súťažná prezentácia a modelka na červenom koberci MATRIX Hair Cup."
  },
  {
    id: "aw-gal-7",
    image: "/images/riccardo/gallery/riccardo_art_77.jpg",
    title: "Schwarzkopf Professional kampaň",
    category: "Súťaže",
    subcategory: "Gala & Prehliadky",
    description: "Celonárodná kampaň Schwarzkopf Professional s účasťou Richarda Čonku."
  },
  {
    id: "aw-gal-8",
    image: "/images/riccardo/gallery/riccardo_art_10.jpg",
    title: "Haute Coiffure Geisha Sculpture",
    category: "Súťaže",
    subcategory: "Avantgarda",
    description: "Umelecké zákulisné stvárnenie skulpturálneho účesu."
  }
];
