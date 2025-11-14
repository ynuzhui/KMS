## KMS激活

基于Vue的KMS激活网站

### Demo

- [预览](https://kms.yunzhui.top)

### 修改

- 将 **`.env.example`** 重命名为 **`.env`** 然后修改 **`.env`** 文件中的内容值即可

### 部署

* **安装** [node.js](https://nodejs.org/zh-cn/) **环境**

  > node > 16.16.0
  > npm > 8.15.0

* 然后以 **管理员权限** 运行 `cmd` 终端，并 `cd` 到 项目根目录
* 在 `终端` 中输入：

```bash
# 安装依赖
npm install
# 预览
npm run dev
# 构建
npm run build
```
> 构建完成后，静态资源会在 **`dist` 目录** 中生成，可将 **`dist` 文件夹下的文件**上传至服务器，也可使用 `Vercel` 等托管平台一键导入并自动部署

### Vercle部署

>点击后自动部署并创建仓库

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ynuzhui/KMS&repository-name=KMS)
