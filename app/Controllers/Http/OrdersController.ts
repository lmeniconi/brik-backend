import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import Order from 'App/Models/Order'
import OrderValidator from 'App/Validators/OrderValidator'

export default class OrdersController {
  public async store({ request }: HttpContextContract) {
    const { products, total } = await request.validate(OrderValidator)

    await Database.transaction(async (trx) => {
      const order = await Order.create(
        {
          total,
        },
        { client: trx }
      )
      await order.related('products').attach(
        products.map((product) => product.id),
        trx
      )
    })
  }
}
