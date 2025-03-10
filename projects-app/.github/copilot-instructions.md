# 📌 Context

## 🎯 Instructions

- Use **JavaScript**, **Vue**, or **Astro** based on the context.
- Ensure the code follows **best practices** for the specified framework.
- Include necessary imports and configuration.
- Use **functional components** where possible.
- Include **type safety** where applicable (e.g., TypeScript for Vue or `defineProps` for Astro).
- Ensure **reusability** and **modularity**.
- If the component includes state or events, follow proper state management patterns.
- Use **composition API** for Vue where appropriate.
- Optimize for **performance** and **accessibility**.
- Add **comments** to explain complex logic.

---

## 🧩 Examples

### ✅ Example 1: Vue 3 Component (Composition API)

```vue
<template>
  <div>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<style scoped>
button {
  background-color: #42b983;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

---

### ✅ Example 2: Astro Component with Props

```astro
---
const { title, description } = Astro.props
---

<section>
  <h2>{title}</h2>
  <p>{description}</p>
</section>

<style>
h2 {
  color: #42b983;
}

p {
  font-size: 16px;
}
</style>
```

---

### ✅ Example 3: JavaScript Utility Function

```javascript
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
```

---

## 🚫 Constraints

- Do not use legacy Vue options API.
- Avoid inline styles unless necessary.
- Keep function and component names **descriptive** and **camelCase**.
- Avoid hardcoded values; use props or config instead.
- Code should follow **DRY (Don't Repeat Yourself)** and **KISS (Keep It Simple, Stupid)** principles.

---

## Styling

Use Tailwindcss for styling

## Accessibility

- Make sure the component is accessible and keyboard
- Provide the [aria-label] attribute for the elements

## 💡 Tips for Better Results

- Be specific about the desired output (e.g., "Generate a Vue component for a login form").
- Include the expected structure and props.
- If you want a specific style (e.g., Tailwind), mention it explicitly.
- Specify any accessibility requirements (e.g., "Make sure the button is keyboard-accessible").

---
