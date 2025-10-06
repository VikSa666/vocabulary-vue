<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import PButton from 'primevue/button';
  import PInputGroup from 'primevue/inputgroup';
  import PInputGroupAddon from 'primevue/inputgroupaddon';
  import PInputText from 'primevue/inputtext';
  import PPassword from 'primevue/password';
  import PCard from 'primevue/card';
  import { useUserStore } from '../stores/userStore';

  const router = useRouter();
  const userStore = useUserStore();

  let email = ref('');
  let password = ref('');
  let firstName = ref('');

  async function createAccount() {
    const success = await userStore.signUp(email.value, password.value, {
      data: {
        first_name: firstName.value,
      },
    });
    if (success) {
      router.push('/secret');
    }
  }
</script>

<template>
  <p-card>
    <template #title>Create account</template>
    <template #content>
      <div class="flex flex-col flex-center gap-2 p-2 items-center">
        <p-input-group>
          <p-input-group-addon>
            <i class="pi pi-user" />
          </p-input-group-addon>
          <p-input-text type="text" size="small" v-model="firstName" placeholder="Name" />
        </p-input-group>
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
          <p-password type="text" size="small" v-model="password" placeholder="Password" />
        </p-input-group>

        <p-button label="Create" @click="createAccount" size="small" />
        <div class="flex flex-row items-center">
          <p class="m-0 text-sm">Already have an account?</p>
          <p-button variant="link" asChild v-slot="slotProps" size="small">
            <router-link to="/login" :class="slotProps.class">Login</router-link>
          </p-button>
        </div>
      </div>
    </template>
  </p-card>
</template>

<style scoped>
  .inputContainer {
    display: flex;
    flex-direction: column;
  }

  .buttonContainer {
    display: flex;
    flex-direction: column;
    margin-top: 1em;
  }
</style>
