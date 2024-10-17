import React, { useState } from 'react'
import style from 'antd-xlsx'

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
    render: (val: any) => {
      // console.log(val, row, i)
      return 'formatted Name: ' + val
    }
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 50,
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

export default function App() {
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

    style({
      sheets,
      filename: 'basic.xlsx',
    })
  }

  return (
    <p>
      基础导出：
      <button onClick={onCountBtnClick}>
        basic
      </button>
    </p>
  )
}
