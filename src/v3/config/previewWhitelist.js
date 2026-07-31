/**
 * Whitelist for ?preview= portfolio showcase iframes.
 * Public URLs use short slugs: ?preview=machinemate
 * Legacy full hostnames (?preview=*.netlify.app) still resolve for backward compatibility.
 */

export const PREVIEW_SITES = [
  {
    id: "quotation",
    host: "bamboo-grove-cafe.netlify.app",
    label: "Bamboo Grove Café — Sample Quotation Site",
    netlifySite: "bamboo-grove-cafe",
  },
  {
    id: "extra-rice",
    host: "extra-rice-trading.netlify.app",
    label: "Extra Rice 8 Trading, OPC",
    netlifySite: "extra-rice-trading",
  },
  {
    id: "ohana",
    host: "ohana-business-solutions.netlify.app",
    label: "Ohana Business Solutions Inc",
    netlifySite: "ohana-business-solutions",
  },
  {
    id: "suyat",
    host: "suyat-notary-public.netlify.app",
    label: "Suyat Notary Public",
    netlifySite: "suyat-notary-public",
  },
  {
    id: "rg-decals",
    host: "rg-decals-printing.netlify.app",
    label: "RG Decals and Printing Shop",
    netlifySite: "rg-decals-printing",
  },
  {
    id: "sonyoba-marketing",
    host: "sonyoba-marketing.netlify.app",
    label: "Sonyoba Marketing",
    netlifySite: "sonyoba-marketing",
  },
  {
    id: "machinemate",
    host: "machinemate-engineering.netlify.app",
    label: "Machinemate Mainteneering Services",
    netlifySite: "machinemate-engineering",
  },
  {
    id: "jazz1-aircon",
    host: "jazz1-aircon-services.netlify.app",
    label: "Jazz1 Airconditioning Services",
    netlifySite: "jazz1-aircon-services",
  },
  {
    id: "clover-industrial-fan",
    host: "clover-industrial-fan.netlify.app",
    label: "Clover Industrial Fan and Blower Inc.",
    netlifySite: "clover-industrial-fan",
  },
  {
    id: "g3k-cad",
    host: "g3k-cad-plotting.netlify.app",
    label: "G3k Cad Plotting & Blueprinting Services",
    netlifySite: "g3k-cad-plotting",
  },
  {
    id: "kubling-tago-resort",
    host: "kubling-tago-resort.netlify.app",
    label: "Kubling Tago Resort",
    netlifySite: "kubling-tago-resort",
  },
  {
    id: "regan-industrial",
    host: "regan-industrial.netlify.app",
    label: "Regan Industrial Sales Inc.",
    netlifySite: "regan-industrial",
  },
  {
    id: "intellismart",
    host: "intellismartinc.netlify.app",
    label: "IntelliSmart Technology Inc.",
    netlifySite: "intellismartinc",
  },
  {
    id: "sv-more-group",
    host: "sv-more-group.netlify.app",
    label: "SV More Group of Companies",
    netlifySite: "sv-more-group",
  },
  {
    id: "trumed-pharma",
    host: "trumed-pharma.netlify.app",
    label: "Trumed Pharmaceuticals",
    netlifySite: "trumed-pharma",
  },
  {
    id: "dn-group",
    host: "dn-group.netlify.app",
    label: "DN Group of Companies",
    netlifySite: "dn-group",
  },
  {
    id: "alibaton-construction",
    host: "alibaton-construction.netlify.app",
    label: "Alibaton Construction Inc.",
    netlifySite: "alibaton-construction",
  },
  {
    id: "fastpoint-ph",
    host: "fastpoint-ph.netlify.app",
    label: "Fastpoint PH",
    netlifySite: "fastpoint-ph",
  },
  {
    id: "archipelago-builders",
    host: "archipelago-builders.netlify.app",
    label: "Archipelago Builders Corporation",
    netlifySite: "archipelago-builders",
  },
  {
    id: "hvill-hospital",
    host: "hvill-hospital.netlify.app",
    label: "H Vill Hospital",
    netlifySite: "hvill-hospital",
    previewSettings: {
      fields: [
        {
          key: "heroEyebrow",
          type: "text",
          default: "Rodriguez · Montalban · Rizal",
          maxLength: 80,
          label: "Hero eyebrow",
        },
        {
          key: "heroHeadline",
          type: "text",
          default: "H Vill Hospital",
          maxLength: 120,
          label: "Hero headline",
        },
        {
          key: "heroSubhead",
          type: "textarea",
          default: "Trusted local care on J.P. Rizal Street — prenatal checkups, ultrasound, and hospital services for families in Manggahan and nearby barangays.",
          maxLength: 400,
          label: "Hero subhead",
        },
        {
          key: "heroImageDesktop",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (desktop)",
        },
        {
          key: "heroImageMobile",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (mobile)",
        },
        {
          key: "galleryCount",
          type: "number",
          min: 2,
          max: 3,
          default: 3,
          label: "Gallery photos shown",
        },
        {
          key: "showWhyUs",
          type: "boolean",
          default: true,
          label: "Show About H Vill",
        },
      ],
    },
  },
  {
    id: "san-mateo-medical-center",
    host: "san-mateo-medical-center.netlify.app",
    label: "San Mateo Medical Center",
    netlifySite: "san-mateo-medical-center",
  },
  {
    id: "villa-clara-pool",
    host: "villa-clara-pool.netlify.app",
    label: "Villa Clara Pool & Venue",
    netlifySite: "villa-clara-pool",
  },
  {
    id: "costa-abril",
    host: "costa-abril.netlify.app",
    label: "Costa Abril Resort",
    netlifySite: "costa-abril",
  },
  {
    id: "air-alex-resort",
    host: "air-alex-resort.netlify.app",
    label: "Airalex Private Lodge & Resort",
    netlifySite: "air-alex-resort",
  },
  {
    id: "casa-de-gloria",
    host: "casa-de-gloria.netlify.app",
    label: "Casa De Gloria Private Resort",
    netlifySite: "casa-de-gloria",
  },
  {
    id: "casa-angelina",
    host: "casa-angelina.netlify.app",
    label: "Casa Angelina Resort",
    netlifySite: "casa-angelina",
  },
  {
    id: "bernardino-general-hospital",
    host: "bernardino-general-hospital.netlify.app",
    label: "Bernardino General Hospital",
    netlifySite: "bernardino-general-hospital",
    previewSettings: {
      fields: [
        {
          key: "heroEyebrow",
          type: "text",
          default: "San Bartolome · Quezon City",
          maxLength: 80,
          label: "Hero eyebrow",
        },
        {
          key: "heroHeadline",
          type: "text",
          default: "Bernardino General Hospital",
          maxLength: 120,
          label: "Hero headline",
        },
        {
          key: "heroSubhead",
          type: "textarea",
          default: "We constantly strive to give you quality care — general hospital services and rehabilitation medicine along Quirino Highway, always open for the community.",
          maxLength: 400,
          label: "Hero subhead",
        },
        {
          key: "heroImageDesktop",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (desktop)",
        },
        {
          key: "heroImageMobile",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (mobile)",
        },
        {
          key: "galleryCount",
          type: "number",
          min: 2,
          max: 3,
          default: 3,
          label: "Gallery photos shown",
        },
        {
          key: "showWhyUs",
          type: "boolean",
          default: true,
          label: "Show About BGH",
        },
      ],
    },
  },
  {
    id: "pgmc",
    host: "pacific-global-medical-center.netlify.app",
    label: "Pacific Global Medical Center",
    netlifySite: "pacific-global-medical-center",
    previewSettings: {
      fields: [
        {
          key: "heroEyebrow",
          type: "text",
          default: "Novaliches · Quezon City · Since 2010",
          maxLength: 80,
          label: "Hero eyebrow",
        },
        {
          key: "heroHeadline",
          type: "text",
          default: "Pacific Global Medical Center",
          maxLength: 120,
          label: "Hero headline",
        },
        {
          key: "heroSubhead",
          type: "textarea",
          default: "\"We Care. We Can.\" — a full-service hospital on Mindanao Avenue offering diagnostics, emergency care, immunization, and community health programs for Novaliches families.",
          maxLength: 400,
          label: "Hero subhead",
        },
        {
          key: "heroImageDesktop",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (desktop)",
        },
        {
          key: "heroImageMobile",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (mobile)",
        },
        {
          key: "galleryCount",
          type: "number",
          min: 2,
          max: 3,
          default: 3,
          label: "Items shown",
        },
        {
          key: "showWhyUs",
          type: "boolean",
          default: true,
          label: "Show About PGMC",
        },
      ],
    },
  },
  {
    id: "novagen",
    host: "novagen-hospital.netlify.app",
    label: "NovaGen — Novaliches General Hospital and Medical Center",
    netlifySite: "novagen-hospital",
    previewSettings: {
      fields: [
        {
          key: "heroEyebrow",
          type: "text",
          default: "793 Quirino Highway · Gulod, Novaliches · Quezon City",
          maxLength: 80,
          label: "Hero eyebrow",
        },
        {
          key: "heroHeadline",
          type: "text",
          default: "Novaliches General Hospital & Medical Center",
          maxLength: 120,
          label: "Hero headline",
        },
        {
          key: "heroSubhead",
          type: "textarea",
          default: "The Tan family's legacy of care since 1997 — accessible, affordable, and compassionate healthcare for the Novaliches community. #AlagangNovaGen: where patients are family.",
          maxLength: 400,
          label: "Hero subhead",
        },
        {
          key: "heroImageDesktop",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (desktop)",
        },
        {
          key: "heroImageMobile",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (mobile)",
        },
        {
          key: "galleryCount",
          type: "number",
          min: 2,
          max: 4,
          default: 4,
          label: "Gallery photos shown",
        },
        {
          key: "showWhyUs",
          type: "boolean",
          default: true,
          label: "Show About NovaGen",
        },
      ],
    },
  },
  {
    id: "fairview-general-hospital",
    host: "fairview-general-hospital.netlify.app",
    label: "Fairview General Hospital Inc.",
    netlifySite: "fairview-general-hospital",
    previewSettings: {
      fields: [
        {
          key: "heroEyebrow",
          type: "text",
          default: "Fairview · Quezon City · Since 1984",
          maxLength: 80,
          label: "Hero eyebrow",
        },
        {
          key: "heroHeadline",
          type: "text",
          default: "Fairview General Hospital Inc.",
          maxLength: 120,
          label: "Hero headline",
        },
        {
          key: "heroSubhead",
          type: "textarea",
          default: "PhilHealth-accredited Level I private hospital — open 24/7 with 30-bed capacity, serving Fairview families with inpatient care, outpatient services, and community health programs.",
          maxLength: 400,
          label: "Hero subhead",
        },
        {
          key: "heroImageDesktop",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (desktop)",
        },
        {
          key: "heroImageMobile",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (mobile)",
        },
        {
          key: "galleryCount",
          type: "number",
          min: 2,
          max: 4,
          default: 4,
          label: "Gallery photos shown",
        },
        {
          key: "showWhyUs",
          type: "boolean",
          default: true,
          label: "Show About Fairview GH",
        },
      ],
    },
  },
  {
    id: "mphs-fairview",
    host: "mphs-fairview.netlify.app",
    label: "MPHS Mother of Perpetual Help Inc. Fairview",
    netlifySite: "mphs-fairview",
  },
  {
    id: "amora-body-wellness-spa",
    host: "amora-body-wellness-spa.netlify.app",
    label: "Amora Body Wellness Spa",
    netlifySite: "amora-body-wellness-spa",
  },
  {
    id: "taguig-city-general-hospital",
    host: "taguig-city-general-hospital.netlify.app",
    label: "Taguig City General Hospital",
    netlifySite: "taguig-city-general-hospital",
  },
  {
    id: "the-lakehouse-taguig",
    host: "the-lakehouse-taguig.netlify.app",
    label: "The Lakehouse Taguig",
    netlifySite: "the-lakehouse-taguig",
  },
  {
    id: "journey-woodblock-ph",
    host: "journey-woodblock-ph.netlify.app",
    label: "Journey Woodblock Modular Cabinets",
    netlifySite: "journey-woodblock-ph",
  },
  {
    id: "cardinal-santos",
    host: "cardinal-santos.netlify.app",
    label: "Cardinal Santos Medical Center",
    netlifySite: "cardinal-santos",
  },
  {
    id: "st-lukes",
    host: "st-lukes.netlify.app",
    label: "St. Luke's Medical Center",
    netlifySite: "st-lukes",
  },
  {
    id: "grand-hyatt-manila",
    host: "grand-hyatt-manila.netlify.app",
    label: "Grand Hyatt Manila",
    netlifySite: "grand-hyatt-manila",
  },
  {
    id: "lucky-drive-inn",
    host: "lucky-drive-inn.netlify.app",
    label: "Lucky Drive Inn Hotel",
    netlifySite: "lucky-drive-inn",
    previewSettings: {
      fields: [
        {
          key: "heroEyebrow",
          type: "text",
          default: "Rodriguez · Rizal",
          maxLength: 80,
          label: "Hero eyebrow",
        },
        {
          key: "heroHeadline",
          type: "text",
          default: "Lucky Drive Inn Hotel",
          maxLength: 120,
          label: "Hero headline",
        },
        {
          key: "heroSubhead",
          type: "textarea",
          default: "The first drive-in hotel in Rodriguez, Rizal — themed rooms, always open, and satisfaction at its best for overnight stays and road-trip rest.",
          maxLength: 400,
          label: "Hero subhead",
        },
        {
          key: "heroImageDesktop",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (desktop)",
        },
        {
          key: "heroImageMobile",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (mobile)",
        },
        {
          key: "galleryCount",
          type: "number",
          min: 2,
          max: 5,
          default: 5,
          label: "Gallery photos shown",
        },
        {
          key: "showWhyUs",
          type: "boolean",
          default: true,
          label: "Show About Lucky Drive Inn",
        },
      ],
    },
  },
  {
    id: "merlitas-private-resort",
    host: "merlitas-private-resort.netlify.app",
    label: "Merlita's Private Resort",
    netlifySite: "merlitas-private-resort",
  },
  {
    id: "cj-resort",
    host: "cj-gomez-private-resort.netlify.app",
    label: "CJ Gomez Private Resort",
    netlifySite: "cj-gomez-private-resort",
    previewSettings: {
      fields: [
        {
          key: "heroEyebrow",
          type: "text",
          default: "Private resort · Rodriguez, Rizal",
          maxLength: 80,
          label: "Hero eyebrow",
        },
        {
          key: "heroHeadline",
          type: "text",
          default: "CJ Gomez Private Resort",
          maxLength: 120,
          label: "Hero headline",
        },
        {
          key: "heroSubhead",
          type: "textarea",
          default: "A place for your special occasions — where you can feel like you're home. Gardens, pavilions, and space for family celebrations and big group venues.",
          maxLength: 400,
          label: "Hero subhead",
        },
        {
          key: "heroImageDesktop",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (desktop)",
        },
        {
          key: "heroImageMobile",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (mobile)",
        },
        {
          key: "galleryCount",
          type: "number",
          min: 2,
          max: 6,
          default: 6,
          label: "Gallery photos shown",
        },
        {
          key: "showWhyUs",
          type: "boolean",
          default: true,
          label: "Show About CJ Gomez",
        },
      ],
    },
  },
  {
    id: "palms-and-terraces",
    host: "palms-and-terraces.netlify.app",
    label: "Palms and Terraces",
    netlifySite: "palms-and-terraces",
    previewSettings: {
      fields: [
        {
          key: "heroEyebrow",
          type: "text",
          default: "San Jose · Rodriguez · Rizal",
          maxLength: 80,
          label: "Hero eyebrow",
        },
        {
          key: "heroHeadline",
          type: "text",
          default: "Palms and Terraces",
          maxLength: 120,
          label: "Hero headline",
        },
        {
          key: "heroSubhead",
          type: "textarea",
          default: "Swim, celebrate, and gather — a public swimming pool and events place for weddings, birthdays, parties, and forums in Rodriguez.",
          maxLength: 400,
          label: "Hero subhead",
        },
        {
          key: "heroImageDesktop",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (desktop)",
        },
        {
          key: "heroImageMobile",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (mobile)",
        },
        {
          key: "galleryCount",
          type: "number",
          min: 2,
          max: 4,
          default: 4,
          label: "Gallery photos shown",
        },
        {
          key: "showWhyUs",
          type: "boolean",
          default: true,
          label: "Show About Palms and Terraces",
        },
      ],
    },
  },
  {
    id: "frances-teresa-garden",
    host: "frances-teresa-garden.netlify.app",
    label: "Frances Teresa Garden — The Party Place",
    netlifySite: "frances-teresa-garden",
    previewSettings: {
      fields: [
        {
          key: "heroEyebrow",
          type: "text",
          default: "Rodriguez · The Party Place",
          maxLength: 80,
          label: "Hero eyebrow",
        },
        {
          key: "heroHeadline",
          type: "text",
          default: "Frances Teresa Garden",
          maxLength: 120,
          label: "Hero headline",
        },
        {
          key: "heroSubhead",
          type: "textarea",
          default: "A garden event venue for weddings, debuts, birthdays, baptisms, reunions, seminars, and photo shoots — plus vintage bridal cars and sports cars for hire.",
          maxLength: 400,
          label: "Hero subhead",
        },
        {
          key: "heroImageDesktop",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (desktop)",
        },
        {
          key: "heroImageMobile",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (mobile)",
        },
        {
          key: "galleryCount",
          type: "number",
          min: 2,
          max: 4,
          default: 4,
          label: "Gallery photos shown",
        },
        {
          key: "showWhyUs",
          type: "boolean",
          default: true,
          label: "Show About The Party Place",
        },
      ],
    },
  },
  {
    id: "sky-glass",
    host: "sky-glass-resort.netlify.app",
    label: "Sky Glass",
    netlifySite: "sky-glass-resort",
  },
  {
    id: "joyce-kim-resort",
    host: "joyce-kim-resort.netlify.app",
    label: "Joyce Kim Resort",
    netlifySite: "joyce-kim-resort",
    previewSettings: {
      fields: [
        {
          key: "heroEyebrow",
          type: "text",
          default: "Hotel resort · Rodriguez",
          maxLength: 80,
          label: "Hero eyebrow",
        },
        {
          key: "heroHeadline",
          type: "text",
          default: "Joyce Kim Resort",
          maxLength: 120,
          label: "Hero headline",
        },
        {
          key: "heroSubhead",
          type: "textarea",
          default: "Day swim and cozy staycation rooms in Brgy. Balite — warm hospitality, outdoor seating, and space to unwind with family or barkada.",
          maxLength: 400,
          label: "Hero subhead",
        },
        {
          key: "heroImageDesktop",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (desktop)",
        },
        {
          key: "heroImageMobile",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (mobile)",
        },
        {
          key: "galleryCount",
          type: "number",
          min: 2,
          max: 5,
          default: 5,
          label: "Gallery photos shown",
        },
        {
          key: "showWhyUs",
          type: "boolean",
          default: true,
          label: "Show About Joyce Kim",
        },
      ],
    },
  },
  {
    id: "villa-apolonia",
    host: "villa-apolonia.netlify.app",
    label: "Villa Apolonia Resort Hotel",
    netlifySite: "villa-apolonia",
  },
  {
    id: "a-and-c-private-pool",
    host: "a-and-c-private-pool.netlify.app",
    label: "A and C Private Pool Resort",
    netlifySite: "a-and-c-private-pool",
  },
  {
    id: "liz-palmana",
    host: "liz-palmana.netlify.app",
    label: "Liz Palmana Resort",
    netlifySite: "liz-palmana",
  },
  {
    id: "top-hill-cafe-grill",
    host: "top-hill-cafe-grill.netlify.app",
    label: "Top Hill Cafe Grill",
    netlifySite: "top-hill-cafe-grill",
  },
  {
    id: "solid-integrated",
    host: "solid-integrated.netlify.app",
    label: "Solid Integrated Company Inc.",
    netlifySite: "solid-integrated",
  },
  {
    id: "bccc-corp",
    host: "bccc-corp.netlify.app",
    label: "BC Cuerpo Construction Corporation",
    netlifySite: "bccc-corp",
  },
  {
    id: "lucky-q-enterprises",
    host: "lucky-q-enterprises.netlify.app",
    label: "Lucky Q Enterprises",
    netlifySite: "lucky-q-enterprises",
  },
  {
    id: "xkr-construction",
    host: "xkr-construction.netlify.app",
    label: "XKR Construction",
    netlifySite: "xkr-construction",
    previewSettings: {
      fields: [
        {
          key: "heroEyebrow",
          type: "text",
          default: "Rodriguez, Rizal · Construction company",
          maxLength: 80,
          label: "Hero eyebrow",
        },
        {
          key: "heroHeadline",
          type: "text",
          default: "XKR Construction",
          maxLength: 120,
          label: "Hero headline",
        },
        {
          key: "heroSubhead",
          type: "textarea",
          default:
            "We work with government and private agencies on both horizontal and vertical projects — from site development to building works across Rizal and nearby project sites.",
          maxLength: 400,
          label: "Hero subhead",
        },
        {
          key: "heroImageDesktop",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (desktop)",
        },
        {
          key: "heroImageMobile",
          type: "image",
          default: null,
          accept: "image/jpeg,image/png,image/webp",
          maxBytes: 2097152,
          label: "Hero image (mobile)",
        },
        {
          key: "galleryCount",
          type: "number",
          min: 2,
          max: 4,
          default: 4,
          label: "Gallery photos shown",
        },
        {
          key: "showWhyUs",
          type: "boolean",
          default: true,
          label: "Show Why agencies work with us",
        },
      ],
    },
  },
];

