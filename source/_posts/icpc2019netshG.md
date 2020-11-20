---
title: ICPC2019网络赛 上海站 G Substring [Hash]
date: 2019-09-16 14:10:31
tags: [Hash]
categories: 题解杂货铺
cover: /2020/10/19/Re0-1/8.png
---
## Problem

规定一个字符串和另一个字符串匹配的条件为首尾两个字符相同，且所有字符的出现次数相同

现在给定一个母串，询问多个子串，问子串在母串中的匹配次数

子串长度和 $\le 10^5$，母串长度 $\le 10^5$

## Solution

我们将询问串按照长度分组，对于每种分组，我们计算母串中对应长度的哈希值

然后统计对应组询问在该长度子串的哈希值中出现次数即可

我们对除串首尾做字符的集合哈希，串首尾特殊处理累加到哈希值上去

考虑子串长度和限制，复杂度均摊，最坏情况$O(n\sqrt{n})$

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef unsigned long long ull;
const ull base = 131;
const int N = 100000 + 10;
int n, T, L[N], ans[N];
ull p[125], Hash[N], h[N];
char s[N], t[N];
vector<int> id[N];
int main() {
    scanf("%d", &T);
    for (int i = p[0] = 1; i < 125; i++) p[i] = p[i - 1] * base;
    while (T--) {
        scanf("%s", s);
        scanf("%d", &n);
        int len = strlen(s);
        for (int i = 1; i <= n; i++) {
            scanf("%s", t);
            Hash[i] = 0;
            L[i] = strlen(t);
            id[L[i]].push_back(i);
            for (int j = 1; j < L[i] - 1; j++) Hash[i] += p[t[j]];
            Hash[i] += p[123] * t[0];
            Hash[i] += p[124] * t[L[i] - 1];
        }
        sort(L + 1, L + n + 1);
        int cnt = unique(L + 1, L + n + 1) - (L + 1);
        for (int i = 1; i <= cnt; i++) {
            ull H = 0;
            int tot = 0;
            for (int j = 0; j < len; j++) {
                if (j >= L[i] - 1) {
                    H -= p[s[j - L[i] + 1]];
                    h[++tot] = H + p[123] * s[j - L[i] + 1] + p[124] * s[j];
                }
                H += p[s[j]];
            }
            sort(h + 1, h + tot + 1);
            for (auto x : id[L[i]]) {
                int p1 = upper_bound(h + 1, h + tot + 1, Hash[x]) - h;
                int p2 = lower_bound(h + 1, h + tot + 1, Hash[x]) - h;
                ans[x] = p1 - p2;
            }
            id[L[i]].clear();
        }
        for (int i = 1; i <= n; i++) printf("%d\n", ans[i]);
    }
    return 0;
}

```