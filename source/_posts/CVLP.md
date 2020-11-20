---
title: CVLP [预处理]
date: 2020-08-14 15:40:52
tags: [VQA, 对比学习, VLP, 预训练, 2020]
mathjax: true
categories: 视觉问答藏书阁
cover: /2020/08/14/CVLP/1.png
---
[Paper Download Address](https://arxiv.org/abs/2007.13135)

[Code Download Address](https://github.com/ArcherYunDong/CVLP-)

## Introduction

语言预训练彻底改变了自然语言理解(NLU)，与此同时，在视觉分支上提出了视觉语言预训练(VLP)，VLP所依赖的网络结构与以往的方法相似，但通过大规模的预训练获得语义信息，使模型具有更好的性能和泛化能力

两种著名的VLP方法LXMERT和ViLBERT均是将标记的视觉区域的特征回归或分类作为自监督学习的代理任务(pretext task)，作者在其中发现了一些问题：1) 噪声标注: L2特征回归和分类在视觉基因组中受到噪声标注的影响；2)领域偏置: 由于视觉特征是由视觉基因组上预先训练好的物体检测器生成的，特征回归和标记的区域的分类会使预先训练好的视觉语言模型继承来自视觉的偏置基因组，这使得在其它下游任务上取得较差的泛化能力

为了解决噪声标注和领域差距的问题，文中提出了对比视觉语言预训练(CVLP)，借鉴了度量学习中流行的对比学习框架来解决领域偏差和有噪声的标签问题，CVLP用对比学习代替了区域回归和分类，对比学习的目的是区分正样本和负样本，不需要任何注释，因此可以解决有噪声的标注和领域偏置问题

由于Tranformer的巨大内存成本，为对比学习而扩大batch size是非常困难的，对比学习的一个突出问题是负样本的大小对性能有很大的限制，而负样本的大小又受到batch size大小的限制，基于记忆库的思想，作者建立了一个动态记忆队列，缓存前一个区域的上下文特征，并作为对比学习中的负样本，相应的缓存特征在训练过程中逐渐漂移(drift)，从而使之前缓存的负样本在内存队列中失效，同时，从缓慢移动的查询网络中提取特征并存储到内存队列中，当队列中充满特征时，最早的视觉上下文特征将从存储库中删除，一个单纯的对比学习是无效的，因为网络将很容易学会区分正样本和负样本，为了解决这一问题，作者采用随机分层密钥网络来增加特征的多样性

本文的贡献总结如下：

1. 提出了一种新的视觉语言预训练对比学习框架，解决了之前的视觉语言预训练方法(如LXMERT和ViLBERT)遇到的领域偏置和噪声标注问题
2. 在CVLP上进行了广泛的消融研究，以验证提出的方法，CVLP预训练相比strong baseline (LXMERT) 取得显著的改善，特别是当预训练和精细训练阶段之间的区域差距变得更大时。CVLP可以在所有三个数据集(VQA, NLVR2，和GQA)上超过LXMERT的性能

## Related Work

### Self-supervised Learning in Vision, Language and Multi-modality

与需要大量数据标注的监督式训练相比，自监督式学习通过在一个代理任务中构造一个损失来自动学习有用的特征，而不需要人工标注，在计算机视觉中，上下文编码器通过image in-painting来学习特征，[Jiasaw][1]通过预测排列特征的位置来学习特征，[Kolesnikov et al][2]对之前提出的自监督学习方法进行了大规模的研究，结果表明，自监督任务的性能随着骨干(backbone)的变化而变化

NLU采用下一词预测(GPT)，下一句预测或标记词预测(BERT)，进行大规模预训练，通常采用Transformer架构进行训练，显著提高了在GLUE基准上的NLU的准确率，LXMERT和ViLBERT表明，标记的词和视觉区域也可以产生良好的视觉-语言表征

### Contrastive Learning

