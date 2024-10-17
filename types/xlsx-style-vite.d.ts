declare module 'xlsx-style-vite' {
  import { WorkBook, WritingOptions } from 'xlsx'
  export function write(data: WorkBook, opts: WritingOptions): any
}
