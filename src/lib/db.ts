// D1 Database Helper for Cloudflare Workers

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface D1PreparedStatement {
  bind(...params: unknown[]): D1PreparedStatement;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  first<T = Record<string, unknown>>(column?: string): Promise<T | undefined>;
  run(): Promise<D1Result<unknown>>;
}

export interface D1Result<T = Record<string, unknown>> {
  success: boolean;
  results?: T[];
  meta?: { duration: number; last_row_id?: number; changes?: number };
}

export async function queryAll<T = Record<string, unknown>>(
  db: D1Database, sql: string, params?: unknown[]
): Promise<T[]> {
  const stmt = db.prepare(sql);
  const bound = params ? stmt.bind(...params) : stmt;
  const result = await bound.all<T>();
  return result.results || [];
}

export async function queryFirst<T = Record<string, unknown>>(
  db: D1Database, sql: string, params?: unknown[]
): Promise<T | null> {
  const stmt = db.prepare(sql);
  const bound = params ? stmt.bind(...params) : stmt;
  const result = await bound.first<T>();
  return result || null;
}

export async function execute(
  db: D1Database, sql: string, params?: unknown[]
): Promise<D1Result<unknown>> {
  const stmt = db.prepare(sql);
  const bound = params ? stmt.bind(...params) : stmt;
  return bound.run();
}

export async function transaction<T>(
  db: D1Database,
  callback: (db: D1Database) => Promise<T>
): Promise<T> {
  await execute(db, 'BEGIN TRANSACTION');
  try {
    const result = await callback(db);
    await execute(db, 'COMMIT');
    return result;
  } catch (err) {
    await execute(db, 'ROLLBACK');
    throw err;
  }
}
