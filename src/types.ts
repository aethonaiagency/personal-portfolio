export interface Project {
  id: string;
  title: string;
  niche: string;
  tools: string[];
  description: string;
  fullChallenge: string;
  fullOutcome: string;
  image: string;
  liveUrl?: string;
  duration: string;
  role: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  details: string[];
}

export interface Skill {
  name: string;
  category: 'core' | 'backend' | 'design';
  level?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarSeed?: string;
  rating?: number;
  planName?: string;
}

export interface LeadSubmission {
  id: string;
  name: string;
  email: string;
  businessName: string;
  budget: string;
  message: string;
  timestamp: string;
}
