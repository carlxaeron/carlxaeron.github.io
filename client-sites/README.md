# Client sites (Netlify)

Static one-page business websites for **quotation / sales demos**. Each folder deploys to its own Netlify site and is showcased on the portfolio via **4-panel preview** (site desktop/mobile + admin desktop/mobile). Marketing site at `/`; browsable admin demo at `/admin/`.

**Portfolio preview (use this link with prospects):**

`https://carlmanuel.com/?preview={slug}`

Direct Netlify URLs return **403** (embed-only) — content loads only inside portfolio preview iframes.

---

## Site catalog

| Business | Slug | Industry | System | Preview link | Deployed |
|----------|------|----------|--------|--------------|----------|
| [Bamboo Grove Café](#bamboo-grove-café-sample) *(sample)* | `quotation` | Café / local food | leads | [Preview](https://carlmanuel.com/?preview=quotation) | 2026-07-10 |
| [Extra Rice 8 Trading, OPC](#extra-rice-8-trading-opc) | `extra-rice` | Rice wholesale & retail | leads | [Preview](https://carlmanuel.com/?preview=extra-rice) | 2026-07-10 |
| [Ohana Business Solutions Inc](#ohana-business-solutions-inc) | `ohana` | Business consultancy | leads | [Preview](https://carlmanuel.com/?preview=ohana) | 2026-07-10 |
| [Suyat Notary Public](#suyat-notary-public) | `suyat` | Notary / legal services | leads | [Preview](https://carlmanuel.com/?preview=suyat) | 2026-07-10 |
| [RG Decals and Printing Shop](#rg-decals-and-printing-shop) | `rg-decals` | Printing / signs & decals | leads | [Preview](https://carlmanuel.com/?preview=rg-decals) | 2026-07-10 |
| [Sonyoba Marketing](#sonyoba-marketing) | `sonyoba-marketing` | Office equipment | leads | [Preview](https://carlmanuel.com/?preview=sonyoba-marketing) | 2026-07-13 |
| [JK Construction Services](#jk-construction-services) | `jk-construction` | Construction / renovation | service | [Preview](https://carlmanuel.com/?preview=jk-construction) | 2026-07-13 |
| [Machinemate Mainteneering Services](#machinemate-mainteneering-services) | `machinemate` | Industrial fans / ventilation | service | [Preview](https://carlmanuel.com/?preview=machinemate) | 2026-07-13 |
| [Jazz1 Airconditioning Services](#jazz1-airconditioning-services) | `jazz1-aircon` | Air conditioning / HVAC | service | [Preview](https://carlmanuel.com/?preview=jazz1-aircon) | 2026-07-13 |
| [Clover Industrial Fan and Blower Inc.](#clover-industrial-fan-and-blower-inc) | `clover-industrial-fan` | Industrial fans & blowers | service | [Preview](https://carlmanuel.com/?preview=clover-industrial-fan) | 2026-07-13 |
| [G3k Cad Plotting & Blueprinting Services](#g3k-cad-plotting--blueprinting-services) | `g3k-cad` | CAD plotting / blueprint printing | service | [Preview](https://carlmanuel.com/?preview=g3k-cad) | 2026-07-14 |
| [Kubling Tago Resort](#kubling-tago-resort) | `kubling-tago-resort` | Day resort / hospitality | booking | [Preview](https://carlmanuel.com/?preview=kubling-tago-resort) | 2026-07-15 |
| [Regan Industrial Sales Inc.](#regan-industrial-sales-inc) | `regan-industrial` | Steel supplier / industrial metals | leads | [Preview](https://carlmanuel.com/?preview=regan-industrial) | 2026-07-15 |
| [IntelliSmart Technology Inc.](#intellismart-technology-inc) | `intellismart` | System integration / AV / security / BMS | leads | [Preview](https://carlmanuel.com/?preview=intellismart) | 2026-07-15 |
| [SV More Group of Companies](#sv-more-group-of-companies) | `sv-more-group` | Pharmaceuticals / health products | leads | [Preview](https://carlmanuel.com/?preview=sv-more-group) | 2026-07-15 |
| [Trumed Pharmaceuticals](#trumed-pharmaceuticals) | `trumed-pharma` | Pharmaceutical marketing / distribution | leads | [Preview](https://carlmanuel.com/?preview=trumed-pharma) | 2026-07-15 |
| [DN Group of Companies](#dn-group-of-companies) | `dn-group` | Building materials / roofing / metal systems | leads | [Preview](https://carlmanuel.com/?preview=dn-group) | 2026-07-15 |
| [Alibaton Construction Inc.](#alibaton-construction-inc) | `alibaton-construction` | Tower crane rental / sales / service | service | [Preview](https://carlmanuel.com/?preview=alibaton-construction) | 2026-07-15 |
| [Fastpoint PH](#fastpoint-ph) | `fastpoint-ph` | Fleet supply / commercial tires | leads | [Preview](https://carlmanuel.com/?preview=fastpoint-ph) | 2026-07-15 |
| [Archipelago Builders Corporation](#archipelago-builders-corporation) | `archipelago-builders` | General building contractor (AAA) | service | [Preview](https://carlmanuel.com/?preview=archipelago-builders) | 2026-07-15 |
| [H Vill Hospital](#h-vill-hospital) | `hvill-hospital` | Hospital / healthcare | appointments | [Preview](https://carlmanuel.com/?preview=hvill-hospital) | 2026-07-15 |
| [San Mateo Medical Center](#san-mateo-medical-center) | `san-mateo-medical-center` | Private hospital / healthcare | appointments | [Preview](https://carlmanuel.com/?preview=san-mateo-medical-center) | 2026-07-15 |
| [Villa Clara Pool & Venue](#villa-clara-pool--venue) | `villa-clara-pool` | Private pool / day venue | booking | [Preview](https://carlmanuel.com/?preview=villa-clara-pool) | 2026-07-16 |
| [Costa Abril Resort](#costa-abril-resort) | `costa-abril` | Water park / day resort | booking | [Preview](https://carlmanuel.com/?preview=costa-abril) | 2026-07-17 |
| [Airalex Private Lodge & Resort](#airalex-private-lodge--resort) | `air-alex-resort` | Day resort / private lodge | booking | [Preview](https://carlmanuel.com/?preview=air-alex-resort) | 2026-07-17 |
| [Casa De Gloria Private Resort](#casa-de-gloria-private-resort) | `casa-de-gloria` | Private pool / staycation resort | booking | [Preview](https://carlmanuel.com/?preview=casa-de-gloria) | 2026-07-17 |
| [Casa Angelina Resort](#casa-angelina-resort) | `casa-angelina` | Vacation home rental / private pool venue | booking | [Preview](https://carlmanuel.com/?preview=casa-angelina) | 2026-07-17 |
| [Bernardino General Hospital](#bernardino-general-hospital) | `bernardino-general-hospital` | Hospital / healthcare / rehab medicine | appointments | [Preview](https://carlmanuel.com/?preview=bernardino-general-hospital) | 2026-07-17 |
| [Pacific Global Medical Center](#pacific-global-medical-center) | `pgmc` | Hospital / healthcare | appointments | [Preview](https://carlmanuel.com/?preview=pgmc) | 2026-07-17 |
| [NovaGen (Novaliches General Hospital and Medical Center)](#novagen-novaliches-general-hospital-and-medical-center) | `novagen` | Hospital / healthcare | appointments | [Preview](https://carlmanuel.com/?preview=novagen) | 2026-07-17 |
| [Fairview General Hospital Inc.](#fairview-general-hospital-inc) | `fairview-general-hospital` | Hospital / healthcare | appointments | [Preview](https://carlmanuel.com/?preview=fairview-general-hospital) | 2026-07-17 |
| [MPHS Mother of Perpetual Help Inc. Fairview](#mphs-mother-of-perpetual-help-inc-fairview) | `mphs-fairview` | K–12 school / nonprofit | leads | [Preview](https://carlmanuel.com/?preview=mphs-fairview) | 2026-07-17 |
| [Amora Body Wellness Spa](#amora-body-wellness-spa) | `amora-body-wellness-spa` | Spa / health & beauty | appointments | [Preview](https://carlmanuel.com/?preview=amora-body-wellness-spa) | 2026-07-17 |
| [Taguig City General Hospital](#taguig-city-general-hospital) | `taguig-city-general-hospital` | Government hospital / public healthcare | appointments | [Preview](https://carlmanuel.com/?preview=taguig-city-general-hospital) | 2026-07-18 |
| [The Lakehouse Taguig](#the-lakehouse-taguig) | `the-lakehouse-taguig` | Hotel resort / Laguna Lake staycation | booking | [Preview](https://carlmanuel.com/?preview=the-lakehouse-taguig) | 2026-07-18 |
| [Journey Woodblock Modular Cabinets](#journey-woodblock-modular-cabinets) | `journey-woodblock-ph` | Cabinetry / modular furniture / CNC woodworking | leads | [Preview](https://carlmanuel.com/?preview=journey-woodblock-ph) | 2026-07-18 |
| [Cardinal Santos Medical Center](#cardinal-santos-medical-center) | `cardinal-santos` | Hospital / healthcare | appointments | [Preview](https://carlmanuel.com/?preview=cardinal-santos) | 2026-07-20 |
| [St. Luke's Medical Center](#st-lukes-medical-center) | `st-lukes` | Private hospital / healthcare | appointments | [Preview](https://carlmanuel.com/?preview=st-lukes) | 2026-07-20 |
| [Grand Hyatt Manila](#grand-hyatt-manila) | `grand-hyatt-manila` | Luxury hotel / hospitality | booking | [Preview](https://carlmanuel.com/?preview=grand-hyatt-manila) | 2026-07-20 |
| [Lucky Drive Inn Hotel](#lucky-drive-inn-hotel) | `lucky-drive-inn` | Drive-in hotel / inn · Rodriguez Rizal | booking | [Preview](https://carlmanuel.com/?preview=lucky-drive-inn) | 2026-07-21 |
| [Merlita's Private Resort](#merlitas-private-resort) | `merlitas-private-resort` | Private resort / venue / staycation · Rodriguez Rizal | booking | [Preview](https://carlmanuel.com/?preview=merlitas-private-resort) | 2026-07-21 |
| [CJ Gomez Private Resort](#cj-gomez-private-resort) | `cj-resort` | Private resort / staycation venue | booking | [Preview](https://carlmanuel.com/?preview=cj-resort) | 2026-07-21 |
| [Palms and Terraces](#palms-and-terraces) | `palms-and-terraces` | Public swimming pool / events venue · Rodriguez Rizal | booking | [Preview](https://carlmanuel.com/?preview=palms-and-terraces) | 2026-07-21 |
| [Frances Teresa Garden — The Party Place](#frances-teresa-garden--the-party-place) | `frances-teresa-garden` | Party venue / garden event place · Rodriguez Rizal | booking | [Preview](https://carlmanuel.com/?preview=frances-teresa-garden) | 2026-07-21 |
| [Sky Glass](#sky-glass) | `sky-glass` | Indoor pool / exclusive resort · Rodriguez Rizal | booking | [Preview](https://carlmanuel.com/?preview=sky-glass) | 2026-07-21 |
| [Joyce Kim Resort](#joyce-kim-resort) | `joyce-kim-resort` | Hotel resort / day swim & staycation · Rodriguez Rizal | booking | [Preview](https://carlmanuel.com/?preview=joyce-kim-resort) | 2026-07-21 |
| [Villa Apolonia Resort Hotel](#villa-apolonia-resort-hotel) | `villa-apolonia` | Hotel resort / day stay & overnight · San Mateo Rizal | booking | [Preview](https://carlmanuel.com/?preview=villa-apolonia) | 2026-07-21 |
| [A and C Private Pool Resort](#a-and-c-private-pool-resort) | `a-and-c-private-pool` | Private pool / vacation home rental · San Mateo Rizal | booking | [Preview](https://carlmanuel.com/?preview=a-and-c-private-pool) | 2026-07-21 |
| [Liz Palmana Resort](#liz-palmana-resort) | `liz-palmana` | Hotel resort / family staycation · San Mateo Rizal | booking | [Preview](https://carlmanuel.com/?preview=liz-palmana) | 2026-07-21 |

Whitelist source of truth: [`src/v3/config/previewWhitelist.js`](../src/v3/config/previewWhitelist.js) (`PREVIEW_SITES`).

---

## Per-client details

### Bamboo Grove Café *(sample)*

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/quotation/` |
| **Netlify site** | `bamboo-grove-cafe` |
| **Preview host** | `bamboo-grove-cafe.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=quotation |
| **Contact** | Maria Santos (fictitious) · maria.santos@example.com · +63 917 123 4567 |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

*Fictitious demo business for quotation template workflow. Hero uses **Motion** (Framer Motion family) via `hero-motion.js`.*

---

### Extra Rice 8 Trading, OPC

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/extra-rice/` |
| **Netlify site** | `extra-rice-trading` |
| **Preview host** | `extra-rice-trading.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=extra-rice |
| **Contact** | extraricetradingdmanuel@gmail.com · +63 967 582 0455 |
| **Location** | Rodriguez, Rizal (main + branch on E. Rodriguez Highway) |
| **Source** | [Facebook](https://www.facebook.com/p/Extra-Rice-8-Trading-OPC-100085354996870/) |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### Ohana Business Solutions Inc

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/ohana/` |
| **Netlify site** | `ohana-business-solutions` |
| **Preview host** | `ohana-business-solutions.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=ohana |
| **Contact** | ohanabusinessconsultancyinc@gmail.com |
| **Location** | Eastwood Greenview, San Isidro, Rodriguez, Rizal 1860 |
| **Source** | [Facebook](https://www.facebook.com/OhanaBusinessConsultancyInc/) · [Google Maps](https://www.google.com/maps/place/Ohana+Business+Solutions+Inc/@14.7301222,121.1375017,18z) |
| **Tagline** | Your family in doing business |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### Suyat Notary Public

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/suyat/` |
| **Netlify site** | `suyat-notary-public` |
| **Preview host** | `suyat-notary-public.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=suyat |
| **Location** | JRS Building, Kanlaon St., San Jose, Rodriguez, Rizal |
| **Source** | [Facebook](https://www.facebook.com/suyatlawoffice/) · [Google Maps](https://www.google.com/maps/place/Suyat+Notary+Public/@14.7470042,121.1309309,17z) |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### RG Decals and Printing Shop

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/rg-decals/` |
| **Netlify site** | `rg-decals-printing` |
| **Preview host** | `rg-decals-printing.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=rg-decals |
| **Contact** | rgdecals123@gmail.com · +63 995 456 7971 |
| **Location** | Metro Manila Hills, Rodriguez, Rizal |
| **Source** | [Facebook](https://www.facebook.com/p/RG-Decals-and-Printing-Shop-61576011299710/) · [Google Maps](https://www.google.com/maps/place/RG+Decals+and+Printing+Shop/@14.7557777,121.1330426,18z) |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### Sonyoba Marketing

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/sonyoba-marketing/` |
| **Netlify site** | `sonyoba-marketing` |
| **Preview host** | `sonyoba-marketing.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=sonyoba-marketing |
| **Contact** | (02) 8774-1525 · Viber (0915) 190-5949 / (0933) 260-4175 |
| **Source** | [sonyobamarketing.com](https://sonyobamarketing.com/) · [Facebook](https://www.facebook.com/sonyobamarketingph) |
| **Package** | Business Website Redesign · **₱18,000** · 7–10 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### JK Construction Services

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/jk-construction/` |
| **Netlify site** | `jk-construction-services` |
| **Preview host** | `jk-construction-services.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=jk-construction |
| **Contact** | jkconstructionservices@yahoo.com · +63 926 658 6754 |
| **Location** | Caloocan, Philippines 1422 |
| **Service area** | Metro Manila, Quezon City, Novaliches, Meycauayan, Caloocan, San Jose del Monte |
| **Source** | [Facebook](https://www.facebook.com/JKConstrSvcs/) |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### Machinemate Mainteneering Services

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/machinemate/` |
| **Netlify site** | `machinemate-engineering` |
| **Preview host** | `machinemate-engineering.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=machinemate |
| **Contact** | mms_fans@yahoo.com · +63 917 776 1418 |
| **Location** | Rodriguez, Philippines |
| **Source** | [Facebook](https://www.facebook.com/machinemate/) |
| **Products** | SS/MS centrifugal fans, axial fans, roof exhaust; export & maintenance engineering |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### Jazz1 Airconditioning Services

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/jazz1-aircon/` |
| **Netlify site** | `jazz1-aircon-services` |
| **Preview host** | `jazz1-aircon-services.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=jazz1-aircon |
| **Contact** | jrairconditioningservices@gmail.com · +63 931 763 9752 |
| **Address** | No. 14 F. Rodriguez St. (Crossing), Brgy. San Jose, Rodriguez Rizal 1860 |
| **Tagline** | Your No.1 TRUSTED in Aircon Company |
| **Reviews** | 100% recommend (15 Reviews) · 12K followers · Always open |
| **Source** | [Facebook](https://www.facebook.com/people/Jazz1-Airconditioning-Services-Montalban-Rizal/100088680976545/) |
| **Assets** | Hero + 4 gallery JPGs downloaded via Chrome DevTools MCP (network response) |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### Clover Industrial Fan and Blower Inc.

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/clover-industrial-fan/` |
| **Netlify site** | `clover-industrial-fan` |
| **Preview host** | `clover-industrial-fan.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=clover-industrial-fan |
| **Contact** | cloverindustrial@gmail.com · +63 908 157 4707 |
| **Address** | 2181 L. Sumulong Memorial Circle, Antipolo, Philippines 1870 |
| **Service area** | Rizal, Philippines |
| **Tagline** | Simple but innovative industrial fan solutions |
| **Source** | [Facebook](https://www.facebook.com/cloverindustrialfan) |
| **Assets** | Hero + 4 gallery JPGs downloaded via Chrome DevTools MCP (network response) |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### G3k Cad Plotting & Blueprinting Services

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/g3k-cad/` |
| **Netlify site** | `g3k-cad-plotting` |
| **Preview host** | `g3k-cad-plotting.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=g3k-cad |
| **Contact** | +63 928 353 4491 (no public email on FB) |
| **Address** | 3rd Floor Blk.30 Lot.12 Badjao St. cor. Ivatan, Amity Village Phase 2, San Jose, Rodriguez, Rizal 1860 |
| **Service area** | Rodriguez, Rizal |
| **Category** | Printing Service · CAD plotting & blueprinting |
| **Source** | [Facebook](https://www.facebook.com/p/G3k-Cad-Plotting-Blueprinting-Services-61553203343584/) |
| **Assets** | Logo, hero + 4 gallery JPGs via Chrome DevTools MCP (network response); Motion + Three.js blueprint hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | `quotation-email.md` · `quotation-sms.txt` · `quotation-messenger.txt` |

---

### Kubling Tago Resort

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/kubling-tago-resort/` |
| **Netlify site** | `kubling-tago-resort` |
| **Preview host** | `kubling-tago-resort.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=kubling-tago-resort |
| **Contact** | Globe 0954 385 8881 · Smart 0985 243 6620 (**no public email** on FB) |
| **Address** | Villa Maria 2 Subd., Cupang, Antipolo City |
| **Category** | Local business · Day resort (infinity pools, cottages, private rooms, function hall) |
| **Source** | [Facebook](https://www.facebook.com/KublingTagoResort/) · ~25K followers |
| **Assets** | Logo, cover, pool hero + gallery (pool, garden, entrance sign, poolside); Motion + Three.js particles; sample rates from FB sheet |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days |
| **Outreach** | Messenger/SMS preferred · `quotation-messenger.txt` · `quotation-sms.txt` · email draft held (no address) |

---

### Regan Industrial Sales Inc.

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/regan-industrial/` |
| **Netlify site** | `regan-industrial` |
| **Preview host** | `regan-industrial.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=regan-industrial |
| **Contact** | inquiry@reganindustrial.com.ph · 0998 843 4711 |
| **Address** | #5 Harmony Street, Grace Village, Brgy. Balingasa, Balintawak, Quezon City 1106 |
| **Category** | Metal / steel supplier · Est. 1968 · ~80K FB followers |
| **Source** | [Facebook](https://www.facebook.com/reganindustrialph/) · [reganindustrial.com](https://reganindustrial.com/) · [mail portal](https://mail.reganindustrial.com/#/home) |
| **Assets** | Logo + hero + gallery from live site (browser fetch); Motion + Three.js blueprint hero |
| **Package** | Business Website Redesign (landing sample) · **₱18,000** · 7–10 days |
| **Outreach** | Email found — **ask before send** · `quotation-email.md` |

---

### IntelliSmart Technology Inc.

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/intellismart/` |
| **Netlify site** | `intellismartinc` |
| **Preview host** | `intellismartinc.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=intellismart |
| **Contact** | sales@intellismartinc.com · (+632) 8350 5986 |
| **Address** | 12 Catanduanes St., Brgy Paltok, West Ave., Quezon City 1105 |
| **Category** | System integration · AV / security / BMS / ICT · ~8.5K FB followers |
| **Source** | [Facebook](https://www.facebook.com/Intellismartinc/) · [intellismartinc.com](https://intellismartinc.com/) |
| **Assets** | Logo + hero + gallery from live site; Motion + Three.js blueprint hero |
| **Package** | Business Website Redesign (landing sample) · **₱18,000** · 7–10 days |
| **Outreach** | Email found — **ask before send** · `quotation-email.md` |

---

### SV More Group of Companies

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/sv-more-group/` |
| **Netlify site** | `sv-more-group` |
| **Preview host** | `sv-more-group.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=sv-more-group |
| **Contact** | reply@svmoregroup.net · (632) 8373-6240 |
| **Address** | #16 Scout Tuazon corner Roces Avenue, Quezon City 1103 |
| **Category** | Pharmaceuticals / health products · Est. 1987 · ~17K FB followers |
| **Source** | [Facebook](https://www.facebook.com/SVMoreGroupPH/) · [svmoregroup.com](https://svmoregroup.com/) |
| **Assets** | Logo + hero + product gallery from live site; Motion + Three.js particles hero |
| **Package** | Business Website Redesign (landing sample) · **₱18,000** · 7–10 days · 50% upfront |
| **Outreach** | Email found — **ask before send** · `quotation-email.md` |

---

### Trumed Pharmaceuticals

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/trumed-pharma/` |
| **Netlify site** | `trumed-pharma` |
| **Preview host** | `trumed-pharma.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=trumed-pharma |
| **Contact** | info@trumedpharma.com · +63 (2) 8697-1754 |
| **Address** | 12F Hexagon Corporate Center, 1471 Quezon Ave, West Triangle, Quezon City 1104 |
| **Category** | Pharmaceutical marketing / distribution (Hexagon Group) |
| **Source** | [trumedpharma.com](https://www.trumedpharma.com/) · [MIMS About](https://www.mims.com/philippines/company/info/trumed/about) |
| **Assets** | Logo + team hero + product/community gallery from live site; Motion + Three.js particles hero |
| **Package** | Business Website Redesign (landing sample) · **₱18,000** · 7–10 days · 50% upfront |
| **Outreach** | Email found — **ask before send** · `quotation-email.md` |

---

### DN Group of Companies

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/dn-group/` |
| **Netlify site** | `dn-group` |
| **Preview host** | `dn-group.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=dn-group |
| **Contact** | dncreativegroup@gmail.com · 0998 846 2400 |
| **Address** | 1388 Quezon Avenue, DN Corporate Center, Brgy. South Triangle, Quezon City |
| **Category** | Building materials / roofing / metals · Est. 1983 · ~5.5K FB followers |
| **Source** | [Facebook](https://www.facebook.com/dngroup.ph/) · [dngroup.com.ph](https://www.dngroup.com.ph/) |
| **Assets** | Logo, hero, product & project gallery from live site; industrial Motion + Three.js blueprint hero |
| **Package** | Business Website Redesign (elevated landing) · **₱18,000** · 7–10 days · 50% upfront |
| **Outreach** | Email found — **ask before send** · `quotation-email.md` |

---

### Alibaton Construction Inc.

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/alibaton-construction/` |
| **Netlify site** | `alibaton-construction` |
| **Preview host** | `alibaton-construction.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=alibaton-construction |
| **Contact** | info@alibaton.com.ph · 0917 542 0415 · (02) 8253 6817 |
| **Address** | Unit 3-J, Edificio Enriqueta Bldg, 422 N.S. Amoranto St. cor D. Tuazon Ave, Quezon City |
| **Category** | Tower crane rental / sales / service · ISO 9001:2015 · ~7.2K FB followers |
| **Source** | [Facebook](https://www.facebook.com/alibatoncons/) · [alibaton.com.ph](https://alibaton.com.ph/) (suspended at build time) |
| **Assets** | Logo, cover hero, team & gallery from Facebook; industrial Motion + Three.js blueprint hero |
| **Package** | Business Website Rebuild (landing) · **₱18,000** · 7–10 days · 50% upfront |
| **Outreach** | Email found — **ask before send** · `quotation-email.md` |

---

### Fastpoint PH

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/fastpoint-ph/` |
| **Netlify site** | `fastpoint-ph` |
| **Preview host** | `fastpoint-ph.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=fastpoint-ph |
| **Contact** | biodriver@gmail.com · 0917 821 2009 |
| **Category** | Fleet supply / commercial tires (Joyall) · EcoVadis Committed · ~500 FB followers |
| **Source** | [Facebook](https://www.facebook.com/ltfrbphilippines/) — vanity URL says LTFRB but page is **Fastpoint PH** (Fastpoint Enterprises Incorporated) |
| **Assets** | Joyall tire container hero, EcoVadis badge; Motion + Three.js particles hero |
| **Package** | Business Website Redesign (landing) · **₱18,000** · 7–10 days · 50% upfront |
| **Outreach** | Email found — **ask before send** · `quotation-email.md` |

---

### Archipelago Builders Corporation

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/archipelago-builders/` |
| **Netlify site** | `archipelago-builders` |
| **Preview host** | `archipelago-builders.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=archipelago-builders |
| **Contact** | abcorpinfo@archipelagobuilders.com |
| **Address** | Archipelago Building, 29 North Avenue, Brgy. Pag-asa, Quezon City |
| **Category** | Category AAA general building contractor · Est. 1965 · ~2.6K FB followers |
| **Source** | [Facebook](https://www.facebook.com/p/Archipelago-Builders-Corporation-100086010290289/) · [archipelagobuilderscorporation.com](http://www.archipelagobuilderscorporation.com/) (unreachable at build; Wayback assets) |
| **Assets** | Logo, intro/about/portfolio from Wayback + FB affiliates strip; Motion + Three.js blueprint hero |
| **Package** | Business Website Rebuild (landing) · **₱18,000** · 7–10 days · 50% upfront |
| **Outreach** | Email found — **ask before send** · `quotation-email.md` |

---

### H Vill Hospital

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/hvill-hospital/` |
| **Netlify site** | `hvill-hospital` |
| **Preview host** | `hvill-hospital.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=hvill-hospital |
| **Contact** | hvill.hospital@yahoo.com · (02) 8997 8949 / (02) 8997 9627 |
| **Address** | 82 J.P. Rizal St., Manggahan, Rodriguez (Montalban), Rizal 1860 |
| **Source** | [Facebook](https://www.facebook.com/hvill.hospital.9/) · public listings (ClinicFinderPH / OneCebu) |
| **Assets** | FB cover + logo + 3 gallery photos; Motion + Three.js particles hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | Email found — **ask before send** · `quotation-email.md` |

---

### San Mateo Medical Center

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/san-mateo-medical-center/` |
| **Netlify site** | `san-mateo-medical-center` |
| **Preview host** | `san-mateo-medical-center.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=san-mateo-medical-center |
| **Contact** | Trunk 8-539-1400 · Information 0921-605-2365 · **no public email on FB** |
| **Address** | Gen. Luna Avenue, Ampid 2, San Mateo, Rizal 1850 |
| **Source** | [Facebook](https://www.facebook.com/SMMC.2016.Official/) (~21K followers) |
| **Assets** | FB cover (2048×779) + logo + gallery thumbs; Motion + Three.js particles hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | No email — Messenger/SMS drafts · ask how to reach |

---

### Villa Clara Pool & Venue

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/villa-clara-pool/` |
| **Netlify site** | `villa-clara-pool` |
| **Preview host** | `villa-clara-pool.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=villa-clara-pool |
| **Contact** | coco.mountain@yahoo.com · 0915 001 4133 · 0998 882 3670 |
| **Address** | 50 P. Rodriguez St., San Rafael, Rodriguez (Montalban), Rizal 1860 |
| **Source** | [Facebook](https://www.facebook.com/VillaClaraPoolVenue/) (~15K followers) |
| **Assets** | HD gallery 2048px + logo 2048×2034 + cover 960×542; daytime only |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | Email found — ask before send · drafts ready |

---

### Costa Abril Resort

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/costa-abril/` |
| **Netlify site** | `costa-abril` |
| **Preview host** | `costa-abril.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=costa-abril |
| **Contact** | 0917 802 1966 (**no public email** on FB) |
| **Address** | 40 Dao Street, San Jose, Rodriguez (Montalban), Rizal 1860 |
| **Source** | [Facebook](https://www.facebook.com/CostaAbril/) (~104K followers) |
| **Assets** | Cover (960x838) + logo (770x770) + 5 gallery photos (up to 2048x1536 HD) via Chrome DevTools MCP inspect + curl download with matching signed fbcdn params; Motion + Three.js particles hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | No email — Messenger/SMS/call drafts · ask how to reach |

---

### Airalex Private Lodge & Resort

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/air-alex-resort/` |
| **Netlify site** | `air-alex-resort` |
| **Preview host** | `air-alex-resort.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=air-alex-resort |
| **Contact** | +63 962 903 5321 (**no public email** on FB) |
| **Category** | Hotel resort · Public swimming pool · ~14K FB followers |
| **Source** | [Facebook](https://www.facebook.com/airalexresort/) |
| **Assets** | Real pool photo (960×640) + logo (479×480) + 2 FB rate cards via Chrome DevTools MCP inspect + in-page `fetch()`/base64 download (fbcdn allows CORS on these variants); Motion + Three.js particles hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | No email — Messenger/SMS drafts · ask how to reach |

---

### Casa De Gloria Private Resort

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/casa-de-gloria/` |
| **Netlify site** | `casa-de-gloria` |
| **Preview host** | `casa-de-gloria.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=casa-de-gloria |
| **Contact** | 0916 266 6266 (**no public email** on FB) |
| **Address** | Block 6 Lot 10 (exact pin shared on booking) |
| **Category** | Hotel resort · Private plunge pool · 4.2K FB followers · 84% recommend (5 reviews) |
| **Source** | [Facebook](https://www.facebook.com/p/Casa-De-Gloria-Private-Resort-61558497461861/) |
| **Assets** | Logo (718×720), hero + 3 pool/waterfall gallery photos (1542×2047) + 1 patio/event photo (2048×1536) via Chrome DevTools MCP inspect (`evaluate_script`/`list_network_requests`) + curl download with the signed fbcdn params (MCP `get_network_request` file-save was blocked by shared-session workspace roots); Motion + Three.js particles hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | No email — Messenger/SMS/call drafts · ask how to reach |

---

### Casa Angelina Resort

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/casa-angelina/` |
| **Netlify site** | `casa-angelina` |
| **Preview host** | `casa-angelina.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=casa-angelina |
| **Contact** | **no public email or phone** on FB — Messenger only |
| **Address** | Block 10 Lot 1, Phase 2, Congress Village, Manggahan, Rodriguez (Montalban), Rizal 1860 |
| **Category** | Vacation Home Rental · ~6.5K FB followers · 88% recommend (12 reviews) · Always open |
| **Source** | [Facebook](https://www.facebook.com/casaangelina.resort/) |
| **Assets** | Cover (960×956) + 6 gallery photos (1260×1260–1878×1878) via Chrome DevTools MCP inspect + in-page `fetch()`/base64 download (upsized `ctp` to match `cstp` max); Motion + Three.js particles hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | No email/phone — Messenger draft only · ask how to reach |

---

### Bernardino General Hospital

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/bernardino-general-hospital/` |
| **Netlify site** | `bernardino-general-hospital` |
| **Preview host** | `bernardino-general-hospital.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=bernardino-general-hospital |
| **Contact** | bghcorpone@yahoo.com (alt bernardino.hosp@gmail.com) · 8935-5264 / 8936-6050 / 8935-7213 |
| **Address** | 680 Quirino Highway, Brgy. San Bartolome, Quezon City 1116 |
| **Category** | Hospital · Always open · Rehabilitation Medicine unit · ~28K FB followers |
| **Source** | [Facebook](https://www.facebook.com/p/Bernardino-General-Hospital-1-100063548425478/) (legacy domain bernardinogeneralhospital.com expired, not linked) |
| **Assets** | Cover graphic (1280×721) + 3 gallery photos (1448×2048, 1080×1350 ×2) via Chrome DevTools MCP inspect + `get_network_request`-identified signed fbcdn URLs, curl-downloaded at native resolution (`get_network_request` file-save blocked by shared-session workspace roots); Motion + Three.js particles hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | Email found — **ask before send** · `quotation-email.md` |

---

### Pacific Global Medical Center

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/pgmc/` |
| **Netlify site** | `pacific-global-medical-center` |
| **Preview host** | `pacific-global-medical-center.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=pgmc |
| **Contact** | **no public email** on FB — trunkline (02) 8248-7400 (Emergency loc. 1017) found on promo graphics, not the About tab |
| **Address** | Lot 2B Mindanao Avenue, Novaliches, Quezon City 1116 |
| **Category** | Hospital · Always open · Founded 2010 · ~19K FB followers · Price Range $$ |
| **Source** | [Facebook](https://www.facebook.com/pgmc2013/) |
| **Assets** | Cover/hero 1640×720 (building exterior) + 480×480 profile logo via Chrome DevTools MCP inspect + curl with matching signed fbcdn query params and browser headers (`get_network_request` file-save blocked by sandbox path restrictions, response body evicted from cache); Photos tab had no real interior/exterior gallery beyond the cover — mostly text-heavy marketing graphics, so Services/Programs sections use icon cards instead of a photo gallery; Motion + Three.js blueprint hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | No public email — Messenger/SMS/call · ask how to reach them |

---

### NovaGen (Novaliches General Hospital and Medical Center)

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/novagen/` |
| **Netlify site** | `novagen-hospital` |
| **Preview host** | `novagen-hospital.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=novagen |
| **Contact** | Trunkline (02) 8426-8888 · **no confirmed current email** (older directories list a stale `novagenhospital@yahoo.com`) |
| **Address** | NGHI Building, 793 Quirino Highway, Brgy. Gulod, Novaliches, Quezon City 1117 |
| **Category** | Private Level 1 tertiary hospital · Est. 1997 (Tan family) · `#AlagangNovaGen` |
| **Source** | [Facebook](https://www.facebook.com/novagen.ph/) · [novagen.com.ph](https://www.novagen.com.ph) · [About microsite](https://sites.google.com/view/novagencomph/about-novagen) |
| **Assets** | Logo (1620×1620 JPEG) + cover photo (1773×657 PNG→JPEG) via Chrome DevTools MCP inspect + in-page `fetch()`/base64 download (`get_network_request` file-save blocked by shared-session workspace roots); FB Photos tab login-walled with only text-graphic posts, so services/facilities content sourced from official novagen.com.ph / About microsite instead of a photo gallery; Motion + Three.js particles hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | No confirmed email — Messenger/SMS/call drafts · ask how to reach them |

---

### Fairview General Hospital Inc.

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/fairview-general-hospital/` |
| **Netlify site** | `fairview-general-hospital` |
| **Preview host** | `fairview-general-hospital.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=fairview-general-hospital |
| **Contact** | fairviewgeneralhospitalinc@gmail.com · (02) 8939-8764 |
| **Address** | Lot 20 Cor Mercury St. Fairview Ave, Fairview Subdivision, Quezon City 1118 |
| **Category** | PhilHealth Level I private hospital · Est. 1984 · OPEN 24/7 · 30-bed capacity · 86% recommend (211 reviews) |
| **Source** | [Facebook](https://www.facebook.com/p/Fairview-General-Hospital-Inc-100057044726961/) |
| **Assets** | Cover/hero 2048×1753 JPEG + logo 480×480 JPEG + gallery 1080×1080 JPEG ×4 via Chrome DevTools MCP in-page `fetch()`/base64 (`get_network_request` file-save blocked by sandbox path); Motion + Three.js blueprint hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | Email on FB About — drafts ready · **ask before send** |

---

### MPHS Mother of Perpetual Help Inc. Fairview

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/mphs-fairview/` |
| **Netlify site** | `mphs-fairview` |
| **Preview host** | `mphs-fairview.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=mphs-fairview |
| **Contact** | mphsi.edu@gmail.com · 0966 194 6589 |
| **Address** | Iris Street, Dahlia Avenue, Quezon City 1118 |
| **Category** | Nonprofit K–12 school · Humility in Greatness · Est. 1990 · 978 FB followers |
| **Source** | [Facebook](https://www.facebook.com/p/MPHS-Mother-of-Perpetual-Help-Inc-Fairview-61588929957305/) |
| **Assets** | Hero 1500×500 + logo 1290×1290 + profile 1024×1024 + gallery JPEGs (2048×1024, 1054×1492, 1024×1536, 1402×1122) via Chrome DevTools MCP in-page fetch/base64; Motion + Three.js blueprint hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | Email on FB About — drafts ready · **ask before send** |

---

### Amora Body Wellness Spa

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/amora-body-wellness-spa/` |
| **Netlify site** | `amora-body-wellness-spa` |
| **Preview host** | `amora-body-wellness-spa.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=amora-body-wellness-spa |
| **Contact** | sugar.stamaria@gmail.com · 0917 176 5171 |
| **Address** | 17 Fairlane St., Fairview, Quezon City |
| **Category** | Health/beauty spa · holistic wellness · online booking · $$ · 100% recommend (5 reviews) · 717 FB followers |
| **Source** | [Facebook](https://www.facebook.com/p/Amora-Body-Wellness-Spa-61569071263786/) · [Instagram](https://www.instagram.com/here_at_amora) |
| **Assets** | Logo 2048×2048 + hero/gallery 1080×1350 JPEGs via Chrome DevTools MCP in-page fetch; Motion + Three.js particles hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | Email on FB About — drafts ready · **ask before send** |

---

### Taguig City General Hospital

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/taguig-city-general-hospital/` |
| **Netlify site** | `taguig-city-general-hospital` |
| **Preview host** | `taguig-city-general-hospital.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=taguig-city-general-hospital |
| **Contact** | tgh@taguig.gov.ph · +63 968 377 6440 (OPD) · +63 964 063 02 (Lab) · +63 968 401 5862 (Radiology) |
| **Address** | 506 C6 Road, Barangay Hagonoy, Taguig City |
| **Category** | Government organization · public hospital · 27K FB followers · 84% recommend (33 reviews) · OPD Mon–Fri 8AM–5PM |
| **Source** | [Facebook](https://www.facebook.com/TaguigCityGeneralHospital/) · [Taguig.gov.ph](https://taguig.gov.ph/health/hospitals-and-centers/) |
| **Assets** | Hero 820×312 + logo 834×813 + gallery 414×414×4 JPEG via Chrome DevTools MCP in-page fetch; Motion + Three.js blueprint hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | tgh@taguig.gov.ph — drafts ready · **ask before send** |

---

### The Lakehouse Taguig

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/the-lakehouse-taguig/` |
| **Netlify site** | `the-lakehouse-taguig` |
| **Preview host** | `the-lakehouse-taguig.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=the-lakehouse-taguig |
| **Contact** | thelakehousetaguig@gmail.com · 0917 871 0777 (WhatsApp) |
| **Address** | Taguig, Philippines 1630 |
| **Category** | Hotel resort · Laguna Lake staycation · Superhost on Airbnb · 1.6K FB followers · always open |
| **Source** | [Facebook](https://www.facebook.com/people/The-Lakehouse/61579539671917/) |
| **Assets** | Hero 2048×1536 + logo 480×480 + gallery pool shots up to 2048×1536 / 1536×2048 JPEG via Chrome DevTools MCP in-page fetch; Motion + Three.js particles hero |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | thelakehousetaguig@gmail.com — drafts ready · **ask before send** · cadence **3d1w** after yes |

---

### Journey Woodblock Modular Cabinets

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/journey-woodblock-ph/` |
| **Netlify site** | `journey-woodblock-ph` |
| **Preview host** | `journey-woodblock-ph.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=journey-woodblock-ph |
| **Contact** | info@journeywoodblock.com · 0917 893 6322 |
| **Address** | Block 38 L34&36 Sparrow Lane, Bay Breeze Executive Village, Brgy Wawa, Taguig City |
| **Category** | Cabinet & countertop store · 11K FB followers · 90% recommend (26 reviews) · $$$ · open · in-store pickup |
| **Source** | [Facebook](https://www.facebook.com/JourneyWoodblockPh/) · [Instagram](https://www.instagram.com/journeywoodblockph) · [journeywoodblock.com](https://www.journeywoodblock.com/) |
| **Assets** | Logo 2048×1536 + hero 1536×2048 + gallery 1080×1528/960×1280×4 JPEG via Chrome DevTools MCP in-page fetch |
| **Hero 3D** | Motion + warm particles + **`data-hero-three-object="woodblock"`** featured carved block (shared `_template/hero-three.js`) |
| **Package** | Starter Business Website · **₱15,000** · 5–7 days · 50% upfront |
| **Outreach** | info@journeywoodblock.com — drafts ready · **ask before send** |

---

### Cardinal Santos Medical Center

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/cardinal-santos/` |
| **Netlify site** | `cardinal-santos` |
| **Preview host** | `cardinal-santos.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=cardinal-santos |
| **Contact** | marketing@csmc.ph · productinfo@csmc.ph · +63 2 8727 0001 |
| **Address** | 10 Wilson St., Greenhills West, San Juan City, Metro Manila 1502 |
| **Category** | Hospital · Always open · 267K FB followers · verified |
| **Source** | [Facebook](https://www.facebook.com/CardinalSantos/) · [cardinalsantos.com.ph](https://cardinalsantos.com.ph/) |
| **System** | appointments · Hospital appointments admin · painHero: institute backlog at Greenhills front desk |
| **Hero 3D** | Motion + cool particles + **`data-hero-three-object="stethoscope"`** |
| **Package** | Business Website · **₱18,000** *(website only)* · 5–7 days · 50% upfront · admin sample priced separately |
| **Outreach** | marketing@csmc.ph — drafts ready · **ask before send** |

---

### St. Luke's Medical Center

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/st-lukes/` |
| **Netlify site** | `st-lukes` |
| **Preview host** | `st-lukes.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=st-lukes |
| **Contact** | productinfo@stlukes.com.ph · customer.bgc@stlukes.com.ph · +63 2 8789 7700 (GC) · +63 2 8723 0101 (QC) |
| **Address** | QC · 279 E. Rodriguez Sr. Ave · Global City · Rizal Drive cor. 32nd St. & 5th Ave, Taguig |
| **Category** | Hospital · 430K FB followers · JCI-accredited · Quezon City & Global City |
| **Source** | [Facebook](https://www.facebook.com/StLukesPH/) · [stlukes.com.ph](https://www.stlukes.com.ph/) |
| **System** | appointments · OPD & appointments admin · painHero: specialty clinics across QC & Global City |
| **Hero 3D** | Motion + cool particles + **`data-hero-three-object="stethoscope"`** · brand indigo `#291f84` |
| **Package** | Starter Business Website · **₱15,000** *(website only; ₱18k fuller option)* · 5–7 days · 50% upfront · admin sample priced separately |
| **Outreach** | productinfo@stlukes.com.ph — drafts ready · **ask before send** |

---

### Grand Hyatt Manila

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/grand-hyatt-manila/` |
| **Netlify site** | `grand-hyatt-manila` |
| **Preview host** | `grand-hyatt-manila.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=grand-hyatt-manila |
| **Contact** | manila.grand@hyatt.com · +63 2 8838 1234 |
| **Address** | 8th Avenue corner 35th Street, Bonifacio Global City, Taguig |
| **Category** | Luxury hotel · 80K FB followers · 96% recommend (24,950 reviews) · Always open · 461 rooms |
| **Source** | [Facebook](https://www.facebook.com/grandhyattmanilaph/) · [Hyatt](https://www.hyatt.com/grand-hyatt/en-US/mangh-grand-hyatt-manila) |
| **System** | booking · Hotel booking & arrivals admin · painHero: room blocks & banquet inquiries on Messenger/email |
| **Hero 3D** | Motion + champagne particles + **`data-hero-three-object="spa"`** (Illume Spa) · charcoal/gold luxury palette |
| **Assets** | Cover 2048×1638 + logo 386×386 + dining 1365×2048×2 + tower crops from cover |
| **Package** | Premium Business Website · **₱18,000** *(website only)* · 7–10 days · 50% upfront · admin sample priced separately |
| **Outreach** | manila.grand@hyatt.com — drafts ready · **ask before send** · cadence **3d1w** after yes |

---

### Lucky Drive Inn Hotel

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/lucky-drive-inn/` |
| **Netlify site** | `lucky-drive-inn` |
| **Preview host** | `lucky-drive-inn.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=lucky-drive-inn |
| **Contact** | luckydriveinnhotel@gmail.com · +63 917 824 7925 |
| **Address** | Don Mariano Ave., San Jose, Rodriguez, Rizal 1860 |
| **Category** | Company · First drive-in hotel in Rodriguez Rizal · Always open · ~1.9K FB followers · slogan “Satisfaction at its Best” |
| **Source** | [Facebook](https://www.facebook.com/luckydriveinnhotel/) |
| **System** | booking · Room booking & calendar admin · painHero: overnight/drive-in requests on Messenger |
| **Hero 3D** | Motion + particles + **`data-hero-three-object="lakehouse"`** · royal blue / kelly green / gold (logo palette) |
| **Assets** | Cover promo 1640×924 + logo 480×480 + themed rooms 2048×1536 (×4) + portrait room 1536×2048 |
| **Package** | Starter Business Website · **₱15,000** *(website only)* · 5–7 days · 50% upfront · admin sample priced separately |
| **Outreach** | luckydriveinnhotel@gmail.com — drafts ready · **ask before send** · cadence **3d1w** after yes |

---

### Merlita's Private Resort

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/merlitas-private-resort/` |
| **Netlify site** | `merlitas-private-resort` |
| **Preview host** | `merlitas-private-resort.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=merlitas-private-resort |
| **Contact** | +63 949 563 1129 (**no public email** on FB) |
| **Address** | 220 E. Manuel St. Brgy. San Jose, Rodriguez, Rizal 1860 |
| **Category** | Page · Event · Private resort in Montalban Rizal · Daytime 8am–5pm · Overnight 8pm–5am · ~4.5K FB followers · TikTok @merlitasvenue |
| **Source** | [Facebook](https://www.facebook.com/merlitasprivateresort/) |
| **System** | booking · Booking & calendar admin · painHero: day/overnight Messenger bookings |
| **Hero 3D** | Motion + particles + **`data-hero-three-object="pooldeck"`** · tropical green / champagne gold |
| **Assets** | Cover 2048×1536 + logo 2048×2048 + venue/event gallery (~939–1074px ×4) via Chrome DevTools MCP inspect + signed fbcdn curl |
| **Package** | Starter Business Website · **₱15,000** *(website only)* · 5–7 days · 50% upfront · admin sample priced separately |
| **Outreach** | No email — Messenger/SMS/call drafts · ask how to reach |

---

### CJ Gomez Private Resort

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/cj-resort/` |
| **Netlify site** | `cj-gomez-private-resort` |
| **Preview host** | `cj-gomez-private-resort.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=cj-resort |
| **Contact** | cjgprivateresort@gmail.com · +63 919 358 8505 |
| **Address** | 1860 · Rodriguez, Rizal (exact pin shared on booking) |
| **Category** | Local business · Private resort · special occasions · ~4.2K FB followers · tagline “feel like you're HOME” |
| **Source** | [Facebook](https://www.facebook.com/CJresort/) |
| **System** | booking · Venue booking & calendar admin · painHero: special-occasion big-group Messenger bookings |
| **Hero 3D** | Motion + particles + **`data-hero-three-object="pooldeck"`** · forest green / warm gold |
| **Assets** | Cover garden + lodge profile + gallery (960×960 ×5) via Chrome DevTools + signed fbcdn curl |
| **Package** | Starter Business Website · **₱15,000** *(website only)* · 5–7 days · 50% upfront · admin sample priced separately |
| **Outreach** | cjgprivateresort@gmail.com — drafts ready · **ask before send** · cadence **3d1w** after yes |

---

### Palms and Terraces

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/palms-and-terraces/` |
| **Netlify site** | `palms-and-terraces` |
| **Preview host** | `palms-and-terraces.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=palms-and-terraces |
| **Contact** | palms.and.terraces@gmail.com (**no public phone** on FB) |
| **Address** | Chico Street, Torres Subd., San Jose, Rodriguez, Philippines 1850 |
| **Category** | Public Swimming Pool · Events place (weddings, birthdays, parties, forums) · ~4.3K FB followers |
| **Source** | [Facebook](https://www.facebook.com/p/Palms-and-Terraces-100063872265656/) |
| **System** | booking · Booking & calendar admin · painHero: weddings/birthdays/pool Messenger bookings |
| **Hero 3D** | Motion + particles + **`data-hero-three-object="pooldeck"`** · tropical green / champagne gold |
| **Assets** | Hero 1920×1795 + logo 908×908 + gallery (1920 / 1440×864 / 1200 / 2048×1536) via Chrome DevTools + signed fbcdn |
| **Package** | Starter Business Website · **₱15,000** *(website only)* · 5–7 days · 50% upfront · admin sample priced separately |
| **Outreach** | palms.and.terraces@gmail.com — drafts ready · **ask before send** · cadence **3d1w** after yes |

---

### Frances Teresa Garden — The Party Place

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/frances-teresa-garden/` |
| **Netlify site** | `frances-teresa-garden` |
| **Preview host** | `frances-teresa-garden.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=frances-teresa-garden |
| **Contact** | ftdl.corp.design@gmail.com · 0947 705 2252 |
| **Address** | 698 Tanguile St., San Jose, Rodriguez, Philippines 1860 |
| **Category** | Performance & Event Venue · weddings, debuts, baptisms, reunions, seminars, photo shoots · vintage bridal/sports cars · ~4.2K FB · 80% recommend |
| **Source** | [Facebook](https://www.facebook.com/p/Frances-Teresa-Garden-The-Party-PlaceParty-Venue-100064148883159/) |
| **System** | booking · Venue booking admin · painHero: wedding/debut/party Messenger bookings |
| **Hero 3D** | Motion + particles + **`data-hero-three-object="lakehouse"`** · garden green / champagne |
| **Assets** | Logo 2048² + gallery (1080–1536) + cover via Playwright logged-out download |
| **Package** | Starter Business Website · **₱15,000** *(website only)* · 5–7 days · 50% upfront · admin sample priced separately |
| **Outreach** | ftdl.corp.design@gmail.com — drafts ready · **ask before send** · cadence **3d1w** after yes |

---

### Sky Glass

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/sky-glass/` |
| **Netlify site** | `sky-glass-resort` |
| **Preview host** | `sky-glass-resort.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=sky-glass |
| **Contact** | **No email** on FB About · 0927 578 8947 |
| **Address** | Blk 10 Lot 45 Phase 2 Congressville Subd. Brgy. Manggahan, Rodriguez, Rizal |
| **Category** | Hotel resort · Public Swimming Pool · Exclusive Resort · Indoor pool (*Dito hindi ka mangingitim*) · ~9.5K FB followers |
| **Source** | [Facebook](https://www.facebook.com/p/Sky-Glass-61557954401054/) |
| **System** | booking · Venue booking & calendar admin · painHero: indoor-pool day + night staycations on Messenger |
| **Hero 3D** | Motion + particles + **`data-hero-three-object="pooldeck"`** · midnight navy / amber |
| **Assets** | Cover 2048×1536 + indoor pool promo 1448×1086 + neon logo wall + guest gallery via Chrome DevTools + signed fbcdn |
| **Package** | Starter Business Website · **₱15,000** *(website only)* · 5–7 days · 50% upfront · admin sample priced separately |
| **Outreach** | No email — Messenger/SMS drafts ready · **ask before send** · cadence **3d1w** after yes |

---

### Joyce Kim Resort

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/joyce-kim-resort/` |
| **Netlify site** | `joyce-kim-resort` |
| **Preview host** | `joyce-kim-resort.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=joyce-kim-resort |
| **Contact** | jkimresort@gmail.com · 0917 657 5747 |
| **Address** | Leal Compound, Brgy. Balite, Rodriguez, Philippines |
| **Category** | Hotel resort · Day Time Swim 8 AM–4 PM · Dine-in / outdoor seating · ~3.3K FB · 84% recommend |
| **Source** | [Facebook](https://www.facebook.com/joycekimresort/) |
| **System** | booking · Booking & calendar admin · painHero: day-swim + overnight Messenger bookings |
| **Hero 3D** | Motion + particles + **`data-hero-three-object="lakehouse"`** · lagoon green / sand gold |
| **Assets** | Logo 959² + hero-venue 2048×1536 + gallery rooms/kitchen (1448–2048) via isolated Chrome CDP + FB Photos |
| **Package** | Starter Business Website · **₱15,000** *(website only)* · 5–7 days · 50% upfront · admin sample priced separately |
| **Outreach** | jkimresort@gmail.com — drafts ready · **ask before send** · cadence **3d1w** after yes |

### Villa Apolonia Resort Hotel

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/villa-apolonia/` |
| **Netlify site** | `villa-apolonia` |
| **Preview host** | `villa-apolonia.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=villa-apolonia |
| **Contact** | newvarh@gmail.com · SMART 0968 306 6345 · PLDT (02) 8788 2475 |
| **Address** | Maly-Maarang Road, Brgy. Maly, San Mateo, Rizal |
| **Category** | Hotel resort · Always open · ~4.3K FB · 66% recommend · “The Perfect Hide-away” |
| **Source** | [Facebook](https://www.facebook.com/VillaApoloniaResortHotel/) |
| **System** | booking · Booking & calendar admin · painHero: room + day-stay Messenger bookings |
| **Hero 3D** | Motion + particles + **`data-hero-three-object="lakehouse"`** · forest green / gold |
| **Assets** | Logo 960² + hero 960×720 + gallery (800–1080) from FB Photos |
| **Package** | Starter Business Website · **₱15,000** *(website only)* · 5–7 days · 50% upfront · admin sample priced separately |
| **Outreach** | newvarh@gmail.com — drafts ready · **ask before send** · cadence **3d1w** after yes |

### A and C Private Pool Resort

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/a-and-c-private-pool/` |
| **Netlify site** | `a-and-c-private-pool` |
| **Preview host** | `a-and-c-private-pool.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=a-and-c-private-pool |
| **Contact** | **No public email/phone** on FB About · [Facebook](https://www.facebook.com/p/A-and-C-Private-Pool-Resort-100057536286377/) |
| **Address** | Abuab Road II, San Mateo, Rizal, Philippines |
| **Category** | Vacation Home Rental · Always open · ~5.1K FB · 92% recommend · Curbside pickup |
| **Source** | [Facebook](https://www.facebook.com/p/A-and-C-Private-Pool-Resort-100057536286377/) |
| **System** | booking · Booking & calendar admin · painHero: day swim / pavilion / room Messenger bookings |
| **Hero 3D** | Motion + particles + **`data-hero-three-object="pooldeck"`** · teal / lake accent |
| **Assets** | Logo 512² (hero crop) + hero 2048×1536 + gallery pool shots (414–1024×1536) via Cursor browser + signed fbcdn |
| **Package** | Starter Business Website · **₱15,000** *(website only)* · 5–7 days · 50% upfront · admin sample priced separately |
| **Outreach** | No email — Messenger/SMS drafts ready · **ask before send** · cadence **3d1w** after yes |

### Liz Palmana Resort

| Field | Value |
|-------|--------|
| **Folder** | `client-sites/liz-palmana/` |
| **Netlify site** | `liz-palmana` |
| **Preview host** | `liz-palmana.netlify.app` |
| **Preview URL** | https://carlmanuel.com/?preview=liz-palmana |
| **Contact** | lizpalmanaresort@yahoo.com · no public phone on FB |
| **Address** | Baltazar Compound, Patiis Rd, Malanday, San Mateo, Philippines |
| **Category** | Hotel · Always open · ~3K FB · Not yet rated (3 Reviews) · Tagline: “An ideal place for your family and friends.” |
| **Source** | [Facebook](https://www.facebook.com/LizPalmana/) · [lizpalmana.com](http://www.lizpalmana.com/) |
| **System** | booking · Booking & calendar admin · painHero: family/friends Messenger bookings |
| **Hero 3D** | Motion + particles + **`data-hero-three-object="lakehouse"`** · palm teal / sand gold |
| **Assets** | Logo 942² + hero-venue 1080×810 + gallery pool/venue (414–1080) via Chrome DevTools + in-page fetch |
| **Package** | Starter Business Website · **₱15,000** *(website only)* · 5–7 days · 50% upfront · admin sample priced separately |
| **Outreach** | lizpalmanaresort@yahoo.com — drafts ready · **ask before send** · cadence **3d1w** after yes |

---

## Folder layout

```text
client-sites/
  README.md           # This catalog — update when adding a client
  _template/          # Copy for new clients
  {slug}/             # One folder per business
    index.html        # Tailwind CDN (primary layout)
    styles.css        # Hero bg, reveal animations
    site.js           # Mobile nav, accordions, filters, scroll reveal
    hero-motion.js    # Motion (Framer Motion) — first-section hero entrance
    hero-three.js     # Three.js ambient canvas + optional featured object (`data-hero-three-object`)
    assets/           # Logos, photos (optional)
    netlify.toml
    client.json       # business, contact, quotation, preview URL
    quotation-email.md
    quotation-sms.txt
    quotation-messenger.txt
    quotation-followup-3d.md
    quotation-followup-1w.md
    embed-guard.js
    netlify/edge-functions/embed-only.js
```

**Motion + Three.js on hero:** wrap the first section in `[data-hero]`, animate copy with `[data-hero-animate]` / `[data-hero-bg]` / `[data-hero-cta]`, add `<canvas data-hero-canvas>`. Themes: `data-hero-three="blueprint"` or `"particles"`. Load `hero-motion.js` then `hero-three.js` as modules after `site.js`. Reference: `g3k-cad/` (Motion + Three.js), `quotation/` (Motion).

## `client.json` schema

```json
{
  "businessName": "Business Name",
  "slug": "business-slug",
  "previewHost": "business-slug.netlify.app",
  "industry": "Industry label",
  "deployedAt": "2026-07-13",
  "contact": {
    "name": "Contact name",
    "email": "client@example.com",
    "phone": "+63 900 000 0000"
  },
  "quotation": {
    "packageName": "Starter Business Website",
    "packageScope": "One-page responsive site…",
    "quotedAmount": "₱15,000",
    "paymentTerms": "50% upfront to begin · 50% on delivery (not the full amount upfront)",
    "timeline": "5–7 business days",
    "previewUrl": "https://carlmanuel.com/?preview=business-slug"
  },
  "outreach": {
    "emailDraft": "quotation-email.md",
    "smsDraft": "quotation-sms.txt",
    "messengerDraft": "quotation-messenger.txt",
    "followUp3dDraft": "quotation-followup-3d.md",
    "followUp1wDraft": "quotation-followup-1w.md",
    "status": "draft",
    "cadence": null,
    "emailFound": false,
    "sentAt": null,
    "nextFollowUpAt": null,
    "lastFollowUpAt": null,
    "followUpCount": 0,
    "notes": ""
  },
  "sources": {
    "facebook": "https://www.facebook.com/…",
    "website": "https://…",
    "address": "…"
  }
}
```

## New client workflow

1. `cp -R client-sites/_template client-sites/{slug}`
2. Customize `index.html`, `styles.css`, `site.js`, `hero-motion.js`, `hero-three.js`, `client.json`, assets
3. Deploy: `cd client-sites/{slug} && npx netlify deploy --prod --create-site {netlify-site-name}`
4. Set `previewHost`, `deployedAt`, and `quotation.previewUrl` in `client.json` (`previewUrl` uses `?preview={slug}`, not the Netlify hostname)
5. Draft outreach (email / SMS / messenger + **3d** and **1w** follow-ups)
6. **If email found** → ask before send (Private Email `info@carlmanuel.com`); **yes** → send + auto follow-ups (default **1 week**; **3 days** only if said in the same reply)
7. Add entry to `src/v3/config/previewWhitelist.js` (`PREVIEW_SITES`)
8. **Add a row + detail section to this README**
9. Portfolio release if whitelist changed (see deploy skill)
10. Browser QA: open preview link on desktop + mobile mockups

## Agent skill & rules

| Resource | Path |
|----------|------|
| Skill | [`.cursor/skills/client-site-netlify/SKILL.md`](../.cursor/skills/client-site-netlify/SKILL.md) |
| Rule | [`.cursor/rules/client-quotations.mdc`](../.cursor/rules/client-quotations.mdc) |
| Whitelist | [`src/v3/config/previewWhitelist.js`](../src/v3/config/previewWhitelist.js) |
| Preview helper | `buildPreviewPortfolioUrl(slug)` in `previewWhitelist.js` |
| Preview tests | [`previewWhitelist.test.js`](../src/v3/config/previewWhitelist.test.js), [`Index.test.js`](../src/pages/Index.test.js), [`PreviewShowcase.test.js`](../src/v3/containers/PreviewShowcase/PreviewShowcase.test.js) |
| Preview UI | [`src/v3/containers/PreviewShowcase/`](../src/v3/containers/PreviewShowcase/) |

## Security

- Preview iframes only allow `*.netlify.app` or hosts in `PREVIEW_SITES`.
- Every client folder ships **embed-only** protection:
  - `embed-guard.js` (in `<head>`)
  - `netlify/edge-functions/embed-only.js`
  - CSP `frame-ancestors` in `netlify.toml`
- Do not commit API keys; use Netlify env vars for forms later.
- Do not commit `.netlify/` link state.

## Verify embed-only

```bash
# Direct → 403
curl -sI "https://{slug}" | head -1

# Iframe simulation → 200
curl -sI -H "Sec-Fetch-Dest: iframe" \
  -H "Referer: https://carlmanuel.com/?preview={slug}" \
  "https://{slug}" | head -1
```

## Outreach

Each client folder includes three **draft** files. Pull package/price/contact from `client.json`. Present to the user for review — **never auto-send**.

Sign-off: **Carl Louis Manuel** · [carlmanuel.com](https://carlmanuel.com) · [Facebook](https://www.facebook.com/profile.php?id=61557195950694) · info@carlmanuel.com
