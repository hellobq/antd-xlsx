import { write } from 'xlsx'
import download from './utils'
import { IExcel } from './type'

export default function nostyle(excelProps: IExcel) {
  return download(
    Object.assign(excelProps, {
      write
    })
  )
}
