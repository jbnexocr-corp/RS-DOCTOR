import postgres from 'postgres';

let client: ReturnType<typeof postgres> | undefined;

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

export function db() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not configured');
  client ??= postgres(connectionString, {
    max: Math.max(1, Math.min(10, Number(process.env.DATABASE_POOL_SIZE) || 4)),
    idle_timeout: 15,
    connect_timeout: 8,
    max_lifetime: 60 * 30,
    prepare: false,
    connection: {
      application_name: 'rs-doctor-web',
      statement_timeout: 8_000,
      lock_timeout: 3_000,
      idle_in_transaction_session_timeout: 10_000,
    },
  });
  return client;
}
