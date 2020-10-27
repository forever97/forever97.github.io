---
title: SQulNTing [子问题一致性]
date: 2020-07-09 07:59:19
tags: [VQA, dataset, 2020, CVPR]
mathjax: true
categories: 视觉问答藏书阁
cover: https://forever97.github.io/2020/07/09/SQuINTing/1.png
---
[Paper Download Address](https://arxiv.org/abs/2001.06927)

VQA问题要求模型在多个抽象层面进行推理，比如要回答问题"这个香蕉熟到能吃的地步了么"，VQA model需要检测香蕉并且提取它的相关属性比如大小和颜色。抽象概念是复杂，多细节层次的。

文章中将问题分为感知和推理两类，感知问题只要求对对象确认存在，查询对象的物理属性和判断对象之间的空间关系，比如"图中香蕉是什么颜色的"或者"这个人的左边的是什么"，推理问题则需要结合视觉感知，逻辑和先验知识来完成，比如"这个香蕉熟到能吃的地步了么"

将问题划分为感知和推理可以更好地评估模型的视觉感知和高级推理能力，作者认为，将感知问题作为推理问题的子任务是有帮助的。通过阐述这样的子任务，可以检测模型是通过合理推断还是通过数据集中的bias和捷径来得到答案。就比如，我们需要留意一下模型的推理能力当其对于香蕉的颜色答案为黄，但对于香蕉能否食用答案是否的时候。高水平推理任务与低水平感知任务之间的不一致表明model还没有有效地学习如何回答推理问题。这些子问题可以用来对任何VQA模型评估而不仅是那些被用来提供理由的模型

随着推理问题的复杂化，目前使用的方法实现良好的覆盖和泛化需要大量的数据，作者采用一种层次分解策略，在这种策略中，用一组合适的问题来识别和连接推理问题。这种方法可以通过组合建模来提高效率，也可以提高回答推理问题的模型的一致性。感知任务为推理问题提供了语言基础，光有视觉基础是不够的，比如图中强调香蕉对问题的重要性并没有告诉是如何重要的(颜色比形状和大小更重要)

![](1.png)

作者从VQA数据集中分割出只包含推理问题的子集，然后提出了VQA-introspect数据集，一个由238K个相关感知子问题组成的新数据集，这些子问题包含了回答原始问题所需的子问题。作者用这个模型对SOTA model进行了细粒度评估(fine-grained evaluation)，这些模型在回答感知和推理任务方面具有相似的准确性，但存在一致性问题，在28.14%的样本中，他们回答对了推理问题，却答错了相应的子认知问题，这种情况突出了一致性问题以及模型可能通过学习常见答案和bias来学习回答推理问题的风险

最后作者介绍了一种通用的建模方法SQuINT，其灵感来自于在人类中观察到的组合学习范式。SQuINT将VQA-introspect注释和一个新的损失函数结合到学习中，该函数鼓励对子问题重要的图像区域在回答主要推理问题中发挥作用。经验评估表明，该方法产生的模型具有更好的一致性，相关感知任务的准确性也没有大的损失。并且SQuINT使得模型对推理问题产生了更好的注意力图，使得模型更可靠

## 相关工作

VQA model可能利用语言和数据集bias获得很好的效果，比如对香蕉的颜色直接回答黄色。这种情况促使研究者采用其它评估方式，[1]检查了model是否理解问题，[2][3]检查了模型是否在逻辑上保持一致性，文章对需要推理能力的问题提出了一种新的评估，检查模型回答高级推理问题和回答相应的感知子问题之间的一致性

[1] Meet Shah, Xinlei Chen, Marcus Rohrbach, and Devi Parikh. Cycle-consistency for robust visual question answering. In IEEE Conference on Computer Vision and Pattern Recognition, 2019.

[2] Marco Tulio Ribeiro, Carlos Guestrin, and Sameer Singh. Are red roses red? evaluating consistency of questionanswering models. In Association for Computational Linguistics. Association for Computational Linguistics, 2019.

[3] Arijit Ray, Karan Sikka, Ajay Divakaran, Stefan Lee, and Giedrius Burachas. Sunny and dark outside?! improving answer consistency in vqa through entailed question generation. Conference on Empirical Methods in Natural Language Processing, 2019.

关于VQA数据集的工作，一些数据集在图片上标注了问题相关的重要的注意力区域，文章的工作是这些工作的补充，提供了语言事实而非视觉事实，同时，评估了感知能力之间的联系，以及它们是如何组合来回答推理问题的

## Reasoning-VQA and VQA-introspect

这个章节分两个部分，第一部分分析了将问题类型划分成认知和推理两类的必要性，并且阐述了构建推理split的方法，第二部分记录了如何构建VQA-instrospect数据集

### Perception vs. Reasoning

一种常见的更细粒度的评估方法是把答案类型分为yes/no和非yes/no或是根据问题的前几个单词来划分(what color，how many)，虽然有用，但是这样的切片是粗糙的，并且不能在不同抽象层次上评估模型的能力，比如"这是香蕉嘛"和"这是垃圾食品嘛"，它们都是非yes/no问题并且开头单词相同。虽说它们都需要目标识别，但是后者显然需要更多的推理能力，需要结合垃圾食品的先验知识

并不是说推理问题就比认知问题要难，只是推理问题除了视觉感知外还需要一些别的技能，比如逻辑，先验知识。举个例子，视觉感知问题"图中小立方体的右边有几个黄色的圆球"就比推理问题"图中香蕉熟到能吃了么"要难得多

撇开难度不谈，对推理或是认知进行分类能够对模型进行详细的基于能力的模型评估，并提高学习

以下是作者对两类问题更正式的划分

1. Perception：检测和识别目标，物理性质，空间关系，文字/图标识别，计数，不超过单跳推理，不超出常识和视觉图像内容，特别注意和往常的paper不同，文章中将空间关系作为认知而非推理，是为了将视觉理解与其他类型的推理和知识分开
2. Reasoning：推理任务的定义非常简单：非认知任务，需要认知任务和先验知识结合

作者对VQA数据集中的感知问题的分析发现，大多数感知问题具有不同的模式，可以使用高精度的基于正则的规则识别，通过这样的规则，最后选出了VQA数据集中18%可能是推理任务的数据。为了验证这个规则以及推理任务，让AMT的worker对数据集进行标定，大概有89.25%的正确率

### VQA-introspect data

考虑到区分认知和推理问题以及为推理问题提供子认知问题的复杂性，研究团队首先对AMT的worker进行培训和筛选，然后利用他们来产生高质量的子问题

#### Worker Training

首先手动标注了VQA数据集中100个样本作为认知问题，100个样本作为图例问题作为例子。首先给出定义和每个定义的几个例子，单独都给出了解释。然后向crowdworkers展示QA对让他们对其分类。最后，要求workers添加所有感知问题和相应的答案以回答主要问题，如果他们对6个判定问题至少能答对5个，则这个worker就合格了

随后，对通过第一轮筛选的crowdworkers进行了进一步的试点实验，根据他们的子问题是否是基于图像的感知问题，是否足以回答主要问题，手工评估他们的子问题的质量，在通过第一次资格考试的540名工人中，144人通过手工评估被选为高质量工人，最终有资格完成论文的主要任务

#### Main task

在主要数据收集中，所有被regex规则识别为推理的VQA问题和被识别为感知的问题的随机子集被工人进一步判断，研究团队通过进一步过滤掉worker对答案有高度分歧的问题来消除模糊的问题

然后每个QI对的子问题由3个独立的worker生成，去重之后每个问题有平均3.1个子问题，结果如下列图

![](2.png)
![](3.png)
![](4.png)

### Dataset Quality Validation

为了确认数据集中的子问题都是认知问题，研究团队让通过了质量测试而又未参与子问题生成的workers对这些子问题进行判断，判断结果是87.8%在三个workers中得到了至少两个人的认可

## 数据集分析

数据分布如图所示

![](5.png)

细节描述详见论文

## Fine grained evaluation of VQA Reasoning

通过检查这些问题的正确性与相关问题的正确性是否一致，VQA-introspect能够更详细地评估SOTA模型在推理问题上的性能

认知失败(不能正确回答子问题)可能是视觉部分的问题，也有可能是grounding problem：model知道大多数情况下香蕉是黄的，然后用这个信息去回答是否成熟的问题，同时，可能不知道黄色跟这个问题有什么关系又或是无法理解子任务的问题。意识到这一点，文章将评估分为四类：

### Q1: Both main & sub-questions correct

虽然不能声称由于子问题的存在，模型正确地预测了主要问题(因为香蕉大部分是黄的，就说香蕉是成熟的)，但是正确回答两个问题说明与良好的推理是一致的

### Q2: Main correct & sub-question incorrect

认知错误说明可能存在推理过程错误，当然也有可能model捕获了其它的感知知识，但没有被确定的子问题涵盖(香蕉是熟的因为表面上有黑点)，也可能是model建立了虚假的shortcut或是随机正确

### Q3: Main incorrect & sub-question correct

这里的失败清楚地表明了推理失败，因为我们验证了子问题足以回答主要问题(在这种情况下，模型知道香蕉大部分是黄色的，但仍然认为它们不够成熟，因此它没有把"黄色香蕉成熟了"联系起来)

### Q4: Both main & sub-question incorrect

虽然模型可能没有推理能力来回答这一象限的问题，但感知失败可以解释不正确的预测

总结一下Q2和Q4有显然的认知错误，Q2可能存在推理错误，Q3一定存在推理错误，Q4无法判断推理是否错误

## Improving learned models with VQAintrospect

这章介绍了VQA-introspect如何用于提升在VQA数据集中训练的模型，主要是为了解决Q2和Q3的问题

### Finetuning

将VQA-introspect合并到一个学习的模型中最简单的方法是对其上的模型进行微调，采用主问题和子问题的二叉熵损失函数的平均值作为损失函数

### SubQuestion Importanceaware Network Tuning

Sub-Question Importance-aware Network Tuning(SQuINT)的初衷是模型在回答推理问题时，应该像在回答相关问题时一样关注图像中的相同区域，SQuINT通过学习如何关注感兴趣的子问题区域，并对它们进行推理以回答主要问题来做到这一点

![](6.png)

#### Attention loss

目前表现良好的基于注意力的模型在被问及简单的感知问题时，通常擅长于图像中的视觉区域定位(grounding)，因为它们是在包含大量感知问题的VQA数据集上训练的。为了使模型在回答主要问题时查看相关的子问题区域，文章在空间和边界框注意力权重上应用均方差(MSE)损失

#### Cross Entropy loss

当注意力loss促使模型在遇到复杂的推理问题时去寻找正确的区域时，需要一种loss来帮助模型学会在给出正确的区域时进行推理，因此，作者将常规二元交叉熵损失应用于推理问题的预测答案之上，此外，还使用了预测答案和GT回答的子问题的二叉熵损失

#### Total SQuINT loss

![](7.png)

## 实验

消融实验
![](8.png)

实验结果展示
![](9.png)




