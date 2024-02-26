import {defineField, defineType} from 'sanity'
import visit from './visit'

export default defineType({
  name: 'visitor',
  title: 'Visitor',
  type: 'document',
  fields: [
    defineField({
      name: 'ip',
      title: 'IP Address',
      type: 'string',
    }),
    defineField({
      name: 'visits',
      title: 'Visits',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{type: 'visit'}]
      }],
    }),
  ],
})
