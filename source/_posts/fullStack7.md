---
title: D3学习记录：热图
date: 2020-11-05 08:55:54
tags: [D3]
categories: D3茶楼
mathjax: true
cover: /2020/11/05/fullStack7/1.png
---

常用git的同学可能对热图(heatmap)已经很熟悉了，就是这个东西

![](2.png)

我的contribution真是丢人，希望之后可以填的更满一点

现在我们来做一个自己的heatmap，当然还是熟悉的那个数据

## 预处理

先把数据读入，然后做一些预处理

```javascript
const pathToJSON = "./data/nyc_weather_data.json"
let dataset = await d3.json(pathToJSON)

const parseDate = d3.timeParse("%Y-%m-%d")
const dateAccessor = d => parseDate(d.date)
dataset = dataset.sort((a, b) => dateAccessor(a) - dateAccessor(b))

const firstDate = dateAccessor(dataset[0])

const weekFormat = d3.timeFormat("%-e")
const xAccessor = d => d3.timeWeeks(firstDate, dateAccessor(d)).length
const dayOfWeekFormat = d3.timeFormat("%-w")
const yAccessor = d => +dayOfWeekFormat(dateAccessor(d))
```

之后计算一些参数，我们期望的是一列显示一周七天，所以要先算出星期的数量

```javascript
const numberOfWeeks = Math.ceil(dataset.length / 7) + 1
let dimensions = {
    margin: {
        top: 30,
        right: 0,
        bottom: 0,
        left: 80,
    },
}
dimensions.width = (window.innerWidth 
    - dimensions.margin.left 
    - dimensions.margin.right) * 0.95
dimensions.boundedWidth = dimensions.width 
    - dimensions.margin.left 
    - dimensions.margin.right
dimensions.height = 
    dimensions.boundedWidth * 7 / numberOfWeeks 
    + dimensions.margin.top 
    + dimensions.margin.bottom
dimensions.boundedHeight = dimensions.height 
    - dimensions.margin.top 
    - dimensions.margin.bottom
```

和往常一样建立画布

```javascript
const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

const bounds = wrapper.append("g")
    .style("transform", `translate(
        ${dimensions.margin.left}px, ${dimensions.margin.top}px
    )`)
```

还需要计算的参数是表示每天的每个小格子的长宽以及格子的间隙

```javascript
const barPadding = 5
const totalBarDimension = d3.min([
    dimensions.boundedWidth / numberOfWeeks,
    dimensions.boundedHeight / 7,
])
const barDimension = totalBarDimension - barPadding
```

## 绘制图表

先把月份的信息绘制出来

```javascript
const monthFormat = d3.timeFormat("%b")
const months = bounds.selectAll(".month")
    .data(d3.timeMonths(dateAccessor(dataset[0]), 
        dateAccessor(dataset[dataset.length - 1])))
    .enter().append("text")
    .attr("class", "month")
    .attr("transform", d => `translate(${
        totalBarDimension * d3.timeWeeks(firstDate, d).length}, -10
    )`)
    .text(d => monthFormat(d))
```

d3.timeMonths可以将起止时间按照月份间隔划分生成数据，生成的数据输出如下

![](3.png)

绘制的效果如下

![](4.png)

星期的绘制如法炮制

```javascript
const dayOfWeekParse = d3.timeParse("%-e")
const dayOfWeekTickFormat = d3.timeFormat("%-A")
const labels = bounds.selectAll(".label")
    .data(new Array(7).fill(null).map((d, i) => i))
    .enter().append("text")
    .attr("class", "label")
    .attr("transform", d => `translate(-10, ${totalBarDimension * (d + 0.5)})`)
    .text(d => dayOfWeekTickFormat(dayOfWeekParse(d))) 
```

然后我们来画里边的格子，其实就是在指定的位置画上对应的小方块

```javascript
// 创建颜色比例尺
const colorAccessor = d => d[metric]
const colorRangeDomain = d3.extent(dataset, colorAccessor)
const colorRange = d3.scaleLinear()
    .domain(colorRangeDomain)
    .range([0, 1])
    .clamp(true)
const colorGradient = d3.interpolateHcl("#ecf0f1", "pink")
const colorScale = d => colorGradient(colorRange(d))

const days = bounds.selectAll(".day")
    .data(dataset, d => d.date)

const newDays = days.enter().append("rect")
const allDays = newDays.merge(days)
    .attr("class", "day")
    .attr("x", d => totalBarDimension * xAccessor(d))
    .attr("width", barDimension)
    .attr("y", d => totalBarDimension * yAccessor(d))
    .attr("height", barDimension)
    .style("fill", d => colorScale(colorAccessor(d)))
```

最后再加上一个标题和比例尺标注

```javascript
d3.select("#metric")
    .text(metric)
d3.select("#legend-min")
    .text(colorRangeDomain[0])
d3.select("#legend-max")
    .text(colorRangeDomain[1])
d3.select("#legend-gradient")
    .style("background", `linear-gradient(to right, ${
        new Array(10).fill(null).map((d, i) => (
            `${colorGradient(i / 9)} ${i * 100 / 9}%`
        )).join(", ")
    })`)
```

交互部分则沿用之前柱状图中的按钮来切换数据，热图就画完了

![](1.png)

[[演示地址]](https://forever97.github.io/dataViz/fullStackD3/heatmap/)






