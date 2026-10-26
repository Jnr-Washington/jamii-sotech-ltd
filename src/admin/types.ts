export const STAGES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const;
export type Stage = (typeof STAGES)[number];
export const OPEN_STAGES: Stage[] = ['new', 'contacted', 'qualified', 'proposal'];

export const STAGE_LABELS: Record<Stage, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal sent',
  won: 'Won',
  lost: 'Lost',
};

// Mirrors jamii-be/src/config/services.js
export const SERVICE_OPTIONS = ['Software development', 'AI & automation', 'Cloud & DevOps', 'Digital strategy', 'UI/UX design', 'Data & analytics'];

export const CTA_LABELS: Record<string, string> = {
  nav: 'Header "Get started"',
  hero: 'Hero "Start a project"',
  services: 'Services "Discuss your project"',
  'cta-band': '"Book a free discovery call"',
  direct: 'Scrolled to the form',
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export type UserRef = Pick<User, 'id' | 'name' | 'email'>;

export interface Activity {
  id: string;
  type: 'created' | 'stage' | 'assigned' | 'note' | 'updated';
  text: string;
  from: string;
  to: string;
  by: { id: string; name: string } | null;
  at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
  source: {
    channel: string;
    cta: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    referrer: string;
    landingPage: string;
  };
  stage: Stage;
  assignedTo: UserRef | null;
  value: number | null;
  followUpAt: string | null;
  lostReason: string;
  firstRespondedAt: string | null;
  closedAt: string | null;
  acknowledgementSent: boolean;
  activity?: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination { page: number; limit: number; total: number; pages: number }

export interface Stats {
  windowDays: number;
  totals: {
    leads: number;
    newThisWeek: number;
    open: number;
    openValue: number;
    won: number;
    lost: number;
    winRate: number | null;
    wonValue: number;
    awaitingResponse: number;
    overdueFollowUps: number;
    unassignedOpen: number;
  };
  response: { count: number; avgHours: number | null; medianHours: number | null; within24hRate: number | null };
  stages: { stage: Stage; count: number; value: number }[];
  byService: { service: string; count: number }[];
  byChannel: { channel: string; count: number; won: number }[];
  byCta: { cta: string; count: number }[];
  weekly: { weekStart: string; count: number }[];
}
