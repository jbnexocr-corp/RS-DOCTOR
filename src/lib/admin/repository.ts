export type EditorialStatus = 'draft' | 'pending-medical-review' | 'approved' | 'published' | 'archived';

export interface EditorialRecord {
  id: string;
  collection: 'pages' | 'services' | 'articles' | 'team' | 'locations' | 'resources' | 'media';
  locale: 'es' | 'en';
  status: EditorialStatus;
  title: string;
  slug: string;
  summary: string;
  body?: string;
  notes: string;
  author?: string;
  medicalReviewer?: string;
  reviewDate?: string;
  sources?: string;
  altText?: string;
  imageData?: string;
  imageKey?: string;
  updatedAt: string;
}
