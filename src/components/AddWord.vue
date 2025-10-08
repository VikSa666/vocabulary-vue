<script lang="ts" setup>
  import PPanel from 'primevue/panel';
  import PButton from 'primevue/button';
  import PMessage from 'primevue/message';
  import PInputText from 'primevue/inputtext';
  import PMultiSelect from 'primevue/multiselect';
  import PSelect from 'primevue/select';
  import PTag from 'primevue/tag';
  import { ref, type Ref } from 'vue';
  import { lexicCategories, type LexicCategory } from '../types';

  const langOutWord = ref('');
  const langInWord = ref('');
  const category: Ref<LexicCategory | undefined> = ref();
  const tags: Ref<Tag[]> = ref([]);

  interface PartialWord {
    langOutWord: string;
    langInWord: string;
    category?: LexicCategory;
    tags: Tag[];
  }
  // TODO: obtain the languages to display
  // interface Props {
  //   learningLang: string;
  //   nativeLang: string;
  // }

  // const props = defineProps<Props>();

  // TODO: Fetch actual tags from table or user
  interface Tag {
    name: string;
    color: string;
  }
  const availableTags = ref([
    { name: 'basic', color: '#1234' },
    { name: 'asdf', color: '#1234' },
    { name: 'fdsa', color: '#1234' },
  ]);

  // TODO: Fetch actual categories from table or user
  const availableCategories = lexicCategories;

  const emit = defineEmits<{
    (e: 'add-word', args: PartialWord): void;
  }>();

  function addWord() {
    emit('add-word', {
      langOutWord: langOutWord.value,
      langInWord: langInWord.value,
      category: category.value,
      tags: tags.value,
    });
  }
</script>

<template>
  <p-panel header="Add a new word">
    <div class="flex flex-col gap-2 items-start">
      <div class="flex flex-row gap-2 flex-wrap">
        <div class="flex flex-col gap-2 w-[20%] min-w-40">
          <p-input-text v-model="langOutWord" placeholder="Word" />
          <p-message size="small" severity="secondary" variant="simple"
            >Enter the word in the language you are learning.</p-message
          >
        </div>

        <div class="flex flex-col gap-2 w-[20%] min-w-40">
          <p-input-text v-model="langInWord" placeholder="Translation" />
          <p-message size="small" severity="secondary" variant="simple"
            >Enter the word in your native language.</p-message
          >
        </div>

        <div class="flex flex-col gap-2 w-[20%] min-w-40">
          <p-select v-model="category" :options="availableCategories" placeholder="Category" />
          <p-message size="small" severity="secondary" variant="simple"
            >Select the grammatical category.</p-message
          >
        </div>

        <div class="flex flex-col gap-2 w-[20%] min-w-40">
          <p-multi-select
            v-model="tags"
            :options="availableTags"
            optionLabel="name"
            filter
            placeholder="Select Tags"
            display="chip"
            class="min-w-40 w-full"
            showClear
            checkmark
          >
            <template #option="slotProps">
              <div class="flex items-center">
                <!-- Todo! Colors!! -->
                <p-tag :value="slotProps.option.name" rounded />
              </div>
            </template>
            <template #dropdownicon>
              <i class="pi pi-tags" />
            </template>
            <template #filtericon>
              <i class="pi pi-search" />
            </template>
            <template #header>
              <!-- TODO: Fix this title -->
              <div class="font-medium px-3 py-2">Available Tags</div>
            </template>
            <template #footer>
              <div class="p-3 flex justify-between">
                <p-button
                  label="Add New"
                  severity="secondary"
                  variant="text"
                  size="small"
                  icon="pi pi-plus"
                />
              </div>
            </template>
          </p-multi-select>
          <p-message size="small" severity="secondary" variant="simple"
            >Select or create tags.</p-message
          >
        </div>
      </div>
      <p-button size="small" @click="addWord" label="Add" />
    </div>
  </p-panel>
</template>
