/**
 * 主 Excel 配置接口
 */
export interface IExcel {
  sheets: ISheet[];                   // 表格中的工作表列表
  filename?: string;                  // 导出的文件名
  hiddenHeader?: boolean;             // 是否隐藏所有工作表的表头
  worker?: boolean;                   // 是否启用 Worker 多线程
}

/**
 * 工作表配置接口
 */
export interface ISheet {
  name?: string;                      // 工作表名称
  columns: IColumn[];                 // 列配置
  dataSource: Record<string, any>[];  // 数据源
  hiddenHeader?: boolean;             // 是否隐藏当前表的表头（优先级高于全局配置）
  style?: ISheetStyle;                // 样式配置
}

/**
 * 样式配置接口（表头和正文）
 */
export interface ISheetStyle {
  header?: IStyleConfig;              // 表头样式配置
  body?: IStyleConfig;                // 正文样式配置
}

/**
 * 列配置接口
 */
export type IColumn = {
  title: string;                      // 列标题
  width?: number;                     // 列宽度
  notExport?: boolean;                // 是否不导出该列
  children?: IColumn[];               // 子列（支持分组表头）
  render?: (value: any, row: Record<string, any>, rowIndex: number) => any | string; // 自定义单元格渲染
  onCell?: Function | string;         // 单元格事件
  colSpan?: number;                   // 合并列数
  [key: string]: any;                 // 额外字段支持

  // dataIndex?: string;  表头分组 父 column 没 dataIndex
  // rootHeight?: number; 
  // leafCount?: number;
  // s?: Point;
  // e?: Point;
  // merge?: IMerge;
}

/**
 * 单元格左上角位置坐标
 */
type Point = {
  r: number;                          // 行索引
  c: number;                          // 列索引
}

/**
 * 单元格合并信息
 */
export type IMerge = {
  title?: string;                     // 合并后的标题
  s: Point;                           // 合并起始位置
  e: Point;                           // 合并结束位置
}

/**
 * 用户配置的样式接口
 */
export interface IStyleConfig {
  fontSize?: number;                  // 字体大小
  color?: string;                     // 字体颜色
  bold?: boolean;                     // 是否加粗
  background?: string;                // 背景色（优先级低于 backgroundColor）
  backgroundColor?: string;           // 背景颜色
  textAlign?: 'left' | 'center' | 'right'; // 文本对齐方式
  borderColor?: string;               // 边框颜色
}

/**
 * 边框的方向
 */
export type Side = 'top' | 'bottom' | 'left' | 'right';

/**
 * 单个单元格样式
 */
export type ICellStyle = {
  font?: {
    sz?: number;                      // 字体大小
    color?: {
      rgb: string;                    // 字体颜色（RGB 格式）
    }
    bold?: boolean;                   // 是否加粗
  }
  alignment: {
    horizontal: IStyleConfig['textAlign']; // 水平对齐方式
    wrapText: boolean;                // 是否自动换行
  }
  border: Record<
    Side,
    {
      style: string;                  // 边框样式
      color?: {
        rgb?: string;                 // 边框颜色（RGB 格式）
      }
    }
  >;
  fill: {
    fgColor: {
      rgb?: string;                   // 填充颜色（RGB 格式）
    }
  }
}
