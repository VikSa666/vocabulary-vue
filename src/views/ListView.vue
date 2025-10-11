<script lang="ts" setup>
  import { onMounted, watch, type Ref } from 'vue';
  import { useUserStore } from '../stores/userStore';
  import { ref } from 'vue';
  import PButton from 'primevue/button';
  import PInputText from 'primevue/inputtext';
  import PInputIcon from 'primevue/inputicon';
  import PIconField from 'primevue/iconfield';
  import PMessage from 'primevue/message';
  import { useRouter } from 'vue-router';
  import { supabase } from '../clients/supabase';
  import PToolbar from 'primevue/toolbar';
  import PDataTable from 'primevue/datatable';
  import PColumn from 'primevue/column';
  import PMultiSelect from 'primevue/multiselect';
  import PillTag from '../components/PillTag.vue';
  import CategorySelector from '../components/CategorySelector.vue';
  import { lexicCategoriesColors, type LexicCategory, type Tag, type Word } from '../types';
  import AddWordComponent from '../components/AddWord.vue';
  import AddTag from '../components/AddTag.vue';
  import FilterBy from '../components/FilterBy.vue';

  const userStore = useUserStore();
  const router = useRouter();

  interface Props {
    id: string;
  }

  const props = defineProps<Props>();

  const words = ref<Word[]>();

  const filteredCategory = ref<LexicCategory | undefined>(undefined);
  const filteredTags = ref<Tag[] | undefined>(undefined);
  const searchText = ref<string | undefined>(undefined);

  onMounted(() => {
    userStore
      .getUserListFilteredWords(
        props.id,
        filteredCategory.value,
        filteredTags.value,
        searchText.value
      )
      .then((promise) => (words.value = promise));
  });

  async function addWord(partialWord: {
    langOutWord: string;
    langInWord: string;
    category?: LexicCategory;
    tags: Tag[];
    additionalInfo?: string;
  }) {
    // TODO: Handle this better
    if (!partialWord.langInWord || !partialWord.langOutWord) return;

    const newWord = {
      list_id: props.id,
      langInWord: partialWord.langInWord,
      langOutWord: partialWord.langOutWord,
      category: partialWord.category,
      tags: partialWord.tags,
      additionalInfo: partialWord.additionalInfo,
    };
    const { data: _, error } = await supabase.from('words').insert([newWord]).select();

    if (error) {
      console.error('Error adding item:', error.message);
    } else {
      words.value = await userStore.getUserListFilteredWords(
        props.id,
        filteredCategory.value,
        filteredTags.value,
        searchText.value
      );
    }
  }

  async function removeWord(wordId: string) {
    const { error } = await supabase.from('words').delete().eq('id', wordId);

    if (error) {
      console.error('Error deleting word:', error.message);
    } else {
      console.info('Word deleted successfully');
      words.value = await userStore.getUserListFilteredWords(
        props.id,
        filteredCategory.value,
        filteredTags.value,
        searchText.value
      );
    }
  }

  // `null` = no word being edited
  const editingWord: Ref<Word | null> = ref(null);

  function editWord(word: Word) {
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
      console.info('Word updated successfully');
      editingWord.value = null;
    }
  }

  async function cancelEdit() {
    editingWord.value = null;
  }

  const showAddWord = ref(false);
  function toggleAddWord() {
    if (!showAddWord.value && showFilterBy.value) {
      showFilterBy.value = false;
    }
    showAddWord.value = !showAddWord.value;
  }

  // TODO: Take to generic module
  function getCategoryTag(category: string): Tag {
    return (
      lexicCategoriesColors.find((c) => c.name === category) ?? { name: category, color: '#000000' }
    );
  }

  const availableTags: Ref<Tag[]> = ref([]);
  onMounted(() => {
    userStore.getUserListData(props.id).then((promise) => {
      availableTags.value = promise?.tags ?? [];
    });
  });

  // TODO: Abstract to more generic
  async function updateTagList() {
    const updatedList = await userStore.getUserListData(props.id);
    if (updatedList) {
      availableTags.value = updatedList.tags;
    }
  }

  async function removeTag(tag: Tag) {
    const updatedTags = availableTags.value.filter((t) => t !== tag);
    const { error } = await supabase.from('lists').update({ tags: updatedTags }).eq('id', props.id);
    if (error) throw error;
    console.info(`Removed tag ${tag.name}`);
    userStore
      .getUserListData(props.id)
      .then((promise) => (availableTags.value = promise?.tags ?? []));
  }

  const showFilterBy = ref(false);
  function toggleFilterBy() {
    if (!showFilterBy.value && showAddWord.value) {
      showAddWord.value = false;
    }
    showFilterBy.value = !showFilterBy.value;
  }

  watch(
    () => [filteredCategory.value, filteredTags.value, searchText.value],
    async () => {
      words.value = await userStore.getUserListFilteredWords(
        props.id,
        filteredCategory.value,
        filteredTags.value,
        searchText.value
      );
    }
  );
