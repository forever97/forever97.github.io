---
title: React学习记录：更强大的评论系统
date: 2020-11-19 09:21:49
tags: [React]
categories: React染坊
mathjax: true
cover: /2020/11/19/react3/1.png
---

我们来继续优化之前写的[评论系统](/2020/11/17/react2/)

## 聚焦功能

首先给评论系统增加一个聚焦功能，具体是，当页面加载完毕之后，会自动聚焦到评论框

React.js通过`ref`来获取已经挂载的元素的DOM节点

我们在textarea中使用`ref`，`ref`是一个函数，当元素在页面上挂载完毕的时候，React.js 就会调用这个函数，并且把这个挂载以后的 DOM节点传给这个函数，之后我们就可以通过this.(元素名)来获取这个DOM元素

```javascript
<textarea 
    ref={(textarea) => this.textarea = textarea}
    value={this.state.content}
    onChange={this.handleContentChange.bind(this)} />
```

然后在class中加入`ComponentDidMount`生命周期

[React.js生命周期方法](https://www.runoob.com/react/react-component-life-cycle.html)

`ComponentDidMount`在第一次渲染后调用

```javascript
componentDidMount () {
    this.textarea.focus()
}
```

![](1.png)

刷新页面后，可以看到已经完成了对评论框的聚焦

## 组件参数验证

Javascript是一种非常灵活的语言，灵活体现在其弱类型，高阶函数等语言特性，但是这也意味着特别容易出bug

这里我突然想起来一则笑话：程序员开发团队写了一个咖啡馆，然后测试员开始对咖啡馆进行测试，他们开始尝试从门口走入咖啡馆，爬窗进入，从下水道进入咖啡馆，坐着，躺着，站着喝咖啡，最后对这个咖啡馆表示满意，结果，咖啡馆上线的第一天，一位顾客进来点了一份炒饭，咖啡馆爆炸了

嗯，是这样的，你永远没法知道使用者会对组件传入什么奇怪的参数，强类型的语言可以一定程度上规避这个问题，弱类型语言由于限制规则少，安全性是很差的

我们在写评论组件的时候，传入的props是一个comment数组，如果使用组着的人传入一个数字1，页面不会有任何的报错，但是会显示不正常，所以我们需要定义一个props的类型

```javascript
static propTypes = {
    comment: PropTypes.object
}
```

## 用户名记录

接下来实现一个功能，让用户在浏览器刷新之后保留上一次填写的用户名，

{% note default modern %}
未完待续
{% endnote %}
