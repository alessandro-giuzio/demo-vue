import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const title = ref('My Counter Title')
  const doubleCount = computed(() => count.value * 2)
  function increment(amount) {
    count.value += amount
  }
  function decres(amount){
    count.value -= amount
  }

  function oddOrEven(){
    if(count.value % 2 === 0){
      return 'even'
    }else{
      return 'odd'
    }
  }
  return { count, doubleCount, increment, title, decres, oddOrEven}
})



