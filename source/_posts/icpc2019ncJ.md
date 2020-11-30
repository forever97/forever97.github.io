---
title: ICPC2019 南昌站 J Summon [Poyla+BSGS+矩阵乘法]
date: 2019-12-09 13:47:30
tags: [Poyla, BSGS, 矩阵乘法]
categories: ✨题解杂货铺
cover: /2020/10/19/Re0-1/8.png
---
## Problem

给定四种颜色，去给一个长度为$n(n \le 10^5)$的环染色

有$m$种长度为$4$的序列不能在环中出现

通过旋转能够重合的环染色记做同一种染色法，求不同的染色方案数

## Solution

通过旋转能够产生n种置换，将置换按照$gcd(step,n)$分类

则答案为$\frac{\sum_{d|n}f(d)*phi(\frac{n}{d})}{n}$

考虑计算$f(d)$，即统计长度为$d$的带$ban$位置的环染色方案数

我们建立一个$64*64$的矩阵$M$，表示长度为$3$的序列之间的转移情况

则$f(d)$为$M^d$的斜对角数字之和，即$blk=\sqrt{n}$

我们用$BSGS$来处理$M^d=(M^{blk})^{\frac{d}{blk}}*M^{d \% blk}$

每次通过两个矩阵的乘积来计算$f(d)$即可

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const int L = 64;
const int P = 998244353;
const int N = 100000 + 10;
#define rep(i, n) for (int i = 0; i < n; i++)
int n, m;
struct MTX {
    int v[L][L];
    void init() {
        reset();
        rep(i, L) v[i][i] = 1;
    }
    void conn() {
        rep(i, 4) rep(j, 4) rep(k, 4) rep(l, 4) {
            v[(i * 4 + j) * 4 + k][(j * 4 + k) * 4 + l] = 1;
        }
    }
    void set() { rep(i, L) rep(j, L) v[i][j] = 1; }
    void reset() { memset(v, 0, sizeof v); }
    void ban(int x, int y, int z, int u) {
        v[(x * 4 + y) * 4 + z][(y * 4 + z) * 4 + u] = 0;
    }
} A[400], B[400];
MTX mul(MTX a, MTX b) {
    MTX c;
    c.reset();
    rep(i, L) rep(j, L) rep(k, L) c.v[i][j] =
        (c.v[i][j] + 1ll * a.v[i][k] * b.v[k][j] % P) % P;
    return c;
}
int phi[N];
void Get_Euler(int n) {
    for (int i = 1; i <= n; i++) phi[i] = i;
    for (int i = 2; i <= n; i++)
        if (phi[i] == i)
            for (int j = i; j <= n; j += i) phi[j] = phi[j] / i * (i - 1);
}
ll inv(ll a, ll m) { return (a == 1 ? 1 : inv(m % a, m) * (m - m / a) % m); }
int main() {
    Get_Euler(100000);
    scanf("%d%d", &n, &m);
    A[1].reset(), A[1].conn();
    for (int i = 1; i <= m; i++) {
        int a, b, c, d;
        scanf("%d%d%d%d", &a, &b, &c, &d);
        A[1].ban(a, b, c, d);
    }
    int blk = sqrt(n + 0.5) + 1;
    A[0].init(), B[0].init();
    for (int i = 2; i <= blk; i++) A[i] = mul(A[i - 1], A[1]);
    B[1] = A[blk];
    for (int i = 2; i <= blk; i++) B[i] = mul(B[i - 1], B[1]);
    ll ans = 0;
    for (int i = 1; i * i <= n; i++) {
        if (n % i) continue;
        auto f = [&](int n) {
            ll t = 0;
            int b = n / blk, a = n % blk;
            auto tmp = mul(A[a], B[b]);
            for (int j = 0; j < L; j++) t = (t + tmp.v[j][j]) % P;
            return t;
        };
        ans = (ans + f(i) * phi[n / i] % P) % P;
        if (i * i != n) ans = (ans + f(n / i) * phi[i] % P) % P;
    }
    printf("%lld\n", ans * inv(n, P) % P);
    return 0;
}
```
