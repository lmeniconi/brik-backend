import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Admin {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    roles: string[]
  ) {
    if (!auth.user) return response.unauthorized()

    if (!roles.includes(auth.user.role))
      return response.unauthorized({
        message: 'You are not authorized to access this resource',
      })

    await next()
  }
}