const NETLIFY_HOST_PATTERN = /^[a-z0-9][a-z0-9-]*\.netlify\.app$/i;
const PREVIEW_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/i;

function normalizeHostname(raw) {
  if (!raw || typeof raw !== "string") return null;

  let value = raw.trim();
  if (!value) return null;

  try {
    if (value.includes("://")) {
      value = new URL(value).hostname;
    } else if (value.includes("/")) {
      value = new URL(`https://${value}`).hostname;
    }
  } catch {
    return null;
  }

  value = value.toLowerCase().replace(/\.$/, "");
  if (!value || value.includes("/") || value.includes(" ")) return null;

  return value;
}

function isNetlifyAppHost(host) {
  return NETLIFY_HOST_PATTERN.test(host);
}

function findPreviewSiteByHost(host) {
  return PREVIEW_SITES.find((site) => site.host.toLowerCase() === host) ?? null;
}

function findPreviewSiteByKey(key) {
  if (!key || typeof key !== "string") return null;
  const normalized = key.trim().toLowerCase();
  if (!normalized) return null;

  return (
    PREVIEW_SITES.find(
      (site) =>
        site.id.toLowerCase() === normalized ||
        site.netlifySite.toLowerCase() === normalized ||
        site.host.toLowerCase() === normalized
    ) ?? null
  );
}

