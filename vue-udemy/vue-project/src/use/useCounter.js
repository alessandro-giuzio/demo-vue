import {
  reactive,
  computed,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  nextTick
} from 'vue'

const counterData = reactive({
  count: 1,
  title: 'My Counter1'
})
export function useCounter(){
  /* Reactive Object */

/* Watch */

watch(
  () => counterData.count,
  (newCount) => {
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
  nextTick(() => {
    console.log('Counter updated')
  })
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

return {
  counterData,
  oddOrEven,
  increaseCounter,
  decreaseCounter
}
}