
import type { Tables} from "database/types"
import type {Session, User} from "@supabase/supabase-js"
import { userRegQuery } from "@/utils/supaQueries"



export const useAuthStore = defineStore('auth-store', () => {
  const user = ref<null | User>(null)
  const userReg = ref<null | Tables<'users'>>(null)

  const setUserReg = async () => {
    if(!user.value){
      userReg.value = null
      return
    }

    if(!userReg.value || userReg.value.id !== user.value.id){
      const {data} = await userRegQuery(user.value.id)

      userReg.value = data || null

    }
  }

  const setAuth = async (userSession: null | Session = null) => {
    if(!userSession) {
      user.value = null
      return
    }
    user.value = userSession.user
    await setUserReg()
  }

  return {
    user,
    userReg,
    setAuth

  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
