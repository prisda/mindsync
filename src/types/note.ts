export interface Tag {
  name: string;
  color?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  tags: string[];
  isPinned: boolean;
  createdAt: any; // Can be Date, string, or Firestore Timestamp
  updatedAt: any; // Can be Date, string, or Firestore Timestamp
}