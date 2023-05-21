import React from 'react'
import antdXlsx from 'antd-xlsx'
import './App.css'

const columns1 = [
  {
    title: '序号',
    dataIndex: 'key',
    width: 50
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: 100,
    merge: true,
  },
  {
    title: 'Other',
    children: [
      {
        title: 'Age',
        dataIndex: 'age',
        width: 150,
      },
      {
        title: 'Address',
        children: [
          {
            title: 'Street',
            dataIndex: 'street',
            width: 150,
          },
          {
            title: 'Door No.',
            dataIndex: 'number',
            children: [
              {
                title: 'Building',
                dataIndex: 'building',
                width: 100,
              },
              {
                title: 'Door No.',
                dataIndex: 'number',
                width: 100,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Company',
    children: [
      {
        title: 'Company Address',
        dataIndex: 'companyAddress',
        width: 200,
      },
      {
        title: 'Company Name',
        dataIndex: 'companyName',
        width: 200,
      },
    ],
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    width: 80,
  },
]

const columns2 = [
  {
    title: '序号',
    dataIndex: 'key',
    width: 50
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: 100,
    merge: true,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 150,
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    width: 80,
  },
]

function App() {
  const onCountBtnClick = () => {
    const dataSource = [];
    for (let i = 0; i < 100; i++) {
      dataSource.push({
        key: i + 1,
        name: i > 40 ? 'John' : 'Jack',
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42 ',
        companyName: 'SoftLake Co',
        gender: 'M',
      });
    }
    dataSource[43].name = 'Alick'

    const sheets = [
      {
        name: '普通表格',
        columns: columns2,
        dataSource
      },
      {
        name: '表头分组',
        columns: columns1,
        dataSource
      }
    ]

    antdXlsx({
      sheets,
      filename: 'output.xlsx'
    })
  }

  return (
    <button type="button" onClick={onCountBtnClick}>
      下载 excel
    </button>
  )
}

export default App
