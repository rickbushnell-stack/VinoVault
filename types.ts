
export interface Wine {
  id: string;
  name: string;
  producer: string;
  vintage: string;
  region: string;
  varietal: string;
  type: 'Red' | 'White' | 'Rosé' | 'Sparkling' | 'Dessert';
  quantity: number;
  rating?: number;
  notes?: string;
  image?: string;
  addedAt: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export type View = 'cellar' | 'sommelier' | 'add' | 'detail';
