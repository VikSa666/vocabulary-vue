<script lang="ts" setup>
  import PPanel from 'primevue/panel';
  import PButton from 'primevue/button';
  import PMessage from 'primevue/message';
  import PMultiSelect from 'primevue/multiselect';
  import CategorySelector from './CategorySelector.vue';
  import PillTag from './PillTag.vue';
  import { type LexicCategory, type Tag } from '../types';
  import type { Ref } from 'vue';
  import { ref } from 'vue';

  //   const emit = defineEmits<{
  //     (e: 'filter', args: { category?: LexicCategory; tags?: Tag[] }): void;
  //   }>();

  const category = defineModel<LexicCategory | undefined>('category');
  const tags = defineModel<Tag[] | undefined>('tags');

  const props = defineProps<{
    availableTags: Tag[];
  }>();

  const selectedCategory: Ref<LexicCategory | undefined> = ref(category.value);
  const selectedTags: Ref<Tag[] | undefined> = ref(tags.value);

  // TODO: Take to generic module

  function applyFilters() {
    category.value = selectedCategory.value;
    tags.value = selectedTags.value;
  }

  function clearFilters() {
    selectedCategory.value = undefined;
    selectedTags.value = undefined;
  }
</script>

<template>
  <p-panel header="Filter">
    <div class="flex flex-col gap-2 items-start">
      <div class="flex flex-row gap-2 flex-wrap">
        <div class="flex flex-col gap-2 min-w-40">
          <category-selector v-model="selectedCategory" />
          <p-message size="small" severity="secondary" variant="simple"
            >Select the grammatical category.</p-message
          >
        </div>

        <div class="flex flex-col gap-2 min-w-40">
          <p-multi-select
            v-model="selectedTags"
            :options="props.availableTags"
            placeholder="Tags"
            optionLabel="name"
            filter
            display="chip"
            class="min-w-40 w-full"
            showClear
            checkmark
          >
            <template #option="slotProps">
              <pill-tag
                :tag="{ name: slotProps.option.name, color: slotProps.option.color }"
                rounded
              />
            </template>
          </p-multi-select>
          <p-message size="small" severity="secondary" variant="simple">Select the tags.</p-message>
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <p-button
          size="small"
          @click="applyFilters"
          label="Apply filters"
          :disabled="selectedCategory === category && selectedTags === tags"
        />
        <p-button
          size="small"
          @click="clearFilters"
          label="Clear filters"
          :disabled="!selectedCategory && !selectedTags"
        />
      </div>
    </div>
  </p-panel>
</template>
