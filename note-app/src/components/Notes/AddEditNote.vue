<template>
  <div class="card p-4 mb-5 mt-6" :class="`has-background-${bgColor}-dark`">
    <label v-if="label" class="label has-text-white"> {{ label }} </label>
    <div class="field">
      <div class="control">
        <textarea
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          class="textarea"
          :placeholder="placeholder"
          ref="textareaRef"
          max-length="100"
          v-autofocus
        />
      </div>
    </div>

    <div class="field is-grouped is-grouped-right">
      <div class="control">
        <slot name="buttons" />
      </div>
    </div>
  </div>
</template>
<script setup>
/* imports */
import { ref } from 'vue'
import { vAutofocus } from '@/directives/vAutofocus'

/* props */
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
    default: ''
  },
  bgColor: {
    type: String,
    default: 'success'
  },
  placeholder: {
    type: String,
    default: 'Add a new note'
  },
  label: {
    type: String
  }
})

/* emits */
const emit = defineEmits(['update:modelValue'])

const textareaRef = ref(null)

/* focus textarea */
const focusTextarea = () => {
  textareaRef.value.focus()
}

defineExpose({
  focusTextarea
})
</script>
