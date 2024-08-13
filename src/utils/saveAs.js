/**
 * 保存文件
 * 
 * @param {Blob} obj 
 * @param {string} title 
 */
export default function saveAs(obj, title) {
  var link = document.createElement('a')
  link.download = title
  link.href = URL.createObjectURL(obj)
  link.click()
  link.remove()
  URL.revokeObjectURL(obj)
}
