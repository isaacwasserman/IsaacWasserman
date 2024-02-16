import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
      initialValue: {
        _type: 'reference',
        _ref: '41c9dd4a-9514-4241-934f-0dbddd014b07',
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    defineField({
      name: 'figures',
      title: 'Figures',
      type: 'array',
      of: [{
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {
          hotspot: true,
        },
        fields: [{
          name: 'caption',
          title: 'Caption',
          type: 'string'
        }]
      },
      {
        type: 'file',
        name: 'video',
        title: 'Video',
        fields: [{
          name: 'caption',
          title: 'Caption',
          type: 'string'
        }
        ]
      }
      ]
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      validation: Rule => Rule.required().min(1),
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
