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
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Quezon City · Open daily 7am–9pm",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Fresh coffee, honest meals, neighborhood warmth",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "A sample quotation site for nearby businesses — swap copy, photos, and colors for each client pitch.",
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
            key: "showWhyUs",
            type: "boolean",
            default: true,
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "extra-rice",
    host: "extra-rice-trading.netlify.app",
    label: "Extra Rice 8 Trading, OPC",
    netlifySite: "extra-rice-trading",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Rodriguez, Rizal · Wholesale & retail",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Quality rice for your home, store, or business",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Trusted local rice trading — walk-in, pick-up, and delivery. Imported and local varieties at competitive sack prices.",
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
            key: "showWhyUs",
            type: "boolean",
            default: true,
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "ohana",
    host: "ohana-business-solutions.netlify.app",
    label: "Ohana Business Solutions Inc",
    netlifySite: "ohana-business-solutions",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Rodriguez, Rizal · Business consultancy",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Your family in doing business",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Trusted support for startups and growing companies — permits, tax filing, bookkeeping, and documents handled with care.",
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
            key: "showWhyUs",
            type: "boolean",
            default: true,
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "suyat",
    host: "suyat-notary-public.netlify.app",
    label: "Suyat Notary Public",
    netlifySite: "suyat-notary-public",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Rodriguez, Rizal · Notary & legal documents",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Trusted notarization when your documents matter",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Professional notary public services, affidavits, deeds, and legal document preparation at our San Jose office.",
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
            key: "showWhyUs",
            type: "boolean",
            default: true,
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "rg-decals",
    host: "rg-decals-printing.netlify.app",
    label: "RG Decals and Printing Shop",
    netlifySite: "rg-decals-printing",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Rodriguez, Rizal · Decals, signs & printing",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Your ideas, printed into reality",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Vehicle decals, signs, banners, and custom printing — quality work for personal, business, and fleet branding needs.",
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
            key: "showWhyUs",
            type: "boolean",
            default: true,
            label: "Show Why section",
          },
        ],
      },
  },
  {
    id: "sonyoba-marketing",
    host: "sonyoba-marketing.netlify.app",
    label: "Sonyoba Marketing",
    netlifySite: "sonyoba-marketing",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Philippines · Office machines & equipment",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Heavy-duty office equipment you can rely on for years",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Paper shredders, laminators, binding machines, time recorders, safes, and printers — trusted by businesses nationwide with cash on delivery and responsive after-sales support.",
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
            key: "showWhyUs",
            type: "boolean",
            default: true,
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "machinemate",
    host: "machinemate-engineering.netlify.app",
    label: "Machinemate Mainteneering Services",
    netlifySite: "machinemate-engineering",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Rodriguez · Industrial ventilation",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Engineered fans & exhaust systems built for heavy-duty performance",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "SS/MS centrifugal fans, axial fans, and roof exhaust — tested, maintained, and shipped for mining, manufacturing, and commercial projects in the Philippines and abroad.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "jazz1-aircon",
    host: "jazz1-aircon-services.netlify.app",
    label: "Jazz1 Airconditioning Services",
    netlifySite: "jazz1-aircon-services",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Montalban · Rizal · 100% recommend (15 reviews)",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Your No.1 trusted aircon company",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Quality units · Expert installers · Sales, installation, general cleaning, chemical wash, and repair for homes and businesses in Rodriguez and nearby areas.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "clover-industrial-fan",
    host: "clover-industrial-fan.netlify.app",
    label: "Clover Industrial Fan and Blower Inc.",
    netlifySite: "clover-industrial-fan",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Antipolo · Industrial company · Always open",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Simple but innovative industrial fan & blower solutions",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Clover Industrial Fan and Blower offers effective ventilation systems for plants, warehouses, and commercial sites — engineered, built, and delivered across Rizal and beyond.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "g3k-cad",
    host: "g3k-cad-plotting.netlify.app",
    label: "G3k Cad Plotting & Blueprinting Services",
    netlifySite: "g3k-cad-plotting",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Rodriguez, Rizal · Printing service",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "CAD plotting & blueprinting you can count on",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "From architectural plans to engineering drawings — G3k prints clean, accurate plots with delivery and online booking for clients around Rodriguez and nearby Rizal.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "kubling-tago-resort",
    host: "kubling-tago-resort.netlify.app",
    label: "Kubling Tago Resort",
    netlifySite: "kubling-tago-resort",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Antipolo · Day resort & private pools",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Kubling Tago Resort",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Escape the city for infinity pools, jacuzzi lounges, cottages, and private rooms — a calm Antipolo hideaway for families, barkada days, and small celebrations.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "regan-industrial",
    host: "regan-industrial.netlify.app",
    label: "Regan Industrial Sales Inc.",
    netlifySite: "regan-industrial",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Steel solution for your success · Est. 1968",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Regan Industrial Sales Inc.",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Quality steel products and end-to-end processing for contractors, engineers, and developers — beams, pipes, plates, bars, and nationwide delivery from Quezon City.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "intellismart",
    host: "intellismartinc.netlify.app",
    label: "IntelliSmart Technology Inc.",
    netlifySite: "intellismartinc",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Intelligent innovations · Smart solutions",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "IntelliSmart Technology Inc.",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Diversified system integration for buildings and businesses — audio-visual, security, BMS, ICT, automation, and more — designed, installed, and supported nationwide.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "sv-more-group",
    host: "sv-more-group.netlify.app",
    label: "SV More Group of Companies",
    netlifySite: "sv-more-group",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Your partner in health and well-being · Est. 1987",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "SV More Group of Companies",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Providing quality and effective health products for Filipinos — pharmaceutical marketing, distribution, and trusted wellness brands nationwide.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "trumed-pharma",
    host: "trumed-pharma.netlify.app",
    label: "Trumed Pharmaceuticals",
    netlifySite: "trumed-pharma",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Fulfilling better healthcare",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Trumed Pharmaceuticals",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "A healthcare marketing company connecting quality pharmaceutical solutions with the people who need them — through partnerships, distribution, and excellence across the Philippines.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "dn-group",
    host: "dn-group.netlify.app",
    label: "DN Group of Companies",
    netlifySite: "dn-group",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Est. 1983 · Quezon City · Building materials group",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "DN Group of Companies",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Trusted partner of architects, engineers, and contractors — metal roofing, façade systems, decking, insulation, and specialty building materials engineered to last.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "alibaton-construction",
    host: "alibaton-construction.netlify.app",
    label: "Alibaton Construction Inc.",
    netlifySite: "alibaton-construction",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "ISO 9001:2015 · Quezon City · Tower crane solutions",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Alibaton Construction Inc.",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Best tower crane service in the Philippines — rental, sales, and service for contractors who need reliable lifting solutions on every site.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "fastpoint-ph",
    host: "fastpoint-ph.netlify.app",
    label: "Fastpoint PH",
    netlifySite: "fastpoint-ph",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Fastpoint Enterprises Incorporated · Nationwide fleet supply",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Fastpoint PH",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Preferred supplier of the Philippines’ biggest fleets — commercial tires and supply that keeps operations transparent, understandable, and on the road.",
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
            max: 2,
            default: 2,
            label: "Gallery photos shown",
          },
          {
            key: "showWhyUs",
            type: "boolean",
            default: true,
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "archipelago-builders",
    host: "archipelago-builders.netlify.app",
    label: "Archipelago Builders Corporation",
    netlifySite: "archipelago-builders",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Category AAA · Est. 1965 · Quezon City",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Archipelago Builders Corporation",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "A general building contractor engaged in both horizontal and vertical construction — trusted public and private projects for six decades.",
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
            max: 2,
            default: 2,
            label: "Gallery photos shown",
          },
          {
            key: "showWhyUs",
            type: "boolean",
            default: true,
            label: "Show About section",
          },
        ],
      },
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
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Ampid 2 · San Mateo, Rizal",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "San Mateo Medical Center",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "A private hospital where your health is our concern — quality care that is efficient, affordable, and accessible, delivered with compassion.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "villa-clara-pool",
    host: "villa-clara-pool.netlify.app",
    label: "Villa Clara Pool & Venue",
    netlifySite: "villa-clara-pool",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "San Rafael · Rodriguez · Rizal",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Villa Clara Pool & Venue",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "A private pool and venue for the privacy you want with family and friends — swim, relax, and enjoy nature in Montalban.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "costa-abril",
    host: "costa-abril.netlify.app",
    label: "Costa Abril Resort",
    netlifySite: "costa-abril",
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
            default: "Costa Abril Resort",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Wave pool, giant slide, and kiddie slide for a full day of family fun — plus cottages, air-conditioned rooms, and a function hall for celebrations.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "air-alex-resort",
    host: "air-alex-resort.netlify.app",
    label: "Airalex Private Lodge & Resort",
    netlifySite: "air-alex-resort",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Private lodge & day resort",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Airalex Private Lodge & Resort",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "A place where you can relax and enjoy — budget-friendly. Public and private pools, cottages, and 24/7 stay options for family days and barkada getaways.",
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
            max: 2,
            default: 2,
            label: "Gallery photos shown",
          },
          {
            key: "showWhyUs",
            type: "boolean",
            default: true,
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "casa-de-gloria",
    host: "casa-de-gloria.netlify.app",
    label: "Casa De Gloria Private Resort",
    netlifySite: "casa-de-gloria",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Private pool · Cosy staycation",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Casa De Gloria Private Resort",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "A staycation you truly deserve — a private plunge pool, LED waterfall wall, and cosy lounge just for your family and friends. No sharing with strangers.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "casa-angelina",
    host: "casa-angelina.netlify.app",
    label: "Casa Angelina Resort",
    netlifySite: "casa-angelina",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Manggahan, Rodriguez, Rizal",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Casa Angelina Resort",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "A private pool house tucked in Congress Village — poolside nights, a karaoke lounge, and an alfresco dining pavilion for family reunions, birthdays, and barkada celebrations.",
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
            label: "Show About section",
          },
        ],
      },
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
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Mother of Perpetual Help School, Inc. · Fairview",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "MPHS Mother of Perpetual Help Inc. Fairview",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "A K–12 Catholic school in Fairview, Quezon City — forming students with faith, discipline, and academic excellence under our motto: Humility in Greatness.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "amora-body-wellness-spa",
    host: "amora-body-wellness-spa.netlify.app",
    label: "Amora Body Wellness Spa",
    netlifySite: "amora-body-wellness-spa",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Timeless care, naturally crafted",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Amora Body Wellness Spa",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Relax, rejuvenate, and reconnect with holistic treatments crafted from locally-sourced, organic ingredients and traditional techniques.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "taguig-city-general-hospital",
    host: "taguig-city-general-hospital.netlify.app",
    label: "Taguig City General Hospital",
    netlifySite: "taguig-city-general-hospital",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "City of Taguig · Public healthcare",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Taguig City General Hospital",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "The second LGU-owned hospital of Taguig — free, quality, and accessible healthcare for Taguigeños along C6 Road, Barangay Hagonoy. Outpatient Department open Monday to Friday.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "the-lakehouse-taguig",
    host: "the-lakehouse-taguig.netlify.app",
    label: "The Lakehouse Taguig",
    netlifySite: "the-lakehouse-taguig",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Luxury staycation · Laguna Lake view",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "The Lakehouse Taguig",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Relax with family and friends without leaving the city — a private resort-style escape in the heart of Taguig, overlooking Laguna Lake.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "journey-woodblock-ph",
    host: "journey-woodblock-ph.netlify.app",
    label: "Journey Woodblock Modular Cabinets",
    netlifySite: "journey-woodblock-ph",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Modular cabinets · CNC woodworking · Taguig",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Journey Woodblock Modular Cabinets",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Custom kitchen cabinets, closets, storage solutions, and CNC wood cutting — crafted with precision for homes and businesses across Metro Manila.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "cardinal-santos",
    host: "cardinal-santos.netlify.app",
    label: "Cardinal Santos Medical Center",
    netlifySite: "cardinal-santos",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Greenhills West · San Juan City",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Cardinal Santos Medical Center",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Caring for YOU like family — a leading hospital for Cardiology, Oncology, Neurosurgery, Gastroenterology, and Rehabilitation Medicine.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "st-lukes",
    host: "st-lukes.netlify.app",
    label: "St. Luke's Medical Center",
    netlifySite: "st-lukes",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Quezon City · Global City · Taguig",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "St. Luke’s Medical Center",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "The Philippines’ leading and most respected healthcare institution — compassionate, patient-centered care guided by excellence and innovation.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "grand-hyatt-manila",
    host: "grand-hyatt-manila.netlify.app",
    label: "Grand Hyatt Manila",
    netlifySite: "grand-hyatt-manila",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Living Grand · Bonifacio Global City",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Grand HyattManila",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Moments of more — above the skyline of BGC. Refined rooms, Illume Spa, destination dining, and spaces that turn arrivals into occasions.",
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
            label: "Show About section",
          },
        ],
      },
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
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Rodriguez · Montalban private resort",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Merlita's Private Resort",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "A calm private resort and venue for daytime staycations, overnight escapes, and celebrations — right in Brgy. San Jose, Rodriguez.",
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
            label: "Show About section",
          },
        ],
      },
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
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Exclusive resort · Rodriguez, Rizal",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Sky Glass",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Indoor pool staycations under glass — swim without the sun. Private celebrations, night lights, and a venue that feels like your own glass house.",
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
            label: "Show About section",
          },
        ],
      },
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
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Hotel resort · San Mateo, Rizal",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Villa Apolonia Resort Hotel",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "The Perfect Hide-away — day stays and overnight rooms on Maly-Maarang Road, Brgy. Maly, for family gatherings and quiet getaways.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "a-and-c-private-pool",
    host: "a-and-c-private-pool.netlify.app",
    label: "A and C Private Pool Resort",
    netlifySite: "a-and-c-private-pool",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Private pool resort · San Mateo",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "A and C Private Pool Resort",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Day swim, pavilion hangouts, and A/C rooms on Abuab Road II — a private pool getaway for family, barkada, and celebrations in San Mateo, Rizal.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "liz-palmana",
    host: "liz-palmana.netlify.app",
    label: "Liz Palmana Resort",
    netlifySite: "liz-palmana",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Hotel resort · San Mateo",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Liz Palmana Resort",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "An ideal place for your family and friends — pool days, staycation nights, and warm hospitality in Malanday, San Mateo.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "top-hill-cafe-grill",
    host: "top-hill-cafe-grill.netlify.app",
    label: "Top Hill Cafe Grill",
    netlifySite: "top-hill-cafe-grill",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "San Mateo · Rizal",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Top Hill Cafe Grill",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Where coffee meets flame — the hangout spot on top of the hill for warm sips, grilled comfort food, and late-night tambay.",
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
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "solid-integrated",
    host: "solid-integrated.netlify.app",
    label: "Solid Integrated Company Inc.",
    netlifySite: "solid-integrated",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Est. 1990 · Rodriguez, Rizal · Quality crushed aggregates",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Solid Integrated Company Inc.",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Quality crushed aggregates from two multi-integrated plants near Metro Manila — basalt sizes and base course for contractors, builders, and affiliate projects.",
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
            key: "showWhyUs",
            type: "boolean",
            default: true,
            label: "Show About section",
          },
        ],
      },
  },
  {
    id: "bccc-corp",
    host: "bccc-corp.netlify.app",
    label: "BC Cuerpo Construction Corporation",
    netlifySite: "bccc-corp",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Rodriguez, Rizal · Design-build contractor",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "BC Cuerpo Construction Corporation",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Horizontal and vertical construction for private clients and government agencies — engineered delivery from San Jose, Rodriguez.",
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
            label: "Show Why section",
          },
        ],
      },
  },
  {
    id: "lucky-q-enterprises",
    host: "lucky-q-enterprises.netlify.app",
    label: "Lucky Q Enterprises",
    netlifySite: "lucky-q-enterprises",
      previewSettings: {
        fields: [
          {
            key: "heroEyebrow",
            type: "text",
            default: "Sitio Gulod · Montalban Rizal",
            maxLength: 80,
            label: "Hero eyebrow",
          },
          {
            key: "heroHeadline",
            type: "text",
            default: "Lucky Q Enterprises",
            maxLength: 120,
            label: "Hero headline",
          },
          {
            key: "heroSubhead",
            type: "textarea",
            default:
              "Reinforced concrete pipes, gravel & sand, and ready-mix — stocked for contractors, LGUs, and site developers who need sizes that fit the trench and trucks that leave the yard on time.",
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
            label: "Show About section",
          },
        ],
      },
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
  {
    id: "pearl-garden-hotel",
    host: "pearl-garden-hotel.netlify.app",
    label: "Pearl Garden Hotel",
    netlifySite: "pearl-garden-hotel",
    previewSettings: {
      fields: [
        {
          key: "heroEyebrow",
          type: "text",
          default: "Malate · Adriatico corner Gen. Malvar",
          maxLength: 80,
          label: "Hero eyebrow",
        },
        {
          key: "heroHeadline",
          type: "text",
          default: "Pearl Garden Hotel",
          maxLength: 120,
          label: "Hero headline",
        },
        {
          key: "heroSubhead",
          type: "textarea",
          default:
            "A calm, budget-friendly stay near Robinsons Place Manila — clean rooms, a 9th-floor pool, and easy access to Malate’s dining strip.",
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
          label: "Show About section",
        },
      ],
    },
  },
  {
    id: "fleur-de-lys",
    host: "fleur-de-lys-morato.netlify.app",
    label: "Fleur de Lys",
    netlifySite: "fleur-de-lys-morato",
    previewSettings: {
      fields: [
        {
          key: "heroEyebrow",
          type: "text",
          default: "Tomas Morato · Quezon City",
          maxLength: 80,
          label: "Hero eyebrow",
        },
        {
          key: "heroHeadline",
          type: "text",
          default: "Fleur de Lys",
          maxLength: 120,
          label: "Hero headline",
        },
        {
          key: "heroSubhead",
          type: "textarea",
          default:
            "Patisserie and café on Morato — custom cakes, soft pastry mornings, and a table when you want to linger.",
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
          label: "Show About section",
        },
      ],
    },
  },
  {
    id: "midnight-haven",
    host: "midnight-haven.netlify.app",
    label: "Midnight Haven",
    netlifySite: "midnight-haven",
    previewSettings: {
      fields: [
        {
          key: "heroEyebrow",
          type: "text",
          default: "Ermita · Open 24 hours",
          maxLength: 80,
          label: "Hero eyebrow",
        },
        {
          key: "heroHeadline",
          type: "text",
          default: "Midnight Haven",
          maxLength: 120,
          label: "Hero headline",
        },
        {
          key: "heroSubhead",
          type: "textarea",
          default:
            "Live music bar & café on M.H. Del Pilar — late kitchen, cold drinks, pool table, and bands that keep Ermita nights moving.",
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
          label: "Show About section",
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
