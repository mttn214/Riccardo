export interface TicketTier {
  id: string;
  name: string;
  priceEUR: number;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface Seminar {
  id: string;
  title: string;
  city: string;
  country: string;
  venue: string;
  dates: string;
  category: 'Umenie Fúkanej' | 'Precízny Strih' | 'Balayage & Blond';
  duration: string;
  totalSeats: number;
  availableSeats: number;
  image: string;
  description: string;
  learningOutcomes: string[];
  schedule: { day: string; morning: string; afternoon: string }[];
  includedItems: string[];
  tiers: TicketTier[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Balayage & Farba' | 'Precízne Strihy' | 'Umenie Fúkanej & Styling' | 'Svadobné & Spoločenské';
  year: string;
  image: string;
  beforeImage?: string;
  hasBeforeAfter?: boolean;
  collection: string;
  description: string;
  technique: string;
  formula?: string;
  toolsUsed: string;
  awardsWon?: string;
}

export interface Award {
  id: string;
  year: string;
  title: string;
  organization: string;
  category: string;
  location: string;
  status: 'Víťaz' | 'Nominácia' | 'Čestné uznanie';
  citation: string;
  image: string;
  badgeIcon: 'Trophy' | 'Crown' | 'Sparkles' | 'Medal' | 'Award' | 'Heart';
  galleryImages?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city?: string;
  source: 'Google' | 'Facebook';
  sourceLabel: string;
  service?: string;
  verified: boolean;
  date: string;
  relativeTime?: string;
  quote: string;
  rating: number;
}

export const STYLIST_PROFILE = {
  name: "Richard Čonka",
  brandName: "HAIR SALON RICCARDO",
  academyName: "RICCARDO ACADEMY & ATELIER",
  tagline: "Vzdelávacie semináre, precízna tvorba & majstrovstvo účesov",
  address: "J. Kármána 1727/30, 984 01 Lučenec, Slovensko",
  phone: "+421 915 869 758",
  email: "hair.riccardo@gmail.com",
  instagramHandle: "@hair_riccardo",
  instagramUrl: "https://www.instagram.com/hair_riccardo/",
  facebookUrl: "https://www.facebook.com/hairsalonriccardo",
  googleMapsUrl: "https://maps.google.com/?q=Hair+Salon+Riccardo+Lucenec",
  bioHeadline: "Vášeň pre dokonalú fúkanú, geometriu strihu a žiarivé farby.",
  bioDescription: "Richard Čonka (Riccardo) je uznávaný slovenský hairstylist, zakladateľ prestížneho Hair Salon Riccardo v Lučenci a nositeľ ocenenia Cena verejnosti SR na prestížnych Czech & Slovak Hairdressing Awards (kaderníckych Oskaroch v Prahe). Svojou ikonickou vzdelávacou sériou 'Umenie fúkanej' a majstrovskými seminármi inšpiruje kaderníkov po celom Slovensku a Česku.",
  quote: "Vlasy nie sú len práca, sú architektúra v pohybe. Správna technika fúkanej a precízny strih dajú žene sebavedomie, ktoré zmení celú jej auru.",
  heroImage: "/images/riccardo/richard_conka_hda_1.jpg",
  stageImage: "/images/riccardo/richard_conka_stage_award.jpg",
  winnersGroupImage: "/images/riccardo/hda_winners_group_hires.jpg",
  logoImage: "/images/riccardo/salon_logo_wall.jpg",
  portraitImage: "/images/riccardo/richard_conka_hda_1.jpg",
  stats: [
    { label: "Rokov skúseností", value: "14+" },
    { label: "Vyškolených kaderníkov", value: "1,200+" },
    { label: "Súťažné ocenenie", value: "Víťaz Czech & Slovak Hairdressing Awards" },
    { label: "Spokojných klientov", value: "10,000+" },
    { label: "Vypredané semináre", value: "100%" }
  ],
  pressPartners: [
    { name: "CZECH & SLOVAK HAIRDRESSING AWARDS", quote: "Víťaz prestížnej Ceny verejnosti SR – Forum Karlín Praha." },
    { name: "ESTETICA MAGAZINE", quote: "Výnimočný talent spájajúci komerčnú nositeľnosť s haute stylingu." },
    { name: "VYSTRIHAJ SA SLOVENSKO", quote: "Hrdý partnerský salón pomáhajúci onkologickým pacientom." },
    { name: "NOTINO & ZLATÁ FIRMA", quote: "Top hodnotený kadernícky salón v Banskobystrickom kraji." }
  ]
};

export const COMPANY_DETAILS = {
  legalName: "ZETEREM s.r.o.",
  tradeName: "Hair Salon Riccardo & Academy",
  ico: "47 520 817",
  dic: "2023950863",
  vatStatus: "Neplatiteľ DPH (nie je platiteľom DPH podľa § 4 zákona o DPH)",
  registeredOffice: "Haličská cesta 942/3, 984 01 Lučenec, Slovenská republika",
  salonAddress: "J. Kármána 1727/30, 984 01 Lučenec, Slovenská republika",
  courtRegistration: "Obchodný register Okresného súdu Banská Bystrica, Oddiel: Sro, Vložka číslo: 25734/S",
  managingDirector: "Richard Čonka",
  contactEmail: "hair.riccardo@gmail.com",
  phone: "+421 915 869 758",
  secondaryPhone: "+421 908 261 740",
  bankAccount: {
    bankName: "Slovenská sporiteľňa, a.s.",
    iban: "SK42 0900 0000 0051 9804 5820",
    ibanRaw: "SK4209000000005198045820",
    swift: "GIBASKBX"
  },
  supervisoryAuthority: {
    name: "Slovenská obchodná inšpekcia (SOI)",
    inspectorate: "Inšpektorát SOI pre Banskobystrický kraj",
    address: "Kuzmányho 18, 974 01 Banská Bystrica 1",
    department: "Odbor výkonu dozoru",
    web: "https://www.soi.sk"
  },
  arsPlatform: "https://ec.europa.eu/consumers/odr"
};

export const SEMINARS_DATA: Seminar[] = [
  {
    id: "sem-umenie-fukanej-lucenec",
    title: "Umenie fúkanej: Architektúra objemu & Trvácnosť",
    city: "Lučenec",
    country: "Slovensko",
    venue: "Atelier Hair Salon Riccardo, J. Kármána 30",
    dates: "16. – 17. November 2026",
    category: "Umenie Fúkanej",
    duration: "2 dni (14 hodín intenzívnej praxe)",
    totalSeats: 6,
    availableSeats: 2,
    image: "/images/riccardo/richard_conka_hda_3.jpg",
    description: "Vlajkový autorský masterclass Richarda Čonku. Komorná skupina maximálne 6 kaderníkov pre garanciu osobnej korekcie každého ťahu kefou. Získate kontrolu nad dynamikou tepla, nadvihnutím od korienkov a zrkadlovo hladkým pohybom bez krepovatenia.",
    learningOutcomes: [
      "Správna biomechanika a ergonómia rúk pri napínaní prameňa",
      "Technika fixácie vlasu studeným vzduchom pre 72-hodinovú trvácnosť",
      "Fúkané 'Riccardo Glam Waves' výhradne cez okrúhlu termálnu kefu bez kulmy",
      "Práca s live modelkou a profesionálne fotenie pred sociálne siete"
    ],
    schedule: [
      {
        day: "1. Deň: Dynamika tepla, analýza vlasu & Live ukážky",
        morning: "09:30 – 13:00: Úvod, rozbor štruktúry vlasu, produkty a live ukážka 2 fúkaných na živých modelkách.",
        afternoon: "14:00 – 18:00: Praktický hands-on tréning na cvičných hlavách pod osobným dohľadom Richarda Čonku."
      },
      {
        day: "2. Deň: Práca na modelkách & Finálny styling",
        morning: "09:30 – 13:00: Účastníci kompletne fúkajú živé modelky (objem a glamour vlny).",
        afternoon: "14:00 – 17:30: Korekcia detailov, fotenie, odovzdanie certifikátov a toast."
      }
    ],
    includedItems: [
      "Termálna kefa z limitovanej edície Riccardo",
      "Pracovné skriptá a manuál fúkania s detailnými postupmi",
      "Oficiálny akreditovaný certifikát Riccardo Academy",
      "Gurmánsky obed a občerstvenie po oba dni",
      "Prístup do súkromnej WhatsApp skupiny absolventov pre spätnú väzbu"
    ],
    tiers: [
      {
        id: "tier-fuk-master",
        name: "Hands-On Masterpass (Limitované na 6 miest)",
        priceEUR: 380,
        description: "Kompletný 2-dňový praktický tréning s osobnou asistenciou Richarda Čonku, prácou na živej modelke a certifikátom.",
        recommended: true,
        features: [
          "Miesto v komornej skupine max 6 účastníkov",
          "Práca na cvičnej hlave aj živej modelke",
          "Termokefa Riccardo v cene",
          "Osobná korekcia techniky od Richarda Čonku",
          "Oficiálny certifikát Riccardo Academy",
          "Profesionálne fotky vášho diela pre sociálne siete"
        ]
      }
    ]
  },
  {
    id: "sem-strih-lucenec",
    title: "Precízny strih & Geometria: Víťazné línie",
    city: "Lučenec",
    country: "Slovensko",
    venue: "Atelier Hair Salon Riccardo, J. Kármána 30",
    dates: "18. – 19. Január 2027",
    category: "Precízny Strih",
    duration: "2 dni (16 hodín)",
    totalSeats: 6,
    availableSeats: 3,
    image: "/images/riccardo/richard_conka_hda_4.jpg",
    description: "Autorský strihací masterclass zameraný na techniky, ktoré Richardovi priniesli víťazstvo na Czech & Slovak Hairdressing Awards. Mikrobob, odľahčenie hmoty na zátylku a čisté línie, ktoré klientke držia tvar 10 týždňov.",
    learningOutcomes: [
      "Anatomické sekcionovanie hlavy pre prirodzený pád vlasov",
      "Vnútorné odľahčenie váhy bez stenčovania spodných dĺžok",
      "Strihanie na suchých vlasoch a personalizácia kontúr",
      "Kombinácia nožníc a britvy pre modernú textúru"
    ],
    schedule: [
      {
        day: "1. Deň: Geometria & Mikrobob architektúra",
        morning: "09:30 – 13:00: Live strih na 2 modelkách s podrobným rozborom uhlov vyťahovania.",
        afternoon: "14:00 – 18:00: Nácvik precízneho mikrobobu na prémiových cvičných hlavách."
      },
      {
        day: "2. Deň: Asymetria & Personalizácia na modelkách",
        morning: "09:30 – 13:00: Strihanie krátkych foriem a textúrovanie.",
        afternoon: "14:00 – 17:30: Finálny styling, kontrola tvarov a slávnostná certifikácia."
      }
    ],
    includedItems: [
      "Prémiová cvičná hlava z pravých vlasov",
      "Skriptá precíznych strihov",
      "Oficiálny certifikát Master Stylist (Czech & Slovak Hairdressing Awards víťaz)",
      "Obed a celodenný catering"
    ],
    tiers: [
      {
        id: "tier-str-master",
        name: "Hands-On Masterpass (Limitované na 6 miest)",
        priceEUR: 440,
        description: "Intenzívna praktická výučba na cvičnej hlave a modelke pod osobným vedením Richarda Čonku.",
        recommended: true,
        features: [
          "Iba 6 účastníkov v ateliéri",
          "Cvičná hlava z pravých vlasov v cene",
          "Osobná asistencia a korekcia strihu",
          "Certifikát Master Stylist (Czech & Slovak Hairdressing Awards víťaz)",
          "Fotozáznam vašich prác"
        ]
      }
    ]
  },
  {
    id: "sem-balayage-lucenec",
    title: "Balayage Alchemy & AirTouch: Čisté blond tóny",
    city: "Lučenec",
    country: "Slovensko",
    venue: "Atelier Hair Salon Riccardo, J. Kármána 30",
    dates: "15. – 16. Marec 2027",
    category: "Balayage & Blond",
    duration: "2 dni (16 hodín)",
    totalSeats: 6,
    availableSeats: 1,
    image: "/images/riccardo/richard_conka_hda_1.jpg",
    description: "Najžiadanejšie salónne techniky zosvetľovania: bezchybný AirTouch, plynulé prechody bez 'schodov' a tónovacie receptúry na čistú chladnú i kašmírovú blond s nulovým poškodením vlasu.",
    learningOutcomes: [
      "AirTouch separácia pre 6-mesačný bezúdržbový odrast",
      "Zónové tónovanie a korekcia teplých podtónov",
      "Správne formulácie vyvíjačov a pH kontrola",
      "Záverečná objemová fúkaná pre diamantový lesk"
    ],
    schedule: [
      {
        day: "1. Deň: Chémia zosvetľovania & AirTouch technika",
        morning: "09:30 – 13:00: Teória pigmentov, live ukážka rozfúkavania na modelke.",
        afternoon: "14:00 – 18:00: Nácvik separácie prameňov na cvičných prameňoch."
      },
      {
        day: "2. Deň: Reálna transformácia na modelke",
        morning: "09:30 – 13:30: Účastníci kompletne zosvetľujú a tónujú vlastné modelky.",
        afternoon: "14:30 – 17:30: Výsledný styling cez Umenie fúkanej a certifikácia."
      }
    ],
    includedItems: [
      "Receptár blond formulácií s presnými pomermi",
      "Balayage podložka a sada štetcov",
      "Certifikát Master Colorist",
      "Obed a catering"
    ],
    tiers: [
      {
        id: "tier-bal-master",
        name: "Hands-On Masterpass (Limitované na 6 miest)",
        priceEUR: 420,
        description: "Kompletné zosvetľovanie a tónovanie na živej modelke pod vedením Richarda Čonku.",
        recommended: true,
        features: [
          "Max 6 účastníkov",
          "Práca na vlastnej modelke s materiálom v cene",
          "Receptár blond formulácií",
          "Certifikát Master Colorist"
        ]
      }
    ]
  }
];

export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: "port-hda-1",
    title: "Žitná Symfónia",
    category: "Precízne Strihy",
    year: "2023",
    collection: "Víťazná kolekcia Czech & Slovak Hairdressing Awards (Praha)",
    image: "/images/riccardo/richard_conka_hda_1.jpg",
    description: "Ikonické dielo Richarda Čonku z víťaznej kolekcie Czech & Slovak Hairdressing Awards 2023. Skulpturálny pletený účes harmonicky popretkávaný prírodnými pšeničnými klasmi.",
    technique: "3D pletenie s variabilnou tenziou, fixácia bez krepovatenia a integrácia organických prvkov do geometrie vlasov.",
    toolsUsed: "Modelovacia pasta s matným finišom, suchý púdrový sprej, mikro-vlásenky.",
    awardsWon: "Víťaz: Cena verejnosti SR (Czech & Slovak Hairdressing Awards 2023)"
  },
  {
    id: "port-hda-2",
    title: "Avant-Garde Volumetry",
    category: "Umenie Fúkanej & Styling",
    year: "2023",
    collection: "Víťazná kolekcia Czech & Slovak Hairdressing Awards (Praha)",
    image: "/images/riccardo/richard_conka_hda_2.jpg",
    description: "Monumentálny haute coiffure objem a jemná textúra. Ukážka nekompromisnej kontroly nad hustotou, tvarovaním a čistou siluetou účesu.",
    technique: "Mikro-krepovanie prameň po prameni pri korienkoch, vnútorné vystuženie a zamatové vyhladenie vonkajšej plochy.",
    toolsUsed: "Profesionálna stylingová žehlička, karbónový tupírovací hrebeň, fixačný závoj.",
    awardsWon: "Víťaz: Cena verejnosti SR (Czech & Slovak Hairdressing Awards 2023)"
  },
  {
    id: "port-hda-3",
    title: "Dark Elegance & Texture",
    category: "Umenie Fúkanej & Styling",
    year: "2023",
    collection: "Víťazná kolekcia Czech & Slovak Hairdressing Awards (Praha)",
    image: "/images/riccardo/richard_conka_hda_3.jpg",
    description: "Súťažný záber na dramatickom čiernom pozadí. Kontrast bohatej štruktúry a precíznej siluety, ktorý presvedčil tisíce hlasujúcich po celom Slovensku.",
    technique: "Vrstvenie textúry, fixácia kontúrových partií a finálny saténový lesk.",
    toolsUsed: "Iontový fén, difuzér, stylingový textúrovací sprej.",
    awardsWon: "Víťaz: Cena verejnosti SR (Czech & Slovak Hairdressing Awards 2023)"
  },
  {
    id: "port-hda-4",
    title: "Pocta Tradícii & Chlieb",
    category: "Precízne Strihy",
    year: "2023",
    collection: "Víťazná kolekcia Czech & Slovak Hairdressing Awards (Praha)",
    image: "/images/riccardo/richard_conka_hda_4.jpg",
    description: "Portrétne vyjadrenie slovenskej folklórnej identity pretavené do svetového kaderníckeho remesla. Plynulý vrkoč s prirodzeným padaním prameňov.",
    technique: "Uvoľnené kontúrové partie lemujúce lícne kosti, asymetrické vyváženie váhy účesu.",
    toolsUsed: "Kefa s prírodnými štetinami, zmatňujúca stylingová hlina.",
    awardsWon: "Víťaz: Cena verejnosti SR (Czech & Slovak Hairdressing Awards 2023)"
  }
];

