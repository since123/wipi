# wipi

A blog system write by nestjs, nextjs, and MySQL.

前后端分离，服务端渲染的博客系统。支持特性：

- 文章创建、编辑、发布
- 文章及页面评论
- 文章搜索及搜索记录管理
- 页面动态创建
- 文件上传（上传到 阿里云 OSS）
- 邮件通知
- 动态系统设置（系统标题、Logo、favicon、页脚及 SEO 配置等）
- 系统访问统计（ip + user-agent）

## 线上预览

### 前台页面

https://custw.qifengle1412.cn/

### 后台管理页面截图

<ul style="display: flex; flex-wrap: no-wrap; list-style: none; padding: 0">
  <li><img style="width: 180px; height: 120px" src="https://wipi.oss-cn-shanghai.aliyuncs.com/2020-02-13/PMHJN7AB7S95TU83JGRZW0/wipi-login.png" alt="登录页面" /></li>
  <li><img style="width: 180px; height: 120px; margin-left: 10px" src="https://wipi.oss-cn-shanghai.aliyuncs.com/2020-02-13/PMHJN7AB7S95TU83JGRZR2/wipi-admin-index.png" alt="后台首页" /></li>
  <li  ><img style="width: 180px; height: 120px; margin-left: 10px" src="https://wipi.oss-cn-shanghai.aliyuncs.com/2020-02-13/PMHJN7AB7S95TU83JGRZOL/wipi-admin-article.png" alt="文章管理" /></li>
  <li  ><img style="width: 180px; height: 120px; margin-left: 10px" src="https://wipi.oss-cn-shanghai.aliyuncs.com/2020-02-13/PMHJN7AB7S95TU83JGRZTJ/wipi-admin-page.png" alt="页面管理" /></li>
</ul>

更多页面及特性可以本地启动使用。

## 本地启动

### clone 本项目。

```shell
git clone --depth=1 https://github.com/zhxuc/wipi.git ypur-project-name
```

### 安装依赖

首先安装 `MySQL`，推荐使用 docker 进行安装。

```shell
docker run -d --restart=always --name wipi-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql
```

然后安装项目 node 依赖。

```shell
cd client && yarn
cd server && yarn
```

### 启动项目

分别启动前台页面和服务端。

```shell
cd client && yarn dev
cd server && yarn start:dev
```

打开浏览器，访问 `http://localhost:3000` 即可访问前台页面，`http://localhost:3000/admin` 为后台管理页面。

服务端接口运行在 `http://localhost:4000`。

首次启动，默认创建用户：wipi，密码：wipi（可在 `server/src/config` 文件中进行修改）。

[PS] 如服务端配置启动失败，请先确认 MySQL 的配置是否正确，配置文件在 `server/src/config`。

## 项目部署

在服务端使用 pm2 进行部署即可，可以查看[`deploy.sh`](./deploy.sh)文件。

## 搜索服务

该项目使用了 MySQL 模糊查询提供搜索接口。如果服务器配置较高，或想体验更强大的搜索服务（elasticsearch），可以参考 `elasticsearch` 文件下 `deploy.sh` 文件。
