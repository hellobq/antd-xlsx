// 保存文件
export default function saveAs(obj: Blob, title: string) {
  var link = document.createElement('a')
  link.download = title
  link.href = URL.createObjectURL(obj)
  link.click()
  link.remove()
  URL.revokeObjectURL(link.href)
}
