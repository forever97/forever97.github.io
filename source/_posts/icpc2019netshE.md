---
title: ICPC2019网络赛 上海站 E Counting Sequences II [生成函数+泰勒展开]
date: 2019-09-15 19:36:05
tags: [生成函数, 泰勒展开]
mathjax: true
categories: 题解杂货铺
cover: https://forever97.github.io/2020/10/19/Re0-1/8.png
---
## Problem

构造一个长度为$n(n \le 10^{18})$数列，每个数字属于$[1,m]$$(m \le 2*10^5)$，要求每个偶数出现次数均为偶数次

## Solution

多重集排列问题，用指数型生成函数处理

$G(x)=(1+\frac{x^1}{1!}+\frac{x^2}{2!}+\frac{x^3}{3!}+\dots)$

本题的指数型生成函数为

$G(x)=(1+\frac{x^1}{1!}+\frac{x^2}{2!}+\frac{x^3}{3!}+\dots)^{\frac{m+1}{2}}(1+\frac{x^2}{2!}+\frac{x^4}{4!}+\frac{x^6}{6!}+\dots)^{\frac{m}{2}}$

根据泰勒公式

$e^x=(1+\frac{x^1}{1!}+\frac{x^2}{2}+\frac{x^3}{3!}+\dots)$

$e^{-x}=(1-\frac{x^1}{1!}+\frac{x^2}{2!}-\frac{x^3}{3!}+\dots)$

得$G(x)=(e^x)^{\frac{m+1}{2}}(\frac{e^x+e^
{-x}}{2})^{\frac{m}{2}}$

二项式展开后代入得第$n$项系数为$\sum_{i=0}^{\frac{m}{2}}C(\frac{m}{2}, i)*(m-2\ast i)^n$

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int P = 1e9 + 7;
const int U = 200000;
int f[U + 3], rf[U + 3];
ll inv(ll a, ll m) { return (a == 1 ? 1 : inv(m % a, m) * (m - m / a) % m); }
void init() {
    f[0] = 1;
    for (int i = 1; i <= U; i++) f[i] = (ll)f[i - 1] * i % P;
    rf[U] = inv(f[U], P);
    for (int i = U; i; i--) rf[i - 1] = (ll)rf[i] * i % P;
}
ll C(int n, int m) {
    if (m < 0 || m > n) return 0;
    return (ll)f[n] * rf[m] % P * rf[n - m] % P;
}
ll powmod(ll a, ll b, ll P) {
    ll t = 1;
    for (; b; b >>= 1, a = a * a % P)
        if (b & 1) t = t * a % P;
    return t;
}
int T, m;
ll n;
int main() {
    init();
    scanf("%d", &T);
    while (T--) {
        scanf("%lld%d", &n, &m);
        ll ans = 0;
        int t = m >> 1;
        for (int i = 0; i <= t; i++) {
            ans = (ans + C(t, i) * powmod(m - 2 * i, n, P) % P) % P;
        }
        ans = ans * powmod(powmod(2, t, P), P - 2, P) % P;
        printf("%lld\n", ans);
    }
    return 0;
}
```

