import { User, Certification, Team, TeamMember } from './types';

// Mock user data for demonstration - you can change the default user here
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    plan: 'FREE',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    email: 'pro@example.com',
    name: 'Pro User',
    plan: 'PRO',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    email: 'manager@example.com',
    name: 'Team Manager',
    plan: 'TEAM',
    teamId: 'team1',
    teamRole: 'MANAGER',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '4',
    email: 'member@example.com',
    name: 'Team Member',
    plan: 'TEAM',
    teamId: 'team1',
    teamRole: 'MEMBER',
    createdAt: new Date('2024-01-08'),
  },
];

export const mockCertifications: Certification[] = [
  {
    id: '1',
    userId: '1',
    name: 'AWS Solutions Architect Associate',
    vendor: 'Amazon Web Services',
    issueDate: new Date('2023-06-15'),
    expiryDate: new Date('2026-06-15'),
    certificateNumber: 'AWS-SAA-XXXXXX',
    status: 'ACTIVE',
    createdAt: new Date('2023-06-15'),
  },
  {
    id: '2',
    userId: '2',
    name: 'Microsoft Azure Fundamentals',
    vendor: 'Microsoft',
    issueDate: new Date('2023-08-20'),
    expiryDate: new Date('2025-08-20'),
    certificateNumber: 'AZ-900-XXXXXX',
    status: 'EXPIRING_SOON',
    createdAt: new Date('2023-08-20'),
  },
  {
    id: '3',
    userId: '2',
    name: 'CompTIA Security+',
    vendor: 'CompTIA',
    issueDate: new Date('2022-03-10'),
    expiryDate: new Date('2025-03-10'),
    certificateNumber: 'SEC+-XXXXXX',
    status: 'ACTIVE',
    createdAt: new Date('2022-03-10'),
  },
  {
    id: '4',
    userId: '2',
    name: 'AWS Developer Associate',
    vendor: 'Amazon Web Services',
    issueDate: new Date('2023-09-01'),
    expiryDate: new Date('2026-09-01'),
    certificateNumber: 'AWS-DEV-XXXXXX',
    attachmentUrl: '/certificates/aws-dev.pdf',
    status: 'ACTIVE',
    createdAt: new Date('2023-09-01'),
  },
];

export const mockTeams: Team[] = [
  {
    id: 'team1',
    name: 'Acme Corp IT Team',
    ownerId: '3',
    createdAt: new Date('2024-01-05'),
  },
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    teamId: 'team1',
    userId: '3',
    role: 'MANAGER',
    joinedAt: new Date('2024-01-05'),
  },
  {
    id: '2',
    teamId: 'team1',
    userId: '4',
    role: 'MEMBER',
    joinedAt: new Date('2024-01-08'),
  },
];

// Helper functions to simulate API calls
export function getCurrentUser(): User {
  // Change the index here to test different user types:
  // 0 = Free user, 1 = Pro user, 2 = Team Manager, 3 = Team Member
  return mockUsers[0]; // Default to free user for demo
}

export function getUserCertifications(userId: string): Certification[] {
  return mockCertifications.filter(cert => cert.userId === userId);
}

export function getTeamMembers(teamId: string): (TeamMember & { user: User })[] {
  return mockTeamMembers
    .filter(member => member.teamId === teamId)
    .map(member => ({
      ...member,
      user: mockUsers.find(user => user.id === member.userId)!,
    }));
}