export const AWARDS_DATA: Award[] = [
  {
    id: "award-1",
    year: "2023",
    title: "VÍŤAZ: Cena verejnosti SR",
    organization: "Czech & Slovak Hairdressing Awards",
    category: "Hlavná divácka kategória Slovensko",
    location: "Forum Karlín, Praha",
    status: "Víťaz",
    citation: "Zisk prestížnej kaderníckej sošky na slávnostnom galavečere 17. ročníka Czech & Slovak Hairdressing Awards v Prahe na základe celonárodného hlasovania verejnosti.",
    image: "/images/riccardo/richard_conka_stage_award.jpg",
    badgeIcon: "Trophy",
    galleryImages: [
      "/images/riccardo/richard_conka_stage_award.jpg",
      "/images/riccardo/hda_winners_group_hires.jpg",
      "/images/riccardo/richard_conka_hda_1.jpg",
      "/images/riccardo/richard_conka_hda_2.jpg",
      "/images/riccardo/richard_conka_hda_3.jpg",
      "/images/riccardo/richard_conka_hda_4.jpg"
    ]
  },
  {
    id: "award-2",
    year: "2023",
    title: "Nominácia: Dámsky komerčný účes",
    organization: "Czech & Slovak Hairdressing Awards",
    category: "Dámska kategória Slovensko",
    location: "Praha, Česká republika",
    status: "Nominácia",
    citation: "Odborná medzinárodná porota ocenila Richardovu kolekciu dámskych strihov a stylingu medzi top finalistov celého Česka a Slovenska.",
    image: "/images/riccardo/richard_conka_hda_2.jpg",
    badgeIcon: "Crown"
  },
  {
    id: "award-3",
    year: "2024",
    title: "Certifikovaný Partner: Vystrihaj sa Slovensko",
    organization: "Liga proti rakovine & Vystrihaj sa Slovensko",
    category: "Dobročinné kaderníctvo",
    location: "Slovensko",
    status: "Čestné uznanie",
    citation: "Hair Salon Riccardo v Lučenci je aktívnym partnerským salónom, ktorý bezplatne strihá a odovzdáva vlasy pre výrobu parochní pre onkologické pacientky.",
    image: "/images/riccardo/salon_logo_wall.jpg",
    badgeIcon: "Heart"
  },
  {
    id: "award-4",
    year: "2024",
    title: "Zlatá Firma & Notino Top Salón",
    organization: "Hodnotenie zákazníkov & Zlatá Firma",
    category: "Kvalita služieb a spokojnosť zákazníkov",
    location: "Lučenec / Banskobystrický kraj",
    status: "Víťaz",
    citation: "Ocenenie za dlhodobo najvyššie hodnotenie služieb, profesionalitu tímu a príjemnú rodinnú atmosféru v Lučenci.",
    image: "/images/riccardo/hda_winners_group_hires.jpg",
    badgeIcon: "Sparkles"
  },
  {
    id: "award-5",
    year: "2019",
    title: "Nominácia: Pánsky komerčný strih & styling",
    organization: "Czech & Slovak Hairdressing Awards",
    category: "Pánska kategória",
    location: "Praha, Česká republika",
    status: "Nominácia",
    citation: "Prebojovanie sa medzi elitu kaderníckeho remesla v Česku a na Slovensku s precíznou pánskou kolekciou.",
    image: "/images/riccardo/richard_conka_stage_award.jpg",
    badgeIcon: "Medal"
  }
];

