import { utils } from 'xlsx-style-vite'

// 获取所有 sheets
export function getSheets({
  sheets,
  hiddenHeader
}) {
  return sheets.reduce((map, { columns, dataSource, name }) => {
    // 不隐藏表头时，要计算表头树的深度和表头合并情况
    let rootHeight = 0, headerMerges = []
    if (!hiddenHeader) {
      rootHeight = getRootHeight(columns)
      headerMerges = getMerges({
        columns,
        rootHeight
      })
    }

    const leafColumns = getAllLeafColumns(columns)
    const bodyMerges = getBodyMerges({
      hiddenHeader,
      rootHeight,
      leafColumns,
      dataSource
    })

    let data = getDataFromColumnsAndDataSource({
      hiddenHeader,
      columns,
      leafColumns,
      rootHeight,
      dataSource
    })
    let cols = getCols(leafColumns)

    let tmp_data = {}, isTitle = false, border = getCellBorders()
    data.forEach((value, r) => {
      value.forEach((v, c) => {
        isTitle = r < rootHeight && c < leafColumns.length // 对表头做单独样式处理

        let cell_text = utils.encode_cell({ r, c })

        const s = {
          font: {
            sz: 12,
            bold: isTitle,
          },
          alignment: {
            vertical: 'center',
            horizontal: isTitle ? 'center' : 'left',
            wrapText: true
          },
          border
        }

        tmp_data[cell_text] = {
          v: typeof v === 'string' ? v.trim() : v,
          s: isTitle
            ? {
              ...s,
              fill: {
                fgColor: {
                  rgb: 'dddddd'
                }
              },
            }
            : s,
          t: typeof v === 'number' || typeof v === 'string' && v.includes('%') ? 'n' : 's',
        }

        // https://segmentfault.com/a/1190000022772664
      })
    })

    // 获取所有单元格编码，比如 ['A1', 'B1', 'C1', 'D1', 'E1', 'F1']
    const output_pos = Object.keys(tmp_data)
    map[name] = Object.assign(
      {},
      tmp_data,
      {
        '!ref': output_pos[0] + ':' + output_pos[output_pos.length - 1],
        '!merges': headerMerges.concat(bodyMerges),
        '!cols': cols
      }
    )
    return map
  }, {})
}

// 获取所有由叶子节点组成的 columns，也就是树的宽度
function getAllLeafColumns(columns) {
  const allColumns = []
  const loop = children => {
    children.forEach((item) => {
      if (item.children) {
        loop(item.children)
      } else {
        allColumns.push(item)
      }
    })
  }
  loop(columns)
  return allColumns
}

// 计算整棵树的高度
function getRootHeight(columns) {
  let height = 0
  const loop = (children) => {
    if (children.length) {
      height++
    }
    for (let i = 0; i < children.length; ++i) {
      if (children[i].children) {
        loop(children[i].children)
        break
      }
    }
  }
  loop(columns)
  return height
}

/**
 * 
 * 把 antd columns/dataSource 组成这种数据格式
 * 
 *  [
      ['姓名', '年龄', '城市'],
      ['张三', 25, '北京'],
      ['李四', 30, '上海'],
      ['王五', 28, '广州']
    ]
 */
const getDataFromColumnsAndDataSource = ({
  hiddenHeader,
  columns,
  leafColumns,
  rootHeight,
  dataSource
}) => {
  const mergedHeaderDatas = []

  // 不隐藏表头时，计算表头数据
  if (!hiddenHeader) {
    // 根据 s/e 计算表头文字所应该处的正确位置
    const title_src = {}
    const flat = children => {
      children.forEach(column => {
        const { title, s, e, children } = column
        title_src[`${s.r}-${s.c}`] = title
        children && flat(children)
      })
    }
    flat(columns)
    // console.log('title_src ...', title_src)
  
    // 根据合并项计算表头数据格式
    for (let i = 0; i < rootHeight; ++i) {
      const mergedHeaderData = []
      for (let j = 0; j < leafColumns.length; ++j) {
        mergedHeaderData.push(
          title_src[`${i}-${j}`] || null
        )
      }
      mergedHeaderDatas.push(
        mergedHeaderData
      )
    }
    // console.log('mergedHeaderDatas ...', mergedHeaderDatas)
  }

  const bodyData = dataSource.reduce((arr, item) => {
    arr.push(
      leafColumns.map(({ dataIndex }) => item[dataIndex])
    )
    return arr
  }, [])
  // console.log('bodyData ...', bodyData)

  return mergedHeaderDatas.concat(bodyData)
}

