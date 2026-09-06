# SEO Plan — Vittu Bharat (Udupi / Mangalore Real Estate)

Audited: 6 pages, robots.txt, sitemap.xml, schema markup, image weights, live Google SERPs.
Written plain. No jargon without a simple meaning next to it.

---

## PART 1 — WHY SEO IS NOT WORKING NOW

Five real problems found in the code. Ranked by damage.

### P1. Fake review rating in schema (FIX TODAY — penalty risk)

`index.html` tells Google: **rating 4.8, based on 120 reviews.**
The site shows **3 testimonials**, and their photos are **stock images from Unsplash** (16 Unsplash links in the file).

Google's rule: rating markup must match real reviews visible on the page.
Unearned `aggregateRating` leads to a manual action, loss of rich results, or sitewide trust damage.
This single block may be holding the whole domain down.

**Do:** delete `aggregateRating` until real Google reviews exist. Let the Google Business Profile carry the stars. Never self-declare a rating.

### P2. Site is dated in the future

Content carries **2026 and 2027** dates — loan rates "as of August 2026", K-RERA counts, rule changes.
Today is September 2026. Claims dated ahead of today cannot be verified and read as unreliable to both Google's helpfulness systems and a careful buyer.

**Do:** every factual claim gets a real date plus a source link (many already have sources — that part is good). Remove anything dated ahead of today.

### P3. Page weight is huge — mobile buyers leave

- `hero.jpg` = **2.6 MB**
- `contact.png` = **2.4 MB**
- Four full-size team photos still shipped: abhijit / ajay / deepa `.jpeg` at **~1.8 MB each**
- `sidhvin.png` = **1.6 MB** (no small version exists in `team/sm/`)
- `style.css` = 148 KB, `main.js` = 52 KB
- **Zero `preload` tags** on the homepage
- A **3.5 MB `.mp3`** is sitting inside `/team`

