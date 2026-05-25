import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Service {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

interface CaseStudy {
  client: string;
  industry: string;
  result: string;
  metric: string;
  metricLabel: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  initials: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SERVICES: Service[] = [
  {
    icon: "⬡",
    title: "Software Development",
    description:
      "Custom web & mobile applications built with modern stacks — from MVPs to enterprise-grade platforms.",
    tags: ["React", "Node.js", "Flutter", "APIs"],
  },
  {
    icon: "◈",
    title: "AI & Automation",
    description:
      "Intelligent workflows, chatbots, and data pipelines that eliminate manual overhead and unlock insights.",
    tags: ["LLM Integration", "RPA", "ML Ops"],
  },
  {
    icon: "◎",
    title: "Cloud & DevOps",
    description:
      "Scalable infrastructure, CI/CD pipelines, and 99.9% uptime guarantees on AWS, GCP, or Azure.",
    tags: ["AWS", "Docker", "Kubernetes", "Terraform"],
  },
  {
    icon: "◇",
    title: "Digital Strategy",
    description:
      "Technology roadmaps, audits, and fractional CTO services that align tech investments with business goals.",
    tags: ["Roadmapping", "Tech Audits", "Consulting"],
  },
  {
    icon: "⬡",
    title: "UI/UX Design",
    description:
      "Research-backed interfaces that convert. From wireframes to pixel-perfect design systems.",
    tags: ["Figma", "Design Systems", "Prototyping"],
  },
  {
    icon: "◈",
    title: "Data & Analytics",
    description:
      "Business intelligence dashboards, ETL pipelines, and predictive models turning raw data into decisions.",
    tags: ["Power BI", "Tableau", "Python", "SQL"],
  },
];

const CASE_STUDIES: CaseStudy[] = [
  {
    client: "Savanna Logistics",
    industry: "Transport & Logistics",
    result: "Fleet tracking platform cut fuel costs by 34%",
    metric: "34%",
    metricLabel: "Cost Reduction",
  },
  {
    client: "AgroLink Kenya",
    industry: "AgriTech",
    result: "Farmer-facing USSD + web portal reached 12,000 users in 3 months",
    metric: "12K",
    metricLabel: "Users in 90 Days",
  },
  {
    client: "PesaEdge Finance",
    industry: "FinTech",
    result: "Loan origination system reduced approval time from 5 days to 4 hours",
    metric: "95%",
    metricLabel: "Faster Approvals",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Amina Wanjiku",
    role: "CEO",
    company: "Savanna Logistics",
    quote:
      "Jamii SoTech didn't just build software — they understood our operations and built something that actually changed how we work.",
    initials: "AW",
  },
  {
    name: "David Otieno",
    role: "CTO",
    company: "PesaEdge Finance",
    quote:
      "The team delivered on time, on budget, and the code quality is exceptional. We've built two more projects with them since.",
    initials: "DO",
  },
  {
    name: "Fatuma Hassan",
    role: "Product Lead",
    company: "AgroLink Kenya",
    quote:
      "They took a vague idea and turned it into a product our farmers love. That kind of empathy for end users is rare.",
    initials: "FH",
  },
];

const STATS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "98%", label: "Client Retention" },
  { value: "6+", label: "Years in Market" },
  { value: "15+", label: "Team Members" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["Services", "Work", "About", "Contact"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-neutral-950/95 backdrop-blur-md border-b border-red-900/30 shadow-lg shadow-red-950/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rotate-45 flex items-center justify-center">
            <span className="text-white text-xs font-bold -rotate-45">JS</span>
          </div>
          <span className="text-white font-bold text-lg tracking-widest uppercase">
            Jamii <span className="text-red-500">SoTech</span>
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-neutral-400 hover:text-red-400 text-sm tracking-widest uppercase transition-colors"
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 text-sm tracking-widest uppercase transition-colors"
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-neutral-300 flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-neutral-950 border-t border-red-900/30 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-neutral-300 text-sm tracking-widest uppercase"
              onClick={() => setMenuOpen(false)}
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-red-600 text-white px-5 py-2 text-sm tracking-widest uppercase text-center"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-neutral-950"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(220,38,38,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-red-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-700/8 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative side text */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3 opacity-30">
        <span className="text-red-500 text-xs tracking-[0.3em] uppercase [writing-mode:vertical-rl] rotate-180">
          Technology That Moves Africa Forward
        </span>
        <div className="w-px h-24 bg-red-800" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-red-600" />
            <span className="text-red-500 text-xs tracking-[0.4em] uppercase">
              Nairobi · Kenya · East Africa
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight text-white mb-6">
            We Build{" "}
            <span className="relative inline-block">
              <span className="text-red-500">Software</span>
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-red-600" />
            </span>
            <br />
            That Solves{" "}
            <span className="text-neutral-400">Real</span>
            <br />
            <span className="text-neutral-300">African Problems.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12">
            Jamii SoTech LTD is a full-service technology company delivering
            custom software, AI automation, and cloud infrastructure to
            ambitious businesses across the continent.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-16">
            <a
              href="#contact"
              className="group bg-red-600 hover:bg-red-500 text-white px-8 py-4 text-sm tracking-widest uppercase transition-all duration-200 flex items-center gap-3"
            >
              Start a Project
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="#work"
              className="border border-neutral-700 hover:border-red-600 text-neutral-300 hover:text-white px-8 py-4 text-sm tracking-widest uppercase transition-all duration-200"
            >
              View Our Work
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-neutral-800 pt-12">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {s.value}
                </div>
                <div className="text-neutral-500 text-xs tracking-widest uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
    </section>
  );
}

function ProblemSolutionSection() {
  const problems = [
    {
      pain: "Tech vendors who don't understand local context",
      fix: "We're built in Africa, for Africa — we get the constraints, the infrastructure, and the culture.",
    },
    {
      pain: "Solutions that ship late and over budget",
      fix: "Agile delivery with fixed milestones, transparent pricing, and weekly progress updates.",
    },
    {
      pain: "Generic software that doesn't fit your workflow",
      fix: "Every system is bespoke — designed around your team, your users, and your business logic.",
    },
    {
      pain: "No support after launch",
      fix: "Ongoing maintenance, monitoring, and iteration. We're partners, not just vendors.",
    },
  ];

  return (
    <section className="bg-neutral-950 py-28 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-red-800/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-red-600" />
          <span className="text-red-500 text-xs tracking-[0.4em] uppercase">
            The Problem & Our Answer
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start mb-20">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              African businesses deserve{" "}
              <span className="text-red-500">better tech partners.</span>
            </h2>
          </div>
          <div>
            <p className="text-neutral-400 text-lg leading-relaxed">
              Too many companies waste time and money on software that doesn't
              work for them. Bloated Western solutions. Offshore teams with no
              context. Projects that go dark. We started Jamii SoTech to be the
              team we wish existed.
            </p>
          </div>
        </div>

        {/* Problem/Solution grid */}
        <div className="grid md:grid-cols-2 gap-px bg-neutral-800">
          {problems.map((item, i) => (
            <div key={i} className="bg-neutral-950 p-8 group hover:bg-neutral-900 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-6 h-6 rounded-full bg-red-950 border border-red-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-500 text-xs">✕</span>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed line-through decoration-red-900">
                  {item.pain}
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-orange-950 border border-orange-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-400 text-xs">✓</span>
                </div>
                <p className="text-neutral-200 text-sm leading-relaxed">
                  {item.fix}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="bg-neutral-900 py-28 relative overflow-hidden">
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(220,38,38,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-red-600" />
          <span className="text-red-500 text-xs tracking-[0.4em] uppercase">
            What We Do
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white max-w-xl leading-tight">
            Core Services
          </h2>
          <p className="text-neutral-400 max-w-xs text-sm leading-relaxed">
            End-to-end technology capability — strategy through deployment,
            under one roof.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-800">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className="bg-neutral-900 hover:bg-neutral-800 p-8 transition-colors group cursor-pointer"
            >
              <div className="text-red-500 text-3xl mb-6 group-hover:text-orange-400 transition-colors">
                {s.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-3 tracking-wide">
                {s.title}
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                {s.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-neutral-400 border border-neutral-700 px-2 py-1 group-hover:border-red-900 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-3 text-red-500 hover:text-red-400 text-sm tracking-widest uppercase transition-colors"
          >
            Discuss your project <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function CaseStudiesSection() {
  return (
    <section id="work" className="bg-neutral-950 py-28 relative overflow-hidden">
      <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-red-800/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-red-600" />
          <span className="text-red-500 text-xs tracking-[0.4em] uppercase">
            Case Studies
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 max-w-xl leading-tight">
          Proof in the work.
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {CASE_STUDIES.map((cs, i) => (
            <div
              key={i}
              className="border border-neutral-800 hover:border-red-900 p-8 transition-all group"
            >
              {/* Metric */}
              <div className="mb-8">
                <div className="text-5xl font-bold text-red-500 mb-1">
                  {cs.metric}
                </div>
                <div className="text-neutral-500 text-xs tracking-widest uppercase">
                  {cs.metricLabel}
                </div>
              </div>

              {/* Bar accent */}
              <div className="h-px w-full bg-neutral-800 mb-6 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-2/3 bg-orange-600 group-hover:w-full transition-all duration-700" />
              </div>

              <div className="text-neutral-500 text-xs tracking-widest uppercase mb-3">
                {cs.industry}
              </div>
              <h3 className="text-white font-bold text-base mb-3 leading-snug">
                {cs.client}
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {cs.result}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-neutral-900 p-8">
              <div className="text-red-700 text-4xl font-serif mb-4">"</div>
              <p className="text-neutral-300 text-sm leading-relaxed mb-8 italic">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-900 flex items-center justify-center text-red-300 text-xs font-bold">
                  {t.initials}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{t.name}</div>
                  <div className="text-neutral-500 text-xs">
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const logos = [
    "Savanna Logistics",
    "AgroLink Kenya",
    "PesaEdge Finance",
    "Kazi Works",
    "NaboHealth",
    "UjuziTech",
  ];

  return (
    <section className="bg-neutral-900 py-20 border-y border-neutral-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-neutral-500 text-xs tracking-[0.4em] uppercase">
            Trusted by innovative companies across East Africa
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((l) => (
            <div
              key={l}
              className="text-neutral-600 hover:text-neutral-400 text-sm font-bold tracking-widest uppercase transition-colors cursor-default"
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="bg-neutral-950 py-28 relative overflow-hidden">
      {/* Big decorative letter */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[280px] font-bold text-neutral-900 select-none pointer-events-none leading-none hidden xl:block">
        J
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-red-600" />
              <span className="text-red-500 text-xs tracking-[0.4em] uppercase">
                About Us
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Technology company.
              <br />
              <span className="text-neutral-500">African roots.</span>
            </h2>
            <p className="text-neutral-400 leading-relaxed mb-6">
              Jamii SoTech LTD was founded in Nairobi with a singular mission:
              to give African businesses access to world-class software
              engineering that actually understands their reality.
            </p>
            <p className="text-neutral-400 leading-relaxed mb-10">
              "Jamii" means community in Swahili. We believe technology should
              serve communities — not just shareholders. Every line of code we
              write is in service of that belief.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Founded", value: "2018" },
                { label: "Headquarters", value: "Nairobi, KE" },
                { label: "Team Size", value: "15+ Engineers" },
                { label: "Projects Shipped", value: "50+" },
              ].map((item) => (
                <div key={item.label} className="border-l-2 border-red-700 pl-4">
                  <div className="text-neutral-500 text-xs tracking-widest uppercase mb-1">
                    {item.label}
                  </div>
                  <div className="text-white font-semibold">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="space-y-4">
            {[
              {
                num: "01",
                title: "Context First",
                body: "We understand African markets, connectivity constraints, and user behaviours before writing a single line.",
              },
              {
                num: "02",
                title: "Radical Transparency",
                body: "Weekly updates, honest timelines, and no surprises. You always know where your project stands.",
              },
              {
                num: "03",
                title: "Ownership Mindset",
                body: "We treat your product like it's ours. That means caring about outcomes, not just deliverables.",
              },
              {
                num: "04",
                title: "Long-term Partnership",
                body: "Our best clients are with us for years. We grow with you as your technology needs evolve.",
              },
            ].map((v) => (
              <div
                key={v.num}
                className="flex gap-6 p-6 bg-neutral-900 hover:bg-neutral-800 transition-colors"
              >
                <div className="text-red-700 font-bold text-sm tracking-widest flex-shrink-0 mt-0.5">
                  {v.num}
                </div>
                <div>
                  <div className="text-white font-semibold mb-2">{v.title}</div>
                  <div className="text-neutral-500 text-sm leading-relaxed">
                    {v.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-red-700 py-28 relative overflow-hidden">
      {/* Noise-like overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(0,0,0,0.5) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.5) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.5) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.5) 75%)",
          backgroundSize: "4px 4px",
        }}
      />
      <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-red-600/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <div className="text-red-300 text-xs tracking-[0.4em] uppercase mb-6">
          Ready to build?
        </div>
        <h2 className="text-5xl md:text-7xl font-bold text-white leading-none mb-6">
          Let's ship something
          <br />
          <span className="text-red-200">remarkable.</span>
        </h2>
        <p className="text-red-200 text-lg max-w-2xl mx-auto leading-relaxed mb-12">
          Whether you have a fully-scoped brief or just an idea on a napkin —
          we're ready to listen. Free discovery call, no commitment.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#contact"
            className="bg-white text-red-700 hover:bg-red-50 px-8 py-4 font-bold text-sm tracking-widest uppercase transition-colors"
          >
            Book a Free Discovery Call
          </a>
          <a
            href="mailto:hello@jamiisotech.co.ke"
            className="border border-red-400 text-white hover:bg-red-600 px-8 py-4 text-sm tracking-widest uppercase transition-colors"
          >
            hello@jamiisotech.co.ke
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="bg-neutral-950 py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left info */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-red-600" />
              <span className="text-red-500 text-xs tracking-[0.4em] uppercase">
                Contact
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Let's start a conversation.
            </h2>
            <p className="text-neutral-400 leading-relaxed mb-10">
              Drop us a line and our team will get back to you within 24 hours.
              We're based in Nairobi but work with clients across the continent
              and beyond.
            </p>

            <div className="space-y-6">
              {[
                { label: "Email", value: "hello@jamiisotech.co.ke" },
                { label: "Phone", value: "+254 700 000 000" },
                { label: "Location", value: "Westlands, Nairobi, Kenya" },
                { label: "Hours", value: "Mon–Fri, 8am–6pm EAT" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="text-neutral-500 text-xs tracking-widest uppercase w-20 flex-shrink-0 mt-0.5">
                    {c.label}
                  </div>
                  <div className="text-white text-sm">{c.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div>
            {submitted ? (
              <div className="border border-red-800 bg-red-950/30 p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="text-orange-400 text-5xl mb-6">✓</div>
                <h3 className="text-white font-bold text-xl mb-3">
                  Message received!
                </h3>
                <p className="text-neutral-400 text-sm">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: "name", label: "Full Name", type: "text" },
                  { id: "email", label: "Email Address", type: "email" },
                  { id: "company", label: "Company / Organisation", type: "text" },
                ].map((f) => (
                  <div key={f.id}>
                    <label className="block text-neutral-500 text-xs tracking-widest uppercase mb-2">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      required
                      value={form[f.id as keyof typeof form]}
                      onChange={(e) =>
                        setForm({ ...form, [f.id]: e.target.value })
                      }
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-600 text-white px-4 py-3 text-sm outline-none transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-neutral-500 text-xs tracking-widest uppercase mb-2">
                    Service Interested In
                  </label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-600 text-white px-4 py-3 text-sm outline-none transition-colors appearance-none"
                  >
                    <option value="">Select a service…</option>
                    {SERVICES.map((s) => (
                      <option key={s.title} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    <option value="Not sure">Not sure yet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 text-xs tracking-widest uppercase mb-2">
                    Tell us about your project
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-600 text-white px-4 py-3 text-sm outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-4 text-sm font-bold tracking-widest uppercase transition-colors"
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 rotate-45 flex items-center justify-center">
            <span className="text-white text-xs font-bold -rotate-45">JS</span>
          </div>
          <span className="text-neutral-400 text-sm tracking-widest uppercase">
            Jamii SoTech LTD
          </span>
        </div>
        <div className="text-neutral-600 text-xs text-center">
          © {new Date().getFullYear()} Jamii SoTech LTD. All rights reserved. · Nairobi, Kenya
        </div>
        <div className="flex gap-6">
          {["LinkedIn", "Twitter", "GitHub"].map((s) => (
            <a
              key={s}
              href="#"
              className="text-neutral-600 hover:text-red-500 text-xs tracking-widest uppercase transition-colors"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function JamiiSoTechHomepage() {
  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Oxanium', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0a0a0a; }
        ::selection { background: rgba(220,38,38,0.4); color: white; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #7f1d1d; }
      `}</style>

      <div className="min-h-screen bg-neutral-950 text-white">
        <NavBar />
        <HeroSection />
        <ProblemSolutionSection />
        <ServicesSection />
        <CaseStudiesSection />
        <TrustSection />
        <AboutSection />
        <CTASection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}