对比学习是自监督学习的一个分支，它利用对比损失来学习对下游任务有用的表示，对比丢失鼓励编码的实例特性与正键(positive keys)类似，而与负键保持距离，不同的对比学习方法采用不同的策略产生正键和负键，这是影响学习表征质量的重要因素，[Wu et al][3]从存储整个训练数据集实例特性的大型内存存储中选择键，还有一些研究使用当前的小批处理示例生成密钥，Moco提出一种动量编码器来动态生成键并将它们存储在一个固定大小的队列中

### Multi-modality Reasoning

目前的视觉语言预训练的骨干是建立在多模态推理结构上的，图像字幕和VQA是激发多模态融合架构设计的两个流行任务，基于关注的结构已广泛应用于多模态融合，[Xu et al][4]首先提出了软关注和硬关注，表明注意力模型具有良好的性能和可解释性，[Yang et al][5]通过叠加注意模型，提出了一种多层注意模型，[BUTD特征][6]展示了使用对象级特性的好处，最近越来越多研究建模对象和单词之间的关系作为表征学习，比如DCN，BAN，DFAF，MCAN，QBN，CA-RN以及STSGR

[1]:https://arxiv.org/abs/1603.09246
[2]:https://arxiv.org/abs/1901.09005
[3]:https://arxiv.org/abs/1805.01978
[4]:https://arxiv.org/abs/1502.03044
[5]:https://arxiv.org/abs/1511.02274
[6]:https://forever97.github.io/2020/07/15/1707-07998/

## Contrastive Visual-Linguistic Pretraining (CVLP)

![](1.png)

CVLP的结构包括Query Network (QueryNet)和Key Network (KeyNet)，它们都包含一个语言Transformer编码器，一个视觉Transformer编码器和一个多模融合Transformer编码器，初始化时，QueryNet和KeyNet具有相同的参数，QueryNet使用可视化和文本输入的masking策略来生成跨模态嵌入，而KeyNet将mask仅应用于文本输入，生成上下文化的可视特性，KeyNet将输出推入一个动态内存队列中，连续生成负样本来计算交叉模态对比损失，利用跨模mask语言建模损失、匹配损失和对比损失的组合对整个CVLP模型进行训练

### Multi-modality Fusion

给定来自视觉语言数据集的图像-句子对，作者首先使用WordPieces技术和映射一个token $W_j$到它相应的嵌入$h_{emb}(W_j) \in R^{d_w}$，其中$d_w=768$，视觉位置bbox B和视觉特征F，通过Faster R-CNN得到，$B,F=RCNN(I)$，然后计算CVLP的视觉输入和文本输入

![](2.png)

$g_F$和$g_{P-ROI}$是两个全连接层，负责对$F_i$和$B_i$做映射，$h_{P-word}$是一个位置编码函数，CVLP同时在QueryNet和KeyNet上做mask，选择$15\%$的输入文本token做替换，一部分token被替换为特殊的[MASK] token，另一部分用随机的token替换，对于视觉区域，作者使用不同的mask策略:所选区域的特征可以被设为零，也可以被其他图像的区域特征所替代，与QueryNet不同，KeyNet只对文本输入使用mask，同时保持所有可视区域特性不变。KeyNet和QueryNet被初始化为具有相同的层和参数，它们都包含9层语言Transformer编码器，5层视觉Transformer编码器和5层的多模融合Transformer编码器

![](3.png)

其中，$r_i$在视觉分支中代表一个自我注意层，$l_i$在语言分支中代表一个自我注意层，$co_i$在多模态融合分支中代表一个共同注意层

三种编码器分别由视觉自注意模块、语言自注意模块和视觉-语言共注意模块实现，视觉自注意利用注意模型中的关键、查询和值特征进行区域特征之间的信息融合，将关键，查询和价值的视觉特征记为$K_v$，$Q_v$，$V_v$，相应的语言特征为$K_w$，$Q_w$，$V_w$，模内信息融合可以表示为：

![](4.png)

其中，Transformer层的注意模块可表示为:

![](5.png)

然后用模间融合模块来融合语言和视觉特征的信息，模间融合过程是双向的，包括从语言到视觉的信息融合和从视觉到语言的信息融合

![](6.png)

