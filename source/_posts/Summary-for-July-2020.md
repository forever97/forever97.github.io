---
title: Summary for July 2020
date: 2020-08-04 07:34:41
tags: [Summary, VQA]
mathjax: true
cover: http://m.qpic.cn/psc?/V10nbMUG2wnlL5/bqQfVz5yrrGYSXMvKr.cqQQG2eWvCUiTppxhqyVT3doJ9qN8947Vsa2MbBhpbSzpEdXFiWhsGbem38Bz1YUiLPItsfN1x86XLwJTMoETuGc!/b&bo=7AblAwAAAAABByw!&rf=viewer_4
---
# 论文总结

### VQA综述 (arxiv2017)

[Detail](https://forever97.github.io/2020/07/02/1610-01465v4/)

VQA目标：给定一个图片相关的问题和对应的图片，通过程序推断出答案

VQA的一般步骤

1. 图像特征提取
2. 问题特征提取
3. 结合两者特征来产生答案

介绍的数据集比较古老，现在通用VQA一般用VQA2.0

VQA模型类型有基础类型(矩阵点乘，叉乘，连接)，贝叶斯模型(效率低下)，attention(现在的模型基本都用到attention)，双线性池(理论上希望计算两个特征的矢量积，但是开销过大，这方面的研究基本是考虑如何去近似)，组合模型(模块网络，sub-step)，一些其它方法(引入知识库；在每个视觉残差块后面加入语言信息)

一些需要解决的问题：数据集中的bias导致image-blind模型也有很好的表现；问题的句式会影响答案；注意力机制受到bias影响；开放式回答的合理评估方式……

### CSS-VQA (CVPR2020)

[Detail](https://forever97.github.io/2020/07/02/2003-06576/)

文章提出的是一种可以与现有VQA模型结合的反事实训练方法(因果阶梯第三层)，以实现VQA系统的视觉可解释性(VQA模型做决定需要依赖正确的视觉区域)和问题敏感性(对问题的变化能够敏锐察觉并作出反应)

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/BmgsQzVq*GNja8O.UNZvUenjQM61D1DrM50DcbTroOLEWIPERqnFu5iKBm.pi7Qq7S*.4QcFHfo*2iXVJGwmIX2RABCTEwL2LD7ivaIgP.A!/b&bo=PgKMAQAAAAADF4M!&rf=viewer_4)

实现方法是通过V-CSS(对图片打上mask的方式)和Q-CSS(对问题打上mask的方式)来生成反事实训练样本

### DLP (AAAI2020)

[Detail](https://forever97.github.io/2020/07/03/AAAI-Decom-VQA/)

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/bhRzIL1Ek8GP*cA*Bielqz.IyuOwjuK3O3aAteVcv.EsbghwwRrhGCBQ1URa9rgL3arkoqYdxhgtfXzqoy.j.Q!!/b&bo=4gS*AQAAAAADB3o!&rf=viewer_4)

模型的目的主要是克服VQA中的Language Priors问题

思路是学习对问题的语言表征进行分解来消除语言先验问题

模型分为四个模块：语言注意力模块，问题识别模块，目标模块和视觉验证模块

目标模块是BUTD注意力(CVPR2018)，验证模块是计算内容和注意力区域的相关性得分，这两块比较常规

文章的主要贡献在前两块，做的事情主要是在问题中把语言相关内容和视觉相关内容解耦，如框架图所示，分解为$q_{type}$，$q_{obj}$和$q_{con}$，然后问题识别模块识别是否为yes/no问题，根据问题类型决定后续处理方法(非yes/no问题需要处理出一个答案集)

### VQA原因生成 (arxiv2020)

[Detail](https://forever97.github.io/2020/07/07/2004-02032/)

提出了一个novel task来衡量VQA模型的综合理解能力：不仅要理解问题，理解图片，同时也要为预测的答案提供理由，指出其和图片以及问题的关系

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/bhRzIL1Ek8GP*cA*Bielq9QSqpmQdIEU7nU47bjqLjzEf0pOVUfDNHPnTcVXuc*4oyiV6ZA*XmjmySyGHUn6*Q!!/b&bo=FALwAQAAAAADB8U!&rf=viewer_4)

基本思路就是得到答案的embedding，把embedding馈入语言模块(预训练的GPT2)来生成理由，用VCR数据集来修正模型

idea是采取end-to-end的方式，将答案产生的原因loss反向传播到答案预测中来提高VQA模型的理解能力

### GQA-OOD (arxiv2020)

[Detail](https://forever97.github.io/2020/07/08/2006-05121/)

提出了一个基于GQA数据集的GQA-OOD数据集，在训练集不变的情况下改变了验证集和测试集的数据分布，来评估VQA模型的泛化能力，评估指标分为Acc-tail(OOD样本的准确率)，Acc-head(每个local group中高频样本的准确率)，ACC-all(整体准确率)

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/BmgsQzVq*GNja8O.UNZvUdRkBDgHWXUulKmcBwh7hlxWHGxK4NzG5LQwQivTDte.Z1k8FAbIceOJBOvDR4yt1OA2WUZURd*L8j0FsTQvJJY!/b&bo=AASuAQAAAAADF5k!&rf=viewer_4)

### SQuINT (CVPR2020)

[Detail](https://forever97.github.io/2020/07/09/2001-06927/)

提出VQA-introspect数据集，包含问题对应的子问题，能够提供更fine-grained的评估

然后在这个数据集上提出了一个通用的学习方法SQuINT，

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/BmgsQzVq*GNja8O.UNZvUZBZxfEmB.C9Zbp5vgq.az*iqwx5cxZpduh60qOIuBaUxBHQvC8*luAS1niBTgpRja47zevb5PQ1jfTLU38FDbg!/b&bo=JwRoAQAAAAADJ0g!&rf=viewer_4)

思路是采用MSE loss使模型在回答主要问题时查看相关的子问题区域，同时结合主要问题以及子问题和GT之间的BCE loss

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/BmgsQzVq*GNja8O.UNZvUXrFyVWVxw8CVMj9mz*RvPBGac5RUdF0FnGQzBFF..cDE6iREguXCVaapK7PwxhqjwveuOGTEz.KO3GtG91PVTk!/b&bo=wQF8AAAAAAADF44!&rf=viewer_4)

