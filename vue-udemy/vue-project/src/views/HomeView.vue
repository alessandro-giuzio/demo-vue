<template>
  <div class="home">
    <h1>{{ appTitle }}</h1>
    <h3>{{ counterData.title }}:</h3>
    <div>
      <button @click="decreaseCounter(1)" class="btn">-</button>
      <button @click="decreaseCounter(10)" class="btn">--</button>
      <span class="counter">{{ counterData.count }}</span>
      <button @click="increaseCounter(1)" class="btn">+</button>
      <button @click="increaseCounter(20)" class="btn">++</button>
    </div>
    <p>This counter is {{ oddOrEven }}</p>
    <div class="edit">
      <h4>Edit counter title:</h4>
      <input v-autofocus v-model="counterData.title" type="text" />
    </div>
  </div>
</template>
<!-- Composition API New Script Setup -->
<script setup>
import {
  reactive,
  computed,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  onUnmounted
} from 'vue'

const appTitle = 'Vue 3 App'
/* const counter = ref(0),
  counterTitle = ref('My Counter') */

/* Reactive Object */
const counterData = reactive({
  count: 1,
  title: 'My Counter1'
})

/* Watch */

watch(
  () => counterData.count,
  (newCount, oldCount) => {
    if (newCount === 20) {
      alert('Counter is 20')
    }
  }
)

/* Computed Property */
const oddOrEven = computed(() => {
  if (counterData.count % 2 === 0) return 'even'
  return 'odd'
})

const increaseCounter = (amount) => {
  counterData.count += amount
}
const decreaseCounter = (decrease) => {
  counterData.count -= decrease
}
/* Hooks */
onBeforeMount(() => {
  console.log('Before Mount')
})
onMounted(() => {
  console.log('Mounted')
})
onBeforeUnmount(() => {
  console.log('Before Unmount')
})
onUnmounted(() => {
  console.log('Unmounted')
})
/* Custom Directives */
const vAutoFocus = {
  mounted: (el) => {
    el.focus()
  }
}
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
