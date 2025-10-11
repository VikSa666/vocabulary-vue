/**
 * Matching model of UserList item in list "lists" from supabase
 */
export interface UserList {
  id: string;
  created_at: string;
  user_id: string;
  language_in: string;
  language_out: string;
}

/**
 * Matching model of a word in list "words" from supabase
 */
export interface Word {
  id: string;
  list_id: string;
  created_at: string;
  langInWord: string;
  langOutWord: string;
  category: LexicCategory;
  tags: Tag[];
  additionalInfo: string;
  appearedTimes: number;
  failedTimes: number;
}

// TODO: others??
export const lexicCategoriesColors: Array<{ name: LexicCategory; color: string }> = [
  { name: 'interjection', color: '#9DA1AA' },
  { name: 'noun', color: '#9DA1AA' },
  { name: 'verb', color: '#256D7B' },
  { name: 'adjective', color: '#721422' },
  { name: 'adverb', color: '#646B63' },
  { name: 'phrase', color: '#CF3476' },
  { name: 'pronoun', color: '#CFD3CD' },
];

export const lexicCategories: Array<string> = [
  'interjection',
  'noun',
  'verb',
  'adjective',
  'adverb',
  'phrase',
  'pronoun',
];
export type LexicCategory = (typeof lexicCategories)[number];

export interface Tag {
  name: string;
  color: string;
}
