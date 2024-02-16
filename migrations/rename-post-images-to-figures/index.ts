import {defineMigration, at, setIfMissing, unset} from 'sanity/migrate'

const from = 'images'
const to = 'figures'

export default defineMigration({
  title: 'Rename post images to figures',
  documentTypes: ["post"],

  migrate: {
    document(doc, context) {
      return [
        at(to, setIfMissing(doc[from])),
        at(from, unset())
      ]
    }
  }
})
