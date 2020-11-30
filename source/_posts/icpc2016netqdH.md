---
title: ICPC2016网络赛 青岛站 H XM Reserves [FFT建模]
date: 2020-11-10 21:12:02
tags: [FFT]
categories: ✨题解杂货铺
cover: /2020/10/19/Re0-1/8.png
---

## 题意

给定一个方格图，每个点上都有一个值$p_{i,j}$，两个格子之间的距离d被定义为格点中心的欧氏距离，现在给出一个分数的定义，每个格点的分数被定义为所有距离在r以内的格点的p/(d+1)的值，求得分最大的格点的分数

## 解题思路

基本做法是求解每个格点的分数，然后得到其中的最大值

所以对于每个$i$，需要求出$\sum_{d<r}(\frac{p_{x_i-d_x,y_i-d_y}}{\sqrt{d_x^2+d_y^2}+1})$

所有需要对点$i$产生贡献的点$j$的坐标和偏移量$d$满足$x_j+d_x=x_i$，$y_j+d_y=y_i$

构造$A_{i∗M+j}=p_{i,j}$，$B_{d_x * M + d_y} = \frac{1}{\sqrt{d_x^2+d_y^2} +1}$

对于条件距离$r$可以在$B$的赋值时做判断处理

考虑到$d_x$和$d_y$的取值范围为$[R,-R]$，我们对偏移量做偏移处理

即$B_{(i + R) * M + j + R} = \frac{1}{\sqrt{i ^ 2 + j ^ 2} +1}$

则$A$和$B$的卷积$C_{(i + R) * M + j + R}$即格点$(i,j)$的得分

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2097152;
int pos[N];
namespace FFT {
struct comp {
    double r, i;
    comp(double _r = 0, double _i = 0) : r(_r), i(_i) {}
    comp operator+(const comp &x) { return comp(r + x.r, i + x.i); }
    comp operator-(const comp &x) { return comp(r - x.r, i - x.i); }
    comp operator*(const comp &x) {
        return comp(r * x.r - i * x.i, i * x.r + r * x.i);
    }
    comp conj() { return comp(r, -i); }
};
const double pi = acos(-1.0);
void FFT(comp a[], int n, int t) {
    for (int i = 1; i < n; i++)
        if (pos[i] > i) swap(a[i], a[pos[i]]);
    for (int d = 0; (1 << d) < n; d++) {
        int m = 1 << d, m2 = m << 1;
        double o = pi * 2 / m2 * t;
        comp _w(cos(o), sin(o));
        for (int i = 0; i < n; i += m2) {
            comp w(1, 0);
            for (int j = 0; j < m; j++) {
                comp &A = a[i + j + m], &B = a[i + j], t = w * A;
                A = B - t;
                B = B + t;
                w = w * _w;
            }
        }
    }
    if (t == -1)
        for (int i = 0; i < n; i++) a[i].r /= n;
}
}  // namespace FFT
FFT::comp A[N], B[N];
int main() {
    int n, m, x;
    double r;
    while (~scanf("%d%d%lf", &n, &m, &r)) {
        int R = ceil(r), M = max(n + 2 * R, m + 2 * R);
        int N = 1;
        while (N < M * M) N <<= 1;
        for (int i = 0; i < N; i++) A[i] = B[i] = FFT::comp(0, 0);
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) {
                scanf("%d", &x);
                A[i * M + j] = FFT::comp(x, 0);
            }
        auto dis = [](int x, int y) { return sqrt(x * x + y * y); };
        for (int i = -R; i <= R; i++) {
            for (int j = -R; j <= R; j++) {
                if (dis(i, j) < r)
                    B[(i + R) * M + j + R] =
                        FFT::comp(1.0 / (dis(i, j) + 1), 0);
            }
        }
        int j = __builtin_ctz(N) - 1;
        for (int i = 0; i < N; i++) {
            pos[i] = pos[i >> 1] >> 1 | ((i & 1) << j);
        }
        FFT::FFT(A, N, 1);
        FFT::FFT(B, N, 1);
        for (int i = 0; i < N; i++) A[i] = A[i] * B[i];
        FFT::FFT(A, N, -1);
        double ans = 0;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++)
                ans = max(ans, A[(i + R) * M + j + R].r);
        printf("%.3f\n", ans);
    }
    return 0;
}
```
