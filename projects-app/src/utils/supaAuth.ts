// Import the supabase client and types for login and registration forms
import { supabase } from '@/lib/supabaseClient'
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
  if (error) return console.log(error)

  // If the user is successfully created, insert additional user details into the 'users' table
  if (data.user) {
    const { error } = await supabase.from('users').insert({
      id: data.user.id,
      email: formData.email,
      password: formData.password,
      username: formData.username,
      full_name: formData.firstName.concat(' ', formData.lastName)
    })

    // Log any errors that occur during the insertion of user details
    if (error) return console.log('Users err: ', error)
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
  const {error} = await supabase.auth.signOut()
  if (error) return console.log(error)
  /* await authStore.setAuth() */
  return true
}
