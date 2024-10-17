import { utils } from 'xlsx'
import {
  ISheet,
  getCellStyleType,
  IMerge,
  IColumn,
} from '../type'

// 获取所有 sheets
function getSheets(
  {
    sheets,
    hiddenHeader: outHiddenHeader,
    getCellStyle,
  }: {
    sheets: ISheet[],
    hiddenHeader?: boolean,
    getCellStyle?: getCellStyleType
  }
) {
  return sheets.reduce((map: Record<string, any>, sheet: ISheet, currentIndex: number) => {
    const {
      name,
      columns: originColumns,
      dataSource,
      style,
      hiddenHeader = outHiddenHeader
    } = sheet

    const columns = excludeNotExportColumns(originColumns)

    // 不隐藏表头时，要计算表头树的深度和表头合并情况
    let rootHeight = 0, headerMerges: IMerge[] = []
    if (!hiddenHeader) {
      rootHeight = getRootHeight(columns)
      headerMerges = getHeaderMerges({
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

    let tmp_data: Record<string, any> = {}, isTitle = false
    data.forEach((value, r) => {
      value.forEach((v: any, c) => {
        isTitle = r < rootHeight && c < leafColumns.length // 对表头做单独样式处理
        let cell_text = utils.encode_cell({ r, c })

        tmp_data[cell_text] = {
          v: typeof v === 'string'
            ? v.trim()
            : v,
          s: typeof getCellStyle === 'function'
            ? getCellStyle({
              isTitle,
              style
            })
            : undefined,
          t: typeof v === 'number' || typeof v === 'string' && v.includes('%')
            ? 'n'
            : 's',
        }

        // https://segmentfault.com/a/1190000022772664
      })
    })

    // 获取所有单元格编码，比如 ['A1', 'B1', 'C1', 'D1', 'E1', 'F1']
    const output_pos = Object.keys(tmp_data)
    map[name || `sheet${currentIndex + 1}`] = Object.assign(
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

export default getSheets

// 获取所有由叶子节点组成的 columns，也就是树的宽度
function getAllLeafColumns(columns: IColumn[]): IColumn[] {
  const allColumns: IColumn[] = []
  const loop = (children: IColumn[]) => {
    children.forEach((item: IColumn) => {
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

/**
 * 排除所有 notExport: true 的列
 */
function excludeNotExportColumns(columns: IColumn[]): IColumn[] {
  const node2leafs: Record<string, IColumn[]> = {}

  // 统计每个节点包含的所有非 notExport 叶子节点
  function loop(columns: IColumn[]) {
    columns.forEach((item) => {
      node2leafs[item.title] = calculateLeafOfNode(item)
      if (item.children) {
        loop(item.children)
      }
    })
  }
  loop(columns)

  function calculateLeafOfNode(node: IColumn): IColumn[] {
    if (node.notExport) return []
    return node.children
      ? node.children.reduce((arr: IColumn[], item) => {
        return arr.concat(calculateLeafOfNode(item))
      }, [])
      : [node]
  }

  // 依赖 node2leafs，生成 columns
  const newColumns: IColumn[] = []
  function resetChildren(columns: IColumn[], newColumns: IColumn[]) {
    columns.forEach((column: IColumn) => {
      const { children, ...resProps } = column

      if (node2leafs[resProps.title].length) {
        newColumns.push(<IColumn>resProps)
      }
      if (children) {
        (<IColumn>resProps).children = []
        resetChildren(children, (resProps as IColumn & { children: IColumn[] }).children)
      }
    })
  }
  resetChildren(columns, newColumns)

  return newColumns
}

// 计算整棵树的高度
function getRootHeight(columns: IColumn[]) {
  let height = 0
  const loop = (children: IColumn[]) => {
    if (children.length) {
      height++
    }
    for (let i = 0; i < children.length; ++i) {
      if (children[i].children) {
        loop(<IColumn[]>children[i].children)
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
const getDataFromColumnsAndDataSource = (
  {
    hiddenHeader,
    columns,
    leafColumns,
    rootHeight,
    dataSource
  }: {
    hiddenHeader?: Boolean,
    columns: IColumn[],
    leafColumns: IColumn[],
    rootHeight: number,
    dataSource: Record<string, any>[]
  }
): any[][] => {
  const mergedHeaderDatas: any[][] = []

  // 不隐藏表头时，计算表头数据
  if (!hiddenHeader) {
    // 根据 s/e 计算表头文字所应该处的正确位置
    const title_src: Record<string, string> = {}
    const flat = (children: IColumn[]) => {
      children.forEach(column => {
        const { title, s, children } = column
        title_src[`${s.r}-${s.c}`] = title
        children && flat(children)
      })
    }
    flat(columns)
    // console.log('title_src ...', title_src)

    // 根据合并项计算表头数据格式
    for (let i = 0; i < rootHeight; ++i) {
      const mergedHeaderData: (string | null)[] = []
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

  const bodyData = dataSource.reduce((arr: any[][], item: Record<string, any>, i: number) => {
    arr.push(
      leafColumns.map(({ dataIndex, render }) => {
        if (render) {
          let onRenderFn = typeof render === 'function'
            ? render
            : new Function(
              'value',
              'row',
              'rowIndex',
              `return (${render})(value, row, rowIndex)`
            ) // in worker
          return onRenderFn(item[dataIndex], item, i)
        } else {
          return item[dataIndex]
        }
      })
    )
    return arr
  }, [])
  // console.log('bodyData ...', bodyData)

  return mergedHeaderDatas.concat(bodyData as any[][])
}

// 从 start 行开始，计算 dataSource 中和 value 相同的行数
function getSameRows({
  start,
  value,
  dataSource,
  dataIndex
}: {
  start: number,
  value: any,
  dataSource: Record<string, any>[],
  dataIndex: string
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

// 获取列宽度 https://www.npmjs.com/package/xlsx#row-and-column-properties
const getCols = (leafColumns: IColumn[]) => {
  return leafColumns.map(({ width = 120 }) => ({ wpx: width }))
}

// 获取所有表头合并项
function getHeaderMerges(
  {
    columns,
    rootHeight
  }: {
    columns: IColumn[],
    rootHeight: number
  }
): IMerge[] {
  getWidthOfNode(columns)
  getHeightOfNode(columns)

  const merges: IMerge[] = []
  getCellMerges({
    columns,
    rootHeight,
    merges
  })
  getColSpanMerges({
    columns,
    merges
  })
  // console.log('columns ....', merges, columns)
  return merges
}


// 表格合并
function getBodyMerges({
  hiddenHeader,
  rootHeight,
  leafColumns,
  dataSource
}: {
  hiddenHeader?: Boolean,
  rootHeight: number,
  leafColumns: IColumn[],
  dataSource: Record<string, any>[]
}) {
  const bodyMerges: IMerge[] = []
  leafColumns.map(({ dataIndex, s, merge, onCell }, columnIndex) => {

    // 同一列合并
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

    // 表格内部局部单元格合并
    for (let i = 0; i < dataSource.length; i++) {
      if (onCell) {
        let onCellFn = typeof onCell === 'function'
          ? onCell
          : new Function('record', 'index', `return (${onCell})(record, index)`) // in worker 返回匿名函数自执行的结果
        const { rowSpan, colSpan } = onCellFn(dataSource[i], i)

        if (rowSpan) {
          // 行合并
          overlapMerges({
            merges: bodyMerges,
            curMerge: {
              s: {
                r: rootHeight + i,
                c: hiddenHeader ? columnIndex : s.c
              },
              e: {
                r: rootHeight + i + rowSpan - 1,
                c: hiddenHeader ? columnIndex : s.c
              }
            }
          })
        }
        if (colSpan) {
          // 列合并
          overlapMerges({
            merges: bodyMerges,
            curMerge: {
              s: {
                r: rootHeight + i,
                c: hiddenHeader ? columnIndex : s.c
              },
              e: {
                r: rootHeight + i,
                c: (hiddenHeader ? columnIndex : s.c) + colSpan - 1
              }
            }
          })
        }
      }
    }
  })

  // console.log('bodyMerges ...', bodyMerges)
  return bodyMerges
}

/**
 * 判断 merges 内是否有与 curMerge 相同合并区间
 *    如果有，则扩大已有区间
 *    如果没，则把 curMerge 加入到 merges 内
 */
function overlapMerges(
  {
    merges,
    curMerge
  }: {
    merges: IMerge[],
    curMerge: IMerge
  }
) {
  let i = 0;
  for (; i < merges.length; ++i) {
    let merge = merges[i]
    let noOverlap =
      merge.e.r < curMerge.s.r ||
      merge.s.r > curMerge.e.r ||
      merge.e.c < curMerge.s.c ||
      merge.s.c > curMerge.e.c

    if (!noOverlap) {
      // 存在共同区间

      merge.s = {
        r: Math.min(merge.s.r, curMerge.s.r),
        c: Math.min(merge.s.c, curMerge.s.c)
      }
      merge.e = {
        r: Math.max(merge.e.r, curMerge.e.r),
        c: Math.max(merge.e.c, curMerge.e.c)
      }
      return
    }
  }

  // 不存在共同区间
  merges.push(curMerge)
}

// 计算每个节点的宽度（子孙叶子节点个数）
function getWidthOfNode(columns: IColumn[]) {
  columns.forEach((item) => {
    item.leafCount = calculateWidthOfNode(item)
    if (item.children) {
      getWidthOfNode(item.children)
    }
  })

  // 以每个节点作为根节点，计算每个节点的叶子节点个数
  // 如果本身是叶子节点，则返回 1
  function calculateWidthOfNode(node: IColumn): number {
    return node.children
      ? node.children.reduce((count, item) => {
        return count += calculateWidthOfNode(item)
      }, 0)
      : 1
  }
}

// 计算这棵树的每个节点的高度
// pHeight 父节点的高度
function getHeightOfNode(columns: IColumn[], pHeight = 0) {
  for (let i = 0; i < columns.length; ++i) {
    columns[i].rootHeight = pHeight + 1
    if (columns[i].children) {
      getHeightOfNode(
        <IColumn[]>columns[i].children, 
        columns[i].rootHeight
      )
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
}: {
  columns: IColumn[],
  rootHeight: number,
  merges: IMerge[],
  p_sc?: number,
  p_sr?: number,
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
        title: column.title,
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
 * 表头列合并
 * 注：表头只支持列合并，使用 column 里的 colSpan 进行设置。
 */
function getColSpanMerges(
  {
    columns,
    merges
  }: {
    columns: IColumn[],
    merges: IMerge[]
  }
) {
  columns.forEach((column, i) => {
    let targetColSpans = column.colSpan
      ? column.colSpan - 1 // 该列打算合并兄弟列数
      : -1
    if (targetColSpans > 0) {
      let mergeItem = merges.find(({ title }) => title === column.title)
      if (!mergeItem) return

      let er, ec
      // 判断合并数是否超出当前同层 columns 宽度
      //    未超出，则使用第 i + targetColSpans 兄弟节点的 e
      //    超出，则使用最后一个兄弟节点的 e
      if (i + targetColSpans < columns.length) {
        er = Math.max(column.e.r, columns[i + targetColSpans].e.r)
        ec = columns[i + targetColSpans].e.c
      } else {
        er = Math.max(column.e.r, columns[columns.length - 1].e.r)
        ec = columns[columns.length - 1].e.c
      }
      column.e = mergeItem.e = {
        r: er,
        c: ec
      }

      // 如果子节点的合并项在祖先节点的合并项之内，则删除子节点的合并项
      for (let i = merges.length - 1; i; --i) {
        if (
          merges[i].s.r >= column.s.r &&
          merges[i].s.c >= column.s.c &&
          merges[i].e.r <= column.e.r &&
          merges[i].e.c <= column.e.c
        ) {
          merges.splice(i, 1)
        }
      }

      // 因为上一步把目标 mergeItem 从 merges 也删除了，在此加回来
      merges.push(mergeItem)
    }

    column.children && getColSpanMerges({
      columns: column.children,
      merges
    })
  })
}
