import {defineField, defineType} from 'sanity'
import visitor from './visitor'

export default defineType({
  name: 'visit',
  title: 'Visit',
  type: 'document',
  fields: [
    defineField({
      name: 'visitor_ip',
      title: 'Visitor IP',
      type: 'string'
    }),
    defineField({
      name: 'route',
      title: 'route',
      type: 'string'
    }),
  ],
})
