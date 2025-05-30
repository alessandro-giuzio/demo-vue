import { groupedUsersQuery } from "@/utils/supaQueries"
import type { Projects, TasksWithProjects } from "@/utils/supaQueries"
import type { GroupedCollabs } from "@/types/GroupedCollabs"

export const useCollabs = () => {
  const groupedCollabs = ref<GroupedCollabs>({})

  const getUserByIds = async (userIds: string[]) => {
    const response = await groupedUsersQuery(userIds)
    console.log('groupedUsersQuery response:', response)
    if (response?.error || !response?.data) return []
    return response.data
  }

  const getGroupedCollabs = async (projects: Array<{ collaborators: string[]; description: string; id: string; name: string; owner_id: string; slug: string; status: "in-progress" | "completed"; }>) => {
    const collabsObj: GroupedCollabs = {}
    for (const project of projects) {
      const filteredCollabIds = project.collaborators?.filter(
        (collaborator) => collaborator !== project.owner_id // Exclude owner_id
      ) || []
      const users = await getUserByIds(filteredCollabIds)
      collabsObj[project.id] = users
    }
    groupedCollabs.value = collabsObj
  }


  return {
    getUserByIds,
    groupedCollabs,
    getGroupedCollabs
  }
}
