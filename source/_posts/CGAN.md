---
title: Conditional Generative Adversarial Nets
date: 2020-03-25 20:23:36
tags: [GAN, CGAN]
categories: 🎪GAN马戏团
cover: /2020/10/19/Re0-1/9.png
---
CGAN(Conditional Generative Adversarial Nets)指的是带有附加条件的GAN网络

[(GAN的介绍戳此处)](/2020/03/13/GAN/)

用传统的方法去训练一个输入为text输出的image的generator最后的学习结果会是同一类图片的平均，图片通常非常的模糊

CGAN的Generator是通过一个接受一个正态分布z和目标限定词$c$得到对应的产出$G(c,z)$，额外信息$c$的引入对生成增加了条件来指导生成，将原先无监督的GAN模型变成了一个有监督的学习过程

与此同时Discriminator也要发生相应的变化，因为如果采用原始GAN的Discriminator的话难以起到对限定词$c$的训练效果，因为不管你的限定词是猪或者是狗，$G$发现只要生成一张清晰的猫的图片，$D$就能给出高分，那么$G$就可以无视限定词直接去学习生成猫就可以了（completely ignore the input conditions）

因此CGAN中，Discriminator不能只接受Generator的输出，还要接受G的输入，Discriminator需要做的不仅是判断图片是否是真实的图片，而是在判断是否是真实图片的同时需要判断text和image的匹配程度

即Discriminator的打分对象从图片变为一个图片和词条的pair，低分的样本有（虚假图片，词条），（与词条不符的真实图片，词条）

因为只是单纯加入了一个条件限定，因此CGAN的最优化过程和GAN十分相似

$min_Gmax_DV(D,G)=E_{x\sim p_{data}(x)}[logD(x|y)]+E_{z\sim p_{z}(z)}[1-logD(G(z|y))]$

是一个条件概率极大极小博弈





