### 特点

在 `create-react-demo` 创建的项目基础上加入了以下功能，可满足绝大多数日常项目开发：

1. 加入了 `antd`, `axios`, `dayjs`, `mobx`
2. 采用了 `typescript` 构建
3. 项目进行了按需引入，组件懒加载，打包压缩去除注释，别名配置，`sass/less` 模块化支持、以及暴露了自定义 `webpack` 配置入口
4. 配置了开发代理，见 `src\setupProxy.js`
5. 配置了基本的 `axios` 拦截响应
6. 配置了 `store`
7. 处理了 `router` 的嵌套配置
8. 添加了常见的 `.gitignore` 及 `.npmrc` 文件
9. 支持 `mobx` 和 `redux` 状态管理器选择

### Download

`$ git clone https://github.com/zhuyuanmin/zym-cli.git`

### Usage

> npm

```bash
$ cd zym-cli
$ npm install
$ npm link
任意目录可使用：$ npx zym create <projectName>
```

> yarn

```bash
$ cd zym-cli
$ yarn
$ yarn link
任意目录可使用：$ zym create <projectName>
```

