<template>
  <div class="home">
    <h1 ref="appTitleRef">{{ appTitle }}</h1>
    <h3>{{ counter.title }}</h3>
    <div>
      <button @click="counter.decres(1)" class="btn">-</button>
      <button @click="counter.decres(2)" class="btn">--</button>
      <span class="counter">{{ counter.count }}</span>
      <button @click="counter.increment(1)" class="btn">+</button>
      <button @click="counter.increment(2)" class="btn">++</button>
    </div>
    <p>This counter is: {{ counter.oddOrEven() }}</p>
    <div class="edit">
      <h4>Edit counter title:</h4>
      <input v-autofocus v-model="counter.title" type="text" />
    </div>
  </div>
</template>
<!-- Composition API New Script Setup -->
<script setup>
import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter'

const appTitle = 'Vue 3 App'
const appTitleRef = ref(null)
/* const counter = ref(0),
  counterTitle = ref('My Counter') */

/* Custom Directives */
const vAutoFocus = {
  mounted: (el) => {
    el.focus()
  }
}

const counter = useCounterStore()
</script>

<!-- Composition API -->
<!-- <script>
import { ref } from 'vue'
export default {
  setup() {
    const counter = ref(0)

    const increaseCounter = () => {
      counter.value++
    }
    const decreaseCounter = () => {
      counter.value--
    }

    return {
      counter,
      increaseCounter,
      decreaseCounter
    }
  }
}
</script> -->

<!-- Options API -->
<!-- <script>
export default {
  data() {
    return {
      counter: 0
    }
  },
  methods: {
    increaseCounter() {
      this.counter++
    },
    decreaseCounter() {
      this.counter--
    }
  }
}
</script> -->
<style>
.home {
  text-align: center;
  padding: 20px;
}
.btn,
.couonter {
  font-size: 2.25rem;
  margin: 10px;
}
.edit {
  margin-top: 60px;
}
</style>