通过模内/模间特征融合，可以得到一个多模上下文特征嵌入，上下文特征在一个紧凑的特征向量中编码多模态交互，基于上下文特征在CVLP中用于语言分支的mask loss和视觉分支的对比loss

### Mask Loss for Language Branch

在预训练阶段，CVLP相比于LXMERT执行了许多不同的pretext task，CVLP不包含监督任务，因此不依赖于人工标注，对于语言分支，作者将mask语言建模和图像-语言匹配预测作为两个代理任务

mask loss是由BERT首先提出的，后续的ViLBERT方法除了语言mask loss外，还增加了视觉特征mask loss

这个损失mask上下文表示，并利用上下文信息预测了mask特征，通过优化mask loss，Transformer隐式地学习了对上下文信息的编码，这有助于对下游任务进行泛化，在CVLP中，作者只对文本输入使用mask loss。此外，还增加了一个匹配损失，它涉及到一个二值Yes/No分类来预测句子是否与视觉特征匹配， mask loss可以用下面的形式来表示

![](7.png)

$\theta$表示语言Transformer编码器的参数，$w_m$和$\overline{w/m}$是要预测的mask token和没有被mask的上下文token

匹配损失定义为

![](8.png)

$W_{CLS}$表示[CLS] token，在图片-文本匹配的代理任务中对视觉-语言信息进行编码

### Contrastive Loss for Visual Branch

对比学习通过从一组负特征中区分视觉上相似的特征对来进行自我监督的表征学习，通过将Faster R-CNN提取的视觉区域特征输入到QueryNet和KeyNet中可以获得正向query-key对，其他batch的所有区域特征都被用作负键，然后通过更新网络权值进行对比学习，使以下损失最小化

![](9.png)

$\tau$表示the temperature of Softmax(?)，$v_i^{key+}$是$v_i^{query}$的所有正键(positive key)，$v_j^{memory-queue}$作为计算$L_{contrast}$的负样本

传统的对比学习方法受到反例数量的限制，实际过程中， 获得大量的负样本也是非常耗时的，受动量对比(MoCo)的启发，作者构建了一个动态的视觉记忆队列来存储KeyNet生成的特性，视觉记忆队列先为空，KeyNet生成的特性逐渐放入队列中，随着训练的进行，可以获得一个大的视觉队列作为负样本，对比学习的效果在很大程度上取决于视觉队列的特征多样性。一旦队列满了，就删除最早的特性。视觉记忆队列表示为

![](10.png)

$\overline{v_{b,n}^i}$表示第i次迭代第b张照片的第n个区域的视觉特征，视觉记忆队列的一个缺点是训练过程中的特征漂移。随着神经网络的快速更新，所提取的特征可能很快就会过时，使得存储在视觉队列中的负样本失效，为了解决这个问题，作者将KeyNet的权重定义为QueryNet的移动平均线(moving average)，QueryNet是通过随机梯度下降训练的，网络的更新记为

![](11.png)

m是动量值(momentum value)，$\theta_k$和$\theta_q$是来自KeyNet和QueryNet中的参数值，这种对比学习方式在训练过程中视觉记忆队列大，特征漂移小，可以取得较好的学习效果

### Randomly Layer-Dropping Key Network

对比学习训练无监督表示学习的一个重要因素是负样本的多样性，对比学习很容易过拟合，从而使表示学习过程失效，作者观察到，随着训练过程的进行，对比学习损失变得非常小，这表明已经发生过拟合，作者通过随机Layer-dropping关键网络，来增加存储在视觉记忆队列中的特征的多样性，droplayer策略包含KeyNet中self-attention和co-attention层的随机dropout，在对比学习的训练过程中，可以增加特征的多样性，防止过拟合，randomly layer-dropping Key Network可以表示如下

![](12.png)

SPL表示是否在某层进行随机drop，由上式可知，在预训练过程中，即使是KeyNet中的层也可能以0.5的抽样概率被丢弃

## Experiments

预训练模型在VQA Task上的比较

![](13.png)

在多项任务上和SOTA的比较

![](14.png)

attention可视化

![](15.png)