export const TESTIMONIALS_STATS = {
  averageRating: "5.0",
  totalReviews: "62",
  googleCount: "44",
  facebookCount: "18",
  recommendationRate: "100%",
  distribution: [
    { stars: 5, percentage: 98, count: 61 },
    { stars: 4, percentage: 2, count: 1 },
    { stars: 3, percentage: 0, count: 0 },
    { stars: 2, percentage: 0, count: 0 },
    { stars: 1, percentage: 0, count: 0 },
  ]
};

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "rev-google-1",
    name: "Katarína Marcineková",
    role: "Overená zákazníčka salónu",
    city: "Lučenec",
    source: "Google",
    sourceLabel: "Google Recenzia",
    service: "Umenie fúkanej & Melír",
    verified: true,
    date: "Google Maps",
    relativeTime: "pred 2 týždňami",
    quote: "Najlepší salón v Lučenci a širokom okolí. Richard je neskutočný profesionál, ktorý presne vie, čo vlasy potrebujú. Strih aj farba vždy predčia očakávania a fúkaná mi drží niekoľko dní v perfektnom stave bez krepovatenia. Úžasná priateľská a rodinná atmosféra.",
    rating: 5
  },
  {
    id: "rev-fb-1",
    name: "Michaela Kováčiková",
    role: "Pravidelná klientka",
    city: "Lučenec",
    source: "Facebook",
    sourceLabel: "Facebook Odporúčanie",
    service: "Cashmere Blonde Balayage",
    verified: true,
    date: "Facebook",
    relativeTime: "pred 3 týždňami",
    quote: "Hair Salon Riccardo odporúčam všetkými desiatimi! Chodím sem pravidelne na zosvetlenie a tónovanie. Žiadne zničené končeky, práve naopak – vlasy sú lesklé, hebké a farba vyzerá luxusne a prirodzene. Vždy odchádzam nadšená.",
    rating: 5
  },
  {
    id: "rev-google-2",
    name: "Jana Balážová",
    role: "Overená zákazníčka salónu",
    city: "Poltár",
    source: "Google",
    sourceLabel: "Google Recenzia",
    service: "Darovanie vlasov – Vystrihaj sa Slovensko",
    verified: true,
    date: "Google Maps",
    relativeTime: "pred 1 mesiacom",
    quote: "Oceňujem nielen špičkovú precíznosť strihu a zmysel pre detail, ale hlavne ľudský prístup. Keď sme do salónu prišli s dcérou darovať vlasy pre onkologických pacientov v rámci projektu Vystrihaj sa Slovensko, prístup Richarda a celého tímu bol nesmierne ústretový, citlivý a srdečný. Salón má obrovské srdce.",
    rating: 5
  },
  {
    id: "rev-fb-2",
    name: "Lucia Šimková",
    role: "Klientka salónu",
    city: "Fiľakovo",
    source: "Facebook",
    sourceLabel: "Facebook Odporúčanie",
    service: "Spoločenský & Svadobný styling",
    verified: true,
    date: "Facebook",
    relativeTime: "pred 1 mesiacom",
    quote: "Richard Čonka je pán majster svojho remesla. Robil mi účes na svadbu a vydržal neporušený tancovanie až do rána. Každý sa pýtal, odkiaľ mám tak nádherne upravené vlasy. Priestory v Lučenci sú komorné, čisté a človek si tam skutočne oddýchne.",
    rating: 5
  },
  {
    id: "rev-google-3",
    name: "Dominika Vargová",
    role: "Overená zákazníčka salónu",
    city: "Lučenec",
    source: "Google",
    sourceLabel: "Google Recenzia",
    service: "Precízny strih Mikrobob",
    verified: true,
    date: "Google Maps",
    relativeTime: "pred 2 mesiacmi",
    quote: "Jednoznačne 5 hviezdičiek. Vždy profesionálne poradenstvo, kvalitná vlasová kozmetika a precízna práca bez akéhokoľvek náhlenia. Strih mi perfektne drží formu už 8 týždňov. Je vidno, že svoju prácu robia srdcom a s obrovským talentom.",
    rating: 5
  },
  {
    id: "rev-fb-3",
    name: "Veronika Petrovičová",
    role: "Pravidelná klientka",
    city: "Banská Bystrica",
    source: "Facebook",
    sourceLabel: "Facebook Odporúčanie",
    service: "AirTouch Balayage & Glaze",
    verified: true,
    date: "Facebook",
    relativeTime: "pred 2 mesiacmi",
    quote: "Kvôli Richardovi cestujem z Banskej Bystrice a oplatí sa každý kilometer. Skvelý prístup, moderné techniky a perfektné prostredie. Jeho víťazstvo na Czech & Slovak Hairdressing Awards len potvrdilo to, čo my zákazníčky vieme už roky. Veľká vďaka!",
    rating: 5
  },
  {
    id: "rev-google-4",
    name: "Peter Novák",
    role: "Overený zákazník",
    city: "Lučenec",
    source: "Google",
    sourceLabel: "Google Recenzia",
    service: "Pánsky precízny strih & Barber úprava",
    verified: true,
    date: "Google Maps",
    relativeTime: "pred 2 mesiacmi",
    quote: "Chodím sem už roky. Skvelý tím, presný strih na mieru, rýchla dohoda termínu a bezproblémové parkovanie priamo pred domom. Najlepšie holičstvo a kaderníctvo v meste.",
    rating: 5
  },
  {
    id: "rev-google-5",
    name: "Martina Haláková",
    role: "Overená zákazníčka salónu",
    city: "Rimavská Sobota",
    source: "Google",
    sourceLabel: "Google Recenzia",
    service: "Umenie fúkanej & Hĺbková kúra",
    verified: true,
    date: "Google Maps",
    relativeTime: "pred 3 mesiacmi",
    quote: "Fúkaná od Richarda je zážitok. Vlasy majú neskutočný objem, lesk a pritom sú jemné na dotyk. Poradil mi aj domácu starostlivosť a šampóny, ktoré mi konečne dali vlasy dokopy. Určite odporúčam každému, kto hľadá prémiovú starostlivosť.",
    rating: 5
  },
  {
    id: "rev-fb-4",
    name: "Simona Kmeťová",
    role: "Klientka salónu",
    city: "Lučenec",
    source: "Facebook",
    sourceLabel: "Facebook Odporúčanie",
    service: "Korekcia farby & Precízny strih",
    verified: true,
    date: "Facebook",
    relativeTime: "pred 3 mesiacmi",
    quote: "Richard mi doslova zachránil vlasy po nevydarenom domácom odfarbovaní. Trpezlivo mi vysvetlil celý postup, stiahol nepekné žlté tóny a vlasy zostali zdravé a vitálne. Skutočný odborník.",
    rating: 5
  },
  {
    id: "rev-google-6",
    name: "Zuzana Tóthová",
    role: "Overená zákazníčka salónu",
    city: "Veľký Krtíš",
    source: "Google",
    sourceLabel: "Google Recenzia",
    service: "Objemová fúkaná & Úprava dĺžok",
    verified: true,
    date: "Google Maps",
    relativeTime: "pred 4 mesiacmi",
    quote: "Príjemná, takmer rodinná atmosféra, šálka skvelej kávy a najmä ruky odborníka, ktorému môžete bez obáv zveriť svoje vlasy. Vždy odchádzam s pocitom sebavedomia.",
    rating: 5
  },
  {
    id: "rev-google-7",
    name: "Marek Daniš",
    role: "Overený zákazník",
    city: "Lučenec",
    source: "Google",
    sourceLabel: "Google Recenzia",
    service: "Pánsky klasický strih",
    verified: true,
    date: "Google Maps",
    relativeTime: "pred 4 mesiacmi",
    quote: "Kvalitná práca, čisté prostredie a príjemný pokec. V Lučenci jednoznačná jednotka.",
    rating: 5
  },
  {
    id: "rev-fb-5",
    name: "Andrea Horváthová",
    role: "Pravidelná klientka",
    city: "Zvolen",
    source: "Facebook",
    sourceLabel: "Facebook Odporúčanie",
    service: "Balayage transformácia",
    verified: true,
    date: "Facebook",
    relativeTime: "pred 5 mesiacmi",
    quote: "Prekrásne zosvetlenie, plynulý prechod bez ostrých línií a vlasy vyzerajú prirodzene aj po niekoľkých mesiacoch bez nutnosti neustáleho dofarbovania korienkov. 100% spokojnosť.",
    rating: 5
  },
  {
    id: "rev-google-8",
    name: "Elena Králiková",
    role: "Overená zákazníčka salónu",
    city: "Lučenec",
    source: "Google",
    sourceLabel: "Google Recenzia",
    service: "Dámsky strih & Regenerácia",
    verified: true,
    date: "Google Maps",
    relativeTime: "pred 5 mesiacmi",
    quote: "Vždy ochotný personál, ústretovosť s termínom a precízny výsledok. Hair Salon Riccardo je dôkazom, že špičková úroveň môže fungovať aj mimo hlavného mesta.",
    rating: 5
  },
  {
    id: "rev-fb-6",
    name: "Barbora Medveďová",
    role: "Klientka salónu",
    city: "Bratislava / Lučenec",
    source: "Facebook",
    sourceLabel: "Facebook Odporúčanie",
    service: "Styling & Fúkaná",
    verified: true,
    date: "Facebook",
    relativeTime: "pred 6 mesiacmi",
    quote: "Kedykoľvek prídem domov do Lučenca na víkend, moja prvá zastávka je u Richarda. V Bratislave platím trojnásobok za polovičnú kvalitu. Richard má dar a jeho ocenenie z Prahy je absolútne zaslúžené.",
    rating: 5
  }
];

