---
title: D3学习记录：散点图
date: 2020-10-28 20:03:20
tags: [D3]
categories: D3茶楼
mathjax: true
cover: /2020/10/28/fullStack2/5.png
---

这次来画一个散点图，用的还是上次画折线图的数据

[[数据下载地址]](https://github.com/forever97/dataViz/blob/main/fullStackD3/lineChart/data/nyc_weather_data.json)

## 准备工作

读入数据的方式和之前是一样的

```javascript
const dataset = await d3.json("./data/nyc_weather_data.json")
```

这次采用湿度和露点作为两个属性

```javascript
const xAccessor = d => d.dewPoint
const yAccessor = d => d.humidity
```

我们准备画一个正方形的散点图，所以我们现在计算它的边长

```javascript
const width = d3.min([
    window.innerWidth * 0.9, 
    window.innerHeight * 0.9,
])
```
同样的，设置一个参数表，并计算bound的高和宽

```javascript
let dimensions = {
    width: width,
    height: width,
    margin: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 50,
    },
}
dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom
```

之后我们用这些参数来创建画布，然后创建bound并平移

```javascript
const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
const bounds = wrapper.append("g")
    .style("transform", `translate(${
        dimensions.margin.left
    }px, ${
        dimensions.margin.top
    }px)`)
```

随后创建一个比例尺

```javascript
const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))  
    .range([0, dimensions.boundedWidth])
    .nice()
const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))  
    .range([dimensions.boundedHeight, 0])
    .nice()
```

.nice()做的是一个舍入操作，能够让比例尺范围为最小刻度的整数倍

## 绘制数据

既然是散点图，我们肯定希望对每个数据绘制一个点，这里我们用小半径的圆来表示点

```javascript
dataset.forEach(d => {
    bounds
        .append("circle")
        .attr("cx", xScale(xAccessor(d)))
        .attr("cy", yScale(yAccessor(d)))   
        .attr("r", 5)
})
```

如果我们用js的方式来处理，直接用循环把每个点画上去就ok了，但是我们是准备用d3来做数据可视化的，那么就需要考虑到数据更新，需要将图像和数据绑定

d3中的数据状态如下图所示

![](1.png)

1. enter状态：表示没有绑定元素的数据
2. group状态：元素和数据一一对应
3. exit状态：没有绑定数据的元素

我们用.dataset()来使得元素和数据关联，之后就可以对于不同状态的数据或元素做对应的处理

```javascript
const dots = bounds.selectAll("circle")
    .data(dataset)
    .enter().append("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", "cornflowerblue")
```

对于enter状态的所有数据，绑定一个图像元素

![](2.png)

那如果我既要加入数据，又想要已有的数据一起更新呢，这里就可以用一个merge，将数据合并

```javascript
const dots = bounds.selectAll("circle").data(dataset)
dots.enter().append("circle")
    .merge(dots)
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", "grey")
```

数据合并还有一种更方便的方式，不需要去先找到enter态，然后append，最后merge，而是可以直接使用join

```javascript
dots.join("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", "grey")
```

创建坐标轴的方式和之前的类似

```javascript
const xAxisGenerator = d3.axisBottom().scale(xScale)
const xAxis = bounds.append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)
const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4) // 指定刻度数量
const yAxis = bounds.append("g")
    .call(yAxisGenerator)
```

这回我们还希望把坐标轴对应的维度变量名也表示在图表上

```javascript
const xAxisLabel = xAxis.append("text") 
    .attr("x", dimensions.boundedWidth / 2) 
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    // html中有些使用属性没效果，要用样式，svg都可
    .style("font-size", "1.4em") 
    .html("Dew point (&deg;F)")
const yAxisLabel = yAxis.append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text("Relative humidity")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle")
```

字体大小设置为标准的1.4倍，y轴旋转90度并居中

已经像模像样了起来

![](3.png)

## 引入颜色维度

散点图除了横纵坐标之外，点的颜色也可以表示一个维度的数据，这里我们用颜色来表示cloudCover这个属性

创建一个颜色比例尺

```javascript
const colorAccessor = d => d.cloudCover
const colorScale = d3.scaleLinear()
    .domain(d3.extent(dataset, colorAccessor))
    .range(["skyblue", "darkslategrey"])
```

然后修改一下绘制散点的fill属性
```javascript
.attr("fill", d => colorScale(colorAccessor(d))) 
```

一张三维的图表就创建完毕了

![](4.png)

最后玩点花的，把坐标轴的.domain移除，把.tickSize设置成跟长宽相等

```javascript
const xAxisGenerator = d3.axisBottom()
    .scale(xScale)
    .ticks(25)
    .tickSize(-dimensions.height)
xAxis.selectAll('.domain') 
        .remove()
```

y轴同理

在css里把tick的颜色设淡一点，改一下圆的半径和透明度，完工

![](5.png)

[[演示地址]](https://forever97.github.io/dataViz/fullStackD3/scatterplot/)
