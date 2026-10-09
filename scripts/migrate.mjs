import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.log('[db] DATABASE_URL no configurada; se omiten migraciones.');
  process.exit(0);
}

const sql = postgres(connectionString, { max: 1, connect_timeout: 15 });

try {
  await sql`
    CREATE TABLE IF NOT EXISTS content_records (
      id text PRIMARY KEY,
      collection text NOT NULL CHECK (collection IN ('pages','services','articles','team','locations','resources','media')),
      locale text NOT NULL CHECK (locale IN ('es','en')),
      status text NOT NULL CHECK (status IN ('draft','pending-medical-review','approved','published','archived')),
      title varchar(120) NOT NULL,
      slug varchar(180) NOT NULL,
      summary text NOT NULL DEFAULT '',
      body text NOT NULL DEFAULT '',
      notes text NOT NULL DEFAULT '',
      author varchar(120) NOT NULL DEFAULT '',
      medical_reviewer varchar(120) NOT NULL DEFAULT '',
      review_date date,
      sources text NOT NULL DEFAULT '',
      alt_text varchar(180) NOT NULL DEFAULT '',
      image_url text NOT NULL DEFAULT '',
      image_key text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (collection, locale, slug)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS content_records_public_idx ON content_records (collection, locale, status, updated_at DESC)`;
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key text PRIMARY KEY,
      value jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS audit_log (
      id text PRIMARY KEY,
      message text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS media_assets (
      id text PRIMARY KEY,
      object_key text NOT NULL UNIQUE,
      url text NOT NULL,
      filename text NOT NULL,
      content_type text NOT NULL,
      size_bytes integer NOT NULL,
      alt_text varchar(180) NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  console.log('[db] Migraciones aplicadas correctamente.');
} finally {
  await sql.end();
}
