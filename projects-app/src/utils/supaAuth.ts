// Import the supabase client and types for login and registration forms
import { supabase } from '@/lib/supabaseClient'
import { showError } from './toast'
import type { LoginForm, RegisterForm } from '@/types/AuthForm'

// Get the authentication store
/* const authStore = useAuthStore() */

// Function to handle user registration
export const register = async (formData: RegisterForm) => {
  // Sign up the user with email and password
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password
  })

  // Log any errors that occur during sign up
  if (error) {
    showError(error.message)
    return false
  }

  // If the user is successfully created, insert additional user details into the 'users' table
  if (data.user) {
    const { error: userError } = await supabase.from('users').insert({
      id: data.user.id,
      email: formData.email,
      password: formData.password,
      username: formData.username,
      full_name: formData.firstName.concat(' ', formData.lastName)
    })

    // Log any errors that occur during the insertion of user details
    if (userError) {
      showError(`Registration failed: ${userError.message}`)
      return false
    }

    // Assign 'contributor' role to the new user
    // 1. Fetch the role_id for 'contributor'
    const { data: roleData, error: roleFetchError } = await supabase
      .from('roles')
      .select('id')
      .eq('key', 'contributor')
      .single()

    if (roleFetchError || !roleData) {
      showError(`Role lookup failed: ${roleFetchError?.message || 'Role not found'}`)
      return false
    }

    // 2. Insert into user_roles
    const { error: roleAssignError } = await supabase.from('user_roles').insert({
      user_id: data.user.id,
      role_id: roleData.id
    })
    if (roleAssignError) {
      showError(`Role assignment failed: ${roleAssignError.message}`)
      return false
    }
  }

  // Set the authentication state in the store
  /* await authStore.setAuth(data.session) */
  return true
}

// Function to handle user login
export const login = async (formData: LoginForm) => {
  // Sign in the user with email and password
  const {  error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password
  })

  // Log any errors that occur during sign in
  return {error}

  // Set the authentication state in the store
 /*  await authStore.setAuth(data.session) */

}
 // Function to handle user logout
export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    showError(`Logout failed: ${error.message}`)
    return false
  }
  /* await authStore.setAuth() */
  return true
}
