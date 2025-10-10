<script lang="ts" setup>
  import PButton from 'primevue/button';
  import PInputText from 'primevue/inputtext';
  import { ref } from 'vue';
  import { useUserStore } from '../stores/userStore';
  import type { Ref } from 'vue';
  import type { Tag } from '../types';
  import { supabase } from '../clients/supabase';

  const userStore = useUserStore();

  const addingNewTag = ref(false);
  const newTag: Ref<string | null> = ref(null);

  const props = defineProps<{
    listId: string;
  }>();

  const emit = defineEmits<{
    (e: 'tag-added'): void;
  }>();

  async function addNewTag() {
    const tag: Tag = {
      name: newTag.value ?? '',
      color: randomColor(),
    };

    const userListData = await userStore.getUserListData(props.listId);
    const currentTags: Tag[] = userListData?.tags ?? [];
    const updatedTags = [...currentTags, tag];
    const { data: _, error } = await supabase
      .from('lists')
      .update({ tags: updatedTags })
      .eq('id', props.listId)
      .select();
    if (error) {
      throw error;
    } else {
      emit('tag-added');
    }
  }

  function randomColor(): string {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }
</script>

<template>
  <div class="p-3 flex justify-between">
    <p-button
      v-if="!addingNewTag"
      label="Add New"
      severity="secondary"
      variant="text"
      size="small"
      icon="pi pi-plus"
      @click="addingNewTag = true"
    />
    <div v-else class="flex flex-row justify-around w-full">
      <p-input-text v-model="newTag" size="small" />
      <p-button icon="pi pi-plus" @click="addNewTag" size="small" rounded />
    </div>
  </div>
</template>
