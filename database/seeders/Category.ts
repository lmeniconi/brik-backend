import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { kebabCase } from 'lodash'

import Category from 'App/Models/Category'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const categories = [
      {
        name: 'Tecnología',
      },
      {
        name: 'Electrodomésticos',
      },
      {
        name: 'Hogar',
      },
      {
        name: 'Deportes',
      },
      {
        name: 'Juguetes',
      },
      {
        name: 'Mascotas',
      },
      {
        name: 'Ropa',
      },
      {
        name: 'Salud y Belleza',
      },
      {
        name: 'Libros',
      },
      {
        name: 'Música',
      },
      {
        name: 'Videojuegos',
      },
      {
        name: 'Cine y Series',
      },
      {
        name: 'Bebés',
      },
      {
        name: 'Niños',
      },
      {
        name: 'Niñas',
      },
      {
        name: 'Hombres',
      },
      {
        name: 'Mujeres',
      },
      {
        name: 'Otros',
      },
    ]

    await Category.createMany(
      categories.map(({ name }) => ({
        name,
        slug: kebabCase(name),
      }))
    )
  }
}
