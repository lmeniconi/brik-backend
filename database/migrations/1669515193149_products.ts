import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('slug').notNullable().unique()
      table.boolean('published').defaultTo(false)
      table.string('image').notNullable()
      table.string('name').notNullable()
      table.text('description').notNullable()
      table.text('characteristics')
      table.integer('stock').notNullable()
      table.float('width').notNullable()
      table.float('depth').notNullable()
      table.float('height').notNullable()
      table.float('weight')

      table.integer('store_id').unsigned().references('id').inTable('stores').onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
