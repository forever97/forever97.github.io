---
title: D3学习记录：动画与过渡
date: 2020-10-29 16:23:51
tags: [D3]
categories: 🍵D3茶楼
mathjax: true
cover: /2020/10/29/fullStack4/1.png
---

动画和过渡是D3中非常重要的一块内容

## 为柱状图添加动画

首先我们学习一下如何对[之前的柱状图](/2020/10/29/fullStack3/)增添动画

之前我们完成柱状图之后，可以通过调用函数生成多个不同的柱状图，现在我们希望用一个按钮来完成柱状图之间的切换，因为每个柱状图中柱子的数量是不同的，因此这就涉及到了d3中各种状态的处理，当exit态中一个柱子退出图像或者enter态中一个柱子加入图像的过程，我们肯定不希望是直接消失或者直接出现的，这样会非常丑，于是，就需要过渡和动画

首先设置动画过渡的时长

```javascript
const exitTransition = d3.transition().duration(500)
const updateTransition = d3.transition().duration(1000)
```

插入动画呢，只要在希望过渡的属性之前加入.transition(updateTransition)即可

我们得设置进入状态，更新状态，以及退出状态的不同属性值，然后在remove之前和append之后插入过渡动画，使得图表转化平滑

先来设置进入状态的属性

```javascript
const newBinGroups = binGroups.enter().append('g').attr('class', 'bin')
// 矩形块
newBinGroups.append("rect")
    .attr("height", 0)
    .attr("x", d => xScale(d.x0) + barPadding)
    .attr("y", dimensions.boundedHeight)
    .attr("width", d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
    .style("fill", "yellowgreen")
// 字符
newBinGroups.append('text')
    .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
    .attr("y", dimensions.boundedHeight)
```

我们将颜色设置成黄绿色并将高度设置成0，这样数据新增的时候就有柱子往上长，颜色会变化的过程，同时还需要设置text一开始也处于底部

然后是状态更新

```javascript
binGroups = newBinGroups.merge(binGroups)        
const barRects = binGroups.select("rect")
    .transition(updateTransition) // 高度过渡
    .attr("x", d => xScale(d.x0) + barPadding)
    .attr("y", d => yScale(yAccessor(d)))
    .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
    .attr("width", d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
    .transition(updateTransition) // 颜色过渡
    .style("fill", "cornflowerblue") 
```

先将新和数据绑定的元素和原来的集合合并，然后过渡到更新状态

注意这里用了两次.transition(updateTransition)，也就是说会有两次过渡动画，一次是新加入的元素高度从0开始到更新状态的高度，第二次则是高度完成后颜色发生变化，如果去掉第二次过渡，则颜色和高度会同时过渡

退出状态的设置则同理

```javascript
const oldBinGroups = binGroups.exit()

oldBinGroups.selectAll("rect")
    .transition(exitTransition) 
    .style("fill", "red") 
    .attr("y", dimensions.boundedHeight)
    .attr("height", 0)

oldBinGroups.selectAll("text")
    .transition(exitTransition)
    .attr("y", dimensions.boundedHeight)

oldBinGroups
    .transition(exitTransition)
    .remove()
```

先将未绑定数据的元素选中，设置最终状态(柱子和文本都要处理)，在过渡完之后，将这些元素remove

而中位线和坐标轴只有一个，没有进入的退出的问题，直接加入动画过渡即可

那么现在让我们最后来画一个按钮，来实现图表内容的切换

这里介绍一下css中按钮的三个方法：hover，focus以及active

hover是鼠标覆盖到按钮上触发，active是鼠标在按钮上处于点击状态时触发，而focus则是鼠标选中文本框时触发，这里我们用hover和active让按钮看起来更棒

先来画一个按钮

```CSS
button {
    font-size: 1.2em;
    margin-left: 1em;
    padding: 0.5em 1em;
    appearance: none;
    -webkit-appearance: none;
    background: darkseagreen;
    color: white;
    border: none;
    box-shadow: 0 5px 0 0 seagreen;
    border-radius: 6px;
    font-weight: 600;
    outline: none;
    cursor: pointer;
    transition: all 0.1s ease-out;
}
```

transition是过渡，ease-out是一个非线性过渡方式(减速型)，设置了6px的圆角以及下边5px的阴影

![](1.png)

然后我们设置一下hover和active

鼠标覆盖的时候颜色变深并且主体下移，同时阴影少1px使得看起来更合理，鼠标点击的时候下移4px同时阴影减少4px，过程中阴影减少始终等于下移距离

