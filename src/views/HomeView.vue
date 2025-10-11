<script lang="ts" setup>
  import PButton from 'primevue/button';
  import { useRouter } from 'vue-router';
  import PCard from 'primevue/card';

  const router = useRouter();

  function goToRegister() {
    router.push('/register');
  }

  function goToLogin() {
    router.push('/login');
  }
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <p-card class="w-fit">
      <template #title>Home Page</template>
      <template #content>
        <div class="flex flex-col flex-center gap-2 p-2 items-center">
          <p>Welcome to the best app for learning vocabulary!</p>

          <p-button label="Login" @click="goToLogin" />
          <p-button label="Register" @click="goToRegister" />
        </div>
      </template>
    </p-card>
  </div>
</template>

<style scoped></style>
