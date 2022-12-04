import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import Order from 'App/Models/Order'
import OrderProduct from 'App/Models/OrderProduct'
import OrderValidator from 'App/Validators/OrderValidator'

export default class OrdersController {
  public async index({ response, auth }: HttpContextContract) {
    const user = auth.user
    if (!user) return response.unauthorized()

    return await Order.query().where('userId', user.id).preload('products').preload('store')
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const { products, total, storeId } = await request.validate(OrderValidator)

    const user = auth.user
    if (!user) return response.unauthorized()

    await Database.transaction(async (trx) => {
      const order = await Order.create(
        {
          total,
          storeId,
          userId: user.id,
        },
        { client: trx }
      )

      await OrderProduct.createMany(
        products.map((product) => ({
          productId: product.id,
          orderId: order.id,
          price: product.price,
          quantity: product.quantity,
        })),
        { client: trx }
      )
    })
  }
}
