---
title: 出现次数大于集合大小一半的数字
date: 2019-08-28 11:04:29
tags: [莫队, 可持久化线段树, 线段树, 树上倍增]
mathjax: true
categories: 题解杂货铺
cover: https://forever97.github.io/2020/10/19/Re0-1/8.png
---
## 集合版本

给定一个集合，问出现次数大于一半的数字

### 权值数组统计

权值数组计数，upd后超过一半即为答案

## 区间版本

给一个长度为$n$的序列$a$，$1 \le a_i \le n$

给定$m$组询问，每次询问一个区间$[l,r]$

查询是否存在一个数在$[l,r]$中出现的次数大于$\frac{r-l+1}{2}$

如果存在，输出这个数，否则输出0

### 单增莫队

莫队处理询问

权值数组计数，保存出现次数最多的点权和次数

非可加数据，需单增处理

复杂度$O((m+n)\sqrt{n})$

### 可持久化线段树

建立可持久化的权值线段树

对于区间查询，在线段树上二分查询R和L-1版本间的数值差符合要求的位置

复杂度$O(nlog_2n)$

## 树上版本

给定一棵$n$个点的点权树，点权$c_i \le n$

$m$组询问，查询一条树链上是否有出现次数大于长度一半的点权值

有则输出点权，没有则输出$-1$

### Solution

构造一个偏序对$(a,w)$

表示一个集合中可能出现次数最多的元素，以及其权值，初始权值为1

当两个集合合并时，如果出现次数最多元素相同，则权值相加

否则权值相减，权值大的减去权值小的，保留权值大的

当一个元素在最终集合中出现次数大于一半时，必定能被保留到最后

用这种方法在树上倍增可以得到可能出现次数大于一半的数字

用线段树验证该数字在这条树链上的出现次数即可

因此，对于每个点权需要建立一棵线段树

动态开点，一个点最多消耗一条链的内存

空间复杂度$O(nlog_2n)$，时间复杂度$O(nlog_2n)$

## Code

### 区间版本

```cpp
// 查询[lx,rx]区间内超过cnt的数
int query(int lx, int rx, int cnt) {
    int L = 1, R = n, mid, x, y;
    x = root[lx - 1], y = root[rx];
    while (L != R) {
        if (v[y] - v[x] <= cnt) return 0;
        mid = (L + R) >> 1;
        if (v[l[y]] - v[l[x]] > cnt)
            R = mid, x = l[x], y = l[y];
        else if (v[r[y]] - v[r[x]] > cnt)
            L = mid + 1, x = r[x], y = r[y];
        else
            return 0;
    }
    return L;
}
```

### 树上版本

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 250000 + 10;
int n, q;
int tot, rt[20 * N], v[20 * N], ls[20 * N], rs[20 * N];
void upd(int &x, int p, int c, int l = 0, int r = n) {
    if (!x) x = ++tot;
    v[x] += c;
    if (l == r) return;
    int mid = (l + r) >> 1;
    p <= mid ? upd(ls[x], p, c, l, mid) : upd(rs[x], p, c, mid + 1, r);
}
int qry(int x, int L, int R, int l = 0, int r = n) {
    if (L <= l && r <= R) return v[x];
    int mid = (l + r) >> 1;
    return (L <= mid ? qry(ls[x], L, R, l, mid) : 0) +
           (mid < R ? qry(rs[x], L, R, mid + 1, r) : 0);
}
vector<int> G[N];
array<int, 2> mx[N][18];
array<int, 2> operator+(array<int, 2> a, array<int, 2> b) {
    if (a[0] ^ b[0]) {
        if (a[1] > b[1]) return array<int, 2>{a[0], a[1] - b[1]};
        return array<int, 2>{b[0], b[1] - a[1]};
    }
    return array<int, 2>{a[0], a[1] + b[1]};
}
int f[N][18], d[N], st[N], en[N], a[N], dfn;
void dfs(int x = 1, int fx = 0) {
    f[x][0] = fx;
    d[x] = d[fx] + 1;
    mx[x][0] = {a[x], 1};
    for (int i = 1; i < 18; i++) {
        f[x][i] = f[f[x][i - 1]][i - 1];
        mx[x][i] = mx[x][i - 1] + mx[f[x][i - 1]][i - 1];
    }
    st[x] = dfn++;
    upd(rt[a[x]], st[x], 1);
    for (int y : G[x])
        if (y ^ fx) dfs(y, x);
    en[x] = dfn;
    upd(rt[a[x]], en[x], -1);
}
array<int, 2> getmx(int x, int y) {
    if (d[x] < d[y]) swap(x, y);
    array<int, 2> res{0, 0};
    auto up = [&](int &x, int k) {
        res = res + mx[x][k];
        x = f[x][k];
    };
    for (int i = 17; ~i; --i)
        if (d[f[x][i]] >= d[y]) up(x, i);
    if (x ^ y) {
        for (int i = 17; ~i; --i)
            if (f[x][i] ^ f[y][i]) up(x, i), up(y, i);
        up(x, 0), up(y, 0);
    }
    return array<int, 2>{(res + mx[x][0])[0], x};
}
int main() {
    scanf("%d%d", &n, &q);
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]);
    for (int i = 1, x, y; i < n; i++) {
        scanf("%d%d", &x, &y);
        G[x].push_back(y);
        G[y].push_back(x);
    }
    dfs();
    for (int x, y; q--;) {
        scanf("%d%d", &x, &y);
        auto res = getmx(x, y);
        int c = res[0], lca = res[1];
        int cnt = qry(rt[c], 0, st[x]) + qry(rt[c], 0, st[y]) - qry(rt[c], 0, st[lca]);
        if (f[lca][0]) cnt -= qry(rt[c], 0, st[f[lca][0]]);
        int cnt0 = d[x] + d[y] - 2 * d[lca] + 1;
        printf("%d\n", cnt > cnt0 / 2 ? c : -1);
    }
    return 0;
}

```