数据集的收集过程在文章中记录非常详细 (对AMT的worker进行培训和筛选的过程)

### VC R-CNN (CVPR2020)

[Detail](https://forever97.github.io/2020/07/14/2002-12204/)

这篇文章的主要贡献是更好的图像特征的提取(引入视觉常识)，在R-CNN的基础上提出了VC R-CNN，用$P(Y|do(X))$取代$P(Y|X)$作为特征学习的目标

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/BmgsQzVq*GNja8O.UNZvUaTp99ju.UiCyzPiVeUNr7xZmqGtjBVHHlNA09i3B5GFsiC0E9Dc8BYzB.VPp7UcTEog*xp6zin.tdLK5QuzMhk!/b&bo=IwIOAQAAAAADFxw!&rf=viewer_4)

这里的do在做的事情是通过bollow和put来实现干预(因果阶梯第二层)：1.从别的图片"bollow"一个对象Z；2.将这个Z"put"在X和Y的周围；3.看看在Z的影响下X是否还会导致Y的出现

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/BmgsQzVq*GNja8O.UNZvUW*I0PbiDE34BMCHu53Q4aIacNjQcW6IeaH2FSq4jR52FfwhjebB*HXVKSEH9lwzNZah16pn8.TDNwPvNSiuNww!/b&bo=yQNLAgAAAAADJ4E!&rf=viewer_4)

confounder Z通过将RoI特征在每个类别上取平均得到

最后P(Y|do(X))就是能够在object detection任务上将给定RoI X的feature去预测RoI Y的类别这个事情做的更好

