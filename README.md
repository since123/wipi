# wipi

A blog system write by nestjs, nextjs, and MySQL.

前后端分离，服务端渲染的博客系统。

## 线上预览

- 前台页面：https://custw.qifengle1412.cn/
- 后台管理：https://custw.qifengle1412.cn/

## 本地启动

1. clone 本项目。

```shell
git clone --depth=1 https://github.com/zhxuc/wipi.git ypur-project-name
```

2. 安装依赖

首先安装 `MySQL`，推荐使用 docker 进行安装。

```shell
docker run -d --restart=always --name wipi-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql
```

然后安装项目 node 依赖。

```shell
cd client && yarn
cd server && yarn
```

3. 启动项目

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
