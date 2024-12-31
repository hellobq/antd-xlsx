import React, { useState, useEffect, useRef } from 'react'
import { saveAs } from 'antd-xlsx'

const columns = [
  {
    title: '序号',
    dataIndex: 'key',
    width: 50,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: 160,

    // in Worker 不能传函数
    render: `
      (val, row, i) => {
        // console.log(val, row, i)
        return 'formatted Name: ' + val
      }
    `
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 50,

    // in Worker 不能传函数
    onCell: `
      (record, index) => {
        if (index === 0) {
          return {
            rowSpan: 6,
          }
        }
        if (index > 0 && index < 6) {
          return {
            rowSpan: 0,
          }
        }
        return {}
      }
    `,
  },
  {
    title: 'Company',
    dataIndex: 'Company',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    width: 50,
  },
]

const filename = 'work in Worker.xlsx'

export default function App() {
  const workerRef = useRef<Worker>()
  const [dataSource] = useState(() => {
    const dataSource = []
    for (let i = 0; i < 100; i++) {
      dataSource.push({
        key: i + 1,
        name: i > 40 ? 'John' : 'Jack',
        age: i + 1,
        Company: 'SoftLake Co',
        gender: i == 3 ? '' : 'M',
      })
    }
    return dataSource
  })

  const onCountBtnClick = () => {
    const sheets = [
      {
        name: 'sheet',
        columns: columns,
        dataSource
      }
    ]

    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'blob',
        params: {
          sheets,
          filename
        }
      })
    }
  }

  useEffect(() => {
    if ('Worker' in window) {
      const worker = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      })
      workerRef.current = worker

      worker.onmessage = function (event) {
        const { type, data } = event.data
        if (type === 'wbout') {
          saveAs(
            data,
            filename
          )
        }
      }
    }
  }, [])

  return (
    <p>
      使用 web worker：
      <button onClick={onCountBtnClick}>
        work in Worker
      </button>
    </p>
  )
}