// 从 start 行开始，计算 dataSource 中和 value 相同的行数
function getSameRows({
  start,
  value,
  dataSource,
  dataIndex
}) {
  let count = 0
  for (let i = start; i < dataSource.length; ++i) {
    if (dataSource[i][dataIndex] === value) {
      count++
    } else {
      return count
    }
  }
  return count
}

// 获取列宽度（字符个数）
const getCols = (leafColumns) => {
  const charWidth = 7.2; // 假设一个字符是 7.2px
  const charNums = leafColumns.map(({ width = 120 }) => Math.floor(width / charWidth))
  return charNums.map(wch => ({ wch }))
}

// 获取所有表头合并项
function getMerges({ columns, rootHeight }) {
  getWidthOfNode(columns)
  getHeightOfNode(columns)

  const merges = []
  getCellMerges({
    columns,
    rootHeight,
    merges
  })
  return merges
}

// 表格体，merge 同一列的相同数据
function getBodyMerges({
  hiddenHeader,
  rootHeight,
  leafColumns,
  dataSource
}) {
  const bodyMerges = []
  leafColumns.map(({ dataIndex, s, e, merge }, columnIndex) => {
    for (let i = 0; i < dataSource.length;) {
      let value = dataSource[i][dataIndex]
      if (merge) {
        let sameRows = getSameRows({
          start: i + 1,
          value,
          dataIndex,
          dataSource,
        })
        // console.log(sameRows)

        // 存在相同合并项
        if (sameRows > 0) {
          bodyMerges.push({
            s: {
              r: rootHeight + i,
              c: hiddenHeader ? columnIndex : s.c
            },
            e: {
              r: rootHeight + i + sameRows,
              c: hiddenHeader ? columnIndex : s.c
            }
          })
          i += sameRows
        } else {
          i++
        }
      } else {
        i++
      }
    }
  })
  // console.log('bodyMerges ...', bodyMerges)
  return bodyMerges
}

// 计算每个节点的宽度（子孙叶子节点个数）
function getWidthOfNode(columns) {
  columns.forEach((item) => {
    item.leafCount = calculateWidthOfNode(item)
    if (item.children) {
      getWidthOfNode(item.children)
    }
  })

  // 以每个节点作为根节点，计算每个节点的叶子节点个数
  // 如果本身是叶子节点，则返回 1
  function calculateWidthOfNode(node) {
    return node.children
      ? node.children.reduce((count, item) => {
        return count += calculateWidthOfNode(item)
      }, 0)
      : 1
  }
}

// 计算这棵树的每个节点的高度
// pHeight 父节点的高度
function getHeightOfNode(columns, pHeight = 0) {
  for (let i = 0; i < columns.length; ++i) {
    columns[i].rootHeight = pHeight + 1
    if (columns[i].children) {
      getHeightOfNode(columns[i].children, columns[i].rootHeight)
    }
  }
}

/**
 * 计算每个单元格的合并项
 */
function getCellMerges({
  columns,      // 表格 columns
  rootHeight,   // 表头高度
  merges,       // 合并后的存储容器

  p_sc = 0,     // p_sc 父节点的起点第几列
  p_sr = 0      // p_sc 父节点的起点第几行
}) {
  columns.forEach((column, i) => {
    let sr = i ? columns[i - 1].s.r : p_sr
    let sc = i ? columns[i - 1].e.c + 1 : p_sc

    column.s = {
      r: sr,
      c: sc
    }
    column.e = {
      r: column.children ? sr : sr + rootHeight - column.rootHeight,
      c: sc + column.leafCount - 1
    }
    merges.push(
      {
        s: {
          r: sr,
          c: sc
        },
        e: {
          r: column.children ? sr : sr + rootHeight - column.rootHeight,
          c: sc + column.leafCount - 1
        }
      }
    )
    if (column.children) {
      getCellMerges({
        columns: column.children,
        merges,
        rootHeight,

        p_sc: column.s.c,
        p_sr: column.s.r + 1
      })
    }
  })
}

/**
 * 返回表格边框 sides: ['top', 'bottom' ...]
 */
function getCellBorders() {
  const sides = ['top', 'bottom', 'left', 'right']
  return sides.reduce((obj, side) => {
    obj[side] = {
      style: 'thin',
      color: { rgb: 'black' },
    }
    return obj
  }, {})
}


/**
 * 将 string 转成 arrayBuffer
 * 
 * @param {string} s 
 * @returns {ArrayBuffer}
 */
export function s2ab(s) {
  const buf = new ArrayBuffer(s.length), view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
}

/**
 * 保存文件
 * 
 * @param {Blob} obj 
 * @param {string} title 
 */
export function saveAs(obj, title) {
  var link = document.createElement('a')
  link.download = title
  link.href = URL.createObjectURL(obj)
  link.click()
  link.remove()
  URL.revokeObjectURL(obj)
}
