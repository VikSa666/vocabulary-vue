<template>
  <h1>Hello World</h1>
  <div>
    <div v-for="(dictionary, cathegory) in myJson">
      <p>{{ cathegory }}</p>
      <div v-for="(russian, english) in dictionary">
        <input type="text" @input="readWord" @keyup.enter="confirmAnswer(russian)">
        <button>Check</button>
        <div>Your answer was {{ confirmedAnswer }} and the actual answer was {{ english }}. Therefore, you are
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
      confirmedAnswer: '',
    }
  },
  methods: {
    readWord(event: any) {
      this.answer = event.target.value;

    },
    confirmAnswer(russian: string) {
      this.confirmedAnswer = this.answer
      this.correct = this.confirmedAnswer === russian
    }
  }
}

</script>

<style scoped>

</style>
