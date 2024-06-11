<script setup>
import CoffeePlan from '@/components/CoffeePlan.vue'
import PlanPicker from '@/components/PlanPicker.vue'
import FancyButton from '@/components/FancyButton.vue'
</script>

<template>
  <main>
    <div class="content">
      <h1 class="title">Coffee Plans</h1>
      <PlanPicker />
      <h2 class="subtitle">
        We travel the world to source the very best single origin coffee for you
      </h2>

      <div class="content">
        <FancyButton>
          <template #icon>☕️</template>
          Submit
        </FancyButton>
      </div>
    </div>
  </main>
</template>
