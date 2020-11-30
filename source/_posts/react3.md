---
title: React学习记录：更强大的评论系统
date: 2020-11-19 09:21:49
tags: [React]
categories: 🎨React染坊
mathjax: true
cover: /2020/11/19/react3/1.png
---

我们来继续优化之前写的[评论系统](/2020/11/17/react2/)

{% folding cyan, 功能实现CheckList %}

{% checkbox checked, 聚焦功能 %}

{% checkbox, 组件参数验证 %}

{% checkbox checked, 用户名记录 %}

{% checkbox checked, 评论记录 %}

{% checkbox checked, 发布时间显示 %}

{% checkbox checked, 评论删除 %}

{% checkbox, 代码块引入 %}

{% endfolding %}

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

教程上是这么使用的

```javascript
static propTypes = {
    comment: PropTypes.object
}
```

我照着使用之后报错了

{% tip warning %}
PropTypes 自 React v15.5 起被移除，使用 prop-types 第三方库来进行替换
{% endtip %}

安装这个库之后从prop-types中导入，用法是相同的

## 用户名记录

接下来实现一个功能，让用户在浏览器刷新之后保留上一次填写的用户名

我们首先监听失去焦点的事件`onBlur`

`onBlur`和`onChange`的区别：`onBlur`是光标焦点只要离开调用方法的文本框就会发生，而`onChange`则是内容改变才会发生


{% tabs test %}
<!-- tab input中加入onBlur -->
```javascript
<input
      value={this.state.username}
      onBlur={this.handleUsernameBlur.bind(this)}
      onChange={this.handleUsernameChange.bind(this)} />
```
<!-- endtab -->

<!-- tab 存储信息-->
```javascript
_saveUsername (username) {
    localStorage.setItem('username', username)
}

handleUsernameBlur (event) {
    this._saveUsername(event.target.value)
}
```
<!-- endtab -->

{% endtabs %}

然后我们在`componentWillMount`生命周期载入名字

```javascript
componentWillMount () {
    this._loadUsername()
}

_loadUsername () {
    const username = localStorage.getItem('username')
    if (username) {
        this.setState({ username })
    }
}
```

## 评论记录

然后我们用相同的方式把评论也持久化，在每次用户提交评论的时候保存评论列表数据，挂载的时候加载起来

```javascript
class CommentApp extends Component {
    componentWillMount () {
        this._loadComments()
    }
    
    _loadComments () {
        let comments = localStorage.getItem('comments')
        if (comments) {
            comments = JSON.parse(comments)
            this.setState({ comments })
        }
    }
    
    _saveComments (comments) {
        localStorage.setItem('comments', JSON.stringify(comments))
    }

    handleSubmitComment (comment) {
        if (!comment) return
        if (!comment.username) return alert('请输入用户名')
        if (!comment.content) return alert('请输入评论内容') 
        const comments = this.state.comments
        comments.push(comment)
        this.setState({ comments })
        this._saveComments(comments)
    }
}
```

## 显示发布时间

我们记录发布评论的时间，通过和当前时间的差值来计算

{% tabs test %}
<!-- tab CommentInput修改 -->

```javascript
handleSubmit () {
    if (this.props.onSubmit) {
        // const { username, content } = this.state
        this.props.onSubmit({
            username: this.state.username,
            content: this.state.content,
            createdTime: +new Date()
        })
    }
    this.setState({ content: '' })
}
```

<!-- endtab -->

<!-- tab Comment中增加时间显示-->

```javascript
class Comment extends Component {
    constructor () {
        super()
        this.state = { timeString: '' }
    }
    
    componentWillMount () {
        this._updateTimeString()
    }

    _updateTimeString () {
        const comment = this.props.comment
        const duration = (+Date.now() - comment.createdTime) / 1000
        this.setState({
            timeString: duration > 60
            ? `${Math.round(duration / 60)} 分钟前`
            : `${Math.round(Math.max(duration, 1))} 秒前`
        })
    }

    render () {
        return (
            <div className='comment'>
                <div className='comment-user'>
                    <span>{this.props.comment.username} </span>：
                </div>
                <p>{this.props.comment.content}</p>
                <span className='comment-createdtime'>
                    {this.state.timeString}
                </span>
            </div>
        )
    }
}
```

