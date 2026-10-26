// Records how a visitor reached the contact form, so the leads dashboard can show which
// channels and buttons bring in enquiries. Stored per browser tab in sessionStorage.

const FIRST_TOUCH_KEY = 'jamii.attribution';
const CTA_KEY = 'jamii.cta';

export interface Attribution {
  cta: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
  landingPage: string;
}

const read = (key: string) => {
  try { return sessionStorage.getItem(key); } catch { return null; }
};
const write = (key: string, value: string) => {
  try { sessionStorage.setItem(key, value); } catch { /* storage blocked: attribution is best-effort */ }
};

// Call once on page load. Keeps the first landing of the session, so moving around the site
// doesn't overwrite where the visitor originally came from.
export function captureFirstTouch() {
  if (read(FIRST_TOUCH_KEY)) return;
  const params = new URLSearchParams(window.location.search);
  let referrer = '';
  try {
    if (document.referrer && new URL(document.referrer).host !== window.location.host) referrer = document.referrer;
  } catch { /* malformed referrer */ }

  write(FIRST_TOUCH_KEY, JSON.stringify({
    utmSource: params.get('utm_source') ?? '',
    utmMedium: params.get('utm_medium') ?? '',
    utmCampaign: params.get('utm_campaign') ?? '',
    referrer,
    landingPage: window.location.pathname + window.location.search,
  }));
}

// Remembers the last call-to-action clicked (elements marked with data-cta).
export function trackCtaClicks() {
  const onClick = (e: MouseEvent) => {
    const el = (e.target as Element | null)?.closest?.('[data-cta]');
    if (el) write(CTA_KEY, el.getAttribute('data-cta') ?? 'direct');
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}

export function getAttribution(): Attribution {
  let firstTouch: Partial<Attribution> = {};
  try { firstTouch = JSON.parse(read(FIRST_TOUCH_KEY) ?? '{}'); } catch { /* ignore */ }
  return {
    utmSource: '', utmMedium: '', utmCampaign: '', referrer: '', landingPage: '',
    ...firstTouch,
    cta: read(CTA_KEY) ?? 'direct',
  };
}
