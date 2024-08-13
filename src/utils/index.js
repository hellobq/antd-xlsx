import getSheets from './sheets'
import s2ab from './s2ab'
import saveAs from './saveAs'

export default (
  {
    sheets,
    filename = 'excel.xlsx',
    hiddenHeader = false,     // 导出表格时，是否隐藏表头。默认显示表头
    worker,                   
  },
  {
    getCellStyle,
    write,
  }
) => {
  const Sheets = getSheets({
    sheets,
    hiddenHeader,
    getCellStyle,
  })
  const workbook = {
    SheetNames: sheets.map(({ name }) => name),
    Sheets
  }
  const wbout = write(workbook, {
    bookType: 'xlsx',
    type: 'binary',
  })

  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  if (worker) {
    return blob
  } else {
    saveAs(blob, filename)
  }
}
