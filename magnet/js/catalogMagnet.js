const catalogMagnet = new Vue({
	el:'#catalogMagnet',
	data:{
		message:'Hello，我是forever97',
		link: [],
		postnum:[],
		//这里是磁贴背景图片
		img:[
            "https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/tijie.jpg",
            "https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/od.jpg",
            "https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/vue.jpg",
            "https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/css.jpg",
            "https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/suanfa.jpg",
            "https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/html.jpg",
            "https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/d3.jpg",
            "https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/blog.jpg",
            "https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/react.jpg",
			"https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/gan.jpg",
            "https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/canvas.jpg",
            "https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/vis.jpg",
            "https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/vqa.jpg",
            "https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/spider.jpg",
            "https://forever97-picture-bed.oss-cn-hangzhou.aliyuncs.com/img/js.jpg",
		],
		//这里是磁贴描述信息
		describe:[
            "一些零碎的题解",
            "目标检测学习记录",
            "VUE学习记录",
            "CSS杂记",
            "尝试传播点知识",
            "HTML学习记录",
            "D3学习记录",
            "博客优化记录",
            "React学习记录",
            "对抗生成网络",
            "一起来画画吧",
            "可视化学习",
            "VQA论文阅读记录",
            "一些简单的爬虫记录",
            "JS小玩具",
		],
		//这里是磁贴的文字颜色
		figLetColor: {color:'white'},
		//这里是磁贴的文字遮罩
		figLetimg: {backgroundImage: 'linear-gradient(to bottom,rgba(0, 0, 0, 0.4) 25%,rgba(16,16,16,0) 100%)'},
		//这里是当磁贴图片为透明背景png时默认展示的背景颜色
		figbackColor: {background:'#000000 URL()'},
		//这里是当磁贴图片为透明背景png时默认展示的凹凸效果
		figShadow: {boxShadow: 'inset 3px 3px 18px 0px rgba(50,50,50, 0.4)'},
	},

})

catalogMagnet.link = $(".categoryMagnetitem").children().children().children("a");
catalogMagnet.postnum = $(".categoryMagnetitem").children().children().children("span");
let linecolor = catalogMagnet.figLetColor.color
$("<style type='text/css' id='dynamic-after' />").appendTo("head");
$("#dynamic-after").text(".magnetname:after{background:" + linecolor + "!important}");