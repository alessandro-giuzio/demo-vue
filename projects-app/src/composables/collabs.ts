import { groupedUsersQuery} from "@/utils/supaQueries"
import type {Projects, TasksWithProjects} from "@/utils/supaQueries"
import type { GroupedCollabs } from "@/types/GroupedCollabs"


export const useCollabs = () => {
  const groupedCollabs = ref<GroupedCollabs>({})
  const getUserByIds = async (userIds: string[]) => {
    const {data,error} = await groupedUsersQuery(userIds)
    if (error || !data) return []
    return data
  }

  const getGroupedCollabs = async (items: Projects | TasksWithProjects) =>{
    const fileredItems = items.filter((item)=>item.collaborators.length)

    const promises = fileredItems.map((item)=> getUserByIds(item.collaborators))

      const results = await Promise.all(promises)
      fileredItems.forEach((item, index)=>{
      groupedCollabs.value[item.id] = results[index]
  })
  }

  return {
    getUserByIds,
    groupedCollabs,
    getGroupedCollabs
  }
}