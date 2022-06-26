let requests_url = 'https://hexo-circle-of-friends-api-nu.vercel.app/api'; //api地址
let moments_container = document.getElementById('moments_container') ; //div容器的id
let orign_data = []; //api请求所得到的源数据
let maxnumber = 20; //页面展示文章数量
let addnumber = 10; //每次加载增加的篇数
let opentype = '_blank';  //'_blank'打开新标签,'_self'本窗口打开

//将html放入指定id的div容器
let append_div = (parent, text) => {
    if (typeof text === 'string') {
        let temp = document.createElement('div');
        temp.innerHTML = text;
        // 防止元素太多 进行提速
        let frag = document.createDocumentFragment();
        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }
        parent.appendChild(frag);
    } else {
        parent.appendChild(text);
    }
};

//去重
let unique = (arr) => {
    return Array.from(new Set(arr))
};

//时区优化
let formatDate = (strDate) => {
    try {
        let date = new Date(Date.parse(strDate.replace(/-/g, "/")));
        let gettimeoffset;
        if (new Date().getTimezoneOffset()) {
            gettimeoffset = new Date().getTimezoneOffset();
        } else {
            gettimeoffset = 8;
        }
        let timeoffset = gettimeoffset * 60 * 1000;
        let len = date.getTime();
        let date2 = new Date(len - timeoffset);
        let sec = date2.getSeconds().toString();
        let min = date2.getMinutes().toString();
        if (sec.length === 1) {
            sec = "0" + sec;
        }
        if (min.length === 1) {
            min = "0" + min;
        }
        return date2.getFullYear().toString() + "/" + (date2.getMonth() + 1).toString() + "/" + date2.getDate().toString() + " " + date2.getHours().toString() + ":" + min + ":" + sec
    } catch (e) {
        return ""
    }
};

let timezoon = (datalist_slice) => {
    let time = datalist_slice[0][1][0][5];
    return formatDate(time)
};

//今日时间
let todaypost = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    let day = (date.getDate()).toString();
    if (month.length === 1) {
        month = "0" + month;
    }
    if (day.length === 1) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day
};

//加载更多文章
let load_more_post = () => {
    maxnumber = maxnumber + addnumber;
    moments_container.innerHTML = "";
    data_handle(orign_data, maxnumber)
};

//月份切片
let slice_month = (data) => {
    let monthlist = [];
    let datalist = [];
    let data_slice = data;
    for (let item in data_slice) {
        data_slice[item].push(item);
        if (data_slice[item][1].lenth !== 10) {
            let list = data_slice[item][1].split('-');
            if (list[1].length < 2) {
                list[1] = "0" + list[1]
            }
            if (list[2].length < 2) {
                list[2] = "0" + list[2]
            }
            data_slice[item][1] = list.join('-')
        }
        let month = data_slice[item][1].slice(0, 7);
        if (monthlist.indexOf(month) !== -1) {
            datalist[monthlist.length - 1][1].push(data_slice[item])
        } else {
            monthlist.push(month);
            datalist.push([month, [data_slice[item]]])
        }
    }
    for (let mounthgroup of datalist) {
        mounthgroup.push(mounthgroup[1][0][6]);
    }
    return datalist
};

