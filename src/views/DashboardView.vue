<script lang="ts" setup>
  import PButton from 'primevue/button';
  import { onMounted } from 'vue';
  import { useUserStore } from '../stores/userStore';
  import PTag from 'primevue/tag';
  import { useRouter } from 'vue-router';

  const userStore = useUserStore();
  const routes = useRouter();

  onMounted(async () => {
    if (!userStore.user) {
      await userStore.fetchUser();
    }
  });

  userStore.fetchUserLists();

  function seeList(id: string) {
    routes.push(`/lists/${id}`);
  }
</script>

<template>
  <div class="flex flex-col">
    <div v-for="(item, itemIdx) in userStore.userLists" :key="itemIdx">
      <div
        class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
        :class="{ 'border-t border-surface-200 dark:border-surface-700': itemIdx !== 0 }"
      >
        <div class="md:w-40 relative">
          <img
            class="block xl:block mx-auto rounded w-full"
            src="../assets/no-image-available.jpg"
            :alt="item.language_in"
          />
          <div class="absolute bg-black/70 rounded-lg" style="left: 4px; top: 4px">
            <p-tag :value="item.language_out" />
          </div>
        </div>
        <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
          <div class="flex flex-row md:flex-col justify-between items-start gap-2">
            <div>
              <!-- <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{
                item.category
              }}</span> -->
              <div class="text-lg font-medium mt-2">
                {{ item.language_in }} - {{ item.language_out }}
              </div>
            </div>
            <!-- <div class="bg-surface-100 p-1" style="border-radius: 30px">
              <div
                class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                style="
                  border-radius: 30px;
                  box-shadow:
                    0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                    0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                "
              >
                <span class="text-surface-900 font-medium text-sm">{{ item.rating }}</span>
                <i class="pi pi-star-fill text-yellow-500"></i>
              </div>
            </div> -->
          </div>
          <div class="flex flex-col md:items-end gap-8">
            <!-- <span class="text-xl font-semibold">${{ item.price }}</span> -->
            <div class="flex flex-row-reverse md:flex-row gap-2">
              <p-button icon="pi pi-pen-to-square" variant="outlined"></p-button>
              <p-button
                icon="pi pi-arrow-right"
                label="See list"
                class="flex-auto md:flex-initial whitespace-nowrap"
                @click="seeList(item.id)"
              ></p-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