```CSS
button:hover{
    background: #73b173;
    box-shadow: 0 4px 0 0 seagreen;
    transform: translateY(1px);
}

button:active {
    box-shadow: 0 1px 0 0 seagreen;
    transform: translateY(4px);
}
```

然后我们在js文件中加上相应的点击事件

```javascript
const button = d3.select('body').append('button').text('Change metric')
button.node().addEventListener('click', onClick)
function onClick() {
    selectedMetricIndex = (selectedMetricIndex + 1) % (metrics.length - 1)
    drawHistogram(metrics[selectedMetricIndex])
}
```

[[演示地址]](https://forever97.github.io/dataViz/fullStackD3/updatingBars/)

## 为折线图添加动画

然后我们尝试在之前的折线图中加入过渡动画

希望实现的效果是不断生成新的数据加到当前数据的末尾，产生随着时间后移的效果

我们先从数据集中取一百天来画图

```javascript
dataset = dataset.sort((a, b) => xAccessor(a) - xAccessor(b)).slice(0, 100)
```

这里dataset重新赋值了，所以我们不能再用之前的const了，而是要用let来定义

```javascript
let dataset = await d3.json(pathToJSON)
```

我们先在画线的程序外边写一个新数据的生成器

```javascript
function generateNewDataPoint(dataset) {
    const lastDataPoint = dataset[dataset.length - 1]
    const nextDay = d3.timeDay.offset(xAccessor(lastDataPoint), 1)

    return {
        date: d3.timeFormat('%Y-%m-%d')(nextDay),
        // random() : 0.0 ~ 1.0 之间的一个伪随机数
        temperatureMax: yAccessor(lastDataPoint) + (Math.random() * 6 - 3),
    }
}
function addNewDay() {    
    dataset = [
        ...dataset.slice(1), 
        generateNewDataPoint(dataset),
    ]
    drawLine(dataset)
}
```

解释一下代码，.slice(st,en)方法可以从数据集中抽取区段[st,en]，可以省略第二个参数，表示从给定开头抽取到结尾，...是ES6的特性，表示将数据集展开，通俗的说就是把dataset的括号拿走

设置一下每次数据更新的时间

```javascript
setInterval(addNewDay, 1500)
```

然后我们来实现动画过渡

坐标轴和之前的柱状图实现一致

线的部分我们先尝试一下和柱状图一样的方式

```javascript
const line = bounds
    .select('.line')
    .transition()
    .duration(1000)
    .attr('d', lineGenerator(dataset))
```

结果非常的蛋疼，原先的线扭啊扭地扭成了下一条线，这是因为attr函数并不知道我们把点平移到了下一个索引，而是将每个点过渡到了第二天的y值(毕竟这个看起来才是合理的动画)

于是我们得告诉动画，我们这是发生了平移

我们计算平移量，然后对线的位置平移样式添加动画

```javascript
const line = bounds
    .select('.line')
    .attr('d', lineGenerator(dataset))
    .style('transform', 'none')
    .transition()
    .duration(1000)
    .style('transform', `translateX(${-pixelsBetweenLastPoints}px)`)
```

这样就变成了向左平移两位

然后发现值跟线对不上了…… (偏了两位)

这个故事告诉我们，过渡的最终状态，一定要是位置正确的状态，咱换换状态

```javascript
const line = bounds
    .select('.line')
    .attr('d', lineGenerator(dataset))
    .style('transform', `translateX(${pixelsBetweenLastPoints}px)`)
    .transition()
    .duration(1000)
    .style('transform', 'none')
```

现在就对了，但是还有点小问题，左边的点是直接消失的，右边的点超出了图表

![](2.png)

defs元素用于存储后面在SVG中使用的任何可重用定义。我们可以在defs元素中放置任何clipPath，在clipPath的作用是隐藏越界数据

```javascript
bounds
    .append('defs')
    .append('clipPath')
    .attr('id', 'bounds-clip-path')
    .append('rect')
    .attr('width', dimensions.boundedWidth)
    .attr('height', dimensions.boundedHeight)
```

修改完我们的bounds之后，越界的线条就消失了

接下来处理前面少掉的一个点，这是书中作者布置的任务，我的实现方法是，直接把映射切掉第一个点，让它显示在clipPath之外，这就不会有突兀的消失了

```javascript
const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset.slice(1), xAccessor))
    .range([0, dimensions.boundedWidth])
```

[[演示地址]](https://forever97.github.io/dataViz/fullStackD3/updatingLine/)

