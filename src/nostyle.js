import { write } from 'xlsx'
import download from './utils'

export default (args) => download(args, {
  write
})
