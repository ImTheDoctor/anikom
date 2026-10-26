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

// One subtype inside a service-catalog type entry (`code` is absent for
// non-classifier entries such as related research lines).
export type ServiceCatalogSubtype = {
  code?: string;
  title: string;
};

// One examination type within a service direction. `code` is the national
// classifier code of examination types (identical across locales); entries
// outside the classifier (geodetic works, damage sources) carry no code.
export type ServiceCatalogType = {
  code?: string;
  title: string;
  subtypes?: ServiceCatalogSubtype[];
};

export type ServiceCatalogTaskCategory = {
  title: string;
  items: string[];
};

// Detail-page content for /[locale]/services/[slug], keyed by the service
// slug. Codes and the subtype skeleton follow the public RA classifier of
// judicial examination types; all titles and texts are draft copy pending
// client review (see docs/design-system.md §11).
export type ServiceCatalogEntry = {
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  codes: string[];
  typesHeading: string;
  types: ServiceCatalogType[];
  objectsHeading: string;
  objects: string[];
  tasksHeading?: string;
  taskCategories?: ServiceCatalogTaskCategory[];
  expertsHeading: string;
  casesHeading: string;
  otherHeading: string;
};

// One examination type of the RA classifier catalog. Types WITHOUT a
// serviceSlug are standalone directions of research: they render as cards
// on /services and get full detail pages (objects, tasks). Types WITH a
// serviceSlug are subordinate to one of the eight company directions —
// their content lives inside the direction page, so they get no card and
// no detail page. Slugs and serviceSlug are shared across locales.
export type ClassifierType = {
  code?: string;
  slug: string;
  serviceSlug?: string;
  title: string;
  description: string;
  objects?: string[];
  taskCategories?: ServiceCatalogTaskCategory[];
  subtypes?: ServiceCatalogSubtype[];
};

// One article of the Լրահոս feed. `categorySlug` (news.categories), `dateISO`
// (sorting + year filter), `authorSlug` (team.items) and `readMinutes` are
// shared across locales; the rest is localized. `body` holds the detail-page
// paragraphs — the feed pages strip it before crossing the client boundary.
export type NewsItem = {
  slug: string;
  categorySlug: string;
  dateISO: string;
  date: string;
  title: string;
  excerpt: string;
  imageLabel: string;
  authorSlug: string;
  readMinutes: number;
  body: string[];
};

