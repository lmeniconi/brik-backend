import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProductValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    published: schema.boolean.optional(),
    image: schema.file.optional({
      extnames: ['jpg', 'png', 'jpeg'],
    }),
    name: schema.string({ trim: true }, [rules.maxLength(255)]),
    description: schema.string({ trim: true }),
    characteristics: schema.string.optional({ trim: true }),
    stock: schema.number(),
    width: schema.number(),
    depth: schema.number(),
    height: schema.number(),
    weight: schema.number.optional(),
    storeId: schema.number([rules.exists({ table: 'stores', column: 'id' })]),
    categories: schema
      .array([rules.minLength(1)])
      .members(schema.number([rules.exists({ table: 'categories', column: 'id' })])),
    prices: schema.array([rules.minLength(1)]).members(
      schema.object().members({
        price: schema.number(),
        minUnits: schema.number(),
        maxUnits: schema.number.optional(),
      })
    ),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {}
}
