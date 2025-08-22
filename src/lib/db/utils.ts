/**
 * Database utility functions
 */
import { Prisma } from '@prisma/client';
import prisma from './client';

/**
 * Safely execute a database operation with error handling
 */
export async function executeQuery<T>(
  operation: () => Promise<T>,
  errorMessage = 'Database operation failed'
): Promise<[T | null, Error | null]> {
  try {
    const result = await operation();
    return [result, null];
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * Create a paginated query
 */
export function createPaginatedQuery<T extends object>(
  modelName: string,
  options: {
    page?: number;
    limit?: number;
    where?: any;
    orderBy?: any;
    include?: any;
    select?: any;
  } = {}
) {
  const {
    page = 1,
    limit = 10,
    where = {},
    orderBy = { createdAt: 'desc' },
    include,
    select,
  } = options;

  const skip = (page - 1) * limit;

  // Get the prisma model dynamically
  const model = prisma[modelName as keyof typeof prisma] as any;

  // Count query
  const countQuery = model.count({
    where,
  });

  // Data query
  const dataQuery = model.findMany({
    where,
    orderBy,
    skip,
    take: limit,
    ...(include ? { include } : {}),
    ...(select ? { select } : {}),
  });

  return {
    countQuery,
    dataQuery,
    async execute() {
      const [count, data] = await Promise.all([countQuery, dataQuery]);
      const totalPages = Math.ceil(count / limit);

      return {
        data,
        meta: {
          total: count,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    },
  };
}

/**
 * Transaction helper
 */
export async function transaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const result = await prisma.$transaction(fn);
    return [result, null];
  } catch (error) {
    console.error('Transaction failed:', error);
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * Helper to handle unique constraint violations
 */
export function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

/**
 * Helper to handle record not found errors
 */
export function isRecordNotFoundError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  );
}