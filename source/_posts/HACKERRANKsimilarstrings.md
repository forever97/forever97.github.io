---
title: HackerRank Similar Strings [Hash+后缀排序+二分]
date: 2019-09-25 22:13:43
tags: [Hash, 后缀排序, 二分]
categories: ✨题解杂货铺
cover: /2020/10/19/Re0-1/8.png
---
## Problem

两个字符串$a$和$b$相似当且仅当两个串长度相等

且$a_i = a_j$时$b_i = b_j， a_i \neq a_j$时$b_i \neq b_j$
        
给定一个字符串，多次询问其某个子串在原串中相似匹配的次数

## Solution

对于每个子串，我们根据每个字母第一次出现的位置对其标号

用标号来表示这个子串，那么如果标号序列的哈希值相同则子串相等

当子串起始位置不同时，我们会得到不同的标号，我们发现标号序列存在后缀递推关系

因此我们从后往前预处理这个标号，得到每个位置作为子串起点时标号对字母的映射

维护每个字符的位置哈希，对于两个子串的比较，只要比较子串区间内所有对应标号的字符的位置哈希是否相同即可

我们对所有后缀按照相似匹配的定义进行排序，那么包含与查询子串相似的串的后缀一定是连续的段

对于查询一个子串相似匹配的次数，我们只要在后缀排名中二分找到这样的相似段的左右端点即可

即两个后缀的最长匹配大于等于子串长度的最远位置，求最长匹配的过程可以二分加速

复杂度$O(knlognlogn)$，$k$为字符集大小

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef unsigned long long ull;
const int N = 100000 + 10, C = 10;
const int base = 131;
int n, m, a[N][C], id[N], rk[N];
ull p[N], b[N][C];
char s[N];
int getmax(int x, int y) {
    if (x > y) swap(x, y);
    int r = n - y + 1, l = 0, ans = 0, mid, h = 0;
    while (l <= r) {
        mid = (l + r) / 2;
        h = 0;
        for (int i = 0; h == i && i < C; i++)
            h += (((b[x + mid - 1][a[x][i]] - b[x - 1][a[x][i]]) * p[y - x] -
                   b[y + mid - 1][a[y][i]] + b[y - 1][a[y][i]]) == 0);
        if (h == C)
            l = mid + 1, ans = mid;
        else
            r = mid - 1;
    }
    return ans;
}
bool cmp(int x, int y) {
    int d = getmax(x, y);
    if (d == n - max(x, y) + 1) return x > y;
    int _A = 0, _B = 0;
    for (int i = 0; i < C; i++) {
        if (s[x + d] == a[x][i]) _A = i;
        if (s[y + d] == a[y][i]) _B = i;
    }
    return _A < _B;
}
void init() {
    for (int i = p[0] = 1; i < N; i++) p[i] = p[i - 1] * base;
    for (int i = 1; i <= n; i++) s[i] -= 'a';
    for (int i = 0; i < C; i++) a[n + 1][i] = i;
    for (int i = n; i > 0; i--) {
        int pos = 0;
        for (int j = 0; j < C; j++) {
            a[i][j] = a[i + 1][j];
            if (a[i][j] == s[i]) pos = j;
        }
        while (pos--) swap(a[i][pos], a[i][pos + 1]);
    }
    for (int i = 1; i <= n; i++) {
        b[i][s[i]] = p[i];
        for (int j = 0; j < C; j++) b[i][j] = b[i][j] + b[i - 1][j];
    }
    for (int i = 1; i <= n; i++) id[i] = i;
    stable_sort(id + 1, id + n + 1, cmp);
    for (int i = 1; i <= n; i++) rk[id[i]] = i;
}
int main() {
    scanf("%d%d", &n, &m);
    scanf("%s", s + 1);
    init();
    while (m--) {
        int l, r, ans;
        scanf("%d%d", &l, &r);
        int x = rk[l];
        int d = r - l + 1;
        l = ans = 1;
        r = x;
        while (l <= r) {
            int mid = (l + r) >> 1;
            if (getmax(id[x], id[mid]) >= d)
                ans = mid, r = mid - 1;
            else
                l = mid + 1;
        }
        int L = ans;
        l = x;
        r = n;
        while (l <= r) {
            int mid = (l + r) >> 1;
            if (getmax(id[x], id[mid]) >= d)
                ans = mid, l = mid + 1;
            else
                r = mid - 1;
        }
        int R = ans;
        printf("%d\n", R - L + 1);
    }
    return 0;
}
```

