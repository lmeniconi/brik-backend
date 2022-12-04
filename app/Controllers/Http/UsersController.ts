import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async update({ request, response, auth, params }: HttpContextContract) {
    const user = auth.user
    if (!user) return response.unauthorized()

    const searchedUser = await User.findOrFail(params.id)
    if (user.role !== 'admin' && searchedUser.id !== user.id) return response.unauthorized()

    const payload = request.only(['firstName', 'lastName', 'email', 'role'])

    if (payload.role) {
      if (payload.role === 'admin' && user.role !== 'admin') return response.unauthorized()
      if ((user.role === 'provider' || user.role === 'admin') && payload.role === 'customer')
        return response.badRequest({ message: 'You can not change role to customer' })
    }

    searchedUser.merge(payload)
    await searchedUser.save()
  }
}
