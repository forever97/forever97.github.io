---
title: VC R-CNN [将常识引入特征]
date: 2020-07-14 07:06:28
tags: [feature extraction, 2020, CVPR, debias]
mathjax: true
cover: /2020/07/14/VCRCNN/2.png
---
[Paper Download Address](https://arxiv.org/abs/2002.12204)

现今的计算机视觉系统擅于告诉我们"什么"，"哪里"，但并不擅长告诉我们"为什么"，这个"为什么"指的就是视觉原因，缺乏常识很容易导致机器学习中的认知误差，比如和leg区域相比，有更多的person区域和ski单词一同出现，那么视觉注意力会更多地放在人身上，但如果我们拥有"常识性"的特征，看到ski的时候我们就会把注意力集中到脚上

![](1.png)

常识并不总是包含在语言中的(因为有reporting bias)，比如我们会看到"人在路上走"，但应该很少见到"人用脚走路"。NLP中词X可以通过预测上下文中的Y来学习，但是这种做法很难迁移到图像中，因为图像中对象同现的显式原因无法被观察到，那么导致X和Y同现的真正常识会被observational bias混淆，比如如果键盘和鼠标总是被观察到在桌子上，那么得到的常识可能是键盘和鼠标是桌子的一部分而非电脑

文章利用MS-COCO数据集中的标注信息，计算Association P(Y|X)和Intervention P(Y|do(X))之间的区别，这里可以简单地理解为1.从别的图片"bollow"一个对象Z；2.将这个Z"put"在X和Y的周围；3.看看在Z的影响下X是否还会导致Y的出现，这里"bollow"和"put"就是干预的核心，这里的Z是干预的结果，不依赖于X和Y，通过这种方法，来自背景的bias会减轻

![](2.png)

文章在R-CNN的基础上提出了VC R-CNN框架，对do-operation提出了一种新算法，VC R-CNN框架如图所示

![](3.png)

而学习到的VC Feature就作为了干预武器的化身

## 相关工作

### Multimodal Feature Learning

随着最近NLP中预训练语言模型(pre-training language models, LM)的成功，研究者开始寻求从大的、未标记的多模态数据中进行弱监督学习来编码视觉-语义知识。然而，所有这些方法都存在语言的报告偏差(reporting bias)，以及下游微调的巨大记忆成本，而VC R-CNN是只基于图片的无监督学习，且能和原先的表征串联

### Un-/Self-supervised Visual Feature Learning

这类研究通过一个精心设计的代理任务(proxy task)来学习视觉特征，比如去噪自动编码器，上下文和旋转预测和数据扩充，上下文预测是通过相关性来学习的，而图像的旋转和增强可以看作是采用随机对照试验，这些都是主动的和非观察的(non-observational)，而VC R-CNN是通过因果推论，是被动和非观察的

### Visual Common Sense

之前的研究分为两类：1.使用常识知识从图像中学习；2.从视频中学习行为。然而，前者将常识局限于人类注释的知识，而后者本质上又是从相关性中学习

### Causality in Vision

和其它工作不同的是，VC R-CNN提供了一个通用的特征提取器

## Sense-making by Intervention

### Causal Intervention

![](4.png)

如上左图所示，在现实世界中，很多情况下X和Y的发生是存在混杂因子(confounders)Z的，如果只从P(Y|X)中学习会导致虚假的相关性，也可以从贝叶斯公式来说明这一点

$P(Y|X)=\sum_zP(Y|X,z)P(z|X)$

confounder Z通过$P(z|X)$造成observational bias

do操作的本质就是去切断Z和X之间的联系

$P(Y|(do(X))=\sum_zP(Y|X,z)P(z)$

通过干预$P(Y|do(X))$作为特征学习目标，可以在"common"和"sense-making"之间进行调整，从而缓解observational bias

![](5.png)

图a中是分别用$P(Y|X)$和$P(Y|do(x))$统计的特征，可以发现相比于$P(Y|X)$中，window和leg被放在一起的情况(因为人在街道上走的图片中通常有带窗的建筑)，$P(Y|do(x))$中两者显然被分开了，而图b中可以看到在VC R-CNN特征图中，ski明显离leg和snow更近

### The Proposed Implementation

因为现实中的confounder是很难被收集全的，文章建立了一个confounder词典，将RoI特征在每个类别上取平均，特征是通过Faster R-CNN得到的

干预实现如下：

$P(Y|do(X))=E_z[Softmax(f_y(x,z))]$

考虑到$E_z$成本高昂，用Normalized Weighted Geometric Mean (NWGM)来近似

由于混淆因子作为类别平均特征的因果关系尚未验证，即Z可能包含碰撞器(或v型结构)干预时，会导致虚假的相关性。为此，文章应用NCC从z移除可能的碰撞器。给定x和z, NCC(x to z)输出从x到z的相对因果强度，然后丢弃碰撞器因果强度大于阈值的训练样本

## VC R-CNN

VC R-CNN以图像为输入，从CNN主干(如ResNet101)中生成feature map。与faster R-CNN不同，VC R-CNN丢弃了Region Proposal Network(RPN)，直接利用ground-truth bounding boxes提取RoIAlign层的目标层表示。最后每两个RoI特征x，y最终成为两个预测因子分支：使用全连接层来估计每个对象类的Self Predictor，以及利用do-calculus来预测context label的Context Predictor

对于RoI X来说，损失函数为

![](6.png)

p是Self Predictor输出的N个类别的离散概率分布，$x^c$是RoI X的ground-truth class，$y_i^c$是ground-truth label

$L_{self}(p,x^c)=-log(p[x^c])$

$L_{cxt}(p_i,y_i^c)=-log(p_i[y_i^c])$

## 实验

消融实验

![](7.png)

Only VC是单纯的VC feature，+Det是只有Self Detection，+Cor是只有context labels，无干预，+VC是文章中的完整的干预过程得到的特征连接上原始特征

对SOTA model的影响

![](8.png)

效果展示(右侧是VC feature)

![](9.png)











