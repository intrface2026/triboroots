export type Locale = "en" | "hi";

export type MenuSectionId =
  | "gallery"
  | "rooms"
  | "offer"
  | "activities"
  | "contact";

export interface MenuItemCopy {
  id: MenuSectionId;
  label: string;
  sublabel: string;
}

export interface HeroCopy {
  brandName: string;
  menu: string;
  closeMenu: string;
  menuEyebrow: string;
  menuHint: string;
  menuSelectedNote: (label: string) => string;
  menuItems: MenuItemCopy[];
  switchLanguageLabel: string;
  muteLabel: string;
  unmuteLabel: string;
  logoAlt: string;
  tileLabel: (index: number) => string;
  photoAlt: (index: number) => string;
  book: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  go: string;
  hideBooking: string;
  showBooking: string;
}

export const HERO_COPY: Record<Locale, HeroCopy> = {
  en: {
    brandName: "TriboRoots",
    menu: "menu",
    closeMenu: "Close menu",
    menuEyebrow: "TriboRoots Platter",
    menuHint: "Tap any item on the plate to explore",
    menuSelectedNote: (label) => `${label} — section coming right up!`,
    menuItems: [
      { id: "gallery", label: "Gallery", sublabel: "Vibes & corners" },
      { id: "rooms", label: "Rooms", sublabel: "Dorms & private" },
      { id: "offer", label: "What We Offer", sublabel: "Perks & café" },
      { id: "activities", label: "Activities", sublabel: "Jam nights & treks" },
      { id: "contact", label: "Contact Us", sublabel: "Find our roots" },
    ],
    switchLanguageLabel: "Switch language to Hindi",
    muteLabel: "Mute ambient sound",
    unmuteLabel: "Unmute ambient sound",
    logoAlt: "TriboRoots Hostel",
    tileLabel: (index) => `Reveal hostel photo ${index}`,
    photoAlt: (index) => `TriboRoots hostel snapshot ${index}`,
    book: "Book",
    checkIn: "CHECK IN",
    checkOut: "CHECK OUT",
    guests: "GUESTS",
    go: "Go!",
    hideBooking: "Hide booking bar",
    showBooking: "Show booking bar",
  },
  hi: {
    brandName: "ट्राइबरूट्स",
    menu: "मेनू",
    closeMenu: "मेनू बंद करें",
    menuEyebrow: "ट्राइबरूट्स थाली",
    menuHint: "आगे बढ़ने के लिए थाली में किसी भी बटन पर क्लिक करें",
    menuSelectedNote: (label) => `${label} — यह अनुभाग जल्द आ रहा है!`,
    menuItems: [
      { id: "gallery", label: "गैलरी", sublabel: "झलकियाँ और कोने" },
      { id: "rooms", label: "कमरे", sublabel: "डॉर्म और प्राइवेट" },
      { id: "offer", label: "हमारी सुविधाएँ", sublabel: "कैफ़े और सहूलियतें" },
      { id: "activities", label: "गतिविधियाँ", sublabel: "संगीत और सैर" },
      { id: "contact", label: "संपर्क करें", sublabel: "हम तक पहुँचें" },
    ],
    switchLanguageLabel: "भाषा बदलकर अंग्रेज़ी करें",
    muteLabel: "ध्वनि बंद करें",
    unmuteLabel: "ध्वनि चालू करें",
    logoAlt: "ट्राइबरूट्स हॉस्टल",
    tileLabel: (index) => `हॉस्टल की झलक ${index} देखें`,
    photoAlt: (index) => `ट्राइबरूट्स हॉस्टल फ़ोटो ${index}`,
    book: "बुक करें",
    checkIn: "चेक-इन",
    checkOut: "चेक-आउट",
    guests: "मेहमान",
    go: "चलो!",
    hideBooking: "बुकिंग बार छिपाएँ",
    showBooking: "बुकिंग बार दिखाएँ",
  },
};
