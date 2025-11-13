import { supabaseAdmin } from './supabase';
import { CertificationStatus, UserCertificationRow } from '@/types/database';

export interface CertificationMetadata {
  vendor?: string | null;
  certificateName?: string | null;
  certificateNumber?: string | null;
  acquiredOn?: Date | null;
  expiresOn?: Date | null;
  storagePath?: string | null;
  parsedVendor?: string | null;
  parsedCertificateName?: string | null;
}

export interface CertificationResponse {
  id: string;
  userId: string;
  vendor: string | null;
  name: string;
  certificateNumber: string | null;
  acquiredOn: string | null;
  expiresOn: string | null;
  status: CertificationStatus;
  storagePath: string | null;
  createdAt: string;
  updatedAt: string;
}

export function determineCertificationStatus(expiresOn?: Date | null): CertificationStatus {
  if (!expiresOn) return 'ACTIVE';
  const now = new Date();
  const diff = expiresOn.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return 'EXPIRED';
  if (days <= 90) return 'EXPIRING_SOON';
  return 'ACTIVE';
}

function serializeDate(input?: Date | null): string | null {
  if (!input || Number.isNaN(input.getTime())) return null;
  return input.toISOString();
}

export async function countUserCertifications(userId: string): Promise<number> {
  return await supabaseAdmin.count('user_certifications', {
    eq: { user_id: userId },
  });
}

export async function createUserCertification(userId: string, metadata: CertificationMetadata): Promise<UserCertificationRow> {
  if (!metadata.certificateName) {
    throw new Error('Certificate name is required');
  }

  const status = determineCertificationStatus(metadata.expiresOn ?? null);
  const payload: Partial<UserCertificationRow> = {
    user_id: userId,
    vendor: metadata.vendor ?? metadata.parsedVendor ?? null,
    certificate_name: metadata.certificateName,
    certificate_number: metadata.certificateNumber ?? null,
    acquired_on: serializeDate(metadata.acquiredOn ?? null),
    expires_on: serializeDate(metadata.expiresOn ?? null),
    status,
    storage_path: metadata.storagePath ?? null,
    parsed_vendor: metadata.parsedVendor ?? null,
    parsed_certificate_name: metadata.parsedCertificateName ?? null,
  };

  const [created] = await supabaseAdmin.insert<UserCertificationRow>('user_certifications', [payload]);
  return created;
}

export async function getUserCertifications(userId: string): Promise<UserCertificationRow[]> {
  return await supabaseAdmin.select<UserCertificationRow>('user_certifications', '*', {
    eq: { user_id: userId },
    order: { column: 'expires_on', ascending: true, nullsFirst: false },
  });
}

export async function removeUserCertification(userId: string, certificationId: string): Promise<void> {
  await supabaseAdmin.delete('user_certifications', {
    eq: { id: certificationId, user_id: userId },
  });
}

export function mapCertificationRow(row: UserCertificationRow): CertificationResponse {
  return {
    id: row.id,
    userId: row.user_id,
    vendor: row.vendor ?? row.parsed_vendor ?? null,
    name: row.certificate_name,
    certificateNumber: row.certificate_number,
    acquiredOn: row.acquired_on,
    expiresOn: row.expires_on,
    status: row.status,
    storagePath: row.storage_path,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