下图是feature map的比较，明显feature分布上leg距离ski更近了

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/BmgsQzVq*GNja8O.UNZvUTmz*m0KGjx.0yLlsvUaBeJNyryKG.59Bk3.CimVCw34B2YvsLVNee7A7NYM8O*3Y8l3qGsgdaIZ5mSWoIfEIX0!/b&bo=YQLWAQAAAAADJ7Y!&rf=viewer_4)

### Where To Look (CVPR2016)

[Detail](https://forever97.github.io/2020/07/27/1511-07394/)

第一次提出了基于QA的图像region attention，分别计算QA对特征和每个图片区域特征之间的attention，然后进行打分，因为是输入是QA对，只能处理mc问题，不能处理open-ended问题

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/TmEUgtj9EK6.7V8ajmQrEF5xBa7rf5tPl1Y8HikUvRIaquJNCQ6m7tDKYCblyji4rpeKDamZk25AH4Cd7bFf24ncMDQUsS26BEPI7NWG.kM!/b&bo=wwSCAQAAAAADF3Y!&rf=viewer_4)

### BUTD (CVPR2018两篇)

[Detail：BUTD](https://forever97.github.io/2020/07/15/1707-07998/)

[Detail：BUTD in VQA](https://forever97.github.io/2020/07/23/1708-02711/)

之前的attention都是关注在feature map的均匀划分的网格上的，BUTD则是关注于物体，得到问题和每个proposal之间的attention，提升的关键在于得到了更好的特征，之后的很多paper默认采用了BUTD特征

列出的第二篇文章讲了很多模型实现和优化的细节，实验部分很全面

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/bqQfVz5yrrGYSXMvKr.cqXRYwAVwuHmedKnMo1KNgu8m*eV05Sca6HC2YNL1DGB.JD61lUPWO.A8rxteA0b8GuvngzTQR8DyD7wG1Wap4*M!/b&bo=oAQ6AQAAAAADB70!&rf=viewer_4)

### EST-VQA (CVPR2020)

[Detail](https://forever97.github.io/2020/07/20/2002-10215/)

主要贡献是在TextVQA任务上提出了EST-VQA数据集，包含图片，问题，答案和对于每个问题的一个bbox，圈出了回答问题的关键区域，bbox的作用是要求VQA问答问题的同时也要圈出相关的区域，同时这是一个双语(中文+英语)的数据集，有效避免了模型挖掘语言表层相关性

然后作者发现SOTA模型并不能很好地完成这个圈bbox的任务，于是提出了一个新的VQA模型QA R-CNN

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/TmEUgtj9EK6.7V8ajmQrEGMz3.1xT46PGhK3I1.FmjZji8u8SRG5sYEXy8dWtvzU*Ng9qMngVuOnnAqTiKlLodDvf1VpOEywTCD3O6f3aeo!/b&bo=PgSmAQAAAAADF68!&rf=viewer_4)

除了传统的Faster R-CNN输出的bbox和对象标签之外，QA R-CNN还为每个box生成一个关注得分，然后连接图片和问题两部分特征，区分box和非box部分，这使得QA R-CNN能够将其注意力集中到图像中可能出现答案的区域

### Learning to Count (ICLR2018)

[Detail](https://forever97.github.io/2020/07/28/1802-05766/)

这篇文章的贡献主要是提出了一个count模块，用来解决VQA中count类问题准确率低的问题，并且这个count模块可以加入到现有的VQA模型中去

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/bqQfVz5yrrGYSXMvKr.cqV215rxDS36v.bXvuY14Mu.bMPNPeGqFmblBdRtttBR25.PfABSVWx6CxHDgWVS.hxCT75qSfz.ru20jVfnKMds!/b&bo=mAOJAQAAAAADBzE!&rf=viewer_4)

VQA难以count的原因是softmax attention不适合计数，两只猫各分0.5权重，一加答案就是1，所以count模块在softmax之前把bbox拿过来计数

主要方法就是把重复proposal内边和外边都消除掉，然后根据完全图公式$V=\sqrt{E}$，通过边的数量来计算实例数量，将计数得到的答案转为一个特征向量参与到最后的分类中

内边的消除靠矩阵运算，外边的消除靠顶点对边权的缩放

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/TmEUgtj9EK6.7V8ajmQrENfKHHIHau05JZxFywNQAdIbZIfDG0oYWFBjuZzxj9ZOys7fQn2nj1fuAphDAqy7humHaEXM9pcFD811hq3vy2I!/b&bo=XgK4AAAAAAADF9Y!&rf=viewer_4)

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/TmEUgtj9EK6.7V8ajmQrEH8c1RiaGvLdm7dNm17EFd8I3P*uo9cA9yIIXm0RbJ8yWw4LgBOHV6LllU0vs68ff6Wvy2R0Oziqro5r9Pv4lWo!/b&bo=SQO5AAAAAAADF8E!&rf=viewer_4)

