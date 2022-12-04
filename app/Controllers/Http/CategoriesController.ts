import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'

export default class CategoriesController {
  public async index({ request }: HttpContextContract) {
    const query = Category.query()

    if (request.input('page')) query.paginate(request.input('page', 1), request.input('limit', 10))

    return await query
  }

  public async show({}: HttpContextContract) {}
}
