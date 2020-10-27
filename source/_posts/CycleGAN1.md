---
title: CycleGAN的隐写术
date: 2020-03-27 18:02:36
tags: [GAN, CycleGAN]
mathjax: true
categories: 对抗生成马戏团
cover: https://forever97.github.io/2020/10/19/Re0-1/9.png
---
[(CycleGAN的介绍戳此处)](https://forever97.github.io/2020/03/27/CycleGAN/)

在CycleGAN的训练过程中

研究者发现，一张图片从Domain X到Domain Y的过程中可能会丢失了细节

但是令人惊讶的是，这张缺失细节的图从Domain Y映射回Domain X的时候这些细节又会被补全

也就是说CycleGAN在做Domain X到Domain Y的转化的时候隐藏了一些细节，使得我们肉眼无法观察到，但是其本身可以通过某些手段将这些记录的细节还原

用自适应直方图均衡化的手段可以观察到，CycleGAN学会了用低振幅高频信号的形式来隐藏原始图像中的细节信息，这种信号看起来几乎像是噪声，而利用这些信息，G可以再现原始图像，使得循环一致性的要求被满足

CycleGAN这种编码信息的特性很容易使得其遭受对抗性的攻击，攻击者可以通过干扰选定的原图像，使得Generator产生他们所选择的图像

文章作者认为CycleGAN模型的这种问题来自于循环一致性损失和Domain之间的熵差，因此改进的手段有修改循环一致性和添加额外的隐藏变量来人为地增加一个Domain的熵

比如在Cycle的时候引入噪声干扰信息编码等

不得不说CycleGAN利用信息编码确实很好地完成了循环一致性的任务，但是这也同时表明了，CycleGAN出现这种情况可能是网络没有足够的能力做到完全映射，所以机器选择了耍小聪明的办法来完成任务

