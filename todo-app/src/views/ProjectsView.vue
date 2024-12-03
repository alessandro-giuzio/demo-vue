<template>
  <div class="projects" v-if="loggedInUser">
    <h1>Projects</h1>
    <div>
      <form @submit.prevent="createProject">
        <div class="field">
          <label for="projectName">Project Name</label>
          <input type="text" v-model="newProjectName" id="projectName" class="input" required />
        </div>
        <div class="field">
          <label for="projectDescription">Description</label>
          <textarea
            v-model="newProjectDescription"
            id="projectDescription"
            class="textarea"
            required
          ></textarea>
        </div>
        <div class="field">
          <label>Members</label>
          <MultiSelect :options="users" v-model="selectedMembers" label="name" />
        </div>
        <button type="submit" class="button">Create Project</button>
      </form>
    </div>
    <div v-if="projects.length > 0">
      <ul>
        <li v-for="project in userProjects" :key="project.id">
          <router-link :to="{ name: 'project-tasks', params: { id: project.id } }">{{
            project.name
          }}</router-link>
          <button @click="editProject(project)">Edit</button>
        </li>
      </ul>
    </div>
    <p v-else>No projects found.</p>
  </div>
  <p v-else class="error">You must be logged in to view projects.</p>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import MultiSelect from '@/components/note/MultiSelect.vue'

// Define props
const props = defineProps<{
  users: User[]
  loggedInUser: User | null
}>()

// Define the Project Type
type Project = {
  id: string
  name: string
  description: string
  members: string[] // Array of user IDs
  userId: string // ID of the user who created the project
}

// Define User Type
type User = {
  id: string
  name: string
  email: string
  password: string
}

// Reactive arrays for projects and users
const projects = ref<Project[]>([])
const users = ref<User[]>(props.users) // Initialize users with the prop value
const loggedInUser = ref(props.loggedInUser)
const newProjectName = ref('')
const newProjectDescription = ref('')
const selectedMembers = ref<string[]>([])

// LocalStorage Keys
const PROJECTS_Key = 'projects'

// Load projects from localStorage
const loadProjects = () => {
  const projectsFromStorage = localStorage.getItem(PROJECTS_Key)
  if (projectsFromStorage) {
    projects.value = JSON.parse(projectsFromStorage)
  }
}

// Save projects to localStorage
const saveProjects = () => {
  localStorage.setItem(PROJECTS_Key, JSON.stringify(projects.value))
}

// Create a new project
const createProject = () => {
  if (!loggedInUser.value) return

  const newProject: Project = {
    id: crypto.randomUUID(),
    name: newProjectName.value,
    description: newProjectDescription.value,
    members: selectedMembers.value,
    userId: loggedInUser.value.id // Associate the project with the logged-in user
  }
  projects.value.push(newProject)
  saveProjects()
  newProjectName.value = ''
  newProjectDescription.value = ''
  selectedMembers.value = []
}

// Edit an existing project
const editProject = (project: Project) => {
  newProjectName.value = project.name
  newProjectDescription.value = project.description
  selectedMembers.value = project.members
  // Remove the project from the list to update it
  projects.value = projects.value.filter((p) => p.id !== project.id)
}

// Filter projects to show only those created by the logged-in user
const userProjects = computed(() => {
  return projects.value.filter((project) => project.userId === loggedInUser.value?.id)
})

// Call the function to load projects on component mount
onMounted(() => {
  loadProjects()
})
</script>

<style>
.projects {
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
