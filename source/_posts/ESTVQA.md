---
title: EST-VQA [双语文本VQA]
date: 2020-07-20 07:27:09
tags: [VQA, 2020, CVPR, dataset, TextVQA]
mathjax: true
categories: 📚VQA藏书阁
cover: /2020/07/20/ESTVQA/1.png
---
[Paper Download Address](https://openaccess.thecvf.com/content_CVPR_2020/papers/Wang_On_the_General_Value_of_Evidence_and_Bilingual_Scene-Text_Visual_CVPR_2020_paper.pdf)

对数据集中的巧合相关性的学习使得VQA系统难以泛化，巧合相关性在数据集中并不稳定，当测试集中的分布与训练集不同时，基于巧合相关性所学习到的东西就不再work

泛化VQA存在的一个潜在问题就是无法判断正确答案是否由正确的理由产生，通过推理得到的答案和通过巧合相关性得到的答案表面上是完全一致的

文章中提出一种度量VQA性能的方法，它通过要求算法证明其推理的合理性来鼓励泛化

![](1.png)

之前也有相关工作研究过推理过程，但是因为提供理由的形式是有限的而饱受困扰，文章中的方法是提供一个简单的指示，说明它的答案是基于图像的哪个区域，若VQA系统提供了正确的答案和正确的图像区域，则说明其推理过程是正确的

作者在Scene Text VQA上做测试，选择这种测试集的原因是大部分VQA model在Text VQA数据集上表现不佳，但是图片中的文本对图片的理解往往是很有指示意义的，而且文本VQA问题通常不太容易通过利用数据中的巧合相关性来解决

同时，因为文本VQA图像中出现的文本范围十分广泛，因此基于分类的方法很容易过拟合，需要开发替代方法，并且这些方法可以推广到其它方面

图中是一些Text VQA中的挑战

![](2.png)

图(a)不需要任何文本内容就可以作答，图(b)拥有不止一个正确答案，图(c)需要先验知识才能回答，图(d)不能够直接从图片内容中获得答案，需要model拥有额外的技能

下图是Evidence-Baced VQA和传统VQA(LoRRA)的对比，可以看出来目前的VQA方法严重依赖于通过分析训练集中的答案而构造的预定义答案空间，从而限制了泛化

![](3.png)

Text-VQA数据集采取的是传统的VQA评估方式，也就是准确率，ST-VQA数据集软分数度量方式，但是这些都是结果导向的评估方式，并未评估推理过程，这种基于分类的VQA系统容易过度拟合到一个固定的答案空间，不容易推广到其它数据集

为了解决这些问题，文章中提出了一种新的scene-text based VQA数据集，命名为Evidence-based Scene Text Visual Question Answering(EST-VQA)，其中包含了三个task：cross language challenge，localization challenge以及traditional challenge，此外进行了一系列实验确定了这三个挑战的baseline

文章主要贡献有：

1. Dataset：EST-VQA数据集提供了图片，问题和答案，以及对于每个问题的一个bounding box，将导向答案的区域框出来，数据集的目的是支持开发更接近实际应用程序所要求的性能水平的文本VQA方法，同时也鼓励开发泛化的通用VQA方法
2. Evaluation Metric：文章中提出了一种Evidence-based评估方法，要求VQA在预测答案的时候提供证据，同时，提出了一种新的VQA模型，在新的度量标准下，单纯的分类模型可能很难有好的效果
3. Bilingual：EST-VQA是首个双语场景文本VQA数据集，其中包含了英语和中文的问题和答案，双语数据集可以更好地激励VQA系统泛化，因为对于多种语言的数据集来说，表层的相关性更难被挖掘，所选择的语言在语法上也特别不同，反映了不同的文化人群，这导致了不同的问题统计，进一步鼓励了泛化

## 相关工作

相比于传统的VQA，文本VQA数据集更多关注于依赖于文本的问题，model需要读取和理解图片中的文本内容

[1]中提出了Text-VQA和一个baseline model LoRRA，如图所示

![](4.png)

Amanpreet Singh, Vivek Natarajan, Meet Shah, Yu Jiang, Xinlei Chen, Dhruv Batra, Devi Parikh, and Marcus Rohrbach. Towards vqa models that can read. In Proc. IEEE Conf. Comp. Vis. Patt. Recogn., pages 8317–8326, 2019

类似的数据集还有ST-VQA，OCR-VQA，这些数据集都提供了图片和依赖于图片中文本的QA对，但是文中的数据集与这些数据集有一些重要的不同之处：

Diversity：现有数据集更多地关注问题回答部分，而在模型的训练和评估中几乎忽略了OCR部分，而EST-VQA关注了这一点

Evaluation Metric：

![](5.png)

NL是normalized Levenshtein distance

## EST-VQA

### 数据收集

1. 图片：图片一共20757张，英文的场景文本图像来自于Total-Text，ICDAR 2013，ICDAR 2015，CTW1500，MLT，COCO Text，中文的场景文本图像来自于LSVT

2. 问题和答案：包含15056个英文问题和13006个汉语问题，问题和答案可以跨语言，比如英文提问图片中商店的名字，如果是中文则答案输出中文。问题和答案必须和图片中的文本有关，标注人需要再图片中用bounding box标注出回答相关的区域作为证据。并且不存在yes/no类别以及存在多种回答的问题

中英文问题分布见下图

![](6.png)

![](7.png)

问题和答案的数量如下图

![](8.png)

### Evidence-based 评估方法

在实验中，作者发现了一个有趣的现象，若真实答案被包含在预生成的答案字典中，则普通的VQA模型可以在不提取图片中文本内容的情况下回答正确问题，这种模型严重依赖于预定义的答案池，无法处理超出词汇列表的情况。因此难以判定模型是理解并推理完成了问题还是overfit了答案空间。作者提出了Evidence-based评估方法(EvE)，要求模型为自己预测的答案提供证据

EvE评估包含两个步骤，check答案和check证据，文章中采用了normalized Levenshtein similarity score(见上文公式)来check答案，最后用IoU度量来确定证据是否充分

对Evidence的评估如图

![](9.png)

$B_{gt}$和$B_{det}$是GT以及预测的bounding box

评估示例如下图

![](10.png)

### Task

Text-VQA和OCR-VQA遵循和一般VQA数据集相同的评估规则，ST-VQA虽说提出了三个任务，但是每个任务的区别只在于外部信息的大小，这些都不足以全面评价VQA模型的能力

文章中设计了三个相关的任务，并且采用在线评估

#### Cross Language Challenge (CLC)

因为数据集是双语的，因此要求模型能够在两种语言之中提取共同的知识，作者采用单语框架(Chinese-only,English-only)和双语框架来评估，用EvE来度量性能

#### Localization Challenge (LC)

作者提出要求VQA model在预测答案的同时将导向答案的证据用bounding box框起来，而非简单地用现成的OCR系统来获取OCR token。因此这个task主要是要求VQA有理解问题和正确定位答案相关区域的能力，采用GT和predicted bounding box之间的IoU作为度量标准

#### Traditional Challenge (TC)

这部分和传统的VQA task一致，不考虑evidence，将预测答案与GT之间的归一化Levenshtein相似度评分作为这一Task的度量

## Baselines and Results

经过一系列实验和分析(略)，作者发现测试的SOTA模型均不能同时输出答案和相关的bounding box，因此提出了一个新的VQA模型：QA R-CNN

![](11.png)

如图所示，模型包含两个部分，Focusing Module (FM)和Reasoning Module (RM)，FM的核心部分是为text detection准备的Faster R-CNN。除了传统的Faster R-CNN输出的bounding box和对象标签之外，QA R-CNN还为每个box生成一个关注得分。对于词嵌入(word embedding)的生成，英文的采用GloVe，中文的则采用Word2Vec，然后词嵌入馈入LSTM来生成问题特征。然后连接图片和问题两部分特征，区分box和非box部分，这使得QA R-CNN能够将其注意力集中到图像中可能出现答案的区域

这里有一个简单的想法是，模型可以直接使用关注分数最高的box的底层文本作为问题的答案，然而这种做法忽略了文本当中的丰富语义

因此引入RM模块，以进一步完善通道，用FastText模型来取得OCR的词嵌入，再将词嵌入与图像特征和问题嵌入做进一步的融合，用于进一步的分类

实验结果展示

![](12.png)



