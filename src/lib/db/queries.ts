/**
 * Complex database queries
 */
import prisma from './client';
import { executeQuery, transaction } from './utils';
import { Prisma } from '@prisma/client';

/**
 * Get certifications with expiration status
 */
export async function getCertificationsWithStatus(
  userId: string,
  options: {
    status?: 'active' | 'expiring' | 'expired' | 'all';
    page?: number;
    limit?: number;
    search?: string;
    vendorId?: string;
    orderBy?: 'name' | 'issueDate' | 'expiryDate' | 'createdAt';
    orderDirection?: 'asc' | 'desc';
  } = {}
) {
  const {
    status = 'all',
    page = 1,
    limit = 10,
    search = '',
    vendorId,
    orderBy = 'expiryDate',
    orderDirection = 'asc',
  } = options;

  const skip = (page - 1) * limit;
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(now.getMonth() + 1);

  // Build where clause
  let where: Prisma.CertificationWhereInput = {
    userId,
    ...(vendorId ? { vendorId } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { certNumber: { contains: search, mode: 'insensitive' } },
            { vendor: { name: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {}),
  };

  // Add status filter
  if (status !== 'all') {
    if (status === 'active') {
      where.expiryDate = { gt: nextMonth };
    } else if (status === 'expiring') {
      where.expiryDate = { lte: nextMonth, gt: now };
    } else if (status === 'expired') {
      where.expiryDate = { lte: now };
    }
  }

  // Build order by
  const orderByClause: Prisma.CertificationOrderByWithRelationInput = {};
  if (orderBy === 'name') {
    orderByClause.name = orderDirection;
  } else if (orderBy === 'issueDate') {
    orderByClause.issueDate = orderDirection;
  } else if (orderBy === 'expiryDate') {
    orderByClause.expiryDate = orderDirection;
  } else if (orderBy === 'createdAt') {
    orderByClause.createdAt = orderDirection;
  }

  return executeQuery(async () => {
    // Count total
    const total = await prisma.certification.count({ where });

    // Get data
    const certifications = await prisma.certification.findMany({
      where,
      include: {
        vendor: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: orderByClause,
      skip,
      take: limit,
    });

    // Enhance with status
    const enhancedCertifications = certifications.map((cert) => {
      let status = 'active';
      if (cert.expiryDate) {
        if (cert.expiryDate <= now) {
          status = 'expired';
        } else if (cert.expiryDate <= nextMonth) {
          status = 'expiring';
        }
      }

      return {
        ...cert,
        status,
        daysUntilExpiry: cert.expiryDate
          ? Math.ceil(
              (cert.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            )
          : null,
      };
    });

    return {
      data: enhancedCertifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  });
}

/**
 * Get upcoming expirations by user
 */
export async function getUpcomingExpirations(userId: string, limit = 5) {
  const now = new Date();
  const inSixMonths = new Date();
  inSixMonths.setMonth(now.getMonth() + 6);

  return executeQuery(() =>
    prisma.certification.findMany({
      where: {
        userId,
        expiryDate: {
          gte: now,
          lte: inSixMonths,
        },
      },
      include: {
        vendor: true,
      },
      orderBy: {
        expiryDate: 'asc',
      },
      take: limit,
    })
  );
}

/**
 * Get certification statistics
 */
export async function getCertificationStats(userId: string) {
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(now.getMonth() + 1);

  return executeQuery(async () => {
    const stats = await prisma.$queryRaw`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN "expiryDate" > ${nextMonth} THEN 1 END) as active,
        COUNT(CASE WHEN "expiryDate" <= ${nextMonth} AND "expiryDate" > ${now} THEN 1 END) as expiring,
        COUNT(CASE WHEN "expiryDate" <= ${now} THEN 1 END) as expired
      FROM "Certification"
      WHERE "userId" = ${userId}
    `;

    return stats[0];
  });
}

/**
 * Renew a certification
 */
export async function renewCertification(
  certificationId: string,
  data: {
    newExpiryDate: Date;
    newIssueDate?: Date;
    newCertNumber?: string;
    fileUrl?: string;
    notes?: string;
  }
) {
  return transaction(async (tx) => {
    // Get current certification
    const currentCert = await tx.certification.findUniqueOrThrow({
      where: { id: certificationId },
    });

    // Create renewal record
    const renewal = await tx.certificationRenewal.create({
      data: {
        certificationId,
        previousIssueDate: currentCert.issueDate,
        previousExpiryDate: currentCert.expiryDate,
        previousCertNumber: currentCert.certNumber,
        renewalDate: new Date(),
        notes: data.notes,
      },
    });

    // Update certification
    const updatedCert = await tx.certification.update({
      where: { id: certificationId },
      data: {
        expiryDate: data.newExpiryDate,
        issueDate: data.newIssueDate || new Date(),
        certNumber: data.newCertNumber || currentCert.certNumber,
        fileUrl: data.fileUrl || currentCert.fileUrl,
        updatedAt: new Date(),
      },
    });

    return { certification: updatedCert, renewal };
  });
}

/**
 * Get certificates by vendor with aggregations
 */
export async function getCertificationsByVendor(userId: string) {
  return executeQuery(async () => {
    const vendors = await prisma.vendor.findMany({
      where: {
        certifications: {
          some: {
            userId,
          },
        },
      },
      include: {
        _count: {
          select: {
            certifications: {
              where: {
                userId,
              },
            },
          },
        },
        certifications: {
          where: {
            userId,
          },
          orderBy: {
            expiryDate: 'asc',
          },
          take: 1,
        },
      },
    });

    return vendors.map((vendor) => ({
      ...vendor,
      certCount: vendor._count.certifications,
      nextExpiration: vendor.certifications[0]?.expiryDate,
    }));
  });
}