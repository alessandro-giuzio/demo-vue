// Import necessary types and functions
import type { Tables } from "database/types"
import type { Session, User } from "@supabase/supabase-js"
import { userRegQuery } from "@/utils/supaQueries"
import { supabase } from "@/lib/supabaseClient"


// Define the authentication store
export const useAuthStore = defineStore('auth-store', () => {
  // State to hold the current user
  const user = ref<null | User>(null)
  // State to hold the user registration details
  const userReg = ref<null | Tables<'users'>>(null)
  // State to track if the authentication state is being changed
  const isTrackingAuthChanges = ref(false)

  // Function to set user registration details
  const setUserReg = async () => {
    // If there is no user, set userReg to null and return
    if (!user.value) {
      userReg.value = null
      return
    }

    // If userReg is not set or the user ID has changed, fetch the user registration details
    if (!userReg.value || userReg.value.id !== user.value.id) {
      const { data } = await userRegQuery({
        column:'id',
        value: user.value.id})
      userReg.value = data || null
    }
  }

  // Function to set the authentication state
  const setAuth = async (userSession: null | Session = null) => {
    // If there is no user session, set user to null and return
    if (!userSession) {
      user.value = null
      userReg.value = null
      return
    }
    // Set the user state and fetch user registration details
    user.value = userSession.user
    await setUserReg()
  }
  // Function to get the current session
  const getSession = async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session?.user) await setAuth(data.session)
  }

  const trackAuthChanges = () => {
    // If already tracking auth changes, return
    if (isTrackingAuthChanges.value) return
    // Set isTrackingAuthChanges to true
    isTrackingAuthChanges.value = true
    supabase.auth.onAuthStateChange((event,session)=>{
      setTimeout(async () => {
        await setAuth(session)
      },0)
      })
  }
  // Return the state and functions to be used in the store
  return {
    user,
    userReg,
    setAuth,
    getSession,
    trackAuthChanges,
  }
})

// Enable Hot Module Replacement (HMR) for the store
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
