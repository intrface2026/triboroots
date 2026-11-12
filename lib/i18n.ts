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
  details: string[];
}

export interface HeroCopy {
  brandName: string;
  menu: string;
  closeMenu: string;
  menuSelectedNote: (label: string) => string;
  menuItems: MenuItemCopy[];
  railHeading: string;
  railCaption: string;
  railFront: string;
  railBack: string;
  railShow: string;
  railExplore: string;
  railPrev: string;
  railNext: string;
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
    menuSelectedNote: (label) => `${label} — section coming right up!`,
    menuItems: [
      {
        id: "gallery",
        label: "Gallery",
        sublabel: "Vibes & corners",
        details: [
          "Curated hostel spaces & golden hour corners",
          "Community murals, courtyard & roof deck",
        ],
      },
      {
        id: "rooms",
        label: "Rooms",
        sublabel: "Dorms & private",
        details: [
          "Cozy social bunks with privacy curtains",
          "Quiet private suites with earthy linen",
        ],
      },
      {
        id: "offer",
        label: "What We Offer",
        sublabel: "Perks & café",
        details: [
          "High-speed Wi-Fi & co-work nooks",
          "In-house slow-brew café & communal kitchen",
        ],
      },
      {
        id: "activities",
        label: "Activities",
        sublabel: "Jam nights & treks",
        details: [
          "Sunrise guided trail walks & bonfires",
          "Acoustic jam sessions & family dinners",
        ],
      },
      {
        id: "contact",
        label: "Contact Us",
        sublabel: "Find our roots",
        details: [
          "24/7 front desk & arrival directions",
          "Group stays, collaborations & events",
        ],
      },
    ],
    railHeading: "Pick Your Trail Pack",
    railCaption: "Tap or hover a backpack on the rail to turn & open it",
    railFront: "Front",
    railBack: "Back",
    railShow: "Show pack details",
    railExplore: "Open section",
    railPrev: "Previous backpack",
    railNext: "Next backpack",
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
    menuSelectedNote: (label) => `${label} — यह अनुभाग जल्द आ रहा है!`,
    menuItems: [
      {
        id: "gallery",
        label: "गैलरी",
        sublabel: "झलकियाँ और कोने",
        details: [
          "हॉस्टल की खूबसूरत जगहें और शांत कोने",
          "कम्युनिटी भित्तिचित्र, आँगन और रूफ़टॉप",
        ],
      },
      {
        id: "rooms",
        label: "कमरे",
        sublabel: "डॉर्म और प्राइवेट",
        details: [
          "प्राइवेसी पर्दों के साथ आरामदायक सोशल बंक",
          "प्राकृतिक लिनेन वाले शांत प्राइवेट रूम",
        ],
      },
      {
        id: "offer",
        label: "हमारी सुविधाएँ",
        sublabel: "कैफ़े और सहूलियतें",
        details: [
          "हाई-स्पीड वाई-फ़ाई और को-वर्क कोने",
          "इन-हाउस कैफ़े और साझा रसोईघर",
        ],
      },
      {
        id: "activities",
        label: "गतिविधियाँ",
        sublabel: "संगीत और सैर",
        details: [
          "सूर्योदय ट्रेल वॉक और बॉनफ़ायर शामें",
          "एकॉस्टिक जैम सेशन और साथ डिनर",
        ],
      },
      {
        id: "contact",
        label: "संपर्क करें",
        sublabel: "हम तक पहुँचें",
        details: [
          "24/7 फ्रंट डेस्क और पहुँचने के निर्देश",
          "ग्रुप स्टे, कोलैबोरेशन और इवेंट्स",
        ],
      },
    ],
    railHeading: "अपना बैकपैक चुनें",
    railCaption: "किसी भी बैकपैक को घुमाने और खोलने के लिए उस पर टैप या होवर करें",
    railFront: "आगे",
    railBack: "पीछे",
    railShow: "विवरण देखें",
    railExplore: "यह सेक्शन खोलें",
    railPrev: "पिछला बैकपैक",
    railNext: "अगला बैकपैक",
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
