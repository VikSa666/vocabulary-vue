import { defineStore } from 'pinia';
import { supabase } from '../clients/supabase';
import type { User } from '@supabase/supabase-js';
import { type Word, type UserList, type Tag, type LexicCategory } from '../types';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    error: null as string | null,
    loading: false,
    userLists: null as UserList[] | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async fetchUser() {
      this.loading = true;
      const { data } = await supabase.auth.getSession();
      this.user = data.session?.user ?? null;
      this.loading = false;

      supabase.auth.onAuthStateChange((_event, session) => {
        this.user = session?.user ?? null;
      });
    },

    async signUp(email: string, password: string, metadata: any) {
      // TODO: Type better metadata
      this.loading = true;
      this.error = null;
      const { data: _, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });
      this.loading = false;
      if (error) {
        this.error = error.message;
        console.error(error);
        return false;
      } else {
        // TODO: Show popup with message
        console.info('check email to confirm singup');
        return true;
      }
    },

    async signIn(email: string, password: string) {
      this.loading = true;
      this.error = null;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      this.loading = false;
      if (error) {
        this.error = error.message;
        console.error(error);
        return false;
      } else {
        console.info(`signed in as ${data.session?.user.email}`);
        this.user = data.session?.user ?? null;
        return true;
      }
    },

    async signOut() {
      this.loading = true;
      await supabase.auth.signOut();
      this.loading = false;
      this.user = null;
    },

    async fetchUserLists() {
      let { data: lists, error } = await supabase.from('lists').select('*');
      if (error) {
        this.error = error.toString();
        console.error(error);
      } else {
        this.userLists = lists as unknown as UserList[];
      }
    },

    async getUserList(id: string) {
      let { data: list, error } = await supabase.from('words').select('*').eq('list_id', id);
      if (error) {
        this.error = error.toString();
        console.error(error);
      } else {
        return list as unknown as Word[];
      }
    },

    async getUserListFilteredWords(
      listId: string,
      category?: LexicCategory,
      tags?: Tag[],
      searchText?: string
    ) {
      let query = supabase.from('words').select('*').eq('list_id', listId);

      if (category) {
        query = query.eq('category', category);
      }
      if (searchText && searchText.trim()) {
        query = query.or(`langInWord.ilike.${searchText}%,langOutWord.ilike.${searchText}%`);
      }
      const { data, error } = await query;
      if (error) {
        this.error = error.toString();
        console.error(error);
        throw error;
      }
      let filtered = data as unknown as Word[];
      if (tags && tags.length) {
        const tagNames = tags.map((t) => t.name);

        // ✅ Only keep words that contain *all* selected tags
        filtered = filtered.filter((word: Word) => {
          const wordTagNames = word.tags.map((t) => t.name);
          return tagNames.every((t) => wordTagNames.includes(t));
        });
      }

      return filtered;
    },

    async getUserListData(listId: string) {
      let { data, error } = await supabase.from('lists').select('*').eq('id', listId).single();
      if (error) {
        this.error = error.toString();
        console.error(error);
      } else {
        return data as unknown as {
          id: string;
          created_at: string;
          user_id: string;
          language_in: string;
          language_out: String;
          tags: Tag[];
        };
      }
    },
  },
});
