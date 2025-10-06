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
  tags: string[];
  metadata?: WordData;
}

// TODO: This could be better
export interface WordData {
  category: LexicCategory;
  // TODO: Users will be able to add their own!
  tags: string[];
}

// TODO: others??
export type LexicCategory = 'noun' | 'verb' | 'adjective' | 'other';
