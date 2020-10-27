---
title: GQA-OOD [低频样本处理]
date: 2020-07-08 08:01:56
tags: [VQA, 2020, dataset]
mathjax: true
categories: 视觉问答藏书阁
cover: https://forever97.github.io/2020/07/08/GQAOOD/1.png
---
[Paper Download Address](https://arxiv.org/abs/2006.05121)

玫瑰是红色的，紫罗兰是蓝色的，但是，VQA系统理应期待他们是这样的么？

目前多数的VQA数据集仍然非常的不平衡，大量常用的表述比如红玫瑰，与上下文无关的表述比如城市中的斑马，这些表述导致模型过分依赖于biases，缺乏一般化的能力。尽管对这个问题有普遍的共识，对误差分布的系统性评估仍然非常稀缺。整体正确率依然是主流，甚至唯一的评判依据，虽然这是不合理的。

现在对于模型的评判有这些问题：误差分布是什么样的？正确的预测是因为推理还是因为偏见？在低频样本和高频样本上的正确率如何？如何在分布之外(OOD)验证模型？

文章提出了一种新的标准，这个标准包含

1. 一个重新组合的GQA数据集，在验证集和测试集中引入分布变换
2. 一系列评估方法
3. 新的评价图来说明VQA在不同操作点上的推理行为

选择GQA数据集是因为其问题组结构能够捕捉biases，可以以此来选择具有较强偏见的组并创建分布转换，为每一个问题添加约束

![](1.png)

作者用这个标准做了大量的实验发现许多SOTA VQA模型都不能胜任解决不常见问题的工作，同时在VQA降低偏见的方法上得到同样的结论。

仅在高频样本上获得的高正确率机械性地提高了整体的正确率，掩盖了当下VQA model的真实行为

文章的贡献如下

1. 公开经过重组和精校(fine-grained)的GQA数据集，提出一系列评估方法，准确评估VQA模型的推理行为，对VQA模型的泛化能力(generalisation behavior)特征化和可视化
2. 相比于其它标准，数据集在验证集和测试集上分布的变化使得其能在OOD条件下测试
3. 评估了最近几个VQA模型，发现其在OOD情况下难以泛化；测试了一些SOTA biases降低方法，说明在解决VQA中的biases问题还有改进的余地

## 相关工作

### VQA数据集

VQA1数据集是最早的大规模数据集，因为其包含大量biases，因此提出了VQA2。CLEVER数据集是一种合成数据集，优点是详细和结构化的注释，后来有人将CLEVER对应到真实世界得到GQA数据集

### 减少bias依赖

尽管设计了复杂的结构，VQA模型依然缺乏泛化能力。VQA问答问题有时候不需要视觉部分，有时即使使用了视觉部分，但是使用的却不是相关区域

[1]用对抗的方式采用question-only模型和VQA模型对抗来解决bias问题；Rubi系统[2]在训练中除了使用基本模型外，还使用了一个question-only分支，来消除bias的影响；[3]使用训练集的问题类型统计数据来规范化模型预测；[4][5]则是让VQA系统将注意力集中在最重要的视觉区域，这些工作在未知分布上(unseen distributions)表现良好，但会略微降低标准测试的性能，标准测试往往对依赖biases的模型更有利

[1] Sainandan Ramakrishnan, Aishwarya Agrawal, and Stefan Lee. Overcoming language priors in visual question answering with adversarial regularization. In Advances in Neural Information Processing Systems, pages 1541– 1551, 2018.

[2] Remi Cadene, Corentin Dancette, Matthieu Cord, Devi Parikh, et al. Rubi: Reducing unimodal biases for visual question answering. In Advances in Neural Information Processing Systems, pages 839–850, 2019.

[3] Christopher Clark, Mark Yatskar, and Luke Zettlemoyer. Don’t take the easy way out: Ensemble based methods for avoiding known dataset biases. In Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing and the 9th International Joint Conference on Natural Language Processing (EMNLP-IJCNLP), pages
4060–4073, 2019.

[4] Jialin Wu and Raymond Mooney. Self-critical reasoning for robust visual question answering. In Advances in Neural Information Processing Systems, pages 8601–8611, 2019

[5] Ramprasaath R Selvaraju, Stefan Lee, Yilin Shen, Hongxia Jin, Shalini Ghosh, Larry Heck, Dhruv Batra, and Devi Parikh. Taking a hint: Leveraging explanations to make vision and language models more grounded. In Proceedings of the IEEE International Conference on Computer Vision, pages 2591–2600, 2019.

### 重塑VQA评估标准

VQA的模型日益复杂，且bias问题严重，亟需新的VQA评估方法。早期的研究采用基于词汇库的软评价方法，虽然被硬分类评价替代，带来了更多bias，但是在训练中更易使用。GQA的作者根据他们的数据集提出了一系列新的评估方法一致性(consistency)，合理性(plausibilitiy)，有效性(validity)，分布(distribution)，这些方法更好地评估了VQA模型的能力，但是并没有评估OOD环境下的泛化能力。[6]提出了GQA分割，重组了训练和验证集以清楚地评估模型在视觉场景的内容和问题的语言结构上的概括程度；[7]提出了CLOSURE标准，SOTA models(包含了为了泛化能力而设计的模型)在这些条件下没能成功泛化；[8]重组了VQA2，提出VQA-CP2，训练集分布和测试集分布不同

[6] Drew Hudson and Christopher D Manning. Learning by abstraction: The neural state machine. In Advances in Neural Information Processing Systems, pages 5901–5914, 2019.

[7] Dzmitry Bahdanau, AI Element, Harm de Vries, Shikhar Murty, Philippe Beaudoin, Yoshua Bengio, and Aaron Courville. Closure: Assessing systematic generalization of clevr models.

[8]Aishwarya Agrawal, Dhruv Batra, Devi Parikh, and Aniruddha Kembhavi. Don’t just assume; look and answer: Overcoming priors for visual question answering. In IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 2018.

## GQA-OOD

作者将新提出的数据集命名为GQA-OOD，OOD样本是低频事件的意思，OOD样本涵盖了训练集中的内容。比如说，提到在图片中出现玫瑰，一般回答是红色的，而GQA-OOD中更多的测试样本，答案则是蓝色之类的

GQA-OOD评估标准由数据集和新的评估方法构成，GQA-OOD和GQA的训练集是相同的，验证集和测试集则进行了分布转化

### Question groups

为了构造分布转换，作者采用了GQA注释中的local groups，它们精确定义了问题的类型"what color"，"where is"，同时还有问题相关的概念，比如"violet"，"zebra"。作者使用了平衡版本的GQA，这个版本对问题分布进行了平滑处理，使得答案分布更加均匀，但是数据集依然是不平衡的，因为现实世界的红色玫瑰本就居多

### Measuring group imbalance

作者提取最不平衡的问题组的子集，因为文章感兴趣的是在特定的背景下评估预测误差，其中分布的变化是有意义的，这里的平衡性是利用信息熵来评估的

### OOD setting and metrics

作者通过根据问题的频率选择答案的子集来引入分布变换，根据评估的类别引入了三种不同的评估指标：

1. Acc-tail，OOD样本的准确率
2. Acc-head，每个local group中高频样本的准确率
3. ACC-all，整体准确率

### Difference with VQA-CP2

VQA-CP2是根据问题的首单词和相同的真实答案来分组的，这种分布转变是通过避免分组之间的重复类型而产生的，而GQA-OOD允许对VQA模型的泛化行为进行细粒度分析

VQA-CP2只包含训练集和测试集，缺乏对超参数的验证，因此，大多数技术在测试集上优化它们的超参数，这会导致overfit测试集，而GQA-OOD包含验证集

GQA-OOD要求是在原始的GQA train split上训练，这要求模型在训练集存在bias的情况下减少测试结果中的bias，有利于通过方法而不是清理训练数据来减少bias

## 实验

![](2.png)

(1) Models fail on rare question-answer pairs

两个盲模型Question Prior和LSTM在低频样本和高频样本上的表现有较大的差距($\Delta$)，说明其对语言biases依赖较大，而BUTD和MCAN也相对比较大，但是MCAN表现比BUTD稍好，说明Transformer结构的表现更好一些

(2) Overall accuracy is dominated by frequent question-answer pairs

acc-all作为VQA的标准度量，并不能很好地评估模型的表现，因为其随着高频样本正确率的提升而提升

(3) Bias-reduction methods are not efficient on rare samples

用于减少bias的方法都没有增加acc-tail的得分，甚至降低acc-head的评分，说明阻止对高频样本的学习并不能提高对低频样本的学习能力

和其它数据集的比较

![](3.png)








