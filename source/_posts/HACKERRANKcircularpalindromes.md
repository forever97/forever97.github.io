---
title: HackerRank Circular Palindromes [Manacher+二分答案]
date: 2019-09-14 21:59:00
tags: [Manacher, 二分答案, ST表]
mathjax: true
categories: ✨题解杂货铺
cover: /2020/10/19/Re0-1/8.png
---
## Problem

求每一种旋转串的最长回文子串，串长小于等于$10^6$

## Solution

倍长字符串，转化为区间回文子串，$manacher$预处理倍长后的回文串

对于查询区间$[L,R]$最长回文子串

我们可以二分答案，检验区间$[L+x-1,R-x+1]$中是否存在长度大于$x$的回文中心即可

$ST$表预处理$r$数组的区间最大值，复杂度$O(nlogn)$

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1000000 + 10;
int n, f[N << 1], r[N << 1];
char s[N], c[N << 1];
int dp[N << 1][21], lg2[N << 1];
void Init(int n) {
    for (int i = 2; i <= n; i++) lg2[i] = lg2[i / 2] + 1;
    for (int i = 1; i <= n; i++) dp[i][0] = r[i];
    for (int j = 1; (1 << j) <= n; j++)
        for (int i = 1; i + (1 << j) - 1 <= n; i++)
            dp[i][j] = max(dp[i][j - 1], dp[i + (1 << (j - 1))][j - 1]);
}
int Max(int l, int r) {
    if (l > r) swap(l, r);
    int k = lg2[r - l + 1];
    return max(dp[l][k], dp[r - (1 << k) + 1][k]);
}
void manacher() {
    for (int i = 1; i <= n; i++) c[i << 1] = s[i], c[(i << 1) + 1] = '#';
    c[1] = '#';
    c[n << 1 | 1] = '#';
    c[0] = '&';
    c[(n + 1) << 1] = '$';
    int j = 0, k;
    n = n << 1 | 1;
    for (int i = 1; i <= n;) {
        while (c[i - j - 1] == c[i + j + 1]) j++;
        r[i] = j;
        for (k = 1; k <= j && r[i] - k != r[i - k]; k++)
            r[i + k] = min(r[i - k], r[i] - k);
        i += k;
        j = max(j - k, 0);
    }
}
int main() {
    scanf("%d%s", &n, s + 1);
    int m = n;
    n = strlen(s + 1);
    for (int i = n + 1; i <= 2 * n; i++) s[i] = s[i - n];
    n = n * 2;
    manacher();
    Init(n);
    // 区间[i,i+n-1]的最长回文子串
    for (int i = 1; i <= m; i++) {
        int l = 1, r = m, ans = 1;
        int L = 2 * i, R = 2 * (i + m - 1); 
        while (l <= r) {
            int mid = l + r >> 1;
            if (Max(L + mid - 1, R - mid + 1) >= mid)
                ans = mid, l = mid + 1;
            else
                r = mid - 1;
        }
        printf("%d\n", ans);
    }
    return 0;
}
```
