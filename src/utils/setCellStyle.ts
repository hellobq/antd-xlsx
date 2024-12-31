import {
  ISheet,
  IStyleConfig,
  ICellStyle,
  Side
} from '../type'

/**
 * 设置单元格样式
 * @param cellStyleConfig - 包含 isTitle 和 style 的单元格样式配置
 * @returns 完整的单元格样式对象
 */
export default function setCellStyle(
  cellStyleConfig: { isTitle: boolean, style?: ISheet['style'] }
): ICellStyle {
  const { 
    isTitle, 
    style = { 
      header: {}, 
      body: {} 
    } 
  } = cellStyleConfig

  const cellStyle: ICellStyle = {
    alignment: {
      horizontal: 'left',
      wrapText: true,
    },
    border: createCellBorders(),
    fill: {
      fgColor: {}
    }
  }

  // 根据是否是标题设置不同样式
  const appliedStyle = isTitle 
    ? { ...defaultHeaderStyle, ...style.header }
    : { ...defaultBodyStyle, ...style.body }

  applyStyle(cellStyle, appliedStyle)

  return cellStyle
}

/**
 * 默认表头样式
 */
const defaultHeaderStyle: IStyleConfig = {
  bold: true,
  backgroundColor: 'dddddd',
  textAlign: 'center',
}

/**
 * 默认正文样式
 */
const defaultBodyStyle: IStyleConfig = {
  backgroundColor: 'ffffff',
  textAlign: 'left',
}

/**
 * 创建单元格边框样式
 * @returns 表格边框对象
 */
function createCellBorders(): ICellStyle['border'] {
  const sides: Side[] = ['top', 'bottom', 'left', 'right']
  return sides.reduce((borders, side) => {
    borders[side] = { style: 'thin' }
    return borders
  }, {} as ICellStyle['border'])
}

/**
 * 应用样式
 * @param target - 待修改的单元格样式
 * @param source - 用户自定义样式
 */
function applyStyle(
  target: ICellStyle,
  source: IStyleConfig,
): void {
  if (!source) return

  const {
    fontSize,
    color,
    bold,
    background,
    backgroundColor = source.backgroundColor,
    textAlign = source.textAlign,
    borderColor,
  } = source

  target.font = {
    sz: fontSize,
    color: color ? { rgb: color } : undefined,
    bold,
  }

  target.alignment.horizontal = textAlign

  target.fill.fgColor.rgb = background || backgroundColor

  Object.keys(target.border).forEach((side) => {
    target.border[side as Side].color = borderColor ? { rgb: borderColor } : undefined
  })
}
