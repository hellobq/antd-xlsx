import { write } from 'xlsx-style-vite'
import download from './utils'
import getCellStyle from './utils/cellStyle'

export default (args) => download(args, {
  getCellStyle,
  write
})
