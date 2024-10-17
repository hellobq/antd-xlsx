// 将 string 转成 arrayBuffer
export default function s2ab(s: string) {
  const buf = new ArrayBuffer(s.length), view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
}
