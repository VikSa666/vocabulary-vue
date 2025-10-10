<script lang="ts" setup>
  import type { Tag } from '../types';

  defineProps<{
    tag: Tag;
  }>();
</script>

<template>
  <span
    class="tag"
    :style="{
      backgroundColor: tag.color + '20',
      borderColor: tag.color,
      color: tag.color,
    }"
  >
    {{ tag.name }}
  </span>
</template>

<style scoped>
  .tag {
    display: inline-block;
    height: fit-content;
    padding: 0.05rem 0.6rem;
    border-radius: 9999px;
    border: 1px solid transparent;
    font-size: 0.85rem;
    font-weight: 500;
    user-select: none;
  }
</style>
