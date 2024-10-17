export type IColumn = {
  title: string;
  width?: number;
  notExport?: boolean;
  children?: IColumn[];
  render?: (value: any, row: Record<string, any>, rowIndex: number) => any | string;
  onCell?: Function | string;
  colSpan?: number;

  [key: string]: any;
  // dataIndex?: string;  表头分组 父 column 没 dataIndex
  // rootHeight?: number; 
  // leafCount?: number;
  // s?: Point;
  // e?: Point;
  // merge?: IMerge;
}

export interface ICellStyle {
  fontSize?: number;
  color?: string;
  bold?: boolean;
  background?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderColor?: string;
}

export interface ISheet {
  name?: string;
  columns: IColumn[];
  dataSource: Record<string, any>[];
  hiddenHeader?: boolean; // 导出表格时，是否隐藏表头。默认显示表头
  style?: {
    header?: ICellStyle;
    body?: ICellStyle;
  }
}

export interface IExcel {
  sheets: ISheet[];
  filename?: string;
  hiddenHeader?: boolean; // 导出表格时，是否隐藏所有 sheet 表头
  worker?: boolean;
}

// cell 左上角
export type Point = {
  r: number;
  c: number;
}

export type IMerge = {
  title?: string;
  s: Point;
  e: Point;
}

export type getCellStyleType = (
  {
    isTitle,
    style
  }: {
    isTitle: boolean,
    style?: ISheet['style']
  }
) => styleType


export type Side = 'top' | 'bottom' | 'left' | 'right'

export type borderType = Record<
  Side, 
  {
    style: string,
    color?: {
      rgb?: string
    }
  }
>

export type styleType = {
  font?: {
    sz?: number,
    color: {
      rgb?: string
    },
    bold?: Boolean
  },
  alignment: {
    horizontal?: ICellStyle['textAlign'],
    wrapText: Boolean
  },
  border: borderType,
  fill?: {
    fgColor: {
      rgb: string
    }
  }
}
