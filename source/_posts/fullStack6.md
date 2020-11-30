---
title: D3学习记录：地图
date: 2020-11-03 15:08:53
tags: [D3]
categories: 🍵D3茶楼
mathjax: true
cover: /2020/11/03/fullStack6/5.png
---

在d3中地图的创建通常用d3-geo来实现的，GeoJSON是一种用于表示地理结构(几何图形、特性或特性集合)的格式，我们选择Natural Earth来作为练手数据

## 数据读入与参数设置

首先读入数据

```javascript
const countryShapes = await d3.json('./data/world-geojson.json')
const dataset = await d3.csv('./data/world_bank_data.csv')
```

console.log一下我们可以看到json数据的内容，其中包含了四个关键字：crs, features, name, type

我们在feature里面挑选关键词并创建访问器函数，通过访问国家ID来找到人口增长数据集中的度量值

```javascript
const countryNameAccessor = d => d.properties["NAME"]
const countryIdAccessor = d => d.properties["ADM0_A3_IS"]
```

然后来看一下这个csv文件

![](1.png)

这个数据集是一个数组，它将每个国家多次列出，每次都使用不同的度量，以Series Name键命名，这里我们只用到每年人口的增长，所以把它抠出来

```javascript
const metric = "Population growth (annual %)"
```

然后我们将检查数据集数组中的每一项。如果条目的“系列名称”与我们的度量不匹配，我们将不做任何事情。如果匹配，我们将向metricDataByCountry对象添加一个新值:键是项目的“国家代码”

```javascript
let metricDataByCountry = {}
dataset.forEach(d => {
    if (d['Series Name'] != metric) return
    metricDataByCountry[d['Country Code']] = d['2017 [YR2017]'] || 0
})
```

然后我们来选择一个投影方式，我们先创建一个球体，随后选择一种投影方式

```javascript
const sphere = { type: 'Sphere' }
const projection = d3
    .geoEqualEarth() 
    .fitWidth(dimensions.boundedWidth, sphere) 
const pathGenerator = d3.geoPath(projection)
```

fitWidth中的两个参数分别表示图示的宽度和要投影的对象

pathGenerator()有一个.bounds()方法，它将返回一个[x, y]坐标数组，描述指定GeoJSON对象的边界框

```javascript
const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)
```

最后我们来定义一下参数

```javascript
let dimensions = {
    width: window.innerWidth * 0.9,
    margin: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
    },
}

dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right
dimensions.boundedHeight = y1
dimensions.height =
    dimensions.boundedHeight + dimensions.margin.top + dimensions.margin.bottom
```

## 创建比例尺

接下来要创建一个比例尺，将度量值(人口增长数量)转换为颜色值

```javascript
// 获取对象值
const metricValues = Object.values(metricDataByCountry) 
// 获取数据范围 (最小值，最大致)
const metricValueExtent = d3.extent(metricValues) 
const maxChange = d3.max([-metricValueExtent[0], metricValueExtent[1]])
const colorScale = d3
    .scaleLinear()
    .domain([-maxChange, 0, maxChange])
    .range(['indigo', 'white', 'darkgreen'])
```

因为增长率存在负增长，所以我们需要获得绝对值的最大值，然后创建一个两段的比例尺，用两种不同颜色表示正负

## 画图

准备工作完成，我们开始画这个地图

先把轮廓画出来

```javascript
const earth = bounds.append("path")
    .attr("class", "earth")
    .attr("d", pathGenerator(sphere))
```

![](2.png)

然后通过d3.geoGraticule10()函数每隔10度画一个分割线

```javascript
const graticuleJson = d3.geoGraticule10()
const graticule = bounds.append("path")
    .attr("class", "graticule")
    .attr("d", pathGenerator(graticuleJson))
```

![](3.png)

最后将国家数据画上

```javascript
const countries = bounds
    .selectAll('.country')
    .data(countryShapes.features) 
    .enter()
    .append('path') 
    .attr('class', 'country')
    .attr('d', pathGenerator)
    .attr('fill', d => {
        const metricValue = metricDataByCountry[countryIdAccessor(d)] 
        if (typeof metricValue === undefined) return '#e2e6e9' 
        return colorScale(metricValue) 
    })
```

再额外加个标题和比例尺说明

```javascript
const legendGroup = wrapper
    .append('g')
    .attr(
        'transform',
        `translate(${120},${
        dimensions.width < 800
            ? dimensions.boundedHeight - 30
            : dimensions.boundedHeight * 0.5
        })`
    )

// 标题
const legendTitle = legendGroup
    .append('text')
    .attr('y', -23)
    .attr('class', 'legend-title')
    .text('Population growth')

// 年份标注
const legendByline = legendGroup
    .append('text')
    .attr('y', -9)
    .attr('class', 'legend-byline')
    .text('Percent change in 2017')

// defs中创建的元素是不可见的，但可以在后面使用
const defs = wrapper.append('defs')
const legendGradientId = 'legend-gradient'
const gradient = defs
    .append('linearGradient')
    .attr('id', legendGradientId)
    .selectAll('stop')
    .data(colorScale.range())
    .enter()
    .append('stop')
    .attr('stop-color', d => d)
    .attr(
        'offset',
        (d, i) =>
        `${
            (i * 100) / 2 
        }%`
    )

// 画出比例尺
const legendWidth = 120
const legendHeight = 16
const legendGradient = legendGroup
    .append('rect')
    .attr('x', -legendWidth / 2)
    .attr('height', legendHeight)
    .attr('width', legendWidth)
    .style('fill', `url(#${legendGradientId})`)

// 右侧数值
const legendValueRight = legendGroup
    .append('text')
    .attr('class', 'legend-value')
    .attr('x', legendWidth / 2 + 10)
    .attr('y', legendHeight / 2)
    .text(`${d3.format('.1f')(maxChange)}%`)

// 左侧数值
const legendValueLeft = legendGroup
    .append('text')
    .attr('class', 'legend-value')
    .attr('x', -legendWidth / 2 - 10)
    .attr('y', legendHeight / 2)
    .text(`${d3.format('.1f')(-maxChange)}%`)
    .style('text-anchor', 'end')
```

这里书上介绍了一个神奇的东西，navigator，可以获取浏览器用户的位置，这里我们用一个小圆圈显示出来

```javascript
navigator.geolocation.getCurrentPosition(myPosition => {
    console.log(myPosition)

    const [x, y] = projection([
        myPosition.coords.longitude,
        myPosition.coords.latitude
    ])

    const myLocation = bounds.append("circle")
        .attr("class", "my-location")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .transition().duration(500)
        .attr("r", 10)
})
```

![](4.png)

互动部分和先前类似，加入了一个小牌子显示信息

```javascript
countries
    .on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave)

const tooltip = d3.select("#tooltip")

function onMouseEnter(datum) { 
    tooltip.style("opacity", 1) 
    const metricValue = metricDataByCountry[countryIdAccessor(datum)]
    tooltip.select("#country").text(countryNameAccessor(datum))
    tooltip.select("#value").text(`${d3.format(",.2f")(metricValue || 0)}`)

    const [centerX, centerY] = pathGenerator.centroid(datum)
    const x = centerX + dimensions.margin.left
    const y = centerY + dimensions.margin.top

    tooltip.style("transform", `translate(`
        + `calc( -50% + ${x}px),`
        + `calc(-100% + ${y}px)`
        + `)`)
}
function onMouseLeave() {
    tooltip.style("opacity", 0) 
}
```

![](5.png)

[[演示地址]](https://forever97.github.io/dataViz/fullStackD3/map/)

