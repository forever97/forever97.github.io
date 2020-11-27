---
title: 通过分解语言表征来克服VQA中的语言先验
date: 2020-07-03 20:58:39
tags: [VQA, AAAI, 2020, debias]
mathjax: true
categories: VQA藏书阁
cover: /2020/07/03/DLR/1.png
---
[Paper Download Address](https://jingchenchen.github.io/files/papers/2020/AAAI_Decom_VQA.pdf)

目前多数VQA model中存在语言先验(Language Priors)问题，比如对于颜色会快速回答"white"，对于运动会快速回答"tennis"，对于"is there a"开头的问题会快速回答"yes"，这些模型并不能真正辨别问题中信息的不同之处，他们只是利用答案和询问词(interrogative words)的同现性来得到答案

尽管有些模型采用了问题注意力机制，将关键词和视觉信息结合，但是它们并没有消除interrogative words的影响，因此仍存在language prior

[1]的研究中，为了消除language piror，用多个手工设计的模块来处理问题中不同的信息，他们用一个问题分类器将问题划分为yes/no类别和非yes/no类别，用一种基于词性的概念抽取器来提取yes/no问题中的概念，以及答案聚类预测因子确定非yes/no问题的答案类型

[1] Agrawal, A.; Batra, D.; Parikh, D.; and Kembhavi, A. 2018. Dont just assume; look and answer: Overcoming priors for visual question answering. In Proceedings of IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 4971–4980.

本文是[1]工作的延伸，都是对内容发现和内容核验解耦，但是有两个方面的不同，一是用语言注意力机制对问题分解而不是基于词性的概念抽取器，二是将候选答案作为视觉部分去学习它们和问题以及图片的关联性，而[1]中预定义了不同的视觉内容，用预训练的分类器对图片的内容进行分类

在QA对中，通常包含三种信息：1.问题类型(question type)，2，相关目标(referring object)，3.期待的内容(expected concept)，期待的内容在yes/no问题中是包含在问题里的，而在非yes/no问题中被包含在答案中

文章中提出的VQA模型分为四个模块：

1. 语言注意力模块(The language attention module)将问题分为三个部分：type，object，concept，在学习concept representations的时候，文章采用软注意力和硬注意力结合的方式来评估interrogative words的影响

2. 问题识别模块(The question identification module)利用type representation来界定问题的种类(yes/no或是具体问题比如color，number)
   
3. 目标模块(The object referring module)采用top-down attention来注意目标相关的图片区域

4. 视觉验证模块(The visual verification module) 计算注意力区域和concept的相关性得分来推断答案

通过这四个模块，文章可以清晰呈现出答案预测的过程

文章的主要贡献有

(1) 学习对问题的语言表征进行分解，将语言相关concept和视觉相关concept解耦来消除language priors

(2) 采用了结合软注意力和硬注意力的语言注意力方法，在分离concept部分和type部分的同时灵敏地甄别问题中的不同信息

## 相关工作

### VQA

作者将VQA的方法分为两类：整体性的(holistic)和模块化的(modular)，整体指对于不同的QA对采用单一的模型进行求解，模块化的指先将问题划分到模块框架下，然后用对应的模块去解决

文章虽然采用模块设计，但是本质上属于holistic方法，因为对于不同的问题采用的是单一的模型。文章采用的方法是分析问题产生phrase，将其作为之后部分的input，而不是去预测模块框架

### Language Priors

为了降低Language Priors的影响，数据集上提出了VQA-CP(训练集和测试集QA分布不同)，训练方法上提出了对抗方式，用question-only model和VQA model对抗来减少biases；以及用人类注意力监督来提升视觉能力，即减少人类视觉注意图和网络得到的注意力之间的差异

## 本文方法

本文模型的整体框架如下，下面的图中(a)和(b)展示了在不同的问题类型下的方法

![](1.png)

### Language Attention Module

作者在[2]的hard attention启发下，设计了结合软注意力和硬注意力的语言注意力模块，

[2] Malinowski, M.; Doersch, C.; Santoro, A.; and Battaglia, P. 2018.Learning visual question answering by bootstrapping hard attention.
In Proceedings of the European Conference on Computer Vision (ECCV), 3–20.

![](2.png)

如上图所示，在语言注意力模块中，采用了三种不同的注意力，type attention，object attention和concept attention来学习三种分解出的representations

同时采用了一种问题分类判别loss来保证type attention确实是注意在interrogative words上，并且设置了一个阈值，对interrogative words进行过滤，使得其不参与object
representations和concept representations

$q_{type}$的计算公式为

![](3.png)

其中$\{w_t\}_{t=1}^T$是问题的T个单词，$\{e_t\}_{t=1}^T$是单词对应的embeddings

同样还有$q_{obj}$和$q_{con}$

![](4.png)

这两个attention都是hard attention，因为只有一部分单词参与计算

### Question Identification Module

得到了type representation $q_{type}$之后文章用question identification loss来标定问题的type

![](5.png)

$CE(a,b)=-alog(b)-(1-a)log(1-b)$，也就是交叉熵损失

yes/no问题的答案集显然是yes/no，对于非yes/no问题需要处理出一个答案集，处理过程需要衡量问题和候选答案的相关性，处理方法是生成一个候选答案维度的01向量mask，用KL散度对mask进行训练

![](6.png)

其中$m_q=sigmoid(s_q)$，$s_{qa}$是$q_{type}$和$a$的点积

### Object Referring Module

Object referring模块利用$q_{obj}$将注意力集中到问题相关的视觉区域，这部分主要follow[3]

[3] Anderson, P.; He, X.; Buehler, C.; Teney, D.; Johnson, M.; Gould,S.; and Zhang, L. 2018. Bottom-up and top-down attention for
image captioning and visual question answering. In Proceedings of IEEE Conference on Computer Vision and Pattern Recognition (CVPR).

### Visual Verification Module

根据视觉注意力区域从答案集中选出正确答案，对于yes/no问题采用交叉熵损失，非yes/no问题用KL散度

![](7.png)

### 实验结果

SOTA

![](8.png)

阈值影响

![](9.png)

实验结果可视化展示

![](10.png)

消融实验

![](11.png)



