export type EditorialStatus = 'draft' | 'pending-medical-review' | 'approved' | 'published' | 'archived';

export interface EditorialRecord {
  id: string;
  collection: 'pages' | 'services' | 'articles' | 'team' | 'locations' | 'resources' | 'media';
  locale: 'es' | 'en';
  status: EditorialStatus;
  title: string;
  slug: string;
  summary: string;
  notes: string;
  altText?: string;
  imageData?: string;
  updatedAt: string;
}

export interface ContentRepository {
  list(): Promise<EditorialRecord[]>;
  get(id: string): Promise<EditorialRecord | undefined>;
  create(record: Omit<EditorialRecord, 'id' | 'updatedAt'>): Promise<EditorialRecord>;
  update(id: string, record: Partial<EditorialRecord>): Promise<EditorialRecord>;
  remove(id: string): Promise<void>;
  export(): Promise<EditorialRecord[]>;
}

/**
 * Browser-only development adapter. It intentionally contains no credentials,
 * authentication claims, or clinical information. Replace this implementation
 * with an authenticated HTTP repository when hosting and database are selected.
 */
export class LocalContentRepository implements ContentRepository {
  constructor(private readonly storageKey = 'ronald-salazar-admin-records') {}

  private read(): EditorialRecord[] {
    if (typeof localStorage === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(this.storageKey) ?? '[]'); } catch { return []; }
  }

  private write(records: EditorialRecord[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(records));
  }

  async list() { return this.read(); }
  async get(id: string) { return this.read().find((record) => record.id === id); }
  async create(input: Omit<EditorialRecord, 'id' | 'updatedAt'>) {
    const record: EditorialRecord = { ...input, id: crypto.randomUUID(), updatedAt: new Date().toISOString() };
    this.write([record, ...this.read()]);
    return record;
  }
  async update(id: string, input: Partial<EditorialRecord>) {
    const records = this.read();
    const index = records.findIndex((record) => record.id === id);
    if (index < 0) throw new Error('Editorial record not found');
    records[index] = { ...records[index], ...input, id, updatedAt: new Date().toISOString() };
    this.write(records);
    return records[index];
  }
  async remove(id: string) { this.write(this.read().filter((record) => record.id !== id)); }
  async export() { return this.read(); }
}
