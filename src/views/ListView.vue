<script lang="ts" setup>
  import { onMounted, type Ref } from 'vue';
  import { useUserStore } from '../stores/userStore';
  import { ref } from 'vue';
  import PButton from 'primevue/button';
  import PInputText from 'primevue/inputtext';
  import { useRouter } from 'vue-router';
  import { supabase } from '../clients/supabase';
  import PToolbar from 'primevue/toolbar';
  import PDataTable from 'primevue/datatable';
  import PColumn from 'primevue/column';
  import PTag from 'primevue/tag';
  import type { LexicCategory, Tag, Word } from '../types';
  import AddWordComponent from '../components/AddWord.vue';

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

  async function addWord(partialWord: {
    langOutWord: string;
    langInWord: string;
    category?: LexicCategory;
    tags: Tag[];
  }) {
    // TODO: Handle this better
    if (!partialWord.langInWord || !partialWord.langOutWord) return;

    const newWord = {
      list_id: props.id,
      langInWord: partialWord.langInWord,
      langOutWord: partialWord.langOutWord,
      category: partialWord.category,
      tags: partialWord.tags,
    };
    const { data: _, error } = await supabase.from('words').insert([newWord]).select();

    if (error) {
      console.error('Error adding item:', error.message);
    } else {
      words.value = await userStore.getUserList(props.id);
    }
  }

  async function removeWord(wordId: string) {
    const { error } = await supabase.from('words').delete().eq('id', wordId);

    if (error) {
      console.error('Error deleting word:', error.message);
    } else {
      console.log('Word deleted successfully');
      words.value = await userStore.getUserList(props.id);
    }
  }

  // `null` = no word being edited
  const editingWord: Ref<Word | null> = ref(null);

  function editWord(word: Word) {
    console.log(word);
    editingWord.value = word;
  }

  async function updateWord() {
    const { error } = await supabase
      .from('words')
      .update(editingWord.value)
      .eq('id', editingWord.value?.id);

    if (error) {
      console.error('Error updating word:', error.message);
    } else {
      console.log('Word updated successfully');
      editingWord.value = null;
    }
  }

  async function cancelEdit() {
    editingWord.value = null;
  }

  const showAddWord = ref(false);
  function toggleAddWord() {
    showAddWord.value = !showAddWord.value;
  }
</script>

<template>
  <div class="overflow-auto">
    <p-button size="small" label="Back" @click="router.push('/secret')" icon="pi pi-arrow-left" />

    <p-toolbar>
      <template #start>
        <p-button
          size="small"
          icon="pi pi-sort-alt"
          rounded
          class="mr-2"
          severity="secondary"
          text
        />
        <p-button size="small" icon="pi pi-filter" rounded class="mr-2" severity="secondary" text />
        <p-button
          size="small"
          :icon="showAddWord ? 'pi pi-minus' : 'pi pi-plus'"
          rounded
          class="mr-2"
          severity="secondary"
          :text="!showAddWord"
          @click="toggleAddWord"
        />
      </template>
    </p-toolbar>

    <transition name="slide-fade">
      <add-word-component v-if="showAddWord" @add-word="addWord" />
    </transition>

    <p-data-table :value="words" tableStyle="min-width: 50rem; overflow: auto">
      <p-column header="Word">
        <template #body="slotProps">
          <div class="w-40">
            <p-input-text
              v-if="editingWord && slotProps.data.id === editingWord.id"
              type="text"
              v-model="editingWord.langOutWord"
              v-keyfilter.alphanum
              size="small"
              fluid
              :invalid="editingWord.langOutWord === ''"
            />
            <p v-else>{{ slotProps.data.langOutWord }}</p>
          </div>
        </template>
      </p-column>
      <p-column header="Translation">
        <template #body="slotProps">
          <div class="w-40">
            <p-input-text
              v-if="editingWord && slotProps.data.id === editingWord.id"
              type="text"
              v-model="editingWord.langInWord"
              v-keyfilter.alphanum
              size="small"
              fluid
              :invalid="editingWord.langInWord === ''"
            />
            <p v-else>{{ slotProps.data.langInWord }}</p>
          </div>
        </template>
      </p-column>
      <p-column header="Created">
        <template #body="slotProps">
          <p>{{ new Date(slotProps.data.created_at).toLocaleDateString() }}</p>
        </template>
      </p-column>
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
      <p-column>
        <template #body="slotProps">
          <div class="min-w-[200px]">
            <div
              class="flex flex-row gap-2"
              v-if="editingWord && editingWord.id === slotProps.data.id"
            >
              <p-button
                rounded
                severity="secondary"
                size="small"
                icon="pi pi-trash"
                @click="removeWord(slotProps.data.id)"
              />
              <p-button
                rounded
                severity="secondary"
                size="small"
                icon="pi pi-check"
                @click="updateWord"
              />
              <p-button
                rounded
                severity="secondary"
                size="small"
                icon="pi pi-times"
                @click="cancelEdit"
              />
            </div>
            <p-button
              rounded
              severity="secondary"
              v-else
              size="small"
              icon="pi pi-pencil"
              @click="editWord(slotProps.data)"
            />
          </div>
        </template>
      </p-column>
    </p-data-table>
  </div>
</template>

<style scoped>
  /* transition for the expanding form */
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.3s ease;
  }
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
  }
</style>
