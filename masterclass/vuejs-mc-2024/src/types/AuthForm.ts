export interface LoginForm {
  email: string
  password: string
}


export interface RegisterForm extends LoginForm {
  confirmpassword: string
  username: string
  firstName: string
  lastName: string
}