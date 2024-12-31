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
    dataIndex: 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 50,
  },
  {
    title: 'Company',
    dataIndex: 'Company',
    notExport: true,
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
    for (let i = 0; i < 5; i++) {
      dataSource.push({
        key: i + 1,
        name: i > 40 ? 'John' : 'Jack',
        age: i + 1,
        Company: 'SoftLake Co',
        gender: 'M',
      })
    }
    return dataSource
  })

  const onCountBtnClick = () => {
    const sheets = [
      {
        columns: columns,
        dataSource,
      }
    ]

    style({
      sheets,
      filename: 'not export column.xlsx',
    })
  }

  return (
    <p>
      导出时，隐藏某些列：
      <button onClick={onCountBtnClick}>
        not export column
      </button>
    </p>
  )
}