//处理数据
let data_handle = (data, maxnumber) => {
    let today = todaypost();
    let Datetody = new Date(today);
    for (let item = 0; item < data[1].length; item++) {
        let Datedate = new Date(data[1][item][1]);
        if (Datedate > Datetody) {
            data[1].splice(item--, 1);
        }
    }
    let today_post = 0;
    let error = 0;
    let unique_live_link;
    let datalist = data[1].slice(0, maxnumber);
    let listlenth = data[1].length;
    let user_lenth = data[0].length;
    let datalist_slice = slice_month(datalist);
    let last_update_time = timezoon(datalist_slice);
    let link_list = [];
    for (let item of data[1]) {
        if (item[1] === today) {
            today_post += 1;
        }
        link_list.push(item[3]);
    }
    let arr = unique(link_list);
    unique_live_link = arr.length;
    for (let item of data[0]) {
        if (item[3] === 'true') {
            error += 1;
        }
    }
    let html_item = '<h2>统计信息</h2>';
    html_item += '<div id="info_user_pool" class="moments-item info_user_pool" style="">';
    html_item += '<div class="moments_chart"><span class="moments_post_info_title">当前友链数:</span><span class="moments_post_info_number">' + user_lenth + '个</span><br><span class="moments_post_info_title">失败数:</span><span class="moments_post_info_number">' + error + '个</span><br></div>';
    html_item += '<div class="moments_chart"><span class="moments_post_info_title">活跃友链数:</span><span class="moments_post_info_number">' + unique_live_link + '个</span><br><span class="moments_post_info_title">当前库存:</span><span class="moments_post_info_number">' + listlenth + '篇</span><br></div>';
    html_item += '<div class="moments_chart"><span class="moments_post_info_title">今日更新:</span><span class="moments_post_info_number">' + today_post + '篇</span><br><span class="moments_post_info_title">最近更新:</span><span class="moments_post_info_number">' + last_update_time + '</span><br></div>';
    html_item += '</div>';
    for (let month_item of datalist_slice) {
        html_item += '<h2>' + month_item[0] + '</h2>';
        for (let post_item of month_item[1]) {
            html_item += ' <div class="moments-item">';
            html_item += ' <a target="' + opentype + '" class="moments-item-img" href="' + post_item[2] + '" title="' + post_item[0] + '">';
            html_item += '<img onerror="this.onerror=null,this.src=&quot;https://cdn.jsdelivr.net/gh/Zfour/Butterfly-friend-poor-html/friendcircle/404.png&quot;"';
            html_item += ' src="' + post_item[4] + '"></a>';
            html_item += '<div class="moments-item-info"><div class="moments-item-time"><i class="far fa-user"></i>';
            html_item += '<span>' + post_item[3] + '</span>';
            html_item += ' <div class="moments_post_time"><i class="far fa-calendar-alt"></i>' +
                '<time datetime="' + post_item[1] + '" title="' + post_item[1] + '">' + post_item[1] + '</time></div>';
            html_item += `</div><a target="${opentype}" class="moments-item-title" href="${post_item[2]}" title="${post_item[0]}">${post_item[0]}</a></div>`;
            html_item += '</div>';

        }
    }
    if (data[1].length - maxnumber > 0) {
        html_item += '<div style="text-align: center"><button type="button" class="moments_load_button" ' +
            'onclick="load_more_post()">加载更多...</button>' +
            '</div>'
    }
    html_item += '<style>.moments-item-info span{padding-left:.3rem;padding-right:.3rem}.moments_post_time time{padding-left:.3rem;cursor:default}.moments_post_info_title{font-weight:700}.moments_post_info_number{float:right}.moments_chart{align-items:flex-start;flex:1;width:100px;height:60px;margin:20px}@media screen and (max-width:500px){.info_user_pool{padding:10px;flex-direction:column;max-height:200px}.moments_chart{flex:0;width:100%;height:160px;margin:0}}.moments-item:before{border:0}@media screen and (min-width:500px){.moments_post_time{float:right}}.moments_load_button{-webkit-transition-duration:.4s;transition-duration:.4s;text-align:center;border:1px solid #ededed;border-radius:.3em;display:inline-block;background:transparent;color:#555;padding:.5em 1.25em}.moments_load_button:hover{color:#3090e4;border-color:#3090e4}.moments-item{position:relative;display:-webkit-box;display:-moz-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-moz-box-align:center;-o-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;margin:0 0 1rem .5rem;-webkit-transition:all .2s ease-in-out;-moz-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;-ms-transition:all .2s ease-in-out;transition:all .2s ease-in-out;box-shadow:rgba(0,0,0,0.07) 0 2px 2px 0,rgba(0,0,0,0.1) 0 1px 5px 0;border-radius:2px}.moments-item-img{overflow:hidden;width:80px;height:80px}.moments-item-img img{max-width:100%;width:100%;height:100%;object-fit:cover}.moments-item-info{-webkit-box-flex:1;-moz-box-flex:1;-o-box-flex:1;box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;padding:0 .8rem}.moments-item-title{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;font-size:1.1em;-webkit-transition:all .3s;-moz-transition:all .3s;-o-transition:all .3s;-ms-transition:all .3s;transition:all .3s;-webkit-line-clamp:1}</style>'
    append_div(moments_container, html_item)
};

//网络请求
fetch(requests_url).then(
    data => data.json()
).then(
    data => {
        orign_data = data;
        data_handle(orign_data, maxnumber)
    }
)