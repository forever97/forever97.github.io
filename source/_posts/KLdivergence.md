---
title: KL散度
date: 2020-03-12 20:51:15
tags: [KL散度, 最大似然估计, 交叉熵, JS散度]
mathjax: true
cover: http://imglf3.nosdn0.126.net/img/MXRvbEU3WmxrOUpKQUhxamtHT3ZHZG9ST1N5WThTZU1Hc0duWUhQUkQwSjgwR3Z2dVRLS3h3PT0.png
---
## 概率分布

概率分布指的是变量X取值及其对应的概率

其包含所有取值和对应的概率

概率函数指的是用函数的形式来表示概率

$P_i=P(X=a_i)(i=1,2,3,4,5,6)$

概率分布函数$F(x)=P(X \le x)$

即概率分布函数是累积概率函数

分布参数$\hat\Theta$是一个概率分布的量化指数，它是样本总数的数值特征或一个统计模型，分布参数为一个或者多个，比如泊松分布只需要一个参数$\lambda$，正态分布则需要两个参数来决定均值和方差

## KL散度

KL散度又被称为相对熵

是一种衡量两个分布之间匹配程度的方法

$D_{KL}(P||Q)=\sum_{i=1}^NP(x_i)log(\frac{P(x_i)}{Q(x_i)})$

其计算的是给定分布偏离真实分布的程度

在深度学习中通常用来评估模型输出的预测值分布与真值分布之间的差异

在公式中，我们用$P(x_i)$对$log(\frac{P(x_i)}{Q(x_i)})$加权

即概率越高的匹配区域的偏离系数更加重要

KL散度并不像范数一样是对称的，也就是其不是真正的度量值

即$D_{KL}(P||Q) \neq D_{KL}(Q||P)$

除去不对称性，KL散度还有一个重要的性质是非负性

$D_{KL}(P||Q) = E_{P}[log(\frac{P}{Q})] = -E_{P}[log(\frac{Q}{P})] \ge -log(E_{P}[\frac{Q}{P}]) = -log(\int P\frac{Q}{P}) = 0$

## 最大似然估计(MLE)

最大似然估计希望从样本数据中估计总体参数

假设我们有一个概率分布D

我们从分布D中抽取n个参数$x_1,x_2,\dots,x_n$

利用n个采样数据来估计分布参数$\hat\Theta$，最终找到使得采样数据可能性最大化的分布参数$\hat\Theta$

即最大化$f_D(x_1,x_2,\dots,x_n|\hat\Theta)$

那么我们可以得到求解式$\hat\Theta=argmax_\theta \Pi_{i=1}^Np(x_i|\Theta)$

注意到乘法在实际处理中容易导致溢出，因此我们做取log处理

$\hat \Theta =argmin_\Theta - \Sigma_{i=1}^Nlog(p(x_i|\Theta))$

式子中的$argmax_\theta$和$argmin_\theta$表示$\theta$使得后式取得最大\小值时的取值

## 交叉熵

熵的概念起源于物理学，用于度量热力学系统的无序程度

信息学中的熵则类似，是用于度量信息的不确定程度

信息的作用是消除不确定性

熵越高，能传递的信息越多，不确定性越高

>确定的事件没有信息，随机事件包含最多的信息

熵的计算式子为$H(x)=-\Sigma_xP(x)log(P(x))$

交叉熵指用分布Q的参数对分布为P的信息x编码需要的最少比特数

$H(P, Q)=-\Sigma_xP(x)log(Q(x))$

我们发现交叉熵跟KL散度以及最大似然估计十分相似

$H(P,Q)=-\Sigma_xP(x)log(Q(x))$

$=-\Sigma_{x\in X}p(x)log(q(x|\Theta))$

$=-\Sigma_xP(x)log(P(x))+\Sigma_xP(x)log(P(x))-\Sigma_xP(x)log(Q(x))$

$=H(P)+D_{KL}(P||Q)$

所以最小化交叉熵，最小化KL散度和最大似然估计过程从参数更新的角度上看意义是相同的

因为KL散度和熵均非负，因此交叉熵也具有非负性

## JS散度

JS散度是KL散度的一种变形

$D_{JS}(P||Q)=\frac{1}{2}D_{KL}(P(x)||\frac{P(x)+Q(x)}{2})+\frac{1}{2}D_{KL}(Q(x)||\frac{P(x)+Q(x)}{2})$

因其是对称的，因此JS散度又可以称为JS距离，相比于KL散度，其对相似度的判断更为准确