// Copy for the placeholder auth pages /[locale]/login and /[locale]/register.
// `nameLabel` is set only on the register variant; the form component uses its
// presence to pick the field set and the password autocomplete hint.
export type AuthPageContent = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  description: string;
  nameLabel?: string;
  emailLabel: string;
  passwordLabel: string;
  submitLabel: string;
  switchText: string;
  switchCta: string;
  unavailableNote: string;
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
    authCta: LinkContent;
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
    metaDescription?: string;
    items: {
      slug: string;
      title: string;
      description: string;
    }[];
  };
  // Detail pages /[locale]/services/[slug]. Keys are the services.items
  // slugs, shared across locales; `codes` are classifier codes, so they are
  // identical in all three files.
  serviceCatalog: Record<string, ServiceCatalogEntry>;
  // Full reference catalog of examination types by RA classifier code
  // (01–20 plus the code-less directions). Standalone types (no serviceSlug)
  // render as cards on the /services page next to the eight directions and
  // carry full detail sections; codes and the group set are identical
  // across locales.
  serviceClassifier: {
    heading: string;
    description: string;
    objectsHeading: string;
    tasksHeading: string;
    otherHeading: string;
    subtypesHeading: string;
    directionLabel: string;
    types: ClassifierType[];
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
    // Direction filter UI on /cases (owner request, Oct 2026). resultsLabel
    // uses a "{count}" placeholder (label-with-count form, plural-safe in
    // every locale).
    filtersLabel: string;
    allFilterLabel: string;
    resultsLabel: string;
    // Shared headings/labels for the case detail pages.
    detail: {
      taskHeading: string;
      workHeading: string;
      resultHeading: string;
      factsHeading: string;
      directionLabel: string;
      typeLabel: string;
      placeYearLabel: string;
      otherHeading: string;
    };
    items: {
      slug: string;
      // Links the case to its service direction detail page (services slug,
      // shared across locales).
      serviceSlug: string;
      category: string;
      title: string;
      date: string;
      imageLabel: string;
      // Detail-page content (draft demo copy, design doc §11): the specific
      // examination kind and the task → research → result narrative.
      examinationType: string;
      summary: string;
      task: string;
      work: string[];
      result: string;
    }[],
  };
  team: {
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
    prevLabel: string;
    nextLabel: string;
    items: {
      quote: string;
      author: string;
      organization: string;
      imageLabel: string;
    }[];
  };
  // The Լրահոս (feed/blog) block behind /[locale]/news and /news/[slug]
  // (owner request, Oct 26, 2026 — replaces the homepage news section and the
  // old three-item stub list). Article copy is owner-authorized draft demo
  // data (design doc §11); `items[].body` renders only on the detail page.
  news: {
    title: string;
    description: string;
    // Homepage section action (links to the feed); the section itself is the
    // compact editorial variant of §6 "News feed" between Testimonials and
    // Partners.
    action: string;
    // sr-only accessible name for the single stretched article links.
    cardAction: string;
    // Sidebar filter UI.
    filtersLabel: string;
    // Category taxonomy shared across locales (slugs), localized titles.
    categories: {
      slug: string;
      title: string;
    }[];
    categoriesHeading: string;
    allCategoriesLabel: string;
    expertsHeading: string;
    allExpertsLabel: string;
    yearsHeading: string;
    allYearsLabel: string;
    searchLabel: string;
    searchPlaceholder: string;
    resetLabel: string;
    // "{count}" placeholder, plural-safe in every locale ("Articles: {count}").
    resultsLabel: string;
    sortLabel: string;
    sortOptions: {
      value: string;
      label: string;
    }[];
    gridViewLabel: string;
    listViewLabel: string;
    paginationLabel: string;
    previousPageLabel: string;
    nextPageLabel: string;
    goToPageLabel: string;
    emptyTitle: string;
    emptyDescription: string;
    // Appended to `readMinutes` on cards ("7 րոպե" / "7 min read").
    readTimeUnit: string;
    authorLabel: string;
    // Subscribe banner (mailto compose — no backend in the MVP).
    newsletter: {
      title: string;
      description: string;
      emailLabel: string;
      emailPlaceholder: string;
      submitLabel: string;
      mailtoSubject: string;
      note: string;
      errorLabel: string;
    };
    // Detail-page shared headings.
    detail: {
      relatedHeading: string;
      authorHeading: string;
      authorProfileLabel: string;
    };
  items: NewsItem[];
};
  partners: {
    eyebrow: string;
    title: string;
    description: string;
    prevLabel: string;
    nextLabel: string;
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
  // Placeholder auth pages /[locale]/login and /[locale]/register
  // (owner request, Oct 2026). The MVP has no auth backend, so the forms are
  // preview UI only; copy is draft pending client sign-off (design doc §11).
  authPage: {
    login: AuthPageContent;
    register: AuthPageContent;
  };
  // Dedicated /[locale]/about page («Մեր մասին»), modeled on the reference
  // "our center" page structure: mission, goals, functions, directions.
  // Copy is owner-authorized draft pending client sign-off (design doc §11);
  // the stats reuse the client-approved homepage figures plus the
  // eight-direction count.
  aboutPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    description: string;
    missionTitle: string;
    mission: string[];
    stats: {
      value: string;
      label: string;
    }[];
    goalsHeading: string;
    goals: string[];
    functionsHeading: string;
    functionGroups: {
      title: string;
      items: string[];
    }[];
    directionsHeading: string;
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

// UI copy for the feed directory's client boundary: the whole news block
// minus `items` (whose `body` paragraphs are detail-page-only) and minus
// `action` (homepage section only). The server page calls this before
// passing props to the Client Component.
export type NewsFeedUi = Omit<HomeContent["news"], "items" | "action">;

export function newsFeedUi(news: HomeContent["news"]): NewsFeedUi {
  return {
    title: news.title,
    description: news.description,
    cardAction: news.cardAction,
    filtersLabel: news.filtersLabel,
    categories: news.categories,
    categoriesHeading: news.categoriesHeading,
    allCategoriesLabel: news.allCategoriesLabel,
    expertsHeading: news.expertsHeading,
    allExpertsLabel: news.allExpertsLabel,
    yearsHeading: news.yearsHeading,
    allYearsLabel: news.allYearsLabel,
    searchLabel: news.searchLabel,
    searchPlaceholder: news.searchPlaceholder,
    resetLabel: news.resetLabel,
    resultsLabel: news.resultsLabel,
    sortLabel: news.sortLabel,
    sortOptions: news.sortOptions,
    gridViewLabel: news.gridViewLabel,
    listViewLabel: news.listViewLabel,
    paginationLabel: news.paginationLabel,
    previousPageLabel: news.previousPageLabel,
    nextPageLabel: news.nextPageLabel,
    goToPageLabel: news.goToPageLabel,
    emptyTitle: news.emptyTitle,
    emptyDescription: news.emptyDescription,
    readTimeUnit: news.readTimeUnit,
    authorLabel: news.authorLabel,
    newsletter: news.newsletter,
    detail: news.detail,
  };
}

export function getHomeContent(locale: Locale): HomeContent {
  return homeContent[locale];
}
