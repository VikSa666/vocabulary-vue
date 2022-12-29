<template>
  <h1>Hello World</h1>
  <div>
    <div v-for="(value, key) in myJson">
      <div v-for="(english, russian) in value">KEY: {{ key }} VALUE: english {{ english }} russian {{ russian }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import json from './assets/vocab.json'
export default {
  data() {
    return {
      myJson: json
    }
  }
}

</script>

<style scoped>

</style>
