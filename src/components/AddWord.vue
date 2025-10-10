<script lang="ts" setup>
  import PPanel from 'primevue/panel';
  import PButton from 'primevue/button';
  import PMessage from 'primevue/message';
  import PInputText from 'primevue/inputtext';
  import PMultiSelect from 'primevue/multiselect';
  import PillTag from './PillTag.vue';
  import AddTag from './AddTag.vue';
  import CategorySelector from './CategorySelector.vue';
  import { onMounted, ref, type Ref } from 'vue';
  import { type LexicCategory, type Tag } from '../types';
  import { useUserStore } from '../stores/userStore';
  import { supabase } from '../clients/supabase';

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

  const userStore = useUserStore();

  interface Props {
    listId: string;
  }

  const props = defineProps<Props>();

  const availableTags: Ref<Tag[]> = ref([]);
  onMounted(() => {
    userStore.getUserListData(props.listId).then((promise) => {
      availableTags.value = promise?.tags ?? [];
    });
  });

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

  // TODO: Abstract to generic
  async function updateTagList() {
    const updatedList = await userStore.getUserListData(props.listId);
    if (updatedList) {
      availableTags.value = updatedList.tags;
    }
  }

  async function removeTag(tag: Tag) {
    const updatedTags = availableTags.value.filter((t) => t !== tag);
    const { error } = await supabase
      .from('lists')
      .update({ tags: updatedTags })
      .eq('id', props.listId);
    if (error) throw error;
    console.info(`Removed tag ${tag.name}`);
    userStore
      .getUserListData(props.listId)
      .then((promise) => (availableTags.value = promise?.tags ?? []));
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
          <category-selector v-model="category" />
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
              <div class="flex justify-between items-center w-full">
                <pill-tag
                  :tag="{ name: slotProps.option.name, color: slotProps.option.color }"
                  rounded
                />
                <p-button
                  size="small"
                  icon="pi pi-trash"
                  severity="secondary"
                  text
                  rounded
                  @click.stop="removeTag(slotProps.option)"
                />
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
              <add-tag :list-id="props.listId" @tag-added="updateTagList" />
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
