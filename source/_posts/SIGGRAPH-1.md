---
title: 基于样例的相机行为控制器
date: 2020-06-01 20:32:56
tags: [SIGGRAPH, 姿态估计, LSTM]
mathjax: true
cover: http://imglf4.nosdn0.126.net/img/MXRvbEU3WmxrOUpZNWU1Rk1STzZhSUZtT3gxSG5SKzhERnNWSVNadTZJUE92bmVESC9yellRPT0.png
---
## 背景
相机规划一直是虚拟现实领域一个活跃的讨论话题
但相机行为(轨迹)的计算问题却甚少有人关注

已有用路径或者运动规划来指导相机轨迹的研究，主要受机器人学文献的启发

但大多数相机规划方法的关键实际上是描述何为好的运动(轨迹)

文章更倾向于从真实的电影片段中提取相机行为，文章在有限行为集上训练的深度学习网络，能够从真实的电影序列中提取相机行为，并利用对相机行为集合的先验学习将其重新定位到虚拟环境中

文章提出：
基于样例的相机行为控制器

1.能够处理比单目标摄像更一般的情况(特别是电影中常见的双人交互)

2.通过从合成和真实电影剪辑中获得的一系列不同相机行为进行训练

3.自动从用户选择的电影片段中提取相机行为，投射到虚拟环境中

