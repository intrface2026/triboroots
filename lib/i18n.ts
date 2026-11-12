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

export interface GateCopy {
  badge: string;
  headline: string;
  handNote: string;
  description: string;
  perkTag: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  planLabel: string;
  planOptions: string[];
  offersOptIn: string;
  submit: string;
  submitting: string;
  privacyNote: string;
  requiredError: string;
  emailError: string;
  serverError: string;
}

export const GATE_COPY: Record<Locale, GateCopy> = {
  en: {
    badge: "UNDER CONSTRUCTION • OFF THE TRAIL",
    headline: "This trail looks lost — we're finding our way back.",
    handNote: "Pssst… want to take an early peek?",
    description:
      "TriboRoots Hostel is still pitching its tents, brewing the masala chai, and painting the murals. Drop your details below to unlock a live sneak peek at what we've built so far — plus we might just send over some founding-stay offers.",
    perkTag: "First-access hostel deals & launch invites",
    nameLabel: "Full Name",
    namePlaceholder: "Aarav Sharma",
    emailLabel: "Email Address",
    emailPlaceholder: "you@example.com",
    phoneLabel: "Phone / WhatsApp",
    phonePlaceholder: "+91 98765 43210",
    planLabel: "Trip Vibe",
    planOptions: [
      "Solo backpacker",
      "Workation stay",
      "Friends / Group trip",
      "Just peeking around",
    ],
    offersOptIn: "Yes, send me early-bird TriboRoots hostel offers",
    submit: "Unlock Website Peek",
    submitting: "Unlocking your trail pass…",
    privacyNote: "No spam — just early access & warm hostel offers.",
    requiredError: "Please fill in your name, email, and phone number.",
    emailError: "Please enter a valid email address.",
    serverError: "Could not unlock right now. Please try again in a moment.",
  },
  hi: {
    badge: "वेबसाइट निर्माणाधीन • राह ढूँढ रहे हैं",
    headline: "हम अभी रास्ते पर हैं — बहुत जल्द लौटेंगे।",
    handNote: "अरे… अंदर की एक झलक देखना चाहते हैं?",
    description:
      "ट्राइबरूट्स हॉस्टल की दुनिया अभी सजाई जा रही है। अगर आप हमारी अब तक बनी वेबसाइट की शुरुआती झलक देखना चाहते हैं (और ख़ास ओपनिंग ऑफ़र्स पाना चाहते हैं), तो नीचे अपनी जानकारी दर्ज करें।",
    perkTag: "शुरुआती मेहमानों के लिए ख़ास हॉस्टल ऑफ़र्स",
    nameLabel: "पूरा नाम",
    namePlaceholder: "आरव शर्मा",
    emailLabel: "ईमेल पता",
    emailPlaceholder: "you@example.com",
    phoneLabel: "फ़ोन / व्हाट्सऐप",
    phonePlaceholder: "+91 98765 43210",
    planLabel: "यात्रा का मूड",
    planOptions: [
      "सोलो बैकपैकर",
      "वर्कएशन स्टे",
      "दोस्तों का ग्रुप",
      "बस झलक देख रहा/रही हूँ",
    ],
    offersOptIn: "हाँ, मुझे ट्राइबरूट्स के शुरुआती हॉस्टल ऑफ़र्स भेजें",
    submit: "वेबसाइट की झलक खोलें",
    submitting: "आपका पास तैयार हो रहा है…",
    privacyNote: "कोई स्पैम नहीं — सिर्फ़ शुरुआती झलक और ख़ास ऑफ़र्स।",
    requiredError: "कृपया अपना नाम, ईमेल और फ़ोन नंबर भरें।",
    emailError: "कृपया सही ईमेल पता दर्ज करें।",
    serverError: "अभी अनलॉक नहीं हो सका। कृपया थोड़ी देर बाद पुनः प्रयास करें।",
  },
};
