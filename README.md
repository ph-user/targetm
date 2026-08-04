# Focus Media Australia — website (v2)

Clean, professional 3-page build aligned to the **Brand & UI Style Guide V1.4** and the
**Website Structure Plan**. Static frontend — open `index.html` in any browser, keep the
`assets/` folder alongside it.

## Files
- `index.html` — Landing (10 sections)
- `about.html` — About Us (5 sections)
- `contact.html` — Contact Us (hero, details, assessment form, what-happens-next)
- `styles.css` — shared design system (all style-guide tokens live here)
- `main.js` — mobile menu, scroll reveal, form confirmation
- `assets/` — your supplied photography, films and logos

## Design decisions
- **Direction:** warm-white / white surfaces with Ink (`#161616`) dark contrast bands;
  brand gold `#CF9300` used only as an accent (eyebrows, highlights, ticks, buttons, borders).
- **Accessible gold:** links and gold text use Dark Gold `#8A5F00` on light (brand gold on
  white fails WCAG per the guide); on dark surfaces the highlight `#FDC87C` is used instead.
- **Type:** Inter throughout, on the guide's web/UI scale. **Spacing:** 4px base / 8px rhythm.
  **Radius:** 8px (14px large cards). **Borders:** 1px `#E4E0D8`. **Elevation:** borders first,
  shadow only where an element floats.

## CTA routing (as per the plan)
| CTA | Destination |
|-----|-------------|
| 01 · Book a Free Assessment | `contact.html#assessment-form` |
| 02 · See How It Works | `index.html#how-it-works` |
| 03 · Explore Screen Solutions | `index.html#screens` |
| 04 · Contact Our Team | `contact.html#contact-details` |

## Before publishing — placeholders to fill
- **Contact details** (`contact.html`): email, phone, hours, office location (all marked "to confirm").
- **Global scale stats** (`about.html`): six figures are placeholders (`—`) — confirm against
  approved Focus Media corporate materials, per the plan's publication note.
- **Assessment form**: currently shows a front-end confirmation only. Wire the `<form>` to
  Focus Media's mailbox or a form service (e.g. Formspree, or a `mailto`/backend endpoint) to
  deliver submissions.
- **Branch map** (`about.html`): a real interactive map can replace the markets grid.
- Verify partner/building logos and any historical claims before go-live.

## Logo note
The header uses a simple "F" gold tile as a text stand-in. Drop the master logo artwork
(SVG preferred, per the guide's handoff notes) into `assets/` and swap the `.brand` markup.

## Collapse hero (the Revolut-style intro)
The landing page opens with a full-bleed image that collapses into the wall-mounted
screen in the lift-lobby photo (`assets/lobby-lift.jpg`) as you scroll, then hands off
to the normal hero. It uses native scroll (no scroll-jacking, no scroll-snap): a 220vh
track with a sticky 100vh stage and a single binary `.stage-2` class toggled past ~35%.
- **Swap the on-screen content:** replace the image in `#cContent` (currently
  `assets/skyline.webp`) with any image/video — it collapses into the screen automatically.
- **Re-align the collapse:** the screen position is measured as fractions of the lobby
  photo in the inline script (`var G={x,y,w,h}`). If you change the lobby image, update
  those four numbers; the JS maps them onto the viewport via object-fit:cover math, so it
  stays aligned at any width.
- **Mobile & accessibility:** the effect is disabled under 768px and for
  `prefers-reduced-motion` (the page falls straight to the standard hero).
