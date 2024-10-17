
import { write as styleWriteFn } from 'xlsx-style-vite'
import getCellStyle from './utils/cellStyle'
import download from './utils'
import { IExcel } from './type'

export default function style(excelProps: IExcel) {
  return download(
    Object.assign(excelProps, {
      write: styleWriteFn,
      getCellStyle,
    })
  )
}
