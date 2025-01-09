import { groupedUsersQuery } from "@/utils/supaQueries"

export const useCollabs = () => {
  const getProfileByIds = async (userIds: string[]) => {
    const {data,error} = await groupedUsersQuery(userIds)
    if (error || !data) return []
    return data
  }
  return {
    getProfileByIds
  }
}
