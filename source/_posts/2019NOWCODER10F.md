---
title: 2019NowCoder 10F Popping Balloons [枚举+线段树]
date: 2019-08-18 19:06:05
tags: [枚举, 线段树]
mathjax: true
cover: http://imglf4.nosdn0.126.net/img/MXRvbEU3WmxrOUxWeHVrM3M0VnN0Rm1MQmNWcWpid2M2L1dGVHZ1czdGYkhQN0lhYllMZG9nPT0.jpg?imageView&thumbnail=2500y1403&type=jpg&quality=96&stripmeta=0&type=jpg
---
## Problem

给定$n(n \le 10^5)$个点的坐标$(x,y)$

选择三条距离相邻距离为r的竖线和三条相邻距离为r的横线，使得线上的点数量最多

## Solution

考虑枚举横线的选取，数据结构维护竖线的极值

我们把相邻为r的三条竖线的值的和保存在第一条竖线上，即可数据结构维护   

考虑枚举的横线和竖线的重复点部分，我们将枚举的横线上的点删除，修改竖线，统计完加回

每个点只会被删除三次，因此总复杂度$O(nlog_2n) $

```cpp
#include <bits/stdc++.h>
using namespace std;
const int L = 100000;
const int N = 300000 + 10;
vector<int> v[N];
int d[N], T[N << 2], M;
void upd(int x, int y) {
    T[M + x] += y;
    for (x = (M + x) / 2; x; x /= 2) T[x] = max(T[x << 1], T[(x << 1) ^ 1]);
}
int n, r; 
int main() {
    scanf("%d%d", &n, &r);
    for (int i = 1; i <= n; i++) {
        int x, y;
        scanf("%d%d", &x, &y);
        d[y]++;
        v[x].push_back(y);
    }
    for (int i = 0; i <= L; i++) d[i] = d[i] + d[i + r] + d[i + 2 * r];
    for (M = 1; M < (L + 3); M <<= 1);
    for (int i = 0; i <= L; i++) T[M + i + 1] = d[i];
    for (int i = M; i; i--) T[i] = max(T[i << 1], T[(i << 1) ^ 1]);
    int ans = 0;
    for (int i = 0; i <= L; i++) {
        int tans = 0;
        for (int j = 0; j < 3; j++) {
            for (auto y : v[i + j * r]) {
                tans++;
                upd(y + 1, -1);
                if (y + 1 - r > 0) upd(y + 1 - r, -1);
                if (y + 1 - 2 * r > 0) upd(y + 1 - 2 * r, -1);
            }
        }
        ans = max(ans, T[1] + tans);
        for (int j = 0; j < 3; j++) {
            for (auto y : v[i + j * r]) {
                tans++;
                upd(y + 1, 1);
                if (y + 1 - r > 0) upd(y + 1 - r, 1);
                if (y + 1 - 2 * r > 0) upd(y + 1 - 2 * r, 1);
            }
        }
    }
    printf("%d\n", ans);
    return 0;
}

```
