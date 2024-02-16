import React from 'react'
const mathInlineIcon = () => (
  <span>
    <span style={{ fontWeight: 'bold' }}>∑</span>b
  </span>
)
const mathIcon = () => <span style={{ fontWeight: 'bold' }}>∑</span>

export default {
  name: 'portableTextWithLatex',
  type: 'array',
  title: 'Body',
  of: [
    {
      type: 'block',
      title: 'Block',
      of: [
        { type: 'latex', icon: mathInlineIcon, title: 'Inline math' },
      ],
    },
    { type: 'latex', icon: mathIcon, title: 'Math block' },
  ],
}
