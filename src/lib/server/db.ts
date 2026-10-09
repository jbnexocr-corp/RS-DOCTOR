import postgres from 'postgres';

let client: ReturnType<typeof postgres> | undefined;

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

export function db() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not configured');
  client ??= postgres(connectionString, {
    max: 8,
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: false,
  });
  return client;
}
