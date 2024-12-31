import React, { useState } from 'react'
import style from 'antd-xlsx'

const columns = [
  {
    title: '序号',
    dataIndex: 'key',
    width: 50
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: 100,
    onCell: (record: any, index: number) => {
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
    },
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
              if (index === 6) {
                return {
                  rowSpan: 2,
                  colSpan: 2
                }
              }
              if (index === 7) {
                return {
                  rowSpan: 0
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
                onCell: (record: any, index: number) => {
                  if (index === 1) {
                    return {
                      colSpan: 2,
                    }
                  }
                  if (index === 6) {
                    return {
                      rowSpan: 0,
                      colSpan: 0
                    }
                  }
                  if (index === 7) {
                    return {
                      rowSpan: 0
                    }
                  }
                  return {}
                },
              },
              {
                title: 'Door No.',
                dataIndex: 'number',
                width: 100,
            onCell: (record: any, index: number) => {
                  if (index === 1) {
                    return {
                      colSpan: 0,
                    }
                  }
                  return {}
                },
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
        onCell: (record: any, index: number) => {
          if (index === 7) {
            return {
              rowSpan: 3,
            }
          }
          if (index > 7 && index < 10) {
            return {
              rowSpan: 0,
            }
          }
          return {}
        },
      },
      {
        title: 'Company Name',
        dataIndex: 'companyName',
        width: 200,
        colSpan: 0,
      },
    ],
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    width: 80,
    merge: true
  },
]

export default function App() {
  const [dataSource] = useState(() => {
    const dataSource = []
    for (let i = 0; i < 10; i++) {
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
      filename: '单元格合并.xlsx'
    })
  }

  return (
    <p>
      单元格合并（表头列合并，表格行/列合并）：
      <button onClick={onCountBtnClick}>
        cell span
      </button>
    </p>
  )
}
