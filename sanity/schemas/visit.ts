import {defineField, defineType} from 'sanity'
import visitor from './visitor'

export default defineType({
  name: 'visit',
  title: 'Visit',
  type: 'document',
  fields: [
    defineField({
      name: 'visitor',
      title: 'Visitor',
      type: 'reference',
      to: [{type: 'visitor'}],
    }),
    defineField({
      name: 'route',
      title: 'route',
      type: 'string'
    }),
  ],
})
