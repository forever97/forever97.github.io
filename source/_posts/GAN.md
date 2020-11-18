---
title: Generative Adversarial Networks
date: 2020-03-13 15:24:28
tags: [GAN]
mathjax: true
categories: GAN马戏团
cover: https://forever97.github.io/2020/10/19/Re0-1/9.png
---

GAN(generative adversarial networks)指生成对抗网络

GAN包含一个Generator(以下简称$G$)和一个Discriminator(以下简称$D$)

$G$是一个生成器，其本质是一个多层感知机，接收一个向量，将其映射到新的数据空间(输出为图片，句子或者其它)

$D$是一个判别器，也是一个多层感知机，输出一个标量，表示输入数据属于真实数据的概率

GAN就是$G$和$D$协同演化的过程

用图像生成作为例子，就是$G$不断去生成图片企图混淆真实图片，欺骗过$D$

而$D$呢，则是不断提高自己的辨别能力，尝试分辨出真实图片和$G$产生的虚假图片

那么GAN作为整体的最优化问题该如何去表示？

判别器$D$需要做的事情是判定x是来自数据集$Data$的概率，因此我们需要最大化$E_{x\sim p_{data}(x)}[logD(x)]$

再考虑企图去欺骗$D$的$G$，有$E_{z\sim p_{z}(z)}[1-logD(G(z))]$，判别器希望这项最大化，而生成器$G$希望这项最小化

所以我们得到了GAN的目标函数

$min_Gmax_DV(D,G)=E_{x\sim p_{data}(x)}[logD(x)]+E_{z\sim p_{z}(z)}[1-logD(G(z))]$

这是一个极大极小博弈的过程，在具体实现中这是迭代的，轮流进行

在每次迭代中：

我们首先固定$G$的参数，用随机的$vector$(原始GAN的论文中采用的是高斯噪声)去得到$Data_G$，并且从$Data$中抽取$Sample$，我们将产生的$Data_G$和Sample混合打上标签用于训练$D$

在$D$的训练完成之后，我们固定$D$的参数，不断用随机的$vector$通过$G$去得到$Data_G$，用$D$对生成打分，调整$G$的参数直到得到较高的分数，也就是在做的是learn to fool discriminator

迭代直到模型达到最优，也就是$D$已经混淆了$Data_G$和原始$Data$，判断输入来自两者的概率都是$0.5$

这就像是一个什么都不懂的幼儿园小朋友在学画画，那么幼儿园老师只要一个很低的判定标准就能够给小红花的，看到大致一个圆脸，和两个眼睛就能好好表扬一通，那么小朋友们通过这个标准就知道画一个圈中间扣两个洞是好的，等到了一年级，二年级，老师也会根据学生的水平提高评判标准，标准的更新则带来了学生水平的提高，相互促进

接下来我们需要证明，最优化问题存在唯一解，并且满足$P_{Data}$=$P_G$，也就是数据的概率分布相同

首先将期望展开为积分

$\int p_{data}(x)logD(x)dx+\int p_{z}(z)(1-logD(G(z)))dz$

=$\int p_{data}(x)logD(x)dx+\int p_G(x)(1-logD(x))dx$

以上积分等式原始GAN论文认为可通过

$E_{z\sim p_{z}(z)}\log(1-D(G(z)))=E_{x\sim p_{G(x)}}\log (1-D(x))$

来证明，来源于测度论中的 $Radon-Nikodym$ 定理

$f(D)=p_{data}log(D)+p_G(1-log(D))$

我们求解取得极值时的参数

$\frac{df(D)}{dD}=p_{data} \times \frac{1}{D} + P_G \times \frac{1}{1-D} \times -1=0$

可以得到$D^*(x)=\frac{P_{data}(x)}{P_{data}(x)+P_G(x)}$

GAN的目标是使得$P_{Data}$=$P_G$，在这种情况下$D^*(x)=\frac{1}{2}$

至此我们得到了原文中的第一条推论

>For G fixed, the optimal discriminator D is 
>$D^*_G(x)=\frac{P_{data}(x)}{P_{data}(x)+P_G(x)}$

也就是说在固定$G$的参数的情况下，得到能够使得价值函数最大化的最优的$D$

证明$G$是极大极小博弈的解，还需要考虑求使得价值函数最小化的生成器$G$

作者在文中提出定理

> The global minimum of the virtual training criterion $C(G)$ is achieved if and only if $p_g=p_{data}$. At that point，$C(G)$ achieves the value $-log4$

$P_G=P_{Data}$的充分性证明是比较简单的，因为我们fix了$D$的参数，去求解使得$V(G,D^*)$最小的$G$，因为$P_G=P_{Data}$，因此$D=\frac{1}{2}$

所以$V(G,D^*)=\int p_{data}(x)log(\frac{1}{2})dx+\int p_G(x)(1-\frac{1}{2})dx$

=$-log2\int p_{data}(x)dx-log2\int p_G(x)dx$

=$-2log2$ = $-log4$

