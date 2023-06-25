/**
 *  设置单元格样式
 *     isTitle: 是否是表头
 *       style: 用户设置的 style 字面量
 */
export function getCellStyle({
  isTitle,
  style
}) {
  const s = {
    alignment: {
      vertical: 'center',
      horizontal: 'left',
      wrapText: true
    },
    border: getCellBorders()
  }

  isTitle && setHeaderStyle({
    s,
    style
  })
  return s
}

/**
 * 返回表格边框 sides: ['top', 'bottom' ...]
 */
function getCellBorders() {
  const sides = ['top', 'bottom', 'left', 'right']
  return sides.reduce((obj, side) => {
    obj[side] = {
      style: 'thin'
    }
    return obj
  }, {})
}

/**
 * 根据 style，改变 s 部分属性的引用值
 *        s: 每个单元格样式
 *    style: 用户设置的 style 字面量
 */
function setHeaderStyle({
  s,      
  style,
}) {
  if (!style) {
    style = {
      header: {}
    }
  }

  const {
    fontSize, 
    color, 
    bold = true,
    background,
    backgroundColor = 'dddddd', 
    textAlign = 'center',
    borderColor
  } = style.header

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
    s.border[side].color = {
      rgb: borderColor
    }
  }
}
