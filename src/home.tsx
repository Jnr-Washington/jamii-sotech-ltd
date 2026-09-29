import React, { useState, type ChangeEvent, type FormEvent } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────

export interface Service { icon: string; title: string; text: string; tags: string[]; featured?: boolean }
export interface Result {
  stat: string; client: string; meta: string; summary: string;
  quote: string; name: string; initials: string; role: string;
}
export interface Value { title: string; text: string }

export const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Our work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
] as const;

export const wrongs: string[] = [
  "Tech vendors who don't understand local context",
  "Generic software that doesn't fit your workflow",
  'Solutions that ship late and over budget',
  'No support after launch',
];
export const rights: string[] = [
  "Built in Africa, for Africa. We get the constraints, the infrastructure and the culture.",
  'Every system is designed around your team, your users and your business logic.',
  'Fixed milestones, transparent pricing and weekly progress updates.',
  "Ongoing maintenance and monitoring. We're partners, not just vendors.",
];

export const services: Service[] = [
  {
    icon: '</>', title: 'Software development', featured: true, tags: ['React', 'Node.js', 'Flutter', 'APIs'],
    text: 'Custom web and mobile apps built with modern stacks, from first MVPs to enterprise-grade platforms.'
  },
  {
    icon: '✦', title: 'AI & automation', tags: ['LLM integration', 'RPA', 'ML Ops'],
    text: 'Workflows, chatbots and data pipelines that remove manual work.'
  },
  {
    icon: '☁', title: 'Cloud & DevOps', tags: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    text: 'Scalable infrastructure and CI/CD pipelines with 99.9% uptime on AWS, GCP or Azure.'
  },
  {
    icon: '◎', title: 'Digital strategy', tags: ['Roadmapping', 'Tech audits', 'Consulting'],
    text: 'Roadmaps, audits and fractional CTO services that line tech up with your goals.'
  },
  {
    icon: '◐', title: 'UI/UX design', tags: ['Figma', 'Design systems', 'Prototyping'],
    text: 'Research-backed interfaces that convert, from wireframes to polished design systems.'
  },
  {
    icon: '▦', title: 'Data & analytics', tags: ['Power BI', 'Tableau', 'Python', 'SQL'],
    text: 'Dashboards, ETL pipelines and predictive models that turn raw data into decisions.'
  },
];

export const results: Result[] = [
  {
    stat: '34%', client: 'Pops and Petals', meta: 'Event organizers · value addition',
    summary: 'Robust bookings and reservations boosted service delivery by 34%.',
    quote: "Jamii SoTech didn't just build software. They understood our operations and built something that changed how we work.",
    name: 'Margaret Kado', initials: 'MK', role: 'CEO, Pops and Petals'
  },
  {
    stat: '15%', client: 'Aetech Labs', meta: 'Software · higher productivity',
    summary: 'Our partnership lifted company productivity by a 15% margin.',
    quote: "The team delivered on time, on budget, and the code quality is exceptional. We've since started two more projects with them.",
    name: 'George K. Chesire', initials: 'GC', role: 'CEO, Aetech Labs'
  },
  {
    stat: '500+', client: 'LIGI', meta: 'Sports · more users',
    summary: '500+ daily active users, with new ones joining at about 8% weekly.',
    quote: "Ever since we partnered with Jamii SoTech, we've seen growth in users on our turf booking platform. Kudos to the team!",
    name: 'Ithiel Nyaga', initials: 'IN', role: 'CTO, LIGI Kenya'
  },
];

export const clients: string[] = ['Pops and Petals', 'Aetech Labs', 'LIGI Kenya', 'Kazi Log', 'Eden Care', 'Kijani AI'];

export const values: Value[] = [
  { title: 'Context first', text: 'We learn your market, connectivity limits and user behavior before writing a single line.' },
  { title: 'Radical transparency', text: 'Weekly updates, honest timelines and no surprises. You always know where your project stands.' },
  { title: 'Ownership mindset', text: "We treat your product like it's ours, caring about outcomes and not just deliverables." },
  { title: 'Long-term partnership', text: 'Our best clients stay for years. We grow with you as your needs evolve.' },
];

export const facts: { label: string; value: string }[] = [
  { label: 'Founded', value: '2026' },
  { label: 'Headquarters', value: 'Kajiado, KE' },
  { label: 'Team size', value: '5+ engineers' },
  { label: 'Projects shipped', value: '10+' },
];


