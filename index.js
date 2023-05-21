import { write } from 'xlsx-style-vite'
import { getSheets, s2ab, saveAs } from './utils'

export default ({
  sheets,
  filename = 'excel.xlsx'
}) => {
  const Sheets = getSheets(sheets)
  const workbook = {
    SheetNames: sheets.map(({ name }) => name),
    Sheets
  }
  const wbout = write(workbook, {
    bookType: 'xlsx',
    type: 'binary',
  })
  saveAs(
    new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    filename
  )
}
