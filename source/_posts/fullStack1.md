---
title: D3学习记录：折线图
date: 2020-10-28 14:26:30
tags: [D3]
categories: D3茶楼
mathjax: true
cover: /2020/10/28/fullStack1/8.png
---
最近准备刷一遍 Fullstack D3 and Data Visualization，系统地学一下d3，顺便记录一下学习过程

首先是实现一个小目标：画一个纽约天气折线图

## 数据载入与查看

第一步，载入数据

```javascript
async function drawLineChart() {
    const dataset = await d3.json("./data/nyc_weather_data.json");
    console.log(dataset);
}
```

以下所有的代码都是默认在drawLineChart异步函数中书写

然后可以控制台输出来看看

![](1.png)

365天的天气，每天还有一堆属性，这种情况下有个更方便的查看数据的方式，console.table，我们来查看第一天的数据

```javascript
console.table(dataset[0])
```

![](2.png)

nice

## 初始参数设置

用xAccessor和yAccessor来绘制x轴和y轴上的点

y轴用每天的最高气温作为标度，而x轴则采用时间

```javascript
const yAccessor = d => d.temperatureMax
```

我们看到x轴的数据类型是这样的

![](3.png)

显然是一个字符串，我们希望把它转成一个js中的date类型，用d3.timeParse()可以完成这个要求

```javascript
const dateParser = d3.timeParse("%Y-%m-%d")
const xAccessor = d => dateParser(d.date)
```

然后来设置一些参数

```javascript
let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
        top: 15,
        right: 15,
        bottom: 40,
        left: 60,
    },
}
```

参数中包括了包装器的大小和页边距

之后这些参数就可以用来计算边界

```javascript
 dimensions.boundedWidth = dimensions.width 
    - dimensions.margin.left 
    - dimensions.margin.right;
dimensions.boundedHeight = dimensions.height 
    - dimensions.margin.top 
    - dimensions.margin.bottom;  
```

创建一个svg元素

```javascript
const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
```

然后在svg中创建一个组，这么做的好处是，我们可以在组里面画东西，然后在svg里面去统一移动画的东西

```javascript
const bounds = wrapper.append("g")  
    .style("transform", `translate(${
        dimensions.margin.left
    }px, ${
        dimensions.margin.top
    }px)`)
```

## 创建比例尺

画坐标轴之前，我们需要创建一个比例尺，把数值映射到图像中的像素

我们用d3.extent来获取数据中的最小值和最大值作为domain

映射到组内

```javascript
const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor)) 
    .range([dimensions.boundedHeight, 0])
const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))  
    .range([0, dimensions.boundedWidth])
```

svg里面的y是从上到下计数的，所以我们想建一个原点在下面的坐标轴需要倒一下比例尺的range，我们可以输出yScale(32)来检查比例尺创建是否正确

我们来创建一个矩形框住低温区域

```javascript
const freezingTemperaturePlacement = yScale(32)
const freezingTemperatures = bounds.append("rect")
    .attr("x", 0)
    .attr("width", dimensions.boundedWidth)
    .attr("y", freezingTemperaturePlacement)
    .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
    .attr("fill", "#e0f3f3")
```

## 绘制折线

首先需要一个线生成器，能够将数据转化成线

```javascript
const lineGenerator = d3.line() 
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))
```

然后就可以把线画出来了

```javascript
const line = bounds.append("path")
    .attr("d", lineGenerator(dataset))
```

但是画出来是这样的

![](4.png)

这是因为svg元素默认黑色填充以及无笔触(stroke)

我们对填充和笔触进行设置

```javascript
const line = bounds.append("path")
    .attr("d", lineGenerator(dataset))
    .attr("fill", "none")
    .attr("stroke", "#af9358")
    .attr("stroke-width", 2)
```

折线图就画出来了

![](5.png)

## 绘制坐标轴

最后来画一个坐标轴，同理，先定义一个坐标轴生成器，然后告诉它在哪里生成坐标轴

```javascript
const yAxisGenerator = d3.axisLeft()  
    .scale(yScale)
const yAxis = bounds.call(yAxisGenerator)
```

call将以selection作为第一个参数执行所提供的函数

也就是上述代码等价于

```javascript
const yAxisGenerator = d3.axisLeft()  
    .scale(yScale)
const yAxis = bounds.append("g")
yAxisGenerator(yAxis)
```

同理画一下x轴

```javascript
const xAxisGenerator = d3.axisBottom()  
    .scale(xScale)
const xAxis = bounds.append("g")
    .call(xAxisGenerator)
```

然后发现这个y轴倒是没什么问题，但是x轴莫名其妙跑到上面去了

![](6.png)

因为d3的坐标轴生成器只知道相对于轴，刻度线在哪个方向，轴的位置是没有设置的，所以要平移一下

```javascript
const xAxis = bounds.append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${
        dimensions.boundedHeight
        }px)`)
```

ok，完工

最后顺便加了条最低温度的线，调整了一下坐标轴的范围和线的颜色

[[演示地址]](https://forever97.github.io/dataViz/fullStackD3/lineChart/)

[[数据下载地址]](https://github.com/forever97/dataViz/blob/main/fullStackD3/lineChart/data/nyc_weather_data.json)