// ─── Components ───────────────────────────────────────────────────────────────

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header>
      <div className="wrap nav">
        <a className="logo" href="#top">
          <img src="https://res.cloudinary.com/dr5v1kpqo/image/upload/v1790683668/jamii_logo_final-digital_po2wdl.jpg" alt="logo" style={{ borderRadius: '12px 12px 12px 4px' }} width={36} height={36} />
          Jamii SoTech
        </a>
        <ul className={menuOpen ? 'mobile-menu-open' : ''}>
          {navLinks.map((l) => (
            <li key={l.href}><a href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a></li>
          ))}
        </ul>
        <a className="btn" href="#contact">Get started</a>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`bar ${menuOpen ? "open" : ""}`} />
          <span className={`bar ${menuOpen ? "open" : ""}`} />
          <span className={`bar ${menuOpen ? "open" : ""}`} />
        </button>
      </div>
    </header>
  );
}

const stats = [
  { n: '10+', label: 'Projects delivered' },
  { n: '98%', label: 'Clients who stay' },
  { n: '5+', label: 'Team members' },
];

function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div>
          <h1>Software that solves real <span>African problems.</span></h1>
          <p className="lead">
            Jamii SoTech builds practical, scalable software with African businesses and communities.
            Because we work here too, we understand the constraints you build around.
          </p>
          <div className="cta">
            <a className="btn" href="#contact">Start a project</a>
            <a className="btn ghost" href="#work">See our work</a>
          </div>
          <div className="stats">
            {stats.map((s) => (
              <div key={s.label}><b>{s.n}</b><span>{s.label}</span></div>
            ))}
          </div>
        </div>
        <div className="art" aria-hidden="true">
          <div className="blob" />
          <div className="dot" />
          <div className="card c1">
            <b>Your project</b>
            <div className="bar"><i style={{ width: '72%' }} /></div>
            <small>Milestone 3 of 4 · on schedule</small>
          </div>
          <div className="card c2"><em>✓</em>Weekly update sent</div>
          <div className="card c3">Karibu, let's talk 💬</div>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="band-alt">
      <div className="wrap">
        <div className="head wide">
          <h2>African businesses deserve better tech partners.</h2>
          <p className="lead">
            Too many companies lose time and money on software that doesn't fit.
            We started Jamii SoTech to be the team we wished we'd had.
          </p>
        </div>
        <div className="split">
          <div className="col">
            <h3>What we kept running into</h3>
            <ul>{wrongs.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div className="col good">
            <h3>How we do it differently</h3>
            <ul>{rights.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <div className="head">
          <h2>Everything from idea to launch, under one roof</h2>
          <p className="lead">End-to-end technology help, from strategy through deployment.</p>
        </div>
        <div className="grid">
          {services.map((s) => (
            <div key={s.title} className={s.featured ? 'svc big' : 'svc'}>
              <div className="ic">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <div className="tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          ))}
        </div>
        <div className="more"><a className="btn ghost" href="#contact">Discuss your project</a></div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="work">
      <div className="wrap">
        <div className="head">
          <h2>Proof in the work</h2>
          <p className="lead">A few of the teams we've built with, in their own words.</p>
        </div>
        <div className="results">
          {results.map((r) => (
            <article key={r.client} className="res">
              <div className="n">{r.stat}</div>
              <div>
                <div className="k">{r.client}</div>
                <small className="muted">{r.meta}</small>
              </div>
              <p>{r.summary}</p>
              <blockquote>{r.quote}</blockquote>
              <div className="who">
                <i>{r.initials}</i>
                <div>{r.name}<small>{r.role}</small></div>
              </div>
            </article>
          ))}
        </div>
        <div className="logos">
          <p>Trusted by innovative companies across East Africa</p>
          {clients.map((c) => <span key={c}>{c}</span>)}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="about">
      <div className="wrap">
        <div>
          <h2>A technology company with <span>African roots.</span></h2>
          <p className="lead">
            Jamii SoTech was founded in Nairobi with one mission: to give African businesses access to
            world-class software engineering that truly understands their reality.
          </p>
          <p className="lead">
            "Jamii" means community in Swahili. We believe technology should serve communities, and every
            line of code we write is in service of that belief.
          </p>
          <div className="facts">
            {facts.map((f) => (
              <div key={f.label}><small>{f.label}</small><b>{f.value}</b></div>
            ))}
          </div>
        </div>
        <div className="vals">
          {values.map((v, i) => (
            <div key={v.title} className="val">
              <div className="ic">{i + 1}</div>
              <div><h3>{v.title}</h3><p>{v.text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <div className="band">
      <h2>Let's ship something remarkable.</h2>
      <p>
        Whether you have a fully scoped brief or just an idea on a napkin, we're ready to listen.
        Free discovery call, no commitment.
      </p>
      <div className="cta">
        <a className="btn" href="#contact">Book a free discovery call</a>
        <a className="btn ghost" href="mailto:hello@jamiisotech.org">hello@jamiisotech.org</a>
      </div>
    </div>
  );
}

interface FormState { name: string; email: string; company: string; service: string; message: string }
const empty: FormState = { name: '', email: '', company: '', service: '', message: '' };
const serviceOptions = ['Software development', 'AI & automation', 'Cloud & DevOps', 'Digital strategy', 'UI/UX design', 'Data & analytics'];
const info: [string, string][] = [
  ['Email', 'hello@jamiisotech.org'],
  ['Phone', '+254 140 69 55 22'],
  ['Location', 'Ongata Rongai, Kajiado, Kenya'],
  ['Hours', 'Mon–Fri, 8am–6pm EAT'],
];

function Contact() {
  const [form, setForm] = useState<FormState>(empty);
  const [sent, setSent] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSent(false);
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);
    setSent(true);
    setForm(empty);
  };

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <div>
          <h2>Let's start a conversation</h2>
          <p className="lead mt-14">
            Drop us a line and our team will get back to you within 24 hours. We're based in Kajiado
            but work with clients across the continent and beyond.
          </p>
          <div className="info">
            {info.map(([k, v]) => (
              <div key={k}><small>{k}</small><span>{v}</span></div>
            ))}
          </div>
        </div>
        <form onSubmit={onSubmit}>
          <label>Full name
            <input name="name" value={form.name} onChange={onChange} placeholder="Wanjiru Mwangi" required />
          </label>
          <label>Email address
            <input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@company.com" required />
          </label>
          <label>Company or organisation
            <input name="company" value={form.company} onChange={onChange} />
          </label>
          <label>Service you're interested in
            <select name="service" value={form.service} onChange={onChange}>
              <option value="">Select a service</option>
              {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label>Tell us about your project
            <textarea name="message" value={form.message} onChange={onChange} placeholder="What are you hoping to build?" required />
          </label>
          <button type="submit" className="btn">Send message</button>
          {sent && <p className="ok" role="status">Thanks! We'll reply within 24 hours.</p>}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <b>Jamii SoTech Ltd</b>
        <span>© {new Date().getFullYear()} Jamii SoTech Ltd. All rights reserved. Kajiado, Kenya</span>
        <nav>
          <a href="#">LinkedIn</a>
          <a href="#">Twitter</a>
          <a href="#">GitHub</a>
        </nav>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function JamiiSoTechHomepage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600;700&display=swap');
        
        .jamii-app {
          --bg:#FFF8F6;--surface:#fff;--ink:#2A1416;--muted:#6B5254;--red:#D7263D;--red-deep:#A61B2E;--on-red:#fff;--tint:#FFE6E3;--line:#F0D9D5;--gold:#F4B740;
          box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);
          background:var(--bg);color:var(--ink);font:400 1.0625rem/1.6 Figtree,system-ui,sans-serif;
          min-height: 100vh;
        }
        
        @media (prefers-color-scheme:dark){
          .jamii-app {--bg:#1D1112;--surface:#2A1A1C;--ink:#FFF1EE;--muted:#C9A9A5;--red:#FF5A6B;--red-deep:#8E1626;--on-red:#2A0D10;--tint:#3A2023;--line:#45292C}
        }
        .jamii-app[data-theme="dark"]{--bg:#1D1112;--surface:#2A1A1C;--ink:#FFF1EE;--muted:#C9A9A5;--red:#FF5A6B;--red-deep:#8E1626;--on-red:#2A0D10;--tint:#3A2023;--line:#45292C}
        
        .jamii-app *, .jamii-app *::before, .jamii-app *::after{box-sizing:border-box}
        .jamii-app h1,.jamii-app h2,.jamii-app h3{font-family:"Bricolage Grotesque",Figtree,system-ui,sans-serif;line-height:1.08;margin:0;letter-spacing:-.02em}
        .jamii-app h1{font-size:clamp(2.4rem,5.6vw,4.2rem);font-weight:800}
        .jamii-app h2{font-size:clamp(1.9rem,3.6vw,2.7rem);font-weight:800}
        .jamii-app h3{font-size:1.25rem;font-weight:600}
        .jamii-app p{margin:0}
        .jamii-app a{color:inherit}
        .jamii-app :focus-visible{outline:3px solid var(--gold);outline-offset:3px}
        
        .jamii-app .wrap{max-width:1120px;margin:0 auto;padding:0 24px}
        .jamii-app section{padding:88px 0}
        .jamii-app .lead{color:var(--muted);max-width:56ch}
        
        .jamii-app .btn{display:inline-block;padding:14px 26px;border-radius:999px;font-weight:600;text-decoration:none;border:2px solid var(--red);background:var(--red);color:var(--on-red);cursor:pointer;font-family:inherit;font-size:1rem;transition:transform .15s}
        .jamii-app .btn:hover{transform:translateY(-2px)}
        .jamii-app .btn.ghost{background:transparent;color:var(--ink);border-color:var(--line)}
        .jamii-app .btn.ghost:hover{border-color:var(--red)}
        
        /* nav */
        .jamii-app header{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
        .jamii-app .nav{display:flex;align-items:center;gap:28px;height:72px}
        .jamii-app .logo{display:flex;align-items:center;gap:10px;font:800 1.2rem "Bricolage Grotesque",sans-serif;text-decoration:none}
        .jamii-app .nav ul{display:flex;gap:26px;list-style:none;margin:0 0 0 auto;padding:0}
        .jamii-app .nav ul a{text-decoration:none;font-weight:500;color:var(--muted)}
        .jamii-app .nav ul a:hover{color:var(--red)}
        .jamii-app .nav .btn{padding:10px 20px}
        
        .jamii-app .mobile-menu-btn {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          margin-left: 12px;
        }
        .jamii-app .mobile-menu-btn .bar {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--ink);
          transition: all 0.3s ease;
        }
        .jamii-app .mobile-menu-btn .bar.open:nth-child(1) {
          transform: rotate(45deg) translate(4px, 4px);
        }
        .jamii-app .mobile-menu-btn .bar.open:nth-child(2) {
          opacity: 0;
        }
        .jamii-app .mobile-menu-btn .bar.open:nth-child(3) {
          transform: rotate(-45deg) translate(4px, -4px);
        }

        /* hero */
        .jamii-app .hero{padding:64px 0 88px;overflow:hidden}
        .jamii-app .hero .wrap{display:grid;grid-template-columns:1.15fr .85fr;gap:48px;align-items:center}
        .jamii-app .hi{display:inline-flex;align-items:center;gap:8px;background:var(--tint);color:var(--red-deep);padding:6px 14px;border-radius:999px;font-weight:600;font-size:.95rem;margin-bottom:22px}
        .jamii-app[data-theme="dark"] .hi, @media (prefers-color-scheme:dark){ .jamii-app:not([data-theme="light"]) .hi {color:var(--red)} }
        .jamii-app .hero h1 span{color:var(--red)}
        .jamii-app .hero .lead{margin:22px 0 30px;font-size:1.15rem}
        .jamii-app .cta{display:flex;flex-wrap:wrap;gap:12px}
        .jamii-app .stats{display:flex;flex-wrap:wrap;gap:12px 36px;margin-top:40px;padding-top:24px;border-top:1px dashed var(--line)}
        .jamii-app .stats b{display:block;font:800 1.9rem "Bricolage Grotesque",sans-serif;color:var(--red)}
        .jamii-app .stats span{color:var(--muted);font-size:.95rem}
        .jamii-app .art{position:relative;min-height:400px}
        .jamii-app .blob{position:absolute;inset:6% 0 0 8%;background:var(--red);border-radius:62% 38% 55% 45%/48% 55% 45% 52%}
        .jamii-app .dot{position:absolute;width:74px;height:74px;border-radius:50%;background:var(--gold);top:0;left:2%}
        .jamii-app .card{position:absolute;background:var(--surface);border-radius:22px;box-shadow:0 18px 40px rgba(120,20,30,.18);padding:18px}
        .jamii-app .c1{width:78%;left:12%;top:20%}
        .jamii-app .c1 .bar{height:10px;border-radius:6px;background:var(--tint);margin:10px 0}
        .jamii-app .c1 .bar i{display:block;height:100%;border-radius:6px;background:var(--red)}
        .jamii-app .c1 small{color:var(--muted)}
        .jamii-app .c2{right:-2%;bottom:14%;display:flex;gap:10px;align-items:center;font-weight:600;font-size:.95rem}
        .jamii-app .c2 em{font-style:normal;background:#2FB67C;color:#fff;border-radius:50%;width:26px;height:26px;display:grid;place-items:center}
        .jamii-app .c3{left:0;bottom:6%;font-weight:600;font-size:.95rem;border-radius:22px 22px 22px 4px}
        
        /* problem */
        .jamii-app .split{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:44px}
        .jamii-app .col{border-radius:24px;padding:30px;background:var(--surface);border:1px solid var(--line)}
        .jamii-app .col.good{background:var(--tint);border-color:transparent}
        .jamii-app .col h3{margin-bottom:16px}
        .jamii-app .col ul{list-style:none;margin:0;padding:0;display:grid;gap:14px}
        .jamii-app .col li{padding-left:34px;position:relative}
        .jamii-app .col li::before{content:"×";position:absolute;left:0;top:0;width:24px;height:24px;border-radius:50%;background:var(--line);color:var(--muted);display:grid;place-items:center;font-weight:700}
        .jamii-app .col.good li::before{content:"✓";background:var(--red);color:var(--on-red)}
        .jamii-app .col:not(.good) li{color:var(--muted)}
        
        /* services */
        .jamii-app .head{max-width:640px;margin-bottom:40px}
        .jamii-app .head .lead{margin-top:12px}
        .jamii-app .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .jamii-app .svc{background:var(--surface);border:1px solid var(--line);border-radius:24px;padding:26px;display:flex;flex-direction:column;gap:10px}
        .jamii-app .svc .ic{width:48px;height:48px;border-radius:16px;background:var(--tint);color:var(--red);display:grid;place-items:center;font-size:1.3rem;font-weight:800}
        .jamii-app .svc p{color:var(--muted);font-size:1rem}
        .jamii-app .tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto;padding-top:6px}
        .jamii-app .tags span{font-size:.85rem;background:var(--bg);border:1px solid var(--line);border-radius:999px;padding:2px 10px;color:var(--muted)}
        .jamii-app .svc.big{grid-column:span 2;background:var(--red);border-color:var(--red);color:var(--on-red)}
        .jamii-app .svc.big .ic{background:rgba(255,255,255,.22);color:inherit}
        .jamii-app .svc.big p{color:inherit;opacity:.92;max-width:48ch}
        .jamii-app .svc.big .tags span{background:rgba(255,255,255,.18);border-color:transparent;color:inherit}
        .jamii-app .more{margin-top:32px;text-align:center}
        
        /* work */
        .jamii-app .work{background:var(--tint)}
        .jamii-app[data-theme="dark"] .work, @media (prefers-color-scheme:dark){ .jamii-app:not([data-theme="light"]) .work {background:#251517} }
        .jamii-app .results{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .jamii-app .res{background:var(--surface);border-radius:24px;padding:28px;display:flex;flex-direction:column;gap:14px}
        .jamii-app .res .n{font:800 3rem/1 "Bricolage Grotesque",sans-serif;color:var(--red)}
        .jamii-app .res .k{font-weight:600}
        .jamii-app .res blockquote{margin:0;color:var(--muted);font-size:1rem;border-left:3px solid var(--red);padding-left:14px}
        .jamii-app .who{display:flex;align-items:center;gap:12px;margin-top:auto;font-size:.95rem}
        .jamii-app .who i{width:42px;height:42px;border-radius:50%;background:var(--red);color:var(--on-red);display:grid;place-items:center;font:700 .9rem Figtree,sans-serif;font-style:normal}
        .jamii-app .who small{display:block;color:var(--muted)}
        .jamii-app .logos{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 34px;margin-top:40px;color:var(--muted);font:600 1.05rem "Bricolage Grotesque",sans-serif}
        .jamii-app .logos p{width:100%;text-align:center;font:500 .95rem Figtree,sans-serif}
        
        /* about */
        .jamii-app .about .wrap{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}
        .jamii-app .about h2 span{color:var(--red)}
        .jamii-app .about .lead{margin-top:20px}
        .jamii-app .facts{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:28px}
        .jamii-app .facts div{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:14px 18px}
        .jamii-app .facts small{color:var(--muted);display:block}
        .jamii-app .facts b{font-weight:600}
        .jamii-app .vals{display:grid;gap:14px}
        .jamii-app .val{display:flex;gap:16px;background:var(--surface);border:1px solid var(--line);border-radius:22px;padding:20px 22px}
        .jamii-app .val .ic{flex:none;width:42px;height:42px;border-radius:50%;background:var(--tint);color:var(--red);display:grid;place-items:center;font-weight:800}
        .jamii-app .val p{color:var(--muted);font-size:1rem}
        
        /* cta band */
        .jamii-app .band{background:var(--red-deep);color:#fff;text-align:center;border-radius:36px;padding:64px 24px;margin:0 24px;position:relative;overflow:hidden}
        .jamii-app .band::before,.jamii-app .band::after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.08)}
        .jamii-app .band::before{width:260px;height:260px;left:-70px;top:-90px}
        .jamii-app .band::after{width:200px;height:200px;right:-50px;bottom:-80px}
        .jamii-app .band>*{position:relative}
        .jamii-app .band p{max-width:52ch;margin:16px auto 28px;opacity:.92}
        .jamii-app .band .btn{background:#fff;color:var(--red-deep);border-color:#fff}
        .jamii-app .band .btn.ghost{background:transparent;color:#fff;border-color:rgba(255,255,255,.6)}
        .jamii-app .band .cta{justify-content:center}
        
        /* contact */
        .jamii-app .contact .wrap{display:grid;grid-template-columns:1fr 1.1fr;gap:56px}
        .jamii-app .info{display:grid;gap:14px;margin-top:28px}
        .jamii-app .info div{display:flex;gap:14px}
        .jamii-app .info small{color:var(--muted);width:72px;flex:none;padding-top:2px}
        .jamii-app form{background:var(--surface);border:1px solid var(--line);border-radius:28px;padding:30px;display:grid;gap:16px}
        .jamii-app label{display:grid;gap:6px;font-weight:600;font-size:.95rem}
        .jamii-app input,.jamii-app select,.jamii-app textarea{font:inherit;padding:12px 14px;border-radius:14px;border:1.5px solid var(--line);background:var(--bg);color:var(--ink)}
        .jamii-app input:focus,.jamii-app select:focus,.jamii-app textarea:focus{outline:none;border-color:var(--red);box-shadow:0 0 0 3px var(--tint)}
        .jamii-app textarea{min-height:110px;resize:vertical}
        
        .jamii-app footer{border-top:1px solid var(--line);padding:28px 0;color:var(--muted);font-size:.95rem}
        .jamii-app footer .wrap{display:flex;flex-wrap:wrap;gap:12px 28px;justify-content:space-between}
        .jamii-app footer nav{display:flex;gap:20px}
        .jamii-app footer a{text-decoration:none}
        .jamii-app footer a:hover{color:var(--red)}
        
        .jamii-app .band-alt{background:var(--surface);border-block:1px solid var(--line)}
        .jamii-app .head.wide{max-width:720px}
        .jamii-app .muted{color:var(--muted)}
        .jamii-app .mt-14{margin-top:14px}
        .jamii-app .ok{color:var(--red);font-weight:600}
        
        @media (max-width:860px){
          .jamii-app .hero .wrap,.jamii-app .about .wrap,.jamii-app .contact .wrap,.jamii-app .split{grid-template-columns:1fr}
          .jamii-app .grid,.jamii-app .results{grid-template-columns:1fr}
          .jamii-app .svc.big{grid-column:auto}
          .jamii-app .nav ul {
            display: none;
            position: absolute;
            top: 72px;
            left: 0;
            right: 0;
            background: var(--surface);
            flex-direction: column;
            padding: 20px;
            border-bottom: 1px solid var(--line);
          }
          .jamii-app .nav ul.mobile-menu-open {
            display: flex;
          }
          .jamii-app .mobile-menu-btn {
            display: flex;
          }
          .jamii-app .nav .btn{margin-left:auto}
          .jamii-app .art{min-height:340px}
          .jamii-app section{padding:64px 0}
        }
        
        @media (prefers-reduced-motion:reduce){
          .jamii-app *{transition:none!important;scroll-behavior:auto!important}
        }
      `}</style>

      <div className="jamii-app">
        <Header />
        <main id="top">
          <Hero />
          <Problem />
          <Services />
          <Work />
          <About />
          <CtaBand />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
