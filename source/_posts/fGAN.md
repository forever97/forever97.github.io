---
title: fGAN--任意散度GAN
date: 2020-04-03 17:09:42
tags: [GAN, fGAN, 散度]
categories: 🎪GAN马戏团
cover: /2020/10/19/Re0-1/9.png
---
fGAN的基本想法就是希望用不同的散度来取代JS散度

使得任何divergence都可以应用到GAN的框架中

f-divergence ：$D_f(P||Q) = \int_{x} q(x)f(\frac{p(x)}{q(x)})dx$

$f$函数需满足当$x=1$时 $f(x)=0$ 且$f$是$convex$

这个式子可以衡量分布P和Q的差异

若P分布和Q分布相同，则$D_f(P||Q) = \int_{x} f(1)dx=0$

当P分布与Q分布不同时，$D_f(P||Q) = \int_{x} q(x)f(\frac{p(x)}{q(x)})dx \ge f(\in_{x}q(x)\frac{p(x)}{q(x)}) =f(1) = 0$

(这里的积分大于等于是因为$f$是$convex$)

当$f(x)=xlogx$时

$D_f(P||Q)=\int_{x} \frac{p(x)}{q(x)} log(\frac{p(x)}{q(x)})
=\int_{x} p(x)log(\frac{p(x)}{q(x)})=D_{KL}(P||Q)$

当$f(x)=-logx$时

$D_f(P||Q)=D_{KL}(Q||P)$，即$Reverse KL$

共轭函数(Fenchel Conjugate)：

每个convex function $f$，都有一个conjugate function $f^*$

$f^*(t)=max_{x \in dom(f)}{xt-f(x)}$

即$f(t_1)$是$xt_1-f(x)$对$x$的任意取值取得的最大值

我们将x取不同值的$xt-f(x)$直线画出来

取每一段位置的upperbound就是f的Fenchel Conjugate

比如$xlogx$的Fenchel Conjugate就是$f^*(t)=exp(t-1)$

$f^*(t)=max_{x \in dom(f)}{xt-f(x)}$

$g(x)=xt-xlogx$ 

现在给定t要使得$g(x)$最大

prove:

$t-logx-1=0$ 

$x=\exp(t-1)$

$f^*(t)=\exp(t-1) \cdot t-\exp(t-1) \cdot (t-1)=\exp(t-1)$

得证

因为$f$和$f^*$是共轭函数

所以$f^*(t)=max_{x \in dom(f)}{xt-f(x)}$ 

可以转化为$f(x)=max\{xt-f^{*}(t)\}$

$t \in dom(f^*)$

$D_f(P||Q)=\int_{x} q(x)f(\frac{p(x)}{q(x)})dx$

$=\int_{x} q(x)(max\{\frac{p(x)}{q(x)}t-f^*(t)\})dx$

$D_f(P||Q) \ge \int_{x}q(x)(\frac{p(x)}{q(x)}D(x)-f^*(D(x)))dx$

$=\int_{x}p(x)D(x)dx-\int_xq(x)f^*(D(x))dx$

所以说我们只要找一个$D(x)$输出为$t$

只要其能逼近$t$，那么这个式子就能逼近$x-divergence$

$D_f(P||Q)$

$\approx max_D \int_x p(x)D(x)dx - \int_xq(x)f^*(D(x))dx$

$=max_D{E_{x \sim P}[D(x)]-E_{x \sim Q}[f^*(D(x))]}$

$G^*=arg min_GD_f(P_{data}||P_G)$

$=arg min_Gmax_D{E_{x \sim P_{data}}[D(x)]-E_{x \sim P_G}[f^*(D(x)]}$

那么只要得到f的共轭函数，我们就能构造出一个对应的GAN

在GAN的训练中通常会碰到以下两个问题：

Mode Collapse：训练到最后可能生成结果中同一张人脸会反复出现

Mode Dropping：Generator switches mode during training(比如第t次迭代全是黄皮肤，t+1次全是白皮肤，t+2次全是黑皮肤)

不同的divergence测试说明了这两个问题和JS-divergence无关

