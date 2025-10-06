import { defineStore } from 'pinia';
import { supabase } from '../clients/supabase';
import type { User } from '@supabase/supabase-js';
import { type Word, type UserList } from '../types';

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
        console.log(error);
        return false;
      } else {
        // TODO: Show popup with message
        console.log('check email to confirm singup');
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
        console.log(error);
        return false;
      } else {
        console.log(`signed in as ${data.session?.user.email}`);
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
        console.log(error);
      } else {
        this.userLists = lists as unknown as UserList[];
      }
    },

    async getUserList(id: string) {
      let { data: list, error } = await supabase.from('words').select('*').eq('list_id', id);
      if (error) {
        this.error = error.toString();
        console.log(error);
      } else {
        console.log(list);
        return list as unknown as Word[];
      }
    },
  },
});
