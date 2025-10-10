<script lang="ts" setup>
  import { RouterView, useRouter } from 'vue-router';
  import PButton from 'primevue/button';
  import PMenubar from 'primevue/menubar';
  import { onMounted, ref } from 'vue';
  import { useUserStore } from './stores/userStore';
  import { storeToRefs } from 'pinia';

  const userStore = useUserStore();

  const darkMode = ref(false);
  onMounted(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      darkMode.value = true;
      document.documentElement.classList.add('my-app-dark');
    } else {
      darkMode.value = false;
      document.documentElement.classList.remove('my-app-dark');
    }
  });
  function toggleDarkMode() {
    darkMode.value = !darkMode.value;
    if (darkMode.value) {
      document.documentElement.classList.add('my-app-dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('my-app-dark');
      localStorage.setItem('theme', 'light');
    }
  }

  const router = useRouter();

  interface MenuItem {
    label: string;
    icon: string;
    show: boolean;
    goToFunction: () => void;
  }

  const menuItems = ref<MenuItem[]>([
    {
      label: 'Home',
      icon: 'pi pi-home',
      show: true,
      goToFunction: () => {
        router.push('/');
      },
    },
    {
      label: 'About',
      icon: 'pi pi-question-circle',
      show: true,
      goToFunction: () => {
        router.push('/'); // TODO!
      },
    },
  ]);

  async function signOut() {
    await userStore.signOut();
    console.info('Sign out successful');
    router.push('/');
  }

  function goToSignIn() {
    router.push('/login');
  }

  const { user, loading } = storeToRefs(userStore);
</script>

<template>
  <header>
    <p-menubar :model="menuItems">
      <template #item="{ item }">
        <p-button
          v-if="item.show"
          size="small"
          :label="item.label as string | undefined"
          :icon="item.icon"
          @click="item.goToFunction"
        />
      </template>
      <template #end>
        <div class="p-menubar-root-list">
          <p-button size="small" v-if="!user && !loading" label="Sign In" @click="goToSignIn" />
          <p-button size="small" v-if="user && !loading" label="Sign Out" @click="signOut" />
          <p-button
            size="small"
            @click="toggleDarkMode"
            :icon="darkMode ? 'pi pi-sun' : 'pi pi-moon'"
          />
        </div>
      </template>
    </p-menubar>
  </header>
  <main>
    <div class="main-content">
      <RouterView />
    </div>
  </main>
</template>
<style scoped>
  .main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
