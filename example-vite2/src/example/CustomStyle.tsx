import React from 'react'
import style, { ISheet } from 'antd-xlsx'

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
            onCell: (record: any, index: number) => {
              if (index === 1) {
                return {
                  rowSpan: 8,
                }
              }
              if (index === 10) {
                return {
                  rowSpan: 2,
                  colSpan: 4,
                }
              }
              if (index === 11) {
                return {
                  rowSpan: 2,
                  colSpan: 2,
                }
              }
              return {}
            },
          },
          {
            title: 'Block',
            dataIndex: 'number',
            children: [
              {
                title: 'Building',
                dataIndex: 'building',
                width: 100
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
        colSpan: 2,
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
    width: 50,
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
    colSpan: 0,
    notExport: true,
  },
]

export default function App() {
  const onCountBtnClick = () => {
    const dataSource = []
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
      })
    }
    dataSource[43].name = 'Alick'

    const sheets: ISheet[] = [
      {
        name: '普通表格',
        columns: columns2,
        dataSource,
        style: {
          header: {
            bold: false,
            backgroundColor: 'ff0000',
            textAlign: 'left'
          }
        }
      }
    ]

    style({
      sheets,
      filename: 'output.xlsx'
    })
  }

  return (
    <p>
      自定义样式：
      <button onClick={onCountBtnClick}>
        custom style
      </button>
    </p>
  )
}
