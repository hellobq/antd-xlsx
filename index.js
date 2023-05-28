import { write } from 'xlsx-style-vite'
import { getSheets, s2ab, saveAs } from './utils'

export default ({
  sheets,
  filename = 'excel.xlsx',
  hiddenHeader = false,     // 导出表格时，是否隐藏表头。默认显示表头
}) => {
  const Sheets = getSheets({
    sheets,
    hiddenHeader,
  })
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
