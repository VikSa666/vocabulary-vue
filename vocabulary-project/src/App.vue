<template>
  <h1>Hello World</h1>
  <div>
    <div v-for="(dictionary, cathegory) in myJson">
      <p>{{ cathegory }}</p>
      <div v-for="(russian, english) in dictionary">
        <form @submit.prevent="submitWord">
          <input type="text" @input="readWord($event, russian)">
        </form>

        <div v-if="submitted">Your answer was {{ answer }} and the actual answer was {{ english }}. Therefore, you are
          {{ correct }}.
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import json from './assets/vocab.json'
export default {
  data() {
    return {
      myJson: json,
      correct: false,
      answer: '',
      submitted: false,
    }
  },
  methods: {
    readWord(event: any, russian: string) {
      this.answer = event.target.value;
      this.correct = this.answer === russian
    },
    submitWord(event: any) {
      this.submitted = true;
    }
  }
}

</script>

<style scoped>

</style>
