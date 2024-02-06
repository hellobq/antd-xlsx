import React from 'react'
import antdXlsx from 'antd-xlsx'
import './index.less'

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
        notExport: true,
      },
      {
        title: 'Address',
        children: [
          {
            title: 'Street',
            dataIndex: 'street',
            width: 150,
            onCell: (record, index) => {
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
                width: 100,
                render: (val, row, i) => {
                  console.log(val, row, i)
                  return val
                }
              },
              {
                title: 'Door No.',
                dataIndex: 'number',
                width: 100,
                notExport: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Company',
    colSpan: 2,
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

    const sheets = [
      {
        name: '普通表格',
        columns: columns2,
        dataSource,
        hiddenHeader: false,
        style: {
          header: {
            bold: false,
            backgroundColor: 'ff0000',
            textAlign: 'left'
          },
          body: {
            fontSize: 12,
            background: 'ffc0cb',
            borderColor: 'ff0000'
          }
        }
      },
      {
        name: '表头分组',
        columns: columns1,
        dataSource,
        style: {
          header: {
            fontSize: 10,
            background: 'ffc0cb',
          },
          body: {
            fontSize: 12,
            borderColor: 'ff0000'
          }
        }
      }
    ]

    antdXlsx({
      sheets,
      filename: 'output.xlsx',
    })
  }

  return (
    <button onClick={onCountBtnClick}>
      下载 excel
    </button>
  )
}
