import { WorkBook, WritingOptions } from 'xlsx'
import getSheets from './sheets'
import s2ab from './s2ab'
import saveAs from './saveAs'
import { IExcel, getCellStyleType } from '../type';

function download(
  args: IExcel & 
  {
    getCellStyle?: getCellStyleType;
    write: (data: WorkBook, opts: WritingOptions) => any;
  }
): Blob | void {
  const {
    sheets,
    filename = 'excel.xlsx',
    hiddenHeader,     
    worker,
    getCellStyle,
    write,
  } = args

  const Sheets = getSheets({
    sheets,
    hiddenHeader,
    getCellStyle,
  })

  const wbout: string = write(
    {
      Sheets,
      SheetNames: sheets.map(({ name }, index) => name || `sheet${index}`)
    }, 
    {
      bookType: 'xlsx',
      type: 'binary',
    }
  )

  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  if (worker) {
    return blob
  } else {
    saveAs(blob, filename)
  }
}

export default download
