---
title: ICPC2019网络赛 上海站 C Triple [FFT+BigSmall]
date: 2019-09-15 20:25:30
tags: [FFT, BigSmall]
mathjax: true
categories: ✨题解杂货铺
cover: /2020/10/19/Re0-1/8.png
---
## Problem

给定三个长度为$n(n \le 10^5)$的数组$A,B,C$，数字范围$1 \le m \le 10^5$

求三个数组各选出一个数字使得最大的数字小于等于剩余两个数字相加的方案数

数据组数$T\le 100$，保证至多只有$20$组$n$大于$1000$ 

## Solution

考虑求补集，枚举最大的数字来自的集合，考虑求其大于剩余两个数字相加的方案

对于$n$大于$1000$的情况我们求剩余两个集合的权值数组卷积，求前缀和之后用最大数字集合查询即可

对于$n$小于等于$1000$的情况，我们暴力枚举剩余两个集合的数字组合，查询最大数字集合的权值数组前缀和

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 262144;
inline char nc() {
    static char buf[100000], *p1 = buf, *p2 = buf;
    if (p1 == p2) {
        p2 = (p1 = buf) + fread(buf, 1, 100000, stdin);
        if (p1 == p2) return EOF;
    }
    return *p1++;
}
inline void read(int &x) {
    char c = nc(), b = 1;
    for (; !(c >= '0' && c <= '9'); c = nc())
        if (c == '-') b = -1;
    for (x = 0; c >= '0' && c <= '9'; x = x * 10 + c - '0', c = nc())
        ;
    x *= b;
}
int pos[N];
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
int T, n, len, a[N], b[N], c[N];
long long fa[N], fb[N], fc[N], ans;
void doit(int *a, int *b, int *c, int N) {
    for (int i = 0; i < N; i++) fa[i] = fb[i] = 0;
    for (int i = 1; i <= n; i++) fa[a[i]]++;
    for (int i = 1; i <= n; i++) fb[b[i]]++;
    mul(fa, fb, fc, N);
    for (int i = 1; i <= len; i++) fc[i] = fc[i] + fc[i - 1];
    for (int i = 1; i <= n; i++) ans = ans - fc[c[i] - 1];
}
void doitsp(int *a, int *b, int *c) {
    for (int i = 1; i <= len; i++) fc[i] = 0;
    for (int i = 1; i <= n; i++) fc[c[i]]++;
    for (int i = len - 1; i; i--) fc[i] = fc[i] + fc[i + 1];
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) 
            if(a[i] + b[j] + 1 <= len) ans -= fc[a[i] + b[j] + 1];
	}
}
int main() {
    read(T);
    for (int cas = 1; cas <= T; cas++) {
        read(n);
        len = 0;
        ans = 1ll * n * n * n;
        for (int i = 1; i <= n; i++) read(a[i]), len = max(a[i], len);
        for (int i = 1; i <= n; i++) read(b[i]), len = max(b[i], len);
        for (int i = 1; i <= n; i++) read(c[i]), len = max(c[i], len);
        if (n <= 1000) {
            doitsp(a, b, c);
            doitsp(b, c, a);
            doitsp(c, a, b);
            printf("Case #%d: %lld\n", cas, ans);
            continue;
        }
        int N = 1;
        while (N < len) N <<= 1;
        N <<= 1;
        doit(a, b, c, N);
        doit(b, c, a, N);
        doit(c, a, b, N);
        printf("Case #%d: %lld\n", cas, ans);
    }
    return 0;
}
```