Homepage ships roughly **12 MB of images**. On a 4G phone in Udupi that is a 15–30 second wait.
Core Web Vitals (Google's speed score) will fail. Most buyers here are on mid-range phones.

**Do:** convert every image to WebP, max 1600px wide, target under 150 KB each. Create `team/sm/sidhvin.png`. Preload the hero image only. Delete the mp3.

### P4. Homepage H1 sells nothing to search

Current H1: `Vittu Bharat Associates`
Nobody searches your company name — they do not know it yet. That headline wins zero keywords.

**Do:** H1 becomes `Real Estate in Udupi & Mangalore`. Brand name stays in the logo and the title tag.

### P5. Only 6 pages, thin internal linking (5–6 links per page)

Google cannot rank you for a keyword you have no page for. The portals (99acres, RealEstateIndia, SquareYards, Justdial) each run thousands of pages. You have six.

---

## PART 2 — WHAT THE LIVE SERPs ACTUALLY SHOW

I searched the real target queries. Findings:

**Finding A — Portals own every generic keyword.**
"property for sale udupi", "2bhk flats udupi", "plots manipal" all return 99acres, SquareYards, RealEstateIndia, CommonFloor, OLX, Justdial, Sulekha across page one.
**You cannot beat them on listing volume. Stop competing there.** They win on inventory. They lose on trust, law, and street-level local knowledge.

**Finding B — Google confuses your Udupi with Bangalore's.**
Searching "2 BHK flats Udupi" returned **NoBroker results for "Udupi Garden, BTM 2nd Stage, Bangalore"**.
The word "Udupi" alone is geographically ambiguous to Google.
**Fix:** never use bare "Udupi". Always pair it — "Udupi, Karnataka", "Udupi district", "Udupi–Manipal", or a ward name (Bannanje, Ambalpady, Santhekatte, Kunjibettu, Doddanagudde, Brahmavar, Katpadi).

**Finding C — The real buyer fear is documented, and you already solve it.**
A loan directory review complained that an agent asked for "file charges" upfront with no certainty of approval. Standard buyer advice in this market is now "avoid agents asking large upfront fees".
Your **₹0 fee** answers the single biggest objection here. Right now it is buried in a small stat tile. **Make it a headline.**

**Finding D — Legal due diligence is the highest-intent content gap.**
Searches for DC conversion / RTC / khata / EC return law-firm and portal blogs (PKP Advocates, 1acre, Deedwise, PropWatch). **Not one is from Udupi or Dakshina Kannada**, and none cover **CRZ**, which applies directly to this coastline.
You have an in-house advocate with 17 years and bank empanelment. Nobody local is using that advantage.

**Finding E — 2026 local ranking weights** (Whitespark-style surveys):
GBP signals ~32%, on-page ~19%, reviews ~16%, links ~15%, behaviour ~8%, citations ~7%.
46% of all Google searches now carry local intent. Google now uses AI to pull keywords **out of review text** — if 30 clients write "title verification Udupi" in reviews, you rank for it without editing the site.

---

## PART 3 — KEYWORD STRATEGY (service + place, short words)

Rule for every page: **one service + one place = one page.** Short. Plain. The way people actually type.

### Tier 1 — money keywords (pages exist, need tuning)

| Keyword | Page | Action |
|---|---|---|
| property in udupi | property-in-udupi.html | keep; add ward sections |
| flats for sale udupi | flats-for-sale-udupi.html | keep; add per-ward prices |
| sites for sale manipal | sites-for-sale-manipal.html | keep |
| home loan udupi | home-loans.html | keep; lead with ₹0 fee |
| real estate udupi | index.html | fix the H1 |

### Tier 2 — build next (real searches, no strong local page exists)

Buy and sell intent — the two you named:

- `buy property in udupi` — buyer page (checklist, legal process, loan tie-in)
- `sell property in udupi` — **you have no seller page. This is the biggest gap on the site.** Sellers are half the market, high value, and almost uncontested locally.

Service + place, one page each:

- `land for sale udupi`
- `house for sale udupi`
- `commercial property udupi`
- `property in mangalore` — *you claim Mangalore in every title tag but own zero Mangalore pages. Google sees the mismatch.*
- `flats for sale mangalore`
- `real estate agent udupi`
- `property rental udupi`
- `nri property udupi` — you already answer NRI and FEMA rules; high value, low competition
- `agricultural land udupi`

Ward level — this beats the portals, because they cannot describe a street:

`property in bannanje` · `flats in ambalpady` · `sites in santhekatte` · `plots in brahmavar` · `property in kunjibettu` · `flats in doddanagudde` · `sites in katpadi` · `property in kaup` · `property in kundapur` · `property in karkala`

### Tier 3 — trust and legal hub (wins AI answers and backlinks)

- `dc conversion udupi`
- `khata transfer udupi`
- `encumbrance certificate udupi`
- `crz rules udupi` — **nobody has written this. Coastal Udupi needs it. An open #1.**
- `stamp duty karnataka` — you already hold the data
- `guidance value udupi`
- `cent to square feet` — a calculator page; big local search, small effort
- `rera check karnataka`

### Words to avoid

Never put bare "Udupi" in a title tag. Drop "premium", "trusted", "leading", "one-stop" — no search volume, no trust value.

---

## PART 4 — TRUST SCORE (E-E-A-T)

Google is asking one question: does a real, qualified, accountable business stand behind this page?

**Already have (good):** named team with photos and real credentials, physical address, hours, phone, in-house advocate, source links on legal claims, RERA / FEMA / Kaveri citations.

**Missing — add these:**

1. **Delete the fake 4.8 / 120 rating.** (same as P1 — it is the worst trust signal on the site)
2. **Collect real Google reviews.** Ask every closed client. Target 25+ in 90 days. Ask them to name the service and the place in their own words — "title check in Bannanje", "home loan in Udupi" — because Google's AI now mines review text for keywords.
3. **LLP registration number, GST number, RERA agent number** in the footer of every page. Verifiable identity beats adjectives.
4. **Author byline on legal pages.** "Reviewed by Deepa R Kotian, Advocate, Udupi — 17 years, empanelled with [banks]." Add `author` and `reviewedBy` to the schema. Property is a YMYL topic (Your Money or Your Life), the category Google judges most strictly.
5. **`dateModified` on every page**, updated honestly when you edit.
6. **Real client photos, or no photos.** Unsplash stock beside a testimonial destroys trust with Google and with a careful buyer.
7. **A "How we get paid" page.** State plainly: the buyer pays nothing, income comes from the seller or builder side. Blunt honesty ranks and converts in a market full of file-charge complaints.
8. **Fix NAP consistency.** Your phone appears in three formats in the code. Pick `+91 93809 39961` and use it everywhere, including schema. Then list the identical name, address, and phone on Justdial, Sulekha, IndiaMART, Google, Bing Places, and Apple Maps.

---

## PART 5 — MORE DATA FOR CRAWLERS (structured data)

Present now: RealEstateAgent, FinancialService, FAQPage, BreadcrumbList, Person, CollectionPage, Place, City, OpeningHours, Geo. That is a solid base. Add:

| Schema | Where | Why |
|---|---|---|
| `LocalBusiness` + `hasMap` + `areaServed` | all pages | pins you to Udupi, kills the Bangalore mix-up |
| `Service` (one per service line) | each service page | lets Google list services separately |
| `Product` + `Offer` + `priceSpecification` | flats / sites pages | price rich results; mark clearly as *starting* price |
| `RealEstateListing` | any live listing | the correct type for property — currently unused |
| `HowTo` | legal guides | step-by-step rich result for DC conversion, khata |
| `Article` + `author` + `reviewedBy` + `datePublished` / `dateModified` | legal hub | E-E-A-T signal on YMYL topics |
| `VideoObject` | Sidhvin's videos | video is under-used in this market |
| `Review` (real ones only) | after collection | only then re-add `aggregateRating` |
| `SearchAction` | index | sitelinks search box |
| `speakable` | FAQ blocks | voice assistants |

Also for crawlers:

- Sitemap: add `<image:image>` entries; split into `sitemap-pages.xml` and `sitemap-legal.xml`
- robots.txt already allows GPTBot, ClaudeBot, PerplexityBot — **good, keep it.** AI search sends real buyers now.
- Add `llms.txt` at root — a plain-text summary of who you are and what you do, for AI crawlers.
- Add hreflang `en-IN`. Add a Kannada version later (`kn-IN`) — local-language pages face very little competition.

---

## PART 6 — HUMAN BEHAVIOUR (what buyers here actually do)

1. **They search a place, not a company.** "flats in ambalpady", never "vittu bharat". → ward pages.
2. **They fear fraud more than price.** The documented complaints are about file charges and fake papers. → lead with ₹0 fee and the in-house advocate, not with "premium properties".
3. **They read law before they read listings.** DC conversion, khata, and EC searches are heavy. Someone reading your CRZ guide at 11pm is three weeks from buying. → the legal hub is a lead funnel, not a blog.
4. **They call, they do not fill forms.** Semi-urban India converts on phone and WhatsApp. → click-to-call and WhatsApp above the fold on every page. You have this; keep it prominent.
5. **Gulf NRIs buy here heavily.** They cannot visit. They need video, remote paperwork, POA, and NRE/NRO guidance. → NRI page plus video walkthroughs. Very low competition.
6. **They ask a friend, then check Google reviews.** Reviews are the closing argument. Review collection is not optional.
7. **They speak Tulu and Kannada.** An English-only site limits reach inside the district.
8. **Mobile, mid-range phone, patchy data.** The 12 MB page problem is a revenue problem, not a technical one.

---

## PART 7 — ORDER OF WORK

**Week 1 — stop the bleeding**

1. Delete `aggregateRating` from index.html
2. Remove Unsplash stock testimonial photos (real or none)
3. Compress all images to WebP under 150 KB; create `team/sm/sidhvin.png`; delete the 3.5 MB mp3
4. Fix homepage H1 to `Real Estate in Udupi & Mangalore`
5. One phone format everywhere: `+91 93809 39961`
6. Remove 2027 dates; date-stamp every factual claim

**Week 2–3 — foundation**

7. Google Business Profile: 100% complete, primary category *Real Estate Agency*, all services listed, weekly photo posts
8. Start review collection — every past client, target 25
9. LLP / GST / RERA numbers into the footer
10. Add `Service`, `LocalBusiness`, and `areaServed` schema sitewide
11. Internal links: every page links to 8–10 others using plain keyword text

**Month 2 — pages that earn**

12. `sell-property-udupi.html` — highest priority missing page
13. `buy-property-udupi.html`
14. `property-in-mangalore.html` and `flats-for-sale-mangalore.html`
15. `nri-property-udupi.html`
16. First five ward pages: Bannanje, Ambalpady, Santhekatte, Kunjibettu, Brahmavar

**Month 3 — authority**

17. Legal hub: DC conversion, khata, EC, **CRZ Udupi**, stamp duty, guidance value
18. `cent-to-square-feet` calculator page
19. Every legal page bylined and reviewed by the advocate, with `Article` and `reviewedBy` schema
20. Local links: Udupi builders, Manipal student-housing pages, local news, chamber of commerce
21. Video for the NRI audience, with `VideoObject` schema

---

## PART 8 — HOW TO KNOW IT IS WORKING

Set up Google Search Console and Bing Webmaster Tools (both free) before anything else. Right now you are flying blind.

Watch monthly:

- Local pack position for `real estate agent udupi` and `property udupi`
- Google review count and rating (target 25+ at 4.5+ within 90 days)
- Core Web Vitals — all green on mobile
- Search Console clicks on `[service] + [place]` queries
- Calls and WhatsApp messages, tagged by the page they came from

Honest timeline: local pack and long-tail movement in **6–10 weeks**; competitive keywords in **4–6 months**. Anyone promising faster is selling something.

---

## THE ONE-LINE STRATEGY

You will never out-list 99acres. You can out-trust them.
They have inventory. You have an advocate, a banker, an address, and named faces.
Win on **service + place + proof**, in the **Udupi wards** the portals cannot describe.