export const PAST_SEMINAR_RECAPS = [
  {
    city: "Lučenec",
    edition: "Umenie fúkanej – Jesenný turnus",
    attendees: 6,
    countriesRepresented: "SR & ČR",
    rating: "5.0 / 5.0",
    image: "/images/riccardo/richard_conka_hda_2.jpg",
    highlight: "Vypredané za 4 hodiny od zverejnenia. Komorná atmosféra priamo v materskom salóne v Lučenci s individuálnym prístupom."
  }
];

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "Priebeh" | "Vybavenie" | "Certifikácia" | "Rezervácia";
}

export const ACADEMY_FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "Priebeh",
    question: "Prečo je kapacita striktne obmedzená na maximálne 6 kaderníkov?",
    answer: "Richard Čonka odmieta masové školenia v kongresových sálach, kde školiteľ nemá čas na jednotlivcov. Naším cieľom je elitný prenos zručností — Richard sa osobne venuje každému strihu, uhlu vyťahovania prameňov a vedeniu nožníc každého jedného účastníka. Preto sú semináre vypísané iba raz za 1 až 2 mesiace a miesta sa zapĺňajú okamžite."
  },
  {
    id: "faq-2",
    category: "Vybavenie",
    question: "Čo si musím priniesť so sebou na masterclass?",
    answer: "Potrebujete len svoje obľúbené osobné nožnice, prestrihávacie nožnice a hrebene, s ktorými ste zvyknutí pracovať. Profesionálne cvičné hlavy z prémiových 100% pravých vlasov, fény, žehličky, profesionálny styling a skriptá sú kompletne zabezpečené v ateliéri."
  },
  {
    id: "faq-3",
    category: "Certifikácia",
    question: "Aký certifikát po absolvovaní seminára získam?",
    answer: "Získate oficiálny tlačený certifikát Riccardo Academy s osobným podpisom Richarda Čonku, víťaza Czech & Slovak Hairdressing Awards. Certifikát potvrdzuje zvládnutie pokročilých techník fúkanej, strihu alebo balayage podľa štandardov oceneného ateliéru."
  },
  {
    id: "faq-4",
    category: "Priebeh",
    question: "Je v cene masterpassu zahrnuté občerstvenie a obed?",
    answer: "Áno, celý deň máte k dispozícii prémiovú kávu, nealko, snacky a spoločný obed v cene. Počas obeda prebieha uvoľnený networking a otvorená diskusia o cenotvorbe, marketingu salónu a komunikácii s prémiovou klientelou."
  },
  {
    id: "faq-5",
    category: "Rezervácia",
    question: "Ako funguje VIP čakacia listina, ak sú miesta vypredané?",
    answer: "Ak je aktuálny termín obsadený, zapíšte sa na VIP čakaciu listinu. Získate prednostné upozornenie o novom termíne (SMS alebo e-mail) 24 hodín predtým, než sa drop oficiálne zverejní na sociálnych sieťach."
  },
  {
    id: "faq-6",
    category: "Rezervácia",
    question: "Aké sú platobné a storno podmienky?",
    answer: "Miesto je záväzne rezervované po úhrade zálohy (100 €). Doplatok sa hradí v deň konania. V prípade nepredvídaných okolností je možné rezerváciu bezplatne previesť na kolegu alebo kolegyňu z vášho salónu."
  }
];

