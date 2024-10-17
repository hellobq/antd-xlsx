import { 
  getCellStyleType, 
  styleType,
  Side,
  borderType,
  ICellStyle,
} from "../type"

/**
 *  设置单元格样式
 *     isTitle: 是否是表头
 *       style: 用户设置的 style 字面量
 */
const getCellStyle: getCellStyleType = cellStyle => {
  let {
    isTitle,
    style
  } = cellStyle

  const s: styleType = {
    alignment: {
      horizontal: 'left',
      wrapText: true
    },
    border: getCellBorders()
  }

  if (!style) {
    style = {
      header: {},
      body: {}
    }
  } else {
    if (!style.header) style.header = {}
    if (!style.body) style.body = {}
  }

  isTitle 
    ? setStyle({
        s,
        style: style.header,
        defaultStyle: {
          bold: true,
          backgroundColor: 'dddddd',
          textAlign: 'center'
        }
      })
    : setStyle({
        s,
        style: style.body,
        defaultStyle: {
          backgroundColor: 'ffffff',
          textAlign: 'left'
        }
      })
  return s
}

/**
 * 返回表格边框 sides: ['top', 'bottom' ...]
 */
function getCellBorders() {
  const sides: Side[] = ['top', 'bottom', 'left', 'right']
  return sides.reduce((obj, side: Side) => {
    obj[side] = {
      style: 'thin'
    }
    return obj
  }, {} as borderType)
}

/**
 * 根据 style，改变 s 部分属性的引用值
 *               s: 每个单元格样式
*            style: 用户设置的 style 字面量
 *    defaultStyle: 默认样式
 */
function setStyle({
  s,      
  style,
  defaultStyle
}: {
  s: styleType,
  style?: ICellStyle,
  defaultStyle: ICellStyle & {
    backgroundColor: string;
    textAlign: 'left' | 'center' | 'right';
  },
}) {
  if (!style) return
  const {
    fontSize, 
    color,    
    bold = defaultStyle.bold,
    background,
    backgroundColor = defaultStyle.backgroundColor,
    textAlign = defaultStyle.textAlign,
    borderColor
  } = style

  s.font = {
    sz: fontSize,
    color: {
      rgb: color
    },
    bold
  }

  s.alignment.horizontal = textAlign
  s.fill = {
    fgColor: {
      rgb: background || backgroundColor
    }
  }

  for (let side in s.border) {
    s.border[side as Side].color = {
      rgb: borderColor
    }
  }
}

export default getCellStyle 
