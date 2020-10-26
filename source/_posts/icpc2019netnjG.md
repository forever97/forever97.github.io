---
title: ICPC2019网络赛 南京站 G Quadrilateral [计数]
date: 2019-09-02 11:18:05
tags: [差分数组, 计数]
mathjax: true
categories: 题解杂货铺
cover: https://forever97.github.io/2020/10/19/Re0-1/8.png
---
## Problem
给定a,b,c,d四条边的取值范围，求能构成的合法四边形数量

$a,b,c \le 10^5,d \le 10^3$

## Solution
考虑求答案的补集，即不合法四边形数量

假定最长边为$a$，则我们需要对于每个取值统计$b+c+d$不超过$a$的数量

因为是连续取值范围，我们可以用差分数组维护$b+c+d$

首先对于每个$b$，产生区间值$[b+l_c,b+r_c]$，差分数组处理得到$b+c$

此时$b+c$是离散的，但是$d$是连续的，所以可以考虑枚举$b+c$，对区间$[b+c+l_d,b+c+r_d]$产生贡献，差分数组处理

二次前缀和之后得到$b+c+d$的权值数组的前缀和，$O(n)$枚举$a$，$O(1)$查询贡献

因为要不合法是$b+c+d<=a$，所以在差分过程中，只要保留$a$值域范围的权值数组

枚举其余边作为最长边，按照上述方法计算，从总方案中减去即可

总复杂度$O(n)$

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 300000 + 10;
long long s1[N], s2[N], tot, ans;
int l[4], r[4];
void solve(int x) {
    int id[3], c = 0;
    for (int i = 0; i <= r[x]; i++) s1[i] = s2[i] = 0;
    for (int i = 0; i < 4; i++) {
        if (i == x) continue;
        id[c++] = i;
    }
    for (int i = l[id[0]]; i <= r[id[0]]; i++) {
        s1[l[id[1]] + i]++;
        s1[r[id[1]] + i + 1]--;
    }
    for (int i = 1; i <= r[x]; i++) s1[i] += s1[i - 1];
    for (int i = 1; i <= r[x]; i++) {
        s2[l[id[2]] + i] += s1[i];
        s2[r[id[2]] + i + 1] -= s1[i];
    }
    for (int i = 1; i <= r[x]; i++) s2[i] += s2[i - 1];
    for (int i = 1; i <= r[x]; i++) s2[i] += s2[i - 1];
    for (int i = l[x]; i <= r[x]; i++) ans += s2[i];
}
int T; 
int main() {
    scanf("%d", &T);
    while (T--) {
        tot = 1;
        ans = 0;
        for (int i = 0; i < 4; i++) {
            scanf("%d%d", &l[i], &r[i]);
            tot = tot * (r[i] - l[i] + 1);
        }
        for (int i = 0; i < 4; i++) solve(i);
        printf("%lld\n", tot - ans);
    }
    return 0;
}
```