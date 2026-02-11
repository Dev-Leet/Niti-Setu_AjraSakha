export interface SavedScheme {
  id: string;
  userId: string;
  schemeId: string;
  notes?: string;
  reminderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaveSchemeInput {
  schemeId: string;
  notes?: string;
  reminderDate?: Date;
}

export interface UpdateSavedSchemeInput {
  notes?: string;
  reminderDate?: Date;
}