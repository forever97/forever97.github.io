---
title: 2019NowCoder 8E Explorer [线段树分治+并查集]
date: 2019-08-20 00:04:09
tags: [线段树分治, 并查集, 离散化]
mathjax: true
cover: http://imglf4.nosdn0.126.net/img/MXRvbEU3WmxrOUlNTjFScHdyR0R3c2RNbzN4NTZyYWgyYWFTNm53eUZ2WmtBa1dNWCtTYi9nPT0.png?imageView&thumbnail=1680x0&quality=96&stripmeta=0
---
## Problem
有$10^9$只小怪兽，第$i$只编号为$i$

有一张$n$个点，$m$条边的无向图$(n,m \le 10^5)$

每条边只允许编号在$[l,r]$之间的小怪兽通过

问有多少小怪兽可以从$1$点抵达$n$点

## Solution
我们对边标号区间$[l,r]$进行离散，最多产生$2*m-1$个区间，左闭右开处理

对区间进行时间分治，在线段树节点上保存覆盖子树所有区间的边$id$

对线段树DFS遍历，当$1$和$n$连通时将节点包含的编号统计入答案即可

连通性判断用可回溯并查集，复杂度$O(mlog_2m)$

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 200000 + 10;
// Union Find Set
int st[N << 1], top, f[N], d[N];
void init(int n) {
    for (int i = 1; i <= n; i++) f[i] = i, d[i] = 1;
    top = 0;
}
int sf(int x) { return f[x] == x ? x : sf(f[x]); }
void back(int tag) {
    for (; top != tag; top--) {
        if (st[top] < 0)
            d[-st[top]]--;
        else
            f[st[top]] = st[top];
    }
}
void Union(int x, int y) {
    if (d[x] > d[y]) swap(x, y);
    if (d[x] == d[y]) d[y]++, st[++top] = -y;
    f[x] = y;
    st[++top] = x;
}
// Edge
struct Data {
    int x, y, l, r;
} E[N];
// Segment Tree
vector<int> v[N << 2];
void upd(int x, int l, int r, int y) {
    int mid = (l + r) >> 1;
    if (E[y].l <= l && r <= E[y].r) {
        v[x].push_back(y);
        return;
    }
    if (E[y].l < mid) upd(x << 1, l, mid, y);
    if (E[y].r > mid) upd(x << 1 | 1, mid, r, y);
}
int n, m, ans = 0;
int b[N << 2], x, y, l, r;
void dfs(int x, int l, int r) {
    int mid = (l + r) >> 1, t = top;
    for (auto y : v[x]) {
        int fx = sf(E[y].x), fy = sf(E[y].y);
        if (fx != fy) Union(fx, fy);
    }
    if (sf(1) == sf(n)) {
        ans += b[r] - b[l];
        back(t);
        return;
    }
    if (l + 1 == r) {
        back(t);
        return;
    }
    dfs(x << 1, l, mid);
    dfs(x << 1 | 1, mid, r);
    back(t);
}
int main() {
    scanf("%d%d", &n, &m);
    init(n);
    int cnt = 0;
    for (int i = 1; i <= m; i++) {
        scanf("%d%d%d%d", &x, &y, &l, &r);
        E[i] = {x, y, l, r + 1};
        b[++cnt] = l;
        b[++cnt] = r + 1;
    }
    sort(b + 1, b + cnt + 1);
    int siz = unique(b + 1, b + cnt + 1) - (b + 1);
    for (int i = 1; i <= m; i++) {
        E[i].l = lower_bound(b + 1, b + siz + 1, E[i].l) - b;
        E[i].r = lower_bound(b + 1, b + siz + 1, E[i].r) - b;
        upd(1, 1, siz, i);
    }
    dfs(1, 1, siz);
    printf("%d\n", ans);
    return 0;
}
```
