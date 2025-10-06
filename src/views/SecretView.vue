<script lang="ts" setup>
  import router from '../router';
  import PCard from 'primevue/card';
  import PButton from 'primevue/button';
  import { onMounted } from 'vue';
  import { useUserStore } from '../stores/userStore';
  import DashboardView from './DashboardView.vue';

  const userStore = useUserStore();

  onMounted(async () => {
    if (!userStore.user) {
      await userStore.fetchUser();
    }
  });

  async function signOut() {
    await userStore.signOut();
    console.log('sign out successful');
    router.push('/');
  }

  userStore.fetchUserLists();
</script>

<template>
  <!-- TODO: Redirect and not use as component!!! -->
  <dashboard-view></dashboard-view>
  <p-card>
    <template #title><h1>This is protected content</h1></template>
    <template #content>
      <div class="flex flex-col flex-center gap-2 p-2 items-center">
        <p id="account">Account: {{ userStore.user?.email }}</p>
        <p>Name: {{ userStore.user?.user_metadata.first_name }}</p>
        <p>{{ userStore.userLists }}</p>
        <p-button size="small" @click="signOut" label="Sign Out" />
      </div>
    </template>
  </p-card>
</template>

<style>
  #account {
    color: green;
  }
</style>
