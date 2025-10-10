<script lang="ts" setup>
  import PSelect from 'primevue/select';
  import { type Tag, lexicCategories, lexicCategoriesColors } from '../types';
  import PillTag from './PillTag.vue';

  const category = defineModel<string>();

  function getCategoryTag(category: string): Tag {
    return (
      lexicCategoriesColors.find((c) => c.name === category) ?? { name: category, color: '#000000' }
    );
  }
</script>

<template>
  <p-select v-model="category" :options="lexicCategories" placeholder="Category">
    <template #option="slotProps">
      <pill-tag :tag="getCategoryTag(slotProps.option)" />
    </template>
  </p-select>
</template>
