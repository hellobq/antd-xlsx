### [1.4.1] - 2024-08-13
#### Added
- 支持在 Web Worker 内调用导出方法，注意：Worker 路径、onCell、render；
- 暴露 saveAs 方法；

#### Changed
- 把工具函数统一放到 utils 内；
- example-vite2 演示代码支持 Worker 示例；
- example-vite2 支持 analyze，剥离 xlsx-style-vite 模块；

### [1.4.0] - 2024-03-01
#### Added
- 新增 nostyle 导出方法，使用其导出的表格不能设置样式，但可 tree-shaking 掉 xlsx-style-vite 包；
- 新增 webpack4 对应的 example；
- 新增 workflow 脚本，可在 https://hellobq.github.io/antd-xlsx 查看导出 demo；
- 新增 changelog.md；

#### Changed
- 新增 rimraf、cpy-cli 依赖，完善构建流程，project 要求 node >= 14；
- 新增 watch script，方便本地打包调试；
- 修改 build 相关 script，增加对 esm/cjs 格式的产物分别构建；
- 新增 gh-pages script，配合 workflow 脚本，部署最新产物；
- 新增 publishConfig 配置，删除 .npmrc 文件；
- package-lock.json 更换镜像源，使用 https://registry.npmmirror.com；
- 修改 README.md，en -> zh
