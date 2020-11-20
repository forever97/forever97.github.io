---
title: Wasserstein GAN
date: 2020-04-10 18:13:06
tags: [GAN, WGAN]
categories: GAN马戏团
cover: /2020/10/19/Re0-1/9.png
---
Wasserstein GAN希望采用Earth Mover Distance来取代JS-divergence，以解决GAN训练中梯度弥散和梯度不稳定的问题

首先是梯度弥散问题，生成器梯度弥散的原因是过分优秀的判别器，判别器越能准确的分辨$G$和$Data$，生成器梯度消失就越严重

对于最优参数的判别器，生成器Loss为

$C(G)=-log4+2D_{JS}(p_{data}||p_G)$

[上式推导戳此处](https://forever97.github.io/2020/03/13/GAN/)

最小化Loss就是最小化JS散度，具体在训练中就是尽量将$P_G$拉向$P_{data}$

JS divergence的问题就在于生成的数据和真实数据往往没有任何重叠，一是Data本质的问题，image在高维空间中的分布是一个低维的manifold，两者很难有overlap，其次在具体实现中Sampling使得overlap的概率更低

观察JS散度的表达式

$D_{JS}(P||Q)=\frac{1}{2}D_{KL}(P(x)||\frac{P(x)+Q(x)}{2})+\frac{1}{2}D_{KL}(Q(x)||\frac{P(x)+Q(x)}{2})$

$D_{KL}(P||Q) = E_{P}[log(\frac{P}{Q})]$

若P和Q没有任何重合，则代入JS散度计算的采样点x只会产生两种情况

1. $P(x)=0，Q(x) \neq 0$
2. $P(x) \neq 0，Q(x)=0$

即两者完全没有重叠或者重叠部分可以忽略不计

那么$JS(P||Q)=log\frac{P}{\frac{1}{2}P+0}=log2$

或是$JS(P||Q)=log\frac{Q}{\frac{1}{2}Q+0}=log2$

也就是说就算有一种分布更接近真实分布，如果没有重合就和完全不接近是相同的效果，JS散度的计算结果都是$log2$，这对梯度下降方法就意味着，梯度为0，可能没法按照更接近真实分布的训练方向前进(train不动)

所以Discriminator需要适当的迭代次数，次数太多，判别器过优，生成器梯度弥散，次数太少，生成器梯度不准，这也是GAN难以训练的原因之一

为了解决这个问题，Goodfellow提出了改进的损失函数

将$E_{x\sim p_{G}(x)}[log(1-D(x))]$替换为$E_{x\sim p_{G}(x)}[-logD(x)]$


在最优的D参数下有$C(G)=-log4+2D_{JS}(p_{data}||p_G)$

我们拆解KL散度可以得到

$D_{KL}(p_G||p_{data})=E_{x \sim p_G}[log \frac{p_G(x)}{p_{data}(x)}]$

$=E_{x \sim p_G}[log \frac{p_G(x)/(p_G(x)+p_{data(x)})}{p_{data}(x)/(p_G(x)+p_{data(x)})}]$

$=E_{x \sim p_G}[log \frac{1-D(x)}{D(x)}]$

$=E_{x \sim p_G}[log (1-D(x))]-E_{x \sim p_G}[log (D(x))]$

因此我们可以得到

$C(G)=D_{KL}(p_G||p_{data})-E_{x \sim p_G}[log (D(x))]$

$=D_{KL}(p_G||p_{data})-2D_{JS}(p_{data}||p_G)+log4+E_{x \sim p_{data}}[logD(x)]$

刨除不依赖G的部分

$C(G)=D_{KL}(p_G||p_{data})-2D_{JS}(p_{data}||p_G)$

我们发现最小化Loss，在减小KL散度的同时需要增大JS散度，这个最优化结果会导致梯度的不稳定

同时$D_{KL}(p_G||p_{data})$在$p_G(x)$趋于0而$p_{data}(x)$趋于1时值趋于0，在$p_G(x)$趋于1而$p_{data}(x)$趋于0时值趋于正无穷

前者对应的是缺乏多样性的问题，后者对应的是缺乏准确性的问题，也就是准确性缺失的惩罚远大于多样性缺失的惩罚，最优化这种Loss的结果就是mode collapse，生成器宁愿生成重复的安全样本也不愿意去尝试产生多样性的可能会触发更大惩罚的样本

Wasserstein GAN为了解决这些问题，提出了Earth Mover Distance(推土机距离)

将distribution看成两堆土，推土机距离就是将P的土形状铲成Q的最短平均距离，铲土有很多种方式，我们穷举moveing plan(matrix)，求最优的plan


$V(G,D)=max_{D \in 1-Lipschitz}(E_{x \sim P_{data}}[D(x)]-E_{x \sim P_G}[D(x)])$

1-Lipschitz的意思是D has to be smooth enough，也就是说，discriminator学出来的划分线必须足够平滑，否则趋于无穷的话推土机距离没法算

用数学式子来表示就是满足$|f(x_1)-f(x_2)| \le K|x_1-x_2|$

f函数的Lipschitz常数为K

为了保证这个限制，文章作者给了一种朴素的办法叫Weight Clipping：限制权值w使得在c和-c之间，使得D平滑

所以相比于原始GAN，WGAN只做了几点改动

1. 判别器的最后一层去掉sigmoid，将二分类问题转化为回归问题 (近似拟合Earth Mover Distance)

2. 去掉G和D的Loss中的log (损失函数变动)

3. 更新判别器参数的时候将其绝对值截断到常数c以内 (1-Lipschitz)

4. 不用基于动量的优化算法 (实验玄学)

总的来说，WGAN的优势在于理论上解决了梯度弥散和collapse mode的问题，不需要精巧的网络设计，也不需要去注意平衡G和D的训练程度，同时提供了一个可以用于衡量训练进程的指标




