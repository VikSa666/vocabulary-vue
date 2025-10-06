<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useUserStore } from '../stores/userStore';
  import { ref } from 'vue';
  import PButton from 'primevue/button';
  import PInputText from 'primevue/inputtext';
  import { useRouter } from 'vue-router';
  import { supabase } from '../clients/supabase';

  import PDataTable from 'primevue/datatable';
  import PColumn from 'primevue/column';
  import PTag from 'primevue/tag';
  import type { Word } from '../types';

  const userStore = useUserStore();
  const router = useRouter();

  interface Props {
    id: string;
  }

  const props = defineProps<Props>();

  const words = ref<Word[]>();
  onMounted(() => {
    userStore.getUserList(props.id).then((promise) => (words.value = promise));
  });

  const newInWord = ref('');
  const newOutWord = ref('');

  async function addWord() {
    if (!newInWord.value || !newOutWord.value) return;

    const newWord = {
      list_id: props.id,
      langInWord: newInWord.value,
      langOutWord: newOutWord.value,
    };
    const { data, error } = await supabase.from('words').insert([newWord]).select();

    if (error) {
      console.error('Error adding item:', error.message);
    } else {
      console.log(data);
      newInWord.value = '';
      newOutWord.value = '';
      words.value = await userStore.getUserList(props.id);
    }
  }
</script>

<template>
  <div>
    <p-button size="small" label="Back" @click="router.push('/secret')" icon="pi pi-arrow-left" />
    <p-input-text type="text" v-model="newInWord" />
    <p-input-text type="text" v-model="newOutWord" />
    <p-button size="small" label="Add word" @click="addWord" icon="pi pi-plus-circle" />

    <p-data-table :value="words" tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">Words</span>
          <div class="flex flex-row items-center gap-2">
            <p-button size="small" icon="pi pi-sort-alt" rounded raised />
            <p-button size="small" icon="pi pi-filter" rounded raised />
            <p-button size="small" icon="pi pi-plus" rounded raised />
          </div>
        </div>
      </template>
      <p-column field="langOutWord" header="Word" />
      <p-column field="langInWord" header="Translation" />
      <p-column field="created_at" header="Created" />
      <p-column header="Category">
        <template #body="slotProps">
          <p-tag :value="slotProps.data.category" rounded />
        </template>
      </p-column>
      <p-column header="Tags">
        <template #body="slotProps"
          ><p-tag v-for="tag in slotProps.data.tags" :value="tag" rounded
        /></template>
      </p-column>
    </p-data-table>
  </div>
</template>
