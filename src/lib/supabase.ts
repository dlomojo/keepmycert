import 'server-only';
import { Buffer } from 'node:buffer';
import { env } from './env';

const REST_URL = `${env.SUPABASE_URL}/rest/v1`;
const STORAGE_URL = `${env.SUPABASE_URL}/storage/v1`;

export type FilterValue = string | number | boolean | null | Date;

export interface QueryOptions {
  eq?: Record<string, FilterValue>;
  neq?: Record<string, FilterValue>;
  ilike?: Record<string, string>;
  gt?: Record<string, FilterValue>;
  gte?: Record<string, FilterValue>;
  lt?: Record<string, FilterValue>;
  lte?: Record<string, FilterValue>;
  in?: Record<string, FilterValue[]>;
  is?: Record<string, string>;
  or?: string;
  order?: { column: string; ascending?: boolean; nullsFirst?: boolean };
  limit?: number;
  offset?: number;
}

function encodeFilterValue(value: FilterValue) {
  if (value === null) return 'null';
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function buildSearchParams(columns: string, options?: QueryOptions) {
  const params = new URLSearchParams();
  params.set('select', columns);

  if (!options) return params;

  const appendComparison = (op: string, values?: Record<string, FilterValue>) => {
    if (!values) return;
    for (const [column, value] of Object.entries(values)) {
      const encoded = encodeFilterValue(value);
      params.append(column, `${op}.${encoded}`);
    }
  };

  appendComparison('eq', options.eq);
  appendComparison('neq', options.neq);
  appendComparison('gt', options.gt);
  appendComparison('gte', options.gte);
  appendComparison('lt', options.lt);
  appendComparison('lte', options.lte);

  if (options.ilike) {
    for (const [column, value] of Object.entries(options.ilike)) {
      params.append(column, `ilike.${value}`);
    }
  }

  if (options.in) {
    for (const [column, values] of Object.entries(options.in)) {
      if (!values.length) continue;
      const encodedValues = values.map(value => encodeFilterValue(value)).join(',');
      params.append(column, `in.(${encodedValues})`);
    }
  }

  if (options.is) {
    for (const [column, value] of Object.entries(options.is)) {
      if (value.startsWith('not.')) {
        params.append(column, value);
      } else {
        params.append(column, `is.${value}`);
      }
    }
  }

  if (options.or) {
    params.set('or', options.or);
  }

  if (options.order) {
    const direction = options.order.ascending === false ? 'desc' : 'asc';
    const nulls = options.order.nullsFirst === false ? '.nullslast' : '.nullsfirst';
    params.append('order', `${options.order.column}.${direction}${nulls}`);
  }

  if (typeof options.limit === 'number') {
    params.set('limit', String(options.limit));
  }

  if (typeof options.offset === 'number') {
    params.set('offset', String(options.offset));
  }

  return params;
}

async function supabaseRequest<T>(path: string, init: RequestInit & { parseResponse?: boolean } = {}) {
  const { parseResponse = true, headers, ...rest } = init;
  const response = await fetch(path, {
    ...rest,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      ...headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${errorText}`);
  }

  if (!parseResponse || response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer as unknown as T;
}

export class SupabaseAdminClient {
  async select<T>(table: string, columns = '*', options?: QueryOptions): Promise<T[]> {
    const params = buildSearchParams(columns, options);
    const url = `${REST_URL}/${table}?${params.toString()}`;
    return await supabaseRequest<T[]>(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
  }

  async selectSingle<T>(table: string, columns = '*', options?: QueryOptions): Promise<T | null> {
    const results = await this.select<T>(table, columns, options);
    if (!results.length) return null;
    return results[0];
  }

  async count(table: string, options?: QueryOptions): Promise<number> {
    const params = buildSearchParams('id', options);
    const url = `${REST_URL}/${table}?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        Accept: 'application/json',
        Prefer: 'count=exact',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase count failed (${response.status}): ${errorText}`);
    }

    const range = response.headers.get('content-range');
    if (!range) return 0;
    const [, total] = range.split('/');
    return total ? parseInt(total, 10) : 0;
  }

  async insert<T>(table: string, values: Partial<T> | Partial<T>[], options?: { upsert?: boolean }): Promise<T[]> {
    const url = `${REST_URL}/${table}`;
    const body = JSON.stringify(values);
    return await supabaseRequest<T[]>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Prefer: `${options?.upsert ? 'resolution=merge-duplicates,' : ''}return=representation`,
      },
      body,
    });
  }

  async update<T>(table: string, values: Partial<T>, options: QueryOptions): Promise<T[]> {
    const params = buildSearchParams('*', options);
    const url = `${REST_URL}/${table}?${params.toString()}`;
    return await supabaseRequest<T[]>(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(values),
    });
  }

  async delete(table: string, options: QueryOptions): Promise<void> {
    const params = buildSearchParams('*', options);
    const url = `${REST_URL}/${table}?${params.toString()}`;
    await supabaseRequest(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
      parseResponse: false,
    });
  }

  async uploadStorage(bucket: string, path: string, file: Buffer, contentType: string, upsert = false): Promise<string> {
    const url = `${STORAGE_URL}/object/${bucket}/${path}`;
    await supabaseRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'x-upsert': upsert ? 'true' : 'false',
      },
      body: file,
      parseResponse: false,
    });
    return path;
  }
}

export const supabaseAdmin = new SupabaseAdminClient();
