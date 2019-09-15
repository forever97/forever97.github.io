---
title: ICPC2019网络赛 南京站 E K Sum [杜教筛+欧拉降幂]
date: 2019-09-01 22:24:35
tags: [莫比乌斯反演, 杜教筛, 欧拉降幂, 数值分块]
mathjax: true
cover: http://imglf3.nosdn0.126.net/img/MXRvbEU3WmxrOUxQdUVwZ1JCRzJmcG1lMUM0aWJScVMrdkhlS2RRSkw1cm1vcytwbW1HeHBRPT0.jpg?imageView&thumbnail=1778y1000&type=jpg&quality=96&stripmeta=0&type=jpg
---
## Problem
定义函数$f_n(k)=\sum_{l_1=1}^n\sum_{l_2=1}^n\dots\sum_{l_k=1}^n(gcd(l_1,l_2,\dots,l_k))^2$

求$S=\sum_{i=2}^kf_n(i)$

答案对$10^9+7$取模

$1 \le n \le 10^9,2 \le k \le 10^{10^5}$

## Solution
$f_n(k)=\sum_{g=1}^ng^2\sum_{l_1=1}^n\sum_{l_2=1}^n\dots\sum_{l_k=1}^n[gcd(l_1,l_2,\dots,l_k)==g]$

设$F(x)=\sum_{l_1=1}^n\sum_{l_2=1}^n\dots\sum_{l_k=1}^n[x \mid gcd(l_1,l_2,\dots,l_k)]$

$g(x)=\sum_{l_1=1}^n\sum_{l_2=1}^n\dots\sum_{l_k=1}^n[gcd(l_1,l_2,\dots,l_k)==x]$

$F(x)=\sum_{x \mid d}g(d)=\lfloor\frac{n}{x}\rfloor^k$

$g(x)=\sum_{x|d}\mu(\frac{d}{x})F(d)=\sum_{x \mid d}\mu(\frac{d}{x})\lfloor\frac{n}{d}\rfloor^k$

$f_n(k)=\sum_{g=1}^ng^2\sum_{g \mid d}\mu(\frac{d}{g})\lfloor\frac{n}{d}\rfloor^k$

枚举约数转枚举倍数

有$f_n(k)=\sum_{i=1}^n\lfloor\frac{n}{i}\rfloor^k\sum_{g|i}g^2\mu(\frac{i}{g})$

则$S(n)=\sum_{i=1}^n(\lfloor\frac{n}{i}\rfloor^2+\lfloor\frac{n}{i}\rfloor^3+\dots+\lfloor\frac{n}{i}\rfloor^k)\sum_{g|i}g^2\mu(\frac{i}{g})$

记$F(n)=n^2+n^3+\dots+n^k$

$G(n)=\sum_{d|n}d^2\mu(\frac{n}{d})$

$F(n)$可以通过等比数列求和公式得到，因为$k$比较大，需要在等比数列求和公式中使用欧拉降幂，需要特殊注意的是，当公比是1时答案是$k-1$，此时$k$并非指数，因此需要分别处理指数取模的$k$以及底数取模的$k$

$G(n)=(id^2\ast\mu)(n)$

考虑卷上$I$来消除$\mu$

$(g*G)(n)=((id^2\ast \mu)\ast I)(n)=(id^2\ast(\mu\ast I))(n)$

$(\mu\ast I)(n)=e,(e\ast f)(n)=f$

因此我们得到$(I\ast G)(n)=id^2$

所以对于$SumG(n)=\sum_{i=1}^nG(n)=\sum_{i=1}^ni^2-\sum_{d \mid n}SumG(\lfloor\frac{n}{d}\rfloor)$

预处理前缀和，杜教筛计算即可

对于$G(n)=(id^2\ast\mu)(n)$前缀和的预处理，$G(n)$是积性函数，并且有$G(1)=1$，$G(p)=p^2-1$，$G(p^c)=p^{2c-2}\ast (p^2-1)$

$S(n)=\sum_{i=1}^nF(\lfloor\frac{n}{i}\rfloor)\ast G(i)$

我们对$G$数值分块，通过$SumG$前缀差得到区段和即可计算最终答案$S$


```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int P = 1e9 + 7;
const int N = 1e6 + 5;
bool notp[N];
int prime[N], pnum, f[N];
ll sum[N], inv6;
void sieve() {
    memset(notp, 0, sizeof(notp));
    notp[0] = notp[1] = f[1] = 1;
    pnum = 0;
    for (int i = 2; i < N; i++) {
        if (!notp[i]) {
            prime[++pnum] = i;
            f[i] = (1ll * i * i - 1 + P) % P;
        }
        for (int j = 1; j <= pnum && 1ll * prime[j] * i < N; j++) {
            notp[prime[j] * i] = 1;
            if (i % prime[j] == 0) {
                f[i * prime[j]] = 1ll * f[i] * prime[j] % P * prime[j] % P;
                break;
            }
            f[i * prime[j]] = 1ll * f[prime[j]] * f[i] % P;
        }
    }
    for (int i = 1; i < N; i++) sum[i] = (sum[i - 1] + f[i]) % P;
}
int phi(int n) {
    int ans = n;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            ans = ans / i * (i - 1);
            while (n % i == 0) n /= i;
        }
    }
    if (n > 1) ans = ans / n * (n - 1);
    return ans;
}
ll sum2(ll x) { return x * (x + 1) % P * (2 * x + 1) % P * inv6 % P; }
unordered_map<ll, ll> mp;
ll S(ll n) {
    if (n < N) return sum[n];
    if (mp.count(n)) return mp[n];
    ll res = sum2(n);
    for (ll i = 2, last; i <= n; i = last + 1) {
        last = n / (n / i);
        res -= (last - (i - 1) + P) % P * S(n / i) % P;
        res = (res % P + P) % P;
    }
    return mp[n] = res;
}
ll mul(ll x, ll y, ll P) {
    return (x * y - (ll)(x / (long double)P * y + 1e-3) * P + P) % P;
}
ll powmod(ll a, ll b, ll P) {
    ll t = 1;
    for (; b; b >>= 1, a = mul(a, a, P))
        if (b & 1) t = mul(t, a, P);
    return t;
}
ll cal(ll x, int k, int rk) {
    if (x == 1) return (rk - 1 + P) % P;
    ll res = (x * x % P - powmod(x, k + 1, P) + P) % P;
    res = res * powmod((1 - x + P) % P, P - 2, P) % P;
    return res;
}
ll solve(int n, int k, int rk) {
    ll res = 0;
    for (int i = 1, last; i <= n; i = last + 1) {
        last = n / (n / i);
        res += (S(last) - S(i - 1) + P) % P * cal(n / i, k, rk) % P;
        res %= P;
    }
    return res;
}
char s[N];
int main() {
    int mod = phi(P);
    inv6 = powmod(6, P - 2, P);
    sieve();
    int T, n;
    scanf("%d", &T);
    while (T--) {
        scanf("%d", &n);
        scanf("%s", s + 1);
        int len = strlen(s + 1);
        ll k = 0, rk = 0;
        for (int i = 1; i <= len; i++) {
            rk = mul(rk, 10, P);
            rk = (rk + s[i] - '0') % P;
            k = mul(k, 10, mod);
            k = (k + s[i] - '0') % mod;
        }
        printf("%lld\n", solve(n, k, rk));
    }
    return 0;
}


```


