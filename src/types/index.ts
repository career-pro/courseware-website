export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'meetings' | 'courseware' | 'picture-books';
  coverImage: string;
  detailImages: string[];
  detailInfo: string;
  downloadLink: string;
  tags: string[];
  isFree: boolean;
  createdAt: string;
}

export interface RedeemCode {
  code: string;
  type: 'A' | 'B';
  remainingUses: number;
  usedFiles: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  path: string;
  emoji: string;
}