$P_G=P_{Data}$的必要性证明则需要从$C(G)=-log4$反推

$C(G)=\int p_{data}(x)logD(x)dx+\int p_G(x)(1-logD(x))dx$

=$\int (p_{data}(x)log(\frac{p_{data}(x)}{p_{data}(x)+p_G(x)})+p_G(x)log(\frac{p_G(x)}{p_{data}(x)+p_G(x)}))dx$

=$\int ((log2-log2)p_{data}(x)+p_{data}(x)log(\frac{p_{data}(x)}{p_{data}(x)+p_G(x)})+(log2-log2)p_G(x)+p_G(x)log(\frac{p_G(x)}{p_{data}(x)+p_G(x)}))dx$

=$-log2\int_x(p_G(x)+p_{data}(x))dx+\int_xp_{data}(x)(log2+log(\frac{p_{data}(x)}{p_{data}(x)+p_G(x)}))+p_G(x)(log2+log(\frac{p_G(x)}{p_{data}(x)+p_G(x)}))dx$

因为$-log2\int_x(p_G(x)+p_{data}(x))dx=-log4$

所以$C(G)=-log4+\int_xp_{data}(x)(log2+log(\frac{p_{data}(x)}{p_{data}(x)+p_G(x)}))+p_G(x)(log2+log(\frac{p_G(x)}{p_{data}(x)+p_G(x)}))dx$

=$-log4+\int_xp_{data}(x)(log(\frac{p_{data}(x)}{(p_{data}(x)+p_G(x))/2}))+p_G(x)(log(\frac{p_G(x)}{(p_{data}(x)+p_G(x))/2}))dx$

=$-log4+D_{KL}(p_{data}(x)||\frac{p_{data}(x)+p_G(x)}{2})+D_{KL}(p_G(x)||\frac{p_{data}(x)+p_G(x)}{2})$

=$-log4+2D_{JS}(p_{data}||p_G)$

当$p_G=p_{data}$时，JS散度为0

证毕，当且仅当生成数据分布等于真实数据分布时得到最优的Generator

[(KL散度和JS散度说明戳此处)](https://forever97.github.io/2020/03/12/KLdivergence/ "With a Title")

现在我们明白了GAN的工作原理和目标函数的正确性

那么我们来解决一些理论上的问题，为什么$G$不直接从真实图片中学习，以及为什么$D$选择做鉴定而不是直接去生成图片呢

若$G$选择直接从图片中学习然后生成，则学习的流程为

图片1 -> auto-encoder -> code -> NN Decoder -> 图片2

即我们需要一个编码器将图片转化为vector，然后NN试图将这个图片还原，也就是图片1和图片2要尽可能相似

但是这样产生的$G$是没有creat能力的，通俗一点讲，就是他画不出没见过的图片，学习最终将code和image定死，学习两张不同朝向的1并不能使得它产生一个正向的1，而可能是噪声

VAE在这个问题上有所改进，在code进入NN之前加入了noise，希望图片仍然能被还原，这样的约束提高了网络creat的能力，但是没有对抗的加入，VAE的图片会相对的比GAN产生的模糊

还有一个问题是，缺乏监督者，因为想要input和output尽量像未必会使得结果向需要的靠拢，pixel的比对仍然属于component level的，每个神经元在同一个layer难以相互影响，那么达成目标可能需要更深的网络，并且容易造成过拟合

那么如果想采用$D$直接学习并且生成呢

$D$是可以做到Creat的，因为$D$本质上是一个Evaluation Function，Discriminator比起Generator存在的优势就是可以从整体上判定图片，我们只要穷举输入，根据Discriminator给出的分数选择高的生成

那么考虑Discriminator的训练，我们发现我们只有正样本(真实的图片)，则最大的问题就是如何寻找负样本(noise？画的差的图？)，我们需要一个质量好的负样本才能训练Discriminator

这个训练可以采用迭代的方法

先用不太好的负样本(noise)和正样本得到第一代的Discriminator，然后一代的Discriminator就可以生成质量略微提升的负样本，然后用这个负样本和Data去训练下一代的Discriminator

问题在于得到负样本的过程相当于求解argmax problem，这是一个不同情况极其个例的求解问题，难度比较高(模型未知)，甚至极大似然估计难以得到结果

因此有了GAN，Generator本质就是学习如何解argmax problem的解题机器，更容易一般化问题(不需要知道模型，直接通过NN解)，Discriminator本质就是两个数据分布的距离计算器

GAN是一种structured learning，Generator是一种Bottom Up方法，只能从component层面学习生成，Discriminator是Top Down方法，能够对整体evaluate，两者结合产生了更好的效果(生成图片更清晰)

但是GAN也存在难训练，易崩溃的问题，在学习过程中，生成器可能会发生退化，反复生成相同样本，导致判别器指向相似的地方，使得训练难以继续，而前面提到的不需要预知模型带来优点的同时也带来了模型过于自由的问题，使得在图片质量较高，pixel较多情况下GAN变得非常不可控
