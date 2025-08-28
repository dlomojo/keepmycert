export type UserPlan = 'FREE' | 'PRO' | 'TEAM';
export type TeamRole = 'MANAGER' | 'MEMBER';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  teamId?: string;
  teamRole?: TeamRole;
  createdAt: Date;
}

export interface Certification {
  id: string;
  userId: string;
  name: string;
  vendor: string;
  issueDate: Date;
  expiryDate: Date;
  certificateNumber?: string;
  attachmentUrl?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'EXPIRING_SOON';
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  joinedAt: Date;
}