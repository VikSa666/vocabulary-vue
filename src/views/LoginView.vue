<script lang="ts" setup>
  import { ref } from 'vue';
  import { useUserStore } from '../stores/userStore';
  import { useRouter } from 'vue-router';
  import PButton from 'primevue/button';
  import PInputGroup from 'primevue/inputgroup';
  import PInputGroupAddon from 'primevue/inputgroupaddon';
  import PInputText from 'primevue/inputtext';
  import PPassword from 'primevue/password';
  import PCard from 'primevue/card';

  const userStore = useUserStore();
  const router = useRouter();

  let email = ref('');
  let password = ref('');

  async function login() {
    const success = await userStore.signIn(email.value, password.value);
    if (success) {
      router.push('/secret');
    }
  }
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <p-card class="w-fit">
      <template #title>Login</template>
      <template #content>
        <div class="flex flex-col flex-center gap-2 p-2 items-center">
          <p-input-group>
            <p-input-group-addon>
              <i class="pi pi-at" />
            </p-input-group-addon>
            <p-input-text
              type="text"
              size="small"
              v-model="email"
              placeholder="example@example.com"
            />
          </p-input-group>

          <p-input-group>
            <p-input-group-addon>
              <i class="pi pi-key" />
            </p-input-group-addon>
            <p-password
              type="text"
              size="small"
              v-model="password"
              placeholder="Password"
              :feedback="false"
            />
          </p-input-group>

          <p-button label="Login" @click="login" size="small" />
          <div class="flex flex-row items-center">
            <p class="text-sm">You don't have an account?</p>
            <p-button variant="link" asChild v-slot="slotProps" size="small">
              <router-link to="/register" :class="slotProps.class">Create account</router-link>
            </p-button>
          </div>
        </div>
      </template>
    </p-card>
  </div>
</template>