export function buildPreviewPortfolioUrl(slugOrSite) {
  const site = findPreviewSiteByKey(slugOrSite);
  const slug = site?.id ?? String(slugOrSite || "").trim().toLowerCase();
  if (!slug) return null;
  return `https://carlmanuel.com/?preview=${slug}`;
}

export function isPreviewHostAllowed(raw) {
  return Boolean(resolvePreviewUrl(raw));
}

/**
 * @param {string} rawQueryValue - value of ?preview= (slug or legacy hostname)
 * @returns {{ url: string, host: string, slug: string, site: object | null } | null}
 */
export function resolvePreviewUrl(rawQueryValue) {
  const raw = rawQueryValue?.trim();
  if (!raw) return null;

  const asHost = normalizeHostname(raw);
  if (asHost && isPreviewHostAllowedInternal(asHost)) {
    const site = findPreviewSiteByHost(asHost);
    return {
      url: `https://${asHost}`,
      host: asHost,
      slug: site?.id ?? asHost.replace(/\.netlify\.app$/i, ""),
      site,
    };
  }

  if (PREVIEW_SLUG_PATTERN.test(raw)) {
    const site = findPreviewSiteByKey(raw);
    if (site) {
      return {
        url: `https://${site.host}`,
        host: site.host,
        slug: site.id,
        site,
      };
    }
  }

  return null;
}

