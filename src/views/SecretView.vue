<script lang="ts" setup>
import { supabase } from '../clients/supabase';
import { ref } from "vue";
import router from '../router';


const account = ref();
getSession();

async function getSession() {
    account.value = await supabase.auth.getSession();
    console.log(account.value)
}

async function signOut() {
  let { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error)
  } else {
      console.log("sing out successful");
      router.push('/');
    }
}
const userLists = ref();

async function fetchLists() {
  try {
    let { data: lists, error } = await supabase.from('lists').select('lists');
    if (lists) {
      userLists.value = lists;
    }
  } catch (error) {
    console.log(error)
  }
}

fetchLists();
</script>

<template>
    <div class="about">
      <h1>This is protected content</h1>
      <p id="account"> Account: {{  account.data.session.user.email  }}</p>
      <p> Name: {{ account.data.session.user.user_metadata.first_name }} </p>
      <p> {{ userLists }}</p>
      <button @click="signOut">Sign Out</button>
    </div>
</template>
  
  <style>
  #account {
      color: green;
  }
  </style>