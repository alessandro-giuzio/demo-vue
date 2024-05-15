import { watch } from 'vue'

export function useWatchCharacters( valueToWatch, maxChars = 100 ){
/* watch characters*/
watch(valueToWatch, (newValue) => {
  if (newValue.length > maxChars) {
    alert(`You have reached the maximum number (${maxChars}) of characters allowed for this field.`)
  }
})
}