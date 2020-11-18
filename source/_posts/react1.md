---
title: React学习记录：基本环境安装 (填坑记录)
date: 2020-11-16 08:58:27
tags: [React]
categories: React染坊
mathjax: true
cover: https://forever97.github.io/2020/11/16/react1/1.png
---

React.js并不能像D3.js一样直接在js里面包含一个文件即可，而是需要一堆工具和库来辅助，这里呢，有一个非常方便的工具[create-react-app](https://github.com/facebookincubator/create-react-app)，可以直接一键生成需要的工具目录，免去全家桶的安装和配置

根据官方文档先安装了creat-react-app

```
npm install -g create-react-app
```

接着就可以按照文档说明创建一个react工程

```
npx create-react-app my-app
cd my-app
npm start
```

## npm start失败

然后，执行到这一步的时候就挂了，npm start失败了，报错信息是

```
npm ERR! code ELIFECYCLE
```

在项目的Issues里面找到了这个问题的解决方案

{% tabs test %}
<!-- tab Following the steps -->
1. Delete package-lock.json (not package.json!) and/or yarn.lock in your project folder.
2. Delete node_modules in your project folder.
3. Remove "babel-loader" from dependencies and/or devDependencies in the package.json file in your project folder.
4. Run npm install or yarn, depending on the package manager you use.
<!-- endtab -->

<!-- tab If this has not helped -->
5. If you used npm, install yarn (http://yarnpkg.com/) and repeat the above steps with it instead.This may help because npm has known issues with package hoisting which may get resolved in future versions.
6. Check if /Users/Dylan/myapp/node_modules/babel-loader is outside your project directory.For example, you might have accidentally installed something in your home folder.
7. Try running npm ls babel-loader in your project folder.This will tell you which other package (apart from the expected react-scripts) installed babel-loader.
<!-- endtab -->

<!-- tab If nothing else helps -->
If nothing else helps, add SKIP_PREFLIGHT_CHECK=true to an .env file in your project. That would permanently disable this preflight check in case you want to proceed anyway.
<!-- endtab -->

{% endtabs %}

结果是，都没有用

网上的解决方案也是如出一辙

```
Step1：npm cache clean --force
Step2：rm -rf node_modules
Step3：rm -rf package-lock.json
Step4：npm install
npm install 成功之后再次启动 npm start
```

也没有效果，当时我是感觉，完蛋了，要去装React全家桶了，最后在[stackoverflow](https://stackoverflow.com/)上找到了不太一样的答案

![](2.png)

我觉得应该是破案了，刚前几天做一个东西的时候把node.js版本从10.16更新到了12.0，大家的回复表示这个版本的node应该是会有一些奇怪的bug的，那现在需要的就是一个node.js的版本回退了

## nvm装完npm无效

想着node.js的版本可能以后还得切，所以干脆装个包管理工具，于是装了个nvm

surprise，新锅出现了，我的npm没了……

![](3.png)

这个问题好像就比较普遍了，但是错误原因也是花里胡哨的

最后是通过这个方法解决的：[[博客链接]](https://blog.csdn.net/fenfeidexiatian/article/details/96993384)

这个时候再start一下

![](1.png)

看到这个react的图标，算是真的完成了环境搭建

在src文件中就是我们可以修改的页面了

![](4.png)