function isPreviewHostAllowedInternal(host) {
  return isNetlifyAppHost(host) || Boolean(findPreviewSiteByHost(host));
}

export function getPreviewQueryFromSearch(search = "") {
  if (typeof window !== "undefined" && !search) {
    return new URLSearchParams(window.location.search).get("preview");
  }
  return new URLSearchParams(search).get("preview");
}

/**
 * Schema fields for parent-owned preview knobs (?preview= panel).
 * @param {object | string | null | undefined} siteOrSlug - whitelist site object or slug/id
 * @returns {Array<object>}
 */
export function getPreviewSettingsSchema(siteOrSlug) {
  const site =
    siteOrSlug && typeof siteOrSlug === "object" && !Array.isArray(siteOrSlug)
      ? siteOrSlug
      : findPreviewSiteByKey(siteOrSlug);
  const fields = site?.previewSettings?.fields;
  return Array.isArray(fields) ? fields : [];
}

/**
 * Build a settings object from schema field defaults (session start — never from API).
 * @param {Array<object>} fields
 * @returns {Record<string, unknown>}
 */
export function getPreviewSettingsDefaults(fields) {
  const defaults = {};
  if (!Array.isArray(fields)) return defaults;
  for (const field of fields) {
    if (!field || typeof field.key !== "string" || !field.key) continue;
    if (Object.prototype.hasOwnProperty.call(field, "default")) {
      defaults[field.key] = field.default;
    }
  }
  return defaults;
}
