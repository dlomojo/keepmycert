// Credly API Types
export interface CredlyBadgeTemplate {
  id?: string;
  name?: string;
  image_url?: string;
  issuer?: {
    name?: string;
  };
}

export interface CredlyBadge {
  id?: string;
  badge_template?: CredlyBadgeTemplate;
  name?: string;
  issued_at?: string;
  expires_at?: string;
  image_url?: string;
  issuer?: { name?: string };
  badge_url?: string;
  evidence?: string;
  url?: string;
}

export interface CredlyProfileResponse {
  data?: CredlyBadge[];
  badges?: CredlyBadge[];
}

export interface CredlyFileData {
  badge?: {
    name?: string;
    issuer?: { name?: string };
  };
  name?: string;
  issuer?: { name?: string };
  issuedOn?: string;
  issued_at?: string;
  expires?: string;
  expires_at?: string;
}

export interface ProcessedBadge {
  name: string;
  issuer: string;
  issuedAt: string | null;
  expiresAt: string | null;
}

export interface CredlyImportRequest {
  method: 'badge_links' | 'badge_files' | 'profile_url';
  data: {
    links?: string[];
    files?: CredlyFileData[];
    profileUrl?: string;
  };
}