</script>

<template>
  <div class="overflow-auto">
    <p-toolbar>
      <template #start>
        <div class="flex flex-row gap-2">
          <p-button
            size="small"
            label="Back"
            @click="router.push('/secret')"
            icon="pi pi-arrow-left"
          />
          <p-message
            v-if="filteredCategory || filteredTags"
            severity="secondary"
            size="small"
            variant="simple"
            icon="pi pi-exclamation-circle"
            >Filters applied</p-message
          >
        </div>
      </template>
      <template #center>
        <div class="flex flex-row gap-2">
          <p-icon-field>
            <p-input-icon>
              <i class="pi pi-search" />
            </p-input-icon>
            <p-input-text size="small" placeholder="Search" v-model="searchText" />
          </p-icon-field>
          <p-button
            size="small"
            icon="pi pi-filter"
            rounded
            class="mr-2"
            :severity="filteredCategory || filteredTags ? 'primary' : 'secondary'"
            :text="!showFilterBy && !filteredCategory && !filteredTags"
            @click="toggleFilterBy"
          />
        </div>
      </template>
      <template #end>
        <div class="flex flex-row gap-2">
          <p-button
            size="small"
            :icon="showAddWord ? 'pi pi-minus' : 'pi pi-plus'"
            label="Create word"
            rounded
            class="mr-2"
            severity="secondary"
            :text="!showAddWord"
            @click="toggleAddWord"
          />
          <p-button
            size="small"
            label="Start exam"
            @click="router.push('/exam')"
            icon="pi pi-arrow-right"
            icon-pos="right"
          />
        </div>
      </template>
    </p-toolbar>

    <transition name="slide-fade">
      <add-word-component v-if="showAddWord" @add-word="addWord" :list-id="props.id" />
    </transition>

    <transition name="slide-fade">
      <filter-by
        v-if="showFilterBy"
        :available-tags="availableTags"
        v-model:category="filteredCategory"
        v-model:tags="filteredTags"
      />
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
          <div class="w-40">
            <category-selector
              v-if="editingWord && editingWord.id === slotProps.data.id"
              v-model="editingWord.category"
            />
            <pill-tag v-else :tag="getCategoryTag(slotProps.data.category)" rounded />
          </div>
        </template>
      </p-column>
      <p-column header="Tags">
        <template #body="slotProps"
          ><p-multi-select
            v-if="editingWord && editingWord.id === slotProps.data.id"
            v-model="editingWord.tags"
            :options="availableTags"
            optionLabel="name"
            filter
            placeholder="Select Tags"
            display="chip"
            class="min-w-40 w-full"
            showClear
            checkmark
            size="small"
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
              <add-tag :list-id="props.id" @tag-added="updateTagList" />
            </template>
          </p-multi-select>
          <div v-else class="flex flex-row gap-2 flex-wrap">
            <pill-tag v-for="tag in slotProps.data.tags" :tag="tag" rounded />
          </div>
        </template>
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
