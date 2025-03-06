import { groupedUsersQuery } from "@/utils/supaQueries"
import type { Projects, TasksWithProjects } from "@/utils/supaQueries"
import type { GroupedCollabs } from "@/types/GroupedCollabs"

export const useCollabs = () => {
  const groupedCollabs = ref<GroupedCollabs>({})

  const getUserByIds = async (userIds: string[]) => {
    const response = await groupedUsersQuery(userIds)
    if (response?.error || !response?.data) return []
    return response.data
  }

  const getGroupedCollabs = async (items: Projects | TasksWithProjects) => {
    const filteredItems = items.filter((item) => item.owner_id) // ✅ Fixed Typo

    // Collect all unique user IDs to batch query
    const uniqueUserIds = [...new Set(filteredItems.map(item => item.owner_id))]

    // Fetch all users in one request
    const users = await getUserByIds(uniqueUserIds)

    // Map user ID to user data
    const userMap = new Map(users.map(user => [user.id, user]))

    // Assign users to corresponding items
    filteredItems.forEach(item => {
      groupedCollabs.value[item.id] = userMap.get(item.owner_id) || null
    })
  }

  return {
    getUserByIds,
    groupedCollabs,
    getGroupedCollabs
  }
}