系统架构
![](http://imglf5.nosdn0.126.net/img/MXRvbEU3WmxrOUtSc2tDZzRyeUNHWFZNc05TalhSV1pFcGVnangvb29pMXRwcFVtU2tFWFJRPT0.png?imageView&thumbnail=500x0&quality=96&stripmeta=0)

(1)a cinematic feature estimator

从电影剪辑中提取相关特征作为输入，在电影特征空间进行表示(输出)

(2)a gating network

通过low dimensional manifold学习，充当选择器

输入电影特征空间 (a path in the cinematic feature space)

输出为一系列相机行为，作为相机行为预测网络的专家权重

(3)a camera pose prediction network

可以通过给定3D动画连续的相机和角色姿态预测下一个相机姿态，预测网络的输出是以复曲面空间坐标表示的相对相机姿势，应用于3D动画计算最终相机姿势


## 电影特征估计器(Cinematic Feature Estimator)

文章采用了基于Deep Learning的Cinematic Feature Estimation从影像demo中自动分析和提取电影特征序列

### 电影特征空间(Cinematic Feature Space)

首先实现相机行为控制需要一个低维电影特征空间来作为一个数学模型表示相机和两个对象之间的联系
(相机角度，相机与对象之间的距离，屏幕的布局，角色之间的相对配置)

文章提出了一种低维空间：cinematic feature space，用于描述相机和角色之间的特征关系，空间设计需考虑 (1)简化从真实镜头中提取电影特征的过程, (2)允许从电影特征中重建三维环境中的相机姿势(包括相机和角色的相对位置和方向，以及2D帧信息)

在此基础上，文章设计了一个电影特征估计器(Cinematic Feature Estimator)，从带有人物角色的RGB图像中提取电影特征

电影特征估计器由三个阶段组成

(1) 基于LCR-Net的角色姿态估计，从图像中提取2d角色姿态

(2) 姿态关联与填充，将不同帧的角色相匹配，提高姿态检测的稳定性(过程包括填补缺失的关节和曲线平滑化)

(3) 训练神经网络，通过输入时间相关的角色姿态(temporally coherent character poses)，输出电影特征

(1)(2)阶段用于降低数据维度，简化收敛过程，降低了对数据量的要求

![](http://imglf6.nosdn0.126.net/img/MXRvbEU3WmxrOUtSc2tDZzRyeUNHWjBVaVlBSXBjenhnV3VvUkRWNWpReHJYR2szUmZtbEt3PT0.png?imageView&thumbnail=500x0&quality=96&stripmeta=0)

角色之间的空间关系(角度，距离)以及相机的框架(角色在屏幕中的构成方式，相机的距离和角度)是电影表意的关键因素，不同的协调方式能传达出不同的信息，这就是相机行为(camera behavior)

从电影片段中提取哪些特征需要理解相机行为，也就是需要理解两个角色之间的行为进展(evolution)与相机角度，帧和距离变化(evolution)之间的相关性

#### 相机姿态 (Camera features)
从单个RGB图像中估计相机姿态仍然是一个具有挑战性的问题，解决方案只能依赖于场景内容的强优先级(例如曼哈顿假设(?))

文章工作建立在这样的假设之上：屏幕中至少有两名角色，并且能够通过训练一个网络从这些角色的姿态中估计相机的相对姿态，文章建议在复曲面空间坐标系中表达相机姿态，这种表达方式专用于基于两个给定目标的相机定格，操作和插值任务

对于目标A和B，carema feature c可以表示为

$c = \{p_A, p_B,\theta,\phi\} ∈ R^6$

$p_A$和$p_B$表示两个角色在屏幕中的位置，$\theta$和$\phi$表示横摆角和俯仰角,给定两个屏幕位置和一组可能的相机视点形成一个2-parametric manifold surface $(\theta,\phi)$

形状类似于主轴环面，每个视点在两个目标和相同的视觉构成(A和B的屏幕位置)之间选定相同的角度$\alpha$(?)

优点

(1) 摄像机在目标A和B的局部基础上定义，可以很容易地将角色的2D屏幕运动与摄像机在Toric坐标系中的相对运动关联起来

(2) 角色的屏幕位置被嵌入到模型当中，使得其方便在不同的3D场景中复现

(3) 输入和输出具有强关联性，参数集容易学习
(输入：屏幕上的角色姿态，输出：Toric坐标系中的相机姿态)

#### 角色姿态(Character features)

character features的定义考虑了(1)从2D姿态估计中学习这些参数的可能性以及(2)参数对gating+prediction网络的指导能力，测试了不同的参数，最终保留参数为：

$v = \{d_{AB}, s_A, s_B, s_{AB},M\} \in R^5$

![](http://imglf3.nosdn0.126.net/img/MXRvbEU3WmxrOUtSc2tDZzRyeUNHZVRud0JFTjI5dDEwSXI2b3FTVXVqRFdBTHN1SFpwS0xRPT0.png?imageView&thumbnail=500x0&quality=96&stripmeta=0)

$d_AB$表示两个character之间的3D距离, $s_A$和$s_B$表示AB线与连接角色的代表点(shoulder)的front vector之间的夹角，$s_{AB}$表示两个front vector之间的difference，M是一个二进制变量，指示电影片段(sequence)的主角

#### 特征提取 (Feature extraction)

p_A和p_B通过角色姿态估计的头部位置来提供值，主角参数M通过姿态估计和Hitchcock摄影原理(最重要的应该是在屏幕上占据区域最大的)确定，因此需要通过network来学习的参数只有Toric坐标系中的相机位置$(\theta,\phi)$和角色相对位置参数$(d_{AB},s_A,s_B,s_{AB})$

### 网络结构

![](http://imglf5.nosdn0.126.net/img/MXRvbEU3WmxrOUtSc2tDZzRyeUNHZFNOOXI5SURNZUFoTkFiT1ZkUk9ENkdBeTZhS29CNFB3PT0.png?imageView&thumbnail=500x0&quality=96&stripmeta=0)

estimate network采用经过时间关联修正(temporally corrected)的LCR-Net处理后的数据作为输入。并且做了数据简化，只保留能够提供角色和相机位置，大小，方向的节点。

对于每一帧，保留$R^28$的参数

$u = \{p_A, p_B, n_A, n_B, h_A, h_B\} \in R^{28}$

$p_A,p_B \in R^2$：2D屏幕中角色头部位置

$n_A,n_B \in R^6$：颈部和左右肩关节位置，与角色之间的相对方向以及与相机的关系有关

$h_A, h_B \in R^6$：臀部，左右大腿关节位置，与相机和角色距离以及相机倾斜角度有关

影片剪辑具有时间一致性(?)，文章采用滑动窗口技术来处理数据中可能存在的噪声，提高鲁棒性

选定窗口大小为8，采用4个previous frames和3个following consecutive frames，即共$R^{8×28}$的参数量，执行一维卷积时，每个节点信道独立

电影特征的六个参数通过具有相同结构但权重和输入不同的三个不同网络进行估计

训练采用算法为Adam adaptive gradient descent algorithm，epochs为100，batch size为256，基础学习率为0.01，在包含77万个注释数据的数据集上训练，数据(8帧)来自30个不同的动画序列

Loss Function：$L(\hat{y},y) =||\hat{y} −y||$

这是一个典型的回归问题，误差函数采用网络输出值与期望值之间的方差

## 相机运动预测网络(Camera Motion Prediction Network)

相机与角色运动之间的相关性是一个典型的时间序列建模问题，只要有足够的时间序列数据，便可以设计出预测网络，在给定一系列相机和角色过去以及当前状态的情况下预测下一个相机姿态

但是真实影片的模糊性使得大量相机行为是合理的，即对于同一段角色动画可能会有不同的Camera Motion，一个非常的序列可以由不同的相机运动产生，没有简单的规则可以从单独的输入数据中确定最佳行为，训练数据的模糊性往往导致均值回归(tend to regress toward mean values)

文章采用的是混合专家系统(MoE)，采用多个预测网络(专家)和一个选择网络，预测网络对输入数据的不同Camera Motion进行专门化，选择网络来决定激活哪些专家，这种方法通过experts和gating通过反向传播来联合训练，因此对数据集的预处理和标记没有要求(?)

Gating Network本质上是一个encoder，用于得到有效相机行为的low dimension manifold，通过gating得到的电影特征序列，采用相应的experts组合，在新的3d片段中再现这个序列

### 门控网络(Gating Network)

门控网络负责提取给定片段中的特定行为或行为组合，通过权衡其影响激活预测网络中的特定专家，Gating Network的输入为电影特征序列，通过标准的single-output LSTM捕获序列全局潜在相机行为信息，通过FC将其压成维度向量，然后用softmax规范化，使得m维特征和为1

![](http://imglf4.nosdn0.126.net/img/MXRvbEU3WmxrOUtSc2tDZzRyeUNHV0F3RWNvM282R1MzQUNmc3g5ZUYyeDVwRlFBUmxZK2h3PT0.png?imageView&thumbnail=500x0&quality=96&stripmeta=0)

### 预测网络(Prediction Network)

预测网络负责通过3d动画和来自gating network的权重，计算相机行为

预测网络是一个简单的三层FC网络，通过sliding window将i帧和前面的帧的相机姿态作为输入，预测下一帧，通过m个训练系数$\alpha_1, \alpha_2, \dots , \alpha_m$来计算预测网络的全局权重，$\alpha = \sum \alpha_i \omega_i$，$\omega$是gating网络得到的权重

预测网络的输入以i帧为中心，包含过去的60帧和将来的59帧

输入由这120帧的character cinematic features和过去60帧的camera features构成

经过训练的网络的输入大小为60\*5+120\*9=1380，为未来30帧输出相机复曲面参数，尺寸为30*5=150

文章做过将输出减少到1帧的实验，结果是两个连续帧之间相机姿态变化太小，无法使网络执行合理的预测

Loss Function：$L(\hat{c},c) = ||\hat{c_i} −c_i||+\eta\sum_{j=i+1}^{i+29}||\hat{c_j} −c_j||$

这个Loss Function比较好理解，同样是回归问题，考虑预测结果的结果与期望结果偏差的基础上，还需要考虑连续帧语义表达上的偏差

## Summary

### 文章主要的贡献

1.人体姿态和相机行为的简单表达(如何简单地学习出相机移动轨迹这种专业性的操作)

2.从连续帧中获取语义并用于预测虚拟场景中的行为(gating+prediction)

### 可能可以扩展的点

1.行为表述角度：可以考虑影片光照对相机轨迹姿态的影响(可以减少几种可能的相机运动轨迹)，非主要角色对主要角色的行为影响(路人行为对影片主角的影响，比如多加几维环境变量)

2.语义获取角度: 电影原声语义判断(对话对行为判定的影响)，背景语义判断(室内室外，白天晚上，这些对行为判定应该也是有指导意义的)
