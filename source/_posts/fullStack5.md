---
title: D3学习记录：交互
date: 2020-11-03 14:07:04
tags: [D3]
categories: D3茶楼
mathjax: true
cover: /2020/11/03/fullStack5/2.png
---

交互即对于键盘和鼠标对元素的操作做出反应

我们先对柱状图加入一些交互操作

交互的实现非常简单，.on(事件，操作函数)，比如我们想在矩形上做出一个鼠标移入的操作，只要实现如下代码即可，这样就可以使得矩阵在鼠标移入的时候变成紫色

```javascript
binGroups.select('rect')
    .on('mouseenter', function (d) {
        d3.select(this).style("fill", "purple")
    })
```

![](1.png)

然后就发现当鼠标移开之后还是紫色的，这说明我们还需要加入一个鼠标移开的事件，这样就可以保证只有鼠标覆盖到的矩阵是变了颜色的

```javascript
.on('mouseout', function(d) {
    d3.select(this).style("fill", "cornflowerblue")
})
```

然后我们就可以在function里面加入更多的操作，比如实现一个矩阵对应数据的小牌牌

现在html的wrapper里面画个牌，用于显示属性对应的范围和矩形表示的数值

```html
<div id="wrapper">
    <div id="tooltip" class="tooltip">
        <div class="tooltip-range">
            <span id="metric"></span>: </span> <span id="range"></span>
        </div>
        <div class="tooltip-value">
            <span id="count"></span> days
        </div>
    </div>
</div>
```

样式用css设置，因为我们希望移动到矩形时显示对应的数据，所以在css中先将其透明度设置为透明

修改鼠标移入的函数，改变数据牌的位置和信息，然后将设置为可见

```javascript
.on('mouseenter', function (d) {
    d3.select(this).style("fill", "purple")
    const formatmetrics = d3.format(".2f") 
    tooltip.select("#metric")
        .text(metric)
    tooltip.select("#range")
        .text([formatmetrics (d.x0), formatmetrics(d.x1)].join(" - "))
    tooltip.select("#count").text(yAccessor(d))
    const x = xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2 + dimensions.margin.left
    const y = yScale(yAccessor(d)) + dimensions.margin.top
    tooltip.style("transform", `translate(${x + 120}px, ${y - 50}px)`)
    tooltip.style("opacity", 1)
})
```

而在移除函数里设置opacity为0，就可以成功加入这个牌子

![](2.png)

[[演示地址]](https://forever97.github.io/dataViz/fullStackD3/barInteraction/)

散点图和柱状图几乎是一个做法，就是在之前实现的内容里加入显示牌即可

![](3.png)

[[演示地址]](https://forever97.github.io/dataViz/fullStackD3/scatterplotInteraction/)


