---
title: ICPC2019网络赛 南京站 D Robots [期望DP]
date: 2019-09-02 10:38:31
tags: [期望DP, 拓扑排序]
mathjax: true
cover: http://imglf5.nosdn0.126.net/img/MXRvbEU3WmxrOUlkRmF6QndPTnA5YXA0SUR0aDJ1Wnp2RnpOL0E3Z2ZqSzV2aDArdGIrSkJ3PT0.jpg?imageView&thumbnail=1680x0&quality=96&stripmeta=0&type=jpg
---
## Problem
一个机器人在一张n个点m条边的有向无环图上行走，每天等概率地在原地不动或者移动到相邻的位置

每天消耗的能量为已经过去的天数，问从起点抵达终点最小耗能

$2 \le n \le 10^5,1 \le m \le 2 \ast 10^5$

## Solution
因为从起点出发到终点转移是等概率的，所以考虑按照从终点到起点的拓扑序转移

记$g_u$为$u$点到终点的期望步数，$f_u$为$u$点到终点的期望代价

考虑在路径序列前端多加一个点，其之后每一天的代价都会增加1

那么其和有向图上的后继节点关系有：

$g_u=(\sum(g_v+1)+g_u+1)/(sz_u+1)$

$f_u=(\sum(f_v+g_v+1)+f_u+g_u+1)/(sz_u+1)$

按照从终点到起点拓扑序转移计算即可

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 100010;
int T, n, m;
vector<int> ret, v[N], G[N];
double g[N], f[N];
int d[N];
void TopSort() {
    queue<int> Q;
    Q.push(n);
    while (!Q.empty()) {
        int u = Q.front();
        Q.pop();
        ret.push_back(u);
        for (auto x : v[u]) {
            --d[x];
            if (!d[x]) Q.push(x);
        }
    }
}
int main() {
    scanf("%d", &T);
    while (T--) {
        scanf("%d%d", &n, &m);
        for (int i = 1; i <= n; i++) G[i].clear(), v[i].clear();
        ret.clear();
        for (int i = 1; i <= m; i++) {
            int x, y;
            scanf("%d%d", &x, &y);
            v[y].push_back(x);
            G[x].push_back(y);
            d[x]++;
        }
        TopSort();
        for (int x : ret) {
        	f[x] = 0;
        	g[x] = 0; 
            if (!G[x].size()) continue;
            for (int y : G[x]) {
                g[x] = g[x] + g[y] + 1;
                f[x] = f[x] + f[y] + g[y] + 1;
            }
            g[x] = (g[x] + 1) / G[x].size();
            f[x] = (f[x] + g[x] + 1) / G[x].size();
        }
        printf("%.2f\n", f[1]);
    }
    return 0;
}
```
