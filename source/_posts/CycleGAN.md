---
title: Cycle Generative Adversarial Nets
date: 2020-03-27 16:39:22
tags: [GAN, CycleGAN]
mathjax: true
categories: GAN马戏团
cover: /2020/10/19/Re0-1/9.png
---
风格迁移问题中，我们需要实现从输入图片到输出图片的映射，那么在训练一个Generator的时候我们需要成对的训练集，然而成对的训练集并不容易获得

因此我们希望采用GAN的形式处理风格迁移问题，$G$负责学习映射，$D$负责判别是否为规定风格

然而GAN处理的问题就在于自由度过大，可能一张清明上河图进到GAN里面风格转化的结果是一张梵高的自画像，即G完全可以为了骗过$D$将Domain X中的所有内容映射到Domain Y中的一张图，使得损失函数无效化

那么我们需要的就不仅是风格上的正确了，而是图片的分布也不能发生太大的变化

所以除去生成器$G(X\to Y)$之外，我们再建立一个生成器$G(Y \to X)$，我们希望在一张图片被映射到Domain Y之后能够被映射回Domain X，且与原来的图片大致相同

与此同时，一张图片在通过$G(Y \to X)$映射到Domain X之后，也应该能通过$G(X \to Y)$得到一张和原图大致相同的图片

定义一个循环一致性损失
$L_{cyc}(F,G,X,Y)=E_{x \sim p_{data(x)}}[||G(F(x))-x||_1]+E_{y \sim p_{data(y)}}[||F(G(y))-y||_1]$

最终的损失函数由三部分组成
$L=L_{GAN}(G(X\to Y)，D_Y)+L_{GAN}(G(Y \to X)，D_X)+L_{cyc}(G(X \to Y),G(Y \to X),X,Y)$

$L_{GAN}$即基础GAN的损失函数

CycleGAN的方法和传统的pix2pix相比对数据集的要求更低
比如需要做春和秋两种风格变换的，并不需要pair的数据,只要一个春风格的数据集和一个秋风格的数据集即可，并且训练完成后能够实现双向转化
