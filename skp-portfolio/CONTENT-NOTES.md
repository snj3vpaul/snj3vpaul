# Content notes (not published)

This file is outside `public/`, so it never ships. It holds the owner-facing notes and snippets that used to live as HTML comments in the page. In v2, edit content in `lib/content.ts`.

## Copy waiting on the owner's confirmation

These descriptions were expanded from one-line summaries and have not yet been confirmed. They are live on the page today; correct anything that is off.

- **What-The-Fabric**: the three tool lines (Fabric names, Compositions, Care labels). The stack is also still missing.
- **Crypto Lab Chip**: the three tool lines (Excel → PDF links intact, Firmware teardown, TLS & SSH scan).

## Where the new professional-work cards come from

Cards 04–06 in the Selected Work rail use only lines from `cv.pdf`:

| Card | CV source |
| --- | --- |
| 04 NDcPP v4 transition | 2025–present role: "Drive NDcPP v4 transition initiatives… SSH, TLS, and X.509 Functional Packages". 2022–2023 role: "test case scenarios for EAL4 and Common Criteria evaluations". |
| 05 Algorithm testing (ACVP) | 2022–2025 roles: ACVP testing (AES, RSA, SHA, HMAC, ECDSA); modules validated in FIPS mode across virtualised and hardware platforms; Nmap, Wireshark, SSHScan. |
| 06 Evidence & lab liaison | 2023–2025: Security Policies and certification evidence; primary liaison with accredited labs. 2025–present: KVM-based test environments. |

The journey lines and the pipeline's "Where I come in" lines come from the same CV entries.

## Still to add (needs data)

- Credentials: link CySA+, Security+ and eJPT to their verification pages (Credly / CompTIA / INE) once the URLs are available.
- On the record: a before → after figure (for example evidence turnaround or lab finding cycles), if there is a number that can be shared.

## Snippets

Writing: one line per article, newest first, inside `<ul class="entries">`:

```html
<li><a href="https://medium.com/@sanjeevkumarpaul25/ARTICLE-LINK" target="_blank" rel="noopener noreferrer"><small>Nov 2026 · Medium</small><strong>Article title ↗</strong></a></li>
```

Camera roll for the Life section (photos in `img/roll/`, about 1200px wide):

```html
<div class="roll" data-roll>
  <p class="sub-label">Camera roll</p>
  <ul class="roll-track" tabindex="0" aria-label="Photos">
    <li><figure><img src="img/roll/01.webp" alt="Describe photo 1" loading="lazy" width="1200" height="800"><figcaption>01 · Caption one</figcaption></figure></li>
  </ul>
</div>
```

The roll needs styles before it is switched on; it was never styled in the dark palette.

## Moved out of the project pages

- FortiClient 7.0.2: if NIST CMVP #4931 (FortiClient Crypto Library 7.0.2) is this module, add it as a button link. Unconfirmed, so it isn't on the page.
- What-The-Fabric: add stack, features and users (if any) as more facts rows.