<!-- endtab -->

{% endtabs %}

![](2.png)

这样就能够显示评论是在几分钟前发布的，但是需要刷新页面才能够更新显示时间

我们希望评论的时间能自动刷新，所以我们用`setInterval`设置一个刷新时间

```javascript
componentWillMount () {
    this._updateTimeString()
    this._timer = setInterval(
        this._updateTimeString.bind(this),
        5000
    )
}
```

## 删除评论

我们接着给评论系统增加删除功能，首先在comment.js中增加一个`删除`按钮，在css中设置被鼠标cover时才能出现

```javascript
 render () {
    const { comment } = this.props
    return (
        <div className='comment'>
            <div className='comment-user'>
                <span className='comment-username'>
                    {comment.username}
                </span>:
            </div>
            <p>{comment.content}</p>
            <span className='comment-createdtime'>
                {this.state.timeString}
            </span>
            <span className='comment-delete'>
                删除
            </span>
        </div>
    )
}
```

现在这个删除按钮时在Comment组件中的，但是存储评论是在CommentApp组件中，我们需要通过CommentList来传递删除的信息

我们在Comment以及CommentList的props中再设置一个参数onDeleteComment

{% tabs test %}
<!-- tab Comment.js修改 -->

```javascript
handleDeleteComment () {
    if (this.props.onDeleteComment) {
        this.props.onDeleteComment(this.props.index)
    }
}
```

```javascript
<span
    onClick={this.handleDeleteComment.bind(this)}
    className='comment-delete'>
    删除
</span>
```

<!-- endtab -->

<!-- tab CommentList.js修改-->

```javascript
handleDeleteComment (index) {
    if (this.props.onDeleteComment) {
        this.props.onDeleteComment(index)
    }
}

render() {
    return (
        <div>
            {this.props.comments.map((comment, i) =>
            <Comment
                comment={comment}
                key={i}
                index={i}
                onDeleteComment={this.handleDeleteComment.bind(this)} />
            )}
        </div>
    )
}
```

<!-- endtab -->

<!-- tab CommentApp.js修改-->

```javascript
handleDeleteComment (index) {
    const comments = this.state.comments
    comments.splice(index, 1)
    this.setState({ comments })
    this._saveComments(comments)
}

render() {
    return (
        <div className='wrapper'>
            <CommentInput onSubmit={this.handleSubmitComment.bind(this)} />
            <CommentList
                comments={this.state.comments}
                onDeleteComment={this.handleDeleteComment.bind(this)} />
        </div>
    )
}
```

<!-- endtab -->

{% endtabs %}

看看这些代码，会觉得其实非常套娃，当用户点击删除按钮的时候`Comment`组件会调用`props.onDeleteComment`，其对应`CommentList`中的`handleDeleteComment`，在这个函数中，调用了`commentList`的`props.onDeleteComment`，其对应的是`CommentApp`组件中的`handleDeleteComment`，这就把参数index逐层传递了上来

快乐删除，并得到了一个报错

![](3.png)

这是因为我们评论的计时器没有删除掉，我们在Comment组件中新增生命周期commentWillUnmount，在组件销毁时清除定时器，类似于C++的析构函数

```javascript
componentWillUnmount () {
    clearInterval(this._timer)
}
```

{% tip success %} 删除功能完成 {% endtip %}

{% btns rounded grid5 %}

{% cell 演示地址, https://forever97.github.io/comment-app/, fab fa-apple %}

{% cell 下载源码, https://github.com/forever97/comment-app/tree/master, fas fa-download %}

{% endbtns %}

