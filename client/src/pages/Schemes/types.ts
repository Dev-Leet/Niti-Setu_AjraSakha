export interface SchemeName {
  en: string;
  hi: string;
}

export interface SchemeDescription {
  en: string;
  hi: string;
}
 
export interface Scheme {
  id: string;
  schemeId: string;
  name: SchemeName;
  description: SchemeDescription;
  ministry: string;
  category: string;
  status: string;
  applicationDeadline?: string;
  officialUrl?: string;
}
