declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      managerId?: string
      department?: string
    }
  }

  interface User {
    role: string
    managerId?: string
    department?: string
  }
}
