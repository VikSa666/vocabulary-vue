<script lang="ts" setup>
  import { RouterView, useRouter } from 'vue-router';
  import PButton from 'primevue/button';
  import PMenubar from 'primevue/menubar';
  import { ref } from 'vue';
  import { useUserStore } from './stores/userStore';
  import { storeToRefs } from 'pinia';

  const userStore = useUserStore();

  const darkMode = ref(document.documentElement.classList.contains('my-app-dark'));
  function toggleDarkMode() {
    darkMode.value = !darkMode.value;
    document.documentElement.classList.toggle('my-app-dark');
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
    console.log('sign out successful');
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
    <RouterView />
  </main>
</template>
