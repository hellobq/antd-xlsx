// import style from 'antd-xlsx'
import { nostyle } from 'antd-xlsx'

onmessage = function (evt) {
  if (evt.data.type === 'blob') {
    const workbook = nostyle({
      worker: true,
      ...evt.data.params
    })
    self.postMessage({ 
      type: "wbout", 
      data: workbook 
    })
  }
}
