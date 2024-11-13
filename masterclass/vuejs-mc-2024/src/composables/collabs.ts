import { groupedProfilesQuery } from "@/utils/supaQueries"

export const useCollabs = () => {
  const getProfilesById = async (usersIds: string[]) => {
      const {data, error} = await groupedProfilesQuery(usersIds)

      if(error || !data) return []

      return data

  }

  return {
    getProfilesById
  }
}
