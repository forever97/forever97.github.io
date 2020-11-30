---
title: ICPC2019网络赛 南昌站 D Interesting Series [生成函数+FFT]
date: 2019-09-11 23:04:08
tags: [生成函数, FFT]
mathjax: true
categories: ✨题解杂货铺
cover: /2020/10/19/Re0-1/8.png
---
## Problem

给定$F_1=1$，$F_n=a*F_{n-1}+1$

有一个有$n$个元素的多重集合$S$

$value(s)=F_{\sum{s_i}}$

定义$ans(k)=\sum_{s \subset S \ and \ |s|=k}value(s)$

求$ans(1),ans(2),……,ans(n) \ mod \ 100003$

$n \le 10^5，2 \le a \le 1000，1 \le s_i \le 1e9$

## Solution

$F_n=\frac{a^n-1}{a-1}$

对于给定的$k$，我们计算出不同方案下的$a^{sum}$之和，$sum$由$k$个$s$相加得到，减去方案数$C_n^k$，然后除以$(a-1)$即可

前者为母函数$(x+a^{s_1})(x+a^{s_2})……(x+a^{s_n})$的$x^{n-k}$前的系数
        
所以我们计算这个母函数前的系数，$FFT$计算即可

我们可以通过分治区间优化多次等长数组的卷积，复杂度$O(nlognlogn)$

此题精度不足需要用$long \ double$
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 524300;
const int P = 100003;
#define double long double
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
} A[N], B[N];
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
void mul(long long *a, long long *b, long long *c, int k) {
    int i, j;
    for (i = 0; i < k; i++) A[i] = comp(a[i], b[i]);
    j = __builtin_ctz(k) - 1;
    for (int i = 0; i < k; i++) {
        pos[i] = pos[i >> 1] >> 1 | ((i & 1) << j);
    }
    FFT(A, k, 1);
    for (int i = 0; i < k; i++) {
        j = (k - i) & (k - 1);
        B[i] = (A[i] * A[i] - (A[j] * A[j]).conj()) * comp(0, -0.25);
    }
    FFT(B, k, -1);
    for (int i = 0; i < k; i++) c[i] = (long long)(B[i].r + 0.5);
}
}  // namespace FFT
ll a[N], b[N], c[N];
int pw[N], s[N];
vector<int> v[N];
void solve(int x, int l, int r) {
    if (l == r) {
        v[x].push_back(1);
        v[x].push_back(pw[l]);
        return;
    }
    int mid = (l + r) >> 1;
    solve(x << 1, l, mid);
    solve(x << 1 | 1, mid + 1, r);
    int N = 1;
    while (N <= r - l + 1) N <<= 1;
    for (int i = 0; i < N; i++) a[i] = b[i] = 0;
    for (int i = 0; i <= mid - l + 1; i++) a[i] = v[x << 1][i];
    for (int i = 0; i <= r - mid; i++) b[i] = v[x << 1 | 1][i];
    FFT::mul(a, b, c, N);
    for (int i = 0; i <= r - l + 1; i++) v[x].push_back(c[i] % P);
}
namespace Comb {
const int U = P - 1;
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
}  // namespace Comb
ll powmod(ll a, ll b, ll P) {
    ll t = 1;
    for (; b; b >>= 1, a = a * a % P)
        if (b & 1) t = t * a % P;
    return t;
}
int n, A, k, q, ans[N];
int main() {
    Comb::init();
    scanf("%d%d%d", &n, &A, &q);
    for (int i = 1; i <= n; i++) scanf("%d", &s[i]);
    for (int i = 1; i <= n; i++) pw[i] = powmod(A, s[i], P);
    solve(1, 1, n);
    int t = powmod((A - 1 + P) % P, P - 2, P);
    for (int i = 1; i <= n; i++)
        ans[i] = 1ll * (v[1][i] - Comb::C(n, i) + P) % P * t % P;
    while (q--) {
        scanf("%d", &k);
        printf("%d\n", ans[k]);
    }
    return 0;
}

```
