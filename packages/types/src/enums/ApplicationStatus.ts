export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING_DOCUMENTS = 'pending_documents',
  COMPLETED = 'completed',
}

export type ApplicationStatusType =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'pending_documents'
  | 'completed';