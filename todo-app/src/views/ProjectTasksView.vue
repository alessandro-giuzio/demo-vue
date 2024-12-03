<template>
  <div class="project-tasks" v-if="loggedInUser">
    <h1>{{ project?.name }} - Tasks</h1>
    <div>
      <form @submit.prevent="createTask">
        <div class="field">
          <label for="taskTitle">Task Title</label>
          <input type="text" v-model="newTaskTitle" id="taskTitle" class="input" required />
        </div>
        <div class="field">
          <label for="taskDescription">Description</label>
          <textarea
            v-model="newTaskDescription"
            id="taskDescription"
            class="textarea"
            required
          ></textarea>
        </div>
        <button type="submit" class="button">Create Task</button>
      </form>
    </div>
    <div v-if="tasks.length > 0">
      <ul>
        <li v-for="task in tasks" :key="task.id">{{ task.title }}</li>
      </ul>
    </div>
    <p v-else>No tasks found.</p>
  </div>
  <p v-else class="error">You must be logged in to view tasks.</p>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Define props
const props = defineProps<{
  loggedInUser: User | null
}>()

// Define the Task Type
type Task = {
  id: string
  title: string
  description: string
  projectId: string
}

// Define the Project Type
type Project = {
  id: string
  name: string
  description: string
  members: string[] // Array of user IDs
}

// Define User Type
type User = {
  id: string
  name: string
  email: string
  password: string
}

// Reactive arrays for tasks and project
const tasks = ref<Task[]>([])
const project = ref<Project | null>(null)
const newTaskTitle = ref('')
const newTaskDescription = ref('')

// LocalStorage Keys
const TASKS_Key = 'tasks'
const PROJECTS_Key = 'projects'

// Load tasks from localStorage
const loadTasks = () => {
  const tasksFromStorage = localStorage.getItem(TASKS_Key)
  if (tasksFromStorage) {
    tasks.value = JSON.parse(tasksFromStorage).filter(
      (task: Task) => task.projectId === route.params.id
    )
  }
}

// Load project from localStorage
const loadProject = () => {
  const projectsFromStorage = localStorage.getItem(PROJECTS_Key)
  if (projectsFromStorage) {
    project.value =
      JSON.parse(projectsFromStorage).find((proj: Project) => proj.id === route.params.id) || null
  }
}

// Save tasks to localStorage
const saveTasks = () => {
  localStorage.setItem(TASKS_Key, JSON.stringify(tasks.value))
}

// Create a new task
const createTask = () => {
  const newTask: Task = {
    id: crypto.randomUUID(),
    title: newTaskTitle.value,
    description: newTaskDescription.value,
    projectId: route.params.id as string
  }
  tasks.value.push(newTask)
  saveTasks()
  newTaskTitle.value = ''
  newTaskDescription.value = ''
}

// Get the current route
const route = useRoute()

// Call the functions to load tasks and project on component mount
onMounted(() => {
  loadTasks()
  loadProject()
})
</script>

<style>
.project-tasks {
  padding: 1rem;
}

.field {
  margin-bottom: 1rem;
}

.input,
.textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-sizing: border-box;
  font-size: 1rem;
}

.button {
  background-color: #38a169; /* Success color */
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #2f855a;
}

.error {
  color: red;
}
</style>
