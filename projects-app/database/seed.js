/* eslint-env node */
import { faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SERVICE_ROLE_KEY)

const logErrorAndExit = (tableName, error) => {
  console.error(
    `An error occurred in table '${tableName}' with code ${error.code}: ${error.message}`
  )
  process.exit(1)
}

const logStep = (stepMessage) => {
  console.log(stepMessage)
}

const seedTaskStatus = async () => {
  logStep('Seeding task statuses...')

  const statuses = [
    { name: 'To Do', color: '#f87171', order_index: 1 },
    { name: 'In Progress', color: '#facc15', order_index: 2 },
    { name: 'Done', color: '#4ade80', order_index: 3 }
  ]

  const { data, error } = await supabase.from('task_status').insert(statuses).select('id')

  if (error) return logErrorAndExit('Task Status', error)

  logStep('Task statuses seeded successfully.')

  return data.map((status, index) => ({
    id: status.id,
    name: statuses[index].name
  }))
}

const seedProjects = async (numEntries, userIds) => {
  logStep('Seeding projects...')
  const projects = []
  const userProjects = []

  for (let i = 0; i < numEntries; i++) {
    const name = faker.lorem.words(3)
    const projectId = faker.string.uuid()

    const project = {
      id: projectId,
      owner_id: faker.helpers.arrayElement(userIds),
      name,
      description: faker.lorem.paragraph(),
      slug: name.toLocaleLowerCase().replace(/ /g, '-')
    }

    projects.push(project)

    userProjects.push({
      user_id: project.owner_id,
      project_id: projectId
    })
  }

  const { data: projectData, error: projectError } = await supabase.from('projects').insert(projects).select('id')
  if (projectError) return logErrorAndExit('Projects', projectError)

  const { error: userProjectError } = await supabase.from('user_projects').insert(userProjects).select('id')
  if (userProjectError) return logErrorAndExit('User Projects', userProjectError)

  logStep('Projects and User Projects seeded successfully.')

  return projectData
}

const seedTasks = async (numEntries, projectIds, userIds, statusIds) => {
  logStep('Seeding tasks...')
  const tasks = []

  for (let i = 0; i < numEntries; i++) {
    tasks.push({
      id: faker.string.uuid(),
      name: faker.lorem.words(3),
      status_id: faker.helpers.arrayElement(statusIds), // 👈 updated
      description: faker.lorem.paragraph(),
      project_id: faker.helpers.arrayElement(projectIds),
      owner_id: faker.helpers.arrayElement(userIds),
      tags: faker.helpers.arrayElements(['tag1', 'tag2', 'tag3']),
      assigned_to: faker.helpers.arrayElement(userIds),
      collaborators: faker.helpers.arrayElements([1, 2, 3])
    })
  }

  const { data, error } = await supabase.from('tasks').insert(tasks).select('id')

  if (error) return logErrorAndExit('Tasks', error)

  logStep('Tasks seeded successfully.')

  return data
}

const seedUsers = async (numEntries) => {
  logStep('Seeding users...')
  const users = []

  for (let i = 0; i < numEntries; i++) {
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: faker.internet.email(),
      password: faker.internet.password()
    })

    if (authError) return logErrorAndExit('Auth Users', authError)

    users.push({
      id: authUser.user.id,
      username: faker.internet.userName(),
      created_at: faker.date.past(),
      email: authUser.user.email,
      password: faker.internet.password(),
      full_name: faker.name.fullName()
    })
  }

  const { data, error } = await supabase.from('users').insert(users).select('id')

  if (error) return logErrorAndExit('Users', error)

  logStep('Users seeded successfully.')

  return data
}

const seedDatabase = async (numEntriesPerTable) => {
  const userIds = (await seedUsers(numEntriesPerTable)).map((user) => user.id)
  const statusRows = await seedTaskStatus()
  const statusIds = statusRows.map((status) => status.id)
  const projectIds = (await seedProjects(numEntriesPerTable, userIds)).map((project) => project.id)
  await seedTasks(numEntriesPerTable, projectIds, userIds, statusIds)
}

const numEntriesPerTable = 10

seedDatabase(numEntriesPerTable)
