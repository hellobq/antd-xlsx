import { WorkBook, WritingOptions } from 'xlsx'
import getSheets from './sheets'
import s2ab from './s2ab'
import saveAs from './saveAs'
import { IExcel, ISheet, ICellStyle } from '../type'

type DownloadParams = IExcel & {
  setCellStyle?: ({ isTitle, style }: { isTitle: boolean, style?: ISheet['style'] }) => ICellStyle
  write: (data: WorkBook, opts: WritingOptions) => any
}

export default function download(args: DownloadParams): Blob | void {
  const {
    sheets,
    filename = 'excel.xlsx',
    hiddenHeader,     
    worker,
    setCellStyle,
    write,
  } = args

  const Sheets = getSheets({
    sheets,
    hiddenHeader,
    setCellStyle,
  })
  const workBook: WorkBook = {
    Sheets,
    SheetNames: sheets.map(({ name }, index) => name || `sheet${index + 1}`)
  }
  const writingOptions: WritingOptions = {
    bookType: 'xlsx',
    type: 'binary',
  }
  const wbout: string = write(workBook, writingOptions)
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })

  if (worker) {
    return blob
  } else {
    saveAs(blob, filename)
  }
}
