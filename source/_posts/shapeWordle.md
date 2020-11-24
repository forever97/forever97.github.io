---
title: ShapeWordle：阿基米德螺旋感知形状生成词云
date: 2020-11-24 08:24:33
tags: [VIS, 2019, 词云]
categories: 可视化胭脂铺
cover: /2020/11/24/shapeWordle/1.png
---

{% tip bell %}IEEE引用格式：Y. Wang et al., “ShapeWordle: Tailoring Wordles using Shape-aware Archimedean Spirals,” IEEE Trans. Vis. Comput. Graph., vol. 26, no. 1, pp. 991–1000, 2020, doi: 10.1109/TVCG.2019.2934783.{% endtip %}

## 摘要

本文提出了一种新技术`ShapeWordle`，可以创建形状为界的文字，将文字变成给定的形状。为了在形状内指导单词的放置，扩展了传统的阿基米德螺旋，通过使用形状的距离场以差分的方式来表示螺旋，使其具有形状感知能力。为了处理非凸形状，本文引入了一种多中心Wordle布局方法，该方法将形状分割成可感知形状的螺旋部分，以自适应地填充空间并生成单词位置。此外，还提供了一组编辑交互，以方便创建语义上有意义的文字，最后提供了三个评价：比较本文结果和最先进的技术`WordArt`，14个用户的案例研究，以及一个展示技术覆盖范围的画廊

## 文章简介


{% btns rounded grid5 %}

{% cell 演示地址, http://www.shapewordle.com/, fab fa-apple %}

{% cell 论文地址, http://www.yunhaiwang.net/infoVis2019/shapewordle/shapewordle.pdf, fas fa-book-open %}

{% endbtns %}



