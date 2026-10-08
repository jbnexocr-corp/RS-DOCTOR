export interface RedirectRule {
  oldUrl: string;
  newUrl: string;
  status: 301 | 302 | 307 | 308;
  notes?: string;
}

// Populate only after the existing website and Search Console exports are audited.
export const redirects: RedirectRule[] = [];