### DFAF (CVPR2019)

[Detail](![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/TmEUgtj9EK6.7V8ajmQrEH8c1RiaGvLdm7dNm17EFd8I3P*uo9cA9yIIXm0RbJ8yWw4LgBOHV6LllU0vs68ff6Wvy2R0Oziqro5r9Pv4lWo!/b&bo=SQO5AAAAAAADF8E!&rf=viewer_4))


文章主要的点有两个，一是同时利用模内关系和跨模关系，二是动态生成模内的有效注意流(另一个模态的信息通过通道门控来引导模内attention)

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/bqQfVz5yrrGYSXMvKr.cqWeOdpefgqRCVwsfmvbZS5Qu6c5KrnNPlM1fC3mRJsr4vjSDvMjZ2ZiCwgXtyVvrSswELW0*9w5r0d2bb2E*35g!/b&bo=zgSHAQAAAAADB24!&rf=viewer_4)

模型框架交替使用co-attention和self-attention，最后用一个简单的分类器得到答案

### CC-VQA (CVPR2019)

[Detail](https://forever97.github.io/2020/07/30/1902-05660/)

这篇paper解决的问题就是那篇VQA综述中说的VQA对问题句式变化感知弱的问题，主要贡献是提出了一个循环一致性的训练框架CC-VQA，并提出了一个对应的数据集VQA-Rephrasings

主要的idea就是VQA系统在回答问题的基础上还要根据答案生成句式不同但是语义相同的问题，并且能成功回答这些问题

![](http://m.qpic.cn/psc?/V10nbMUG3EIcUi/TmEUgtj9EK6.7V8ajmQrEFmdHkcaEjOf3saEMfPSDeiHz9pCKKLanCqPlbAkJi75G55b9hAAc4RmN9665A9caAE3VP7zFVdQM1Kt*OiF20M!/b&bo=UwSBAQAAAAADF.U!&rf=viewer_4)

CC-VQA利用VQA模型和VQG模型搭建，有点像Cycle-GAN，要检测生成的Q和A是否和原来的具有一致性，对于生成的Q，作者提出了一个门控机制，将不正确的Q过滤掉

循环一致性损失在VQA模型和VQG模型都能够稳定输出后再加入(延迟激活)

# 论文复现

### BUTD model

paper中集成了30个single model，可以达到70%左右的acc

| VQA-VALID || VQA-CP ||
|---|---|---|---|
|number(single)|44.18%|number(pair）|16.73%|
|yes/no(single)|81.68%|yes/no(pair)|55.18%|
|other(single)|56.73%|other(pair)|27.79%|
|count(single)|50.83%|count(pair)|19.33%|
|all(single)|64.46%|all(pair)|36.23%|

### Counting model

paper中的结果是number和count的acc上升了，其它的没有下降，我复现出来发现其它问题类型acc下降了，感觉可能是过拟合了，也有可能是和BUTD的代码有些细节处理不一致导致的

| VQA-VALID || VQA-CP ||
|---|---|---|---|
|number(single)|44.67%|number(pair）|17.02%|
|yes/no(single)|80.26%|yes/no(pair)|51.41%|
|other(single)|56.76%|other(pair)|27.53%|
|count(single)|51.43%|count(pair)|19.65%|
|all(single)|64.01%|all(pair)|34.75%|

