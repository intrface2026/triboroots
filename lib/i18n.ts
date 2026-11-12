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
  guestsInputLabel: string;
  go: string;
  hideBooking: string;
  showBooking: string;
  months: string[];
  monthsShort: string[];
  weekdaysShort: string[];
  prevMonth: string;
  nextMonth: string;
  clearDates: string;
  doneDates: string;
  selectDatesHint: string;
  nightsLabel: (nights: number) => string;
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
    guestsInputLabel: "Number of guests",
    go: "Go!",
    hideBooking: "Hide booking bar",
    showBooking: "Show booking bar",
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    monthsShort: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    weekdaysShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    prevMonth: "Previous month",
    nextMonth: "Next month",
    clearDates: "Clear",
    doneDates: "Done",
    selectDatesHint: "Pick dates",
    nightsLabel: (nights) => `${nights} ${nights === 1 ? "night" : "nights"}`,
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
    guestsInputLabel: "मेहमानों की संख्या",
    go: "चलो!",
    hideBooking: "बुकिंग बार छिपाएँ",
    showBooking: "बुकिंग बार दिखाएँ",
    months: [
      "जनवरी",
      "फ़रवरी",
      "मार्च",
      "अप्रैल",
      "मई",
      "जून",
      "जुलाई",
      "अगस्त",
      "सितंबर",
      "अक्तूबर",
      "नवंबर",
      "दिसंबर",
    ],
    monthsShort: [
      "जन॰",
      "फ़र॰",
      "मार्च",
      "अप्रै॰",
      "मई",
      "जून",
      "जुला॰",
      "अग॰",
      "सित॰",
      "अक्तू॰",
      "नव॰",
      "दिस॰",
    ],
    weekdaysShort: ["र", "सो", "मं", "बु", "गु", "शु", "श"],
    prevMonth: "पिछला महीना",
    nextMonth: "अगला महीना",
    clearDates: "साफ़",
    doneDates: "हो गया",
    selectDatesHint: "तारीख़ चुनें",
    nightsLabel: (nights) => `${nights} ${nights === 1 ? "रात" : "रातें"}`,
  },
};

export interface GateCopy {
  headline: string;
  handNote: string;
  ctaButton: string;
  modalTitle: string;
  modalSubtitle: string;
  closeModal: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  noteLabel: string;
  notePlaceholder: string;
  submit: string;
  submitting: string;
  requiredError: string;
  emailError: string;
  serverError: string;
}

export const GATE_COPY: Record<Locale, GateCopy> = {
  en: {
    headline: "We're lost on the trail — finding our way back.",
    handNote: "Want an early peek & secret hostel offers?",
    ctaButton: "lemme see 👀",
    modalTitle: "Who’s knocking?",
    modalSubtitle:
      "Leave your details below to peek at what we've built so far — we might even send some opening hostel offers your way.",
    closeModal: "Close form",
    nameLabel: "Name",
    namePlaceholder: "Your full name",
    emailLabel: "Email",
    emailPlaceholder: "you@domain.com",
    phoneLabel: "Phone / WhatsApp",
    phonePlaceholder: "+91 98765 43210",
    noteLabel: "What brings you here?",
    notePlaceholder: "Looking for a stay, planning a trip, or just curious",
    submit: "Step inside →",
    submitting: "Opening the door…",
    requiredError: "Please fill in all fields before stepping inside.",
    emailError: "That email doesn't look quite right.",
    serverError: "Something slipped on the trail. Please try once more.",
  },
  hi: {
    headline: "हम अभी रास्ते पर हैं — बहुत जल्द लौटेंगे।",
    handNote: "क्या आप अंदर की शुरुआती झलक देखना चाहते हैं?",
    ctaButton: "ज़रा दिखाओ 👀",
    modalTitle: "अंदर आने से पहले",
    modalSubtitle:
      "अब तक बनी वेबसाइट देखने के लिए अपनी जानकारी भरें — हो सकता है हम आपको शुरुआती हॉस्टल ऑफ़र्स भी भेजें।",
    closeModal: "फ़ॉर्म बंद करें",
    nameLabel: "नाम",
    namePlaceholder: "आपका पूरा नाम",
    emailLabel: "ईमेल",
    emailPlaceholder: "you@domain.com",
    phoneLabel: "फ़ोन / व्हाट्सऐप",
    phonePlaceholder: "+91 98765 43210",
    noteLabel: "किस सिलसिले में आना हुआ?",
    notePlaceholder: "सोलो ट्रिप, दोस्तों के साथ स्टे, या बस एक झलक",
    submit: "अंदर आओ →",
    submitting: "दरवाज़ा खुल रहा है…",
    requiredError: "कृपया अंदर जाने से पहले सभी जानकारी भरें।",
    emailError: "कृपया सही ईमेल पता लिखें।",
    serverError: "कुछ गड़बड़ हो गई, कृपया एक बार फिर कोशिश करें।",
  },
};
