import React from 'react'
import ReactDOM from 'react-dom/client'
import Example from './example'
import './index.css'

const dom = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(dom).render(
  <React.StrictMode>
    <Example />
  </React.StrictMode>
)
