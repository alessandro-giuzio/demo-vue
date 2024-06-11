<template>
  <div class="plans">
    {{ selectedCoffeePlan }}
    <CoffeePlan
      v-for="plan in plans"
      :key="plan"
      :name="plan"
      @selected="handleSelectCoffePlan"
      :selected="plan === seletecCoffeePlan"
    />
  </div>
</template>

<script setup>
import { ref} from 'vue'
import CoffeePlan from '@/components/CoffeePlan.vue'
const plans = ref(['The Single', 'The Addict', 'The Curios', 'The Hacker'])

const selectedCoffeePlan = ref()
function handleSelectCoffePlan(name) {
  selectedCoffeePlan.value = name
}
</script>
