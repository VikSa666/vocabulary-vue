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
  <p-card>
    <template #title>Home Page</template>
    <template #content>
      <div class="flex flex-col flex-center gap-2 p-2 items-center">
        <p>This is some random content viewable by everyone!</p>

        <p-button label="Login" @click="goToLogin" />
        <p-button label="Register" @click="goToRegister" />
      </div>
    </template>
  </p-card>
</template>

<style scoped></style>
