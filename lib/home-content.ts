import enHome from "@/data/home.en.json";
import hyHome from "@/data/home.hy.json";
import ruHome from "@/data/home.ru.json";
import type { Locale } from "@/lib/i18n";

export type LinkContent = {
  label: string;
  href: string;
};

export type LanguageContent = {
  label: string;
  triggerLabel: string;
  names: Record<Locale, string>;
};

export type CertificateItem = {
  title: string;
  issuer: string;
  year: string;
  number?: string;
  // Path to the scan under public/ when a copy exists (currently only the
  // director's four documents); text-only records render as hairline rows.
  image?: string;
  imageLabel?: string;
};

// Detailed profile shown on /[locale]/team/[slug]. Draft demo data for every
// expert except the director, whose entries are grounded in his documents.
export type ExpertProfile = {
  bio: string[];
  education: {
    period: string;
    title: string;
    place: string;
  }[];
  career: {
    period: string;
    title: string;
    place: string;
  }[];
  languages: string[];
  certificates: CertificateItem[];
};

// One entry of the expert roster. `directions` holds service slugs from
// services.items (shared across locales); `experience` is the localized
// display string, `experienceYears` the numeric value used for filtering
// and sorting.
export type ExpertItem = {
  slug: string;
  name: string;
  role: string;
  imageLabel: string;
  directions: string[];
  experienceYears: number;
  experience: string;
  profile: ExpertProfile;
};

export type HomeContent = {
  meta: {
    title: string;
    description: string;
  };
  common: {
    brandName: string;
    skipToContent: string;
    pageInProgress: string;
  };
  navigation: {
    primaryLabel: string;
    mobileLabel: string;
    primary: LinkContent[];
    sections: LinkContent[];
  };
  header: {
    homeLabel: string;
    language: LanguageContent;
    contactCta: LinkContent;
  };
  mobileNav: {
    openLabel: string;
    closeLabel: string;
  };
  hero: {
    title: string;
    description: string;
    primaryCta: LinkContent;
    secondaryCta: LinkContent;
    stats: {
      value: string;
      label: string;
    }[];
  };
  services: {
    heading: string;
    action: string;
    items: {
      slug: string;
      title: string;
      description: string;
    }[];
  };
  process: {
    eyebrow: string;
    title: string;
    description: string;
    action: LinkContent;
    steps: {
      number: string;
      title: string;
      description: string;
    }[];
  };
  featured: {
    sectionLabel: string;
    primary: {
      eyebrow: string;
      title: string;
      description: string;
      imageLabel: string;
      cta: LinkContent;
    };
    secondary: {
      eyebrow: string;
      title: string;
      description: string;
      cta: LinkContent;
    };
  };
  cases: {
    eyebrow: string;
    title: string;
    description: string;
    action: string;
    cardAction: string;
    items: {
      slug: string;
      category: string;
      title: string;
      date: string;
      imageLabel: string;
    }[];
  };
  clients: {
    eyebrow: string;
    title: string;
    description: string;
    items: {
      title: string;
      description: string;
    }[];
  };
  team: {
    eyebrow: string;
    title: string;
    action: string;
    cardAction: string;
    items: ExpertItem[];
  };
  experts: {
    metaTitle: string;
    breadcrumbLabel: string;
    breadcrumbHome: string;
    title: string;
    description: string;
    stats: {
      value: string;
      label: string;
    }[];
    rosterStatLabel: string;
    listHeading: string;
    directionsLabel: string;
    filtersLabel: string;
    searchLabel: string;
    searchPlaceholder: string;
    experienceLabel: string;
    experienceOptions: {
      value: string;
      label: string;
    }[];
    resetLabel: string;
    resultsLabel: string;
    sortLabel: string;
    sortOptions: {
      value: string;
      label: string;
    }[];
    gridViewLabel: string;
    listViewLabel: string;
    cardAction: string;
    paginationLabel: string;
    previousPageLabel: string;
    nextPageLabel: string;
    goToPageLabel: string;
    emptyTitle: string;
    emptyDescription: string;
    profileUi: {
      aboutTitle: string;
      educationTitle: string;
      careerTitle: string;
      certificatesTitle: string;
      similarTitle: string;
      experienceLabel: string;
      languagesLabel: string;
      certificatesLabel: string;
    };
  };
  testimonials: {
    eyebrow: string;
    title: string;
    description: string;
    ratingLabel: string;
    items: {
      quote: string;
      author: string;
      organization: string;
      imageLabel: string;
    }[];
  };
  news: {
    eyebrow: string;
    title: string;
    description: string;
    action: string;
    cardAction: string;
    items: {
      slug: string;
      category: string;
      date: string;
      title: string;
      imageLabel: string;
    }[];
  };
  partners: {
    eyebrow: string;
    title: string;
    description: string;
    items: {
      name: string;
    }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: LinkContent;
    secondaryCta: LinkContent;
    note: string;
  };
  // Dedicated /[locale]/contact page. Contact facts (phone, email, address,
  // hours) are NOT duplicated here — the page renders footer.contacts so the
  // approved details keep a single source of truth.
  contactPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    description: string;
    infoTitle: string;
    formTitle: string;
    formNote: string;
    form: {
      nameLabel: string;
      phoneLabel: string;
      emailLabel: string;
      serviceLabel: string;
      serviceAny: string;
      messageLabel: string;
      messagePlaceholder: string;
      submitLabel: string;
      mailtoSubject: string;
      errors: {
        name: string;
        phone: string;
        message: string;
      };
    };
    mapTitle: string;
  };
  footer: {
    homeLabel: string;
    description: string;
    descriptor: string;
    socialPending: string;
    exploreTitle: string;
    servicesTitle: string;
    allServicesLabel: string;
    contactTitle: string;
    contacts: {
      label: string;
      value: string;
      href?: string;
    }[];
    copyright: string;
    previewNote: string;
  };
};

const homeContent: Record<Locale, HomeContent> = {
  hy: hyHome,
  en: enHome,
  ru: ruHome,
};

export function getHomeContent(locale: Locale): HomeContent {
  return homeContent[locale];
}