export const PAST_SOLD_OUT_SEMINARS = [
  {
    id: "past-1",
    title: "Umenie fúkanej & Signature Styling",
    date: "Október 2026",
    seatsTotal: 6,
    soldOutTime: "Vypredané za 4 hodiny",
    attendeesFrom: ["Bratislava", "Košice", "Banská Bystrica", "Brno"],
    rating: "Hodnotenie 5.0 (6/6 odporúčaní)",
    image: "/images/riccardo/richard_conka_hda_2.jpg"
  },
  {
    id: "past-2",
    title: "Precízny mikrobob & Geometria",
    date: "August 2026",
    seatsTotal: 6,
    soldOutTime: "Vypredané za 9 hodín",
    attendeesFrom: ["Praha", "Žilina", "Zvolen", "Lučenec"],
    rating: "Hodnotenie 5.0 (6/6 odporúčaní)",
    image: "/images/riccardo/richard_conka_hda_4.jpg"
  },
  {
    id: "past-3",
    title: "Balayage Alchemy & Dim-Out",
    date: "Jún 2026",
    seatsTotal: 6,
    soldOutTime: "Vypredané za 6 hodín",
    attendeesFrom: ["Trnava", "Nitra", "Poprad", "Bratislava"],
    rating: "Hodnotenie 5.0 (6/6 odporúčaní)",
    image: "/images/riccardo/richard_conka_hda_1.jpg"
  }
];
