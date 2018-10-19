/**
 * @author: kqzhu
 * @date: 2018/09/10
 * @name: EchartsUtil 1.0
 * @description: 本工具是基于echarts4.0进行的二次开发封装，不用书写大量的重复的代码，只需简单传递少量的公共参数，调用方法即可呈现图形
 */


/**
 * 为图形设置容器
 */
Array.prototype.setContainer = function (containerId) {
    var containerWidth;
    var containerHeight;
    var container = eval("document.getElementById('" + containerId + "')");
    //以为需要用递归查找祖宗级父元素
 /*   var ParentContainer = container.parentNode;//获取容器父元素
    function getParentContainer() {
        if(ParentContainer.clientWidth != 0 && ParentContainer.clientWidth != "undefined" && ParentContainer.clientWidth != null){
            return ParentContainer.clientWidth;
        }
        ParentContainer = ParentContainer.parentNode;
        getParentContainer();
    }
    var containerParent = getParentContainer();*/
    var containerParent = container.parentNode.clientWidth;//获取容器父元素的宽度
    if(containerParent == 0 || containerParent == "undefined" || containerParent == null){
        containerParent = 600;
    }
    if(typeof(container.attributes.width) != "undefined"){
        if(container.getAttribute("width").includes("%")){
            containerWidth = containerParent*container.getAttribute("width").replace("%","")/100
        }
        if(container.getAttribute("width").includes("px")){
            containerWidth = container.getAttribute("width").replace("px","");
        }
    }else {
        containerWidth = containerParent||"600";
    }
    if(typeof(container.attributes.height) != "undefined"){
        if(container.getAttribute("height").includes("%")){
            containerHeight = containerWidth*container.getAttribute("height").replace("%","")/100
        }
        if(container.getAttribute("height").includes("px")){
            containerHeight = container.getAttribute("height").replace("px","");
        }
    }else {
        containerHeight = containerWidth*0.618||"400";//黄金分割比例0.618
    }
    container.style.width = containerWidth+"px";
    container.style.height = containerHeight+"px";
};
/**
 * 判断是否为整数
 * @param obj
 * @returns {Boolean}
 */
Array.prototype.isInteger = function(obj) {
    return obj%1 === 0
};
/**
 * 检测数组是否存在
 * @param obj
 * @returns {Boolean}
 */
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
} ;
/**
 * 数组中最大值 最小值
 * @param array
 * @returns
 */
Array.prototype.max = function(){
    return Math.max.apply({},this) ;
} ;
Array.prototype.min = function(){
    return Math.min.apply({},this) ;
} ;


/**
 *
 *EchartUtil核心代码
 *
 */
var zhuEcharts = {
    //格式化数据series
    echartsDataFormate : {
        /**
         *整理数据没有分组类型的，适合饼图
         */
        NoGroupFormate : function (data){
            //category 的数据存储
            var categorys = [];
            //data 的数据存储
            var datas = [];
            //遍历
            for(var i=0;i<data.length;i++){
                categorys.push(data[i].name || "");
                //定义一个中间变量
                var temp_data = {value:data[i].value || 0 , name : data[i].name || ""};
                datas.push(temp_data);
            }
            return {categorys:categorys,data:datas};
        },
        //整理数据有分组类型的，适合折线图、柱形图（分组，堆积） 
        //数据格式：group：XXX，name：XXX，value：XXX
        /**
         * @param data : json数据<br>
         * @param type : 图表类型<br>
         * var data1 = [ <br>
         *	  { group:'类型1' , name: '1月', value: 10 }, <br>
         *    { group:'类型2' , name: '1月', value: 15 }, <br>
         *    { group:'类型1' , name: '2月', value: 25 }, <br>
         *    { group:'类型2' , name: '2月', value: 12 }, <br>
         *    { group:'类型1' , name: '3月', value: 22 }, <br>
         *    { group:'类型2' , name: '3月', value: 12 }, <br>
         *    ];
         *
         */
        GroupFormate : function (data,type) {
            //用于存储类型名称
            var groups = new Array();
            //用于存储data.name数据
            var names = new Array();
            //存储返回series数据 （一个或者多个）
            var series = new Array();

            for(var i=0; i<data.length; i++){
                //判断data[i].group是否存在数租groups中
                if (!groups.contains(data[i].group)) {
                    //不存在则跳进 存放
                    groups.push(data[i].group);
                }

                //判断name数据是否存在 数组names中
                if (!names.contains(data[i].name)) {
                    //不存在则跳进 存放
                    names.push(data[i].name);
                }
            }

            //遍历分类
            for (var i=0; i<groups.length; i++){
                //定义一个series中间变量
                var temp_series = {};
                //定义data.value数据存储
                var temp_data = new  Array();
                //遍历所有数据
                for(var j=0; j<data.length; j++){
                    //遍历data.name数据
                    for(var k=0; k<names.length; k++){
                        //判断所有分类中的所有数据含name数据分开
                        if(groups[i] == data[j].group && names[k] == data[j].name){
                            temp_data.push(data[j].value);
                        }
                    }
                }
                temp_series = {name:groups[i],type:type,data:temp_data};
                series.push(temp_series);

            }
            return {groups : groups ,category : names , series : series};
        },

        BarFormate : function (data,type) {
            switch (type){
                case 1:
                    //用于存储类型名称
                    var groups = new Array();
                    //用于存储data.name数据
                    var names = new Array();
                    //存储返回series数据 （一个或者多个）
                    var series = new Array();

                    for(var i=0; i<data.length; i++){
                        //判断data[i].group是否存在数租groups中
                        if (!groups.contains(data[i].group)) {
                            //不存在则跳进 存放
                            groups.push(data[i].group);
                        }

                        //判断name数据是否存在 数组names中
                        if (!names.contains(data[i].name)) {
                            //不存在则跳进 存放
                            names.push(data[i].name);
                        }
                    }

                    //遍历分类
                    for (var i=0; i<groups.length; i++){
                        //定义一个series中间变量
                        var temp_series = {};
                        //定义data.value数据存储
                        var temp_data = new  Array();
                        //遍历所有数据
                        for(var j=0; j<data.length; j++){
                            //遍历data.name数据
                            for(var k=0; k<names.length; k++){
                                //判断所有分类中的所有数据含name数据分开
                                if(groups[i] == data[j].group && names[k] == data[j].name){
                                    temp_data.push(data[j].value);
                                }
                            }
                        }
                        temp_series = {name:groups[i],type:"bar",data:temp_data,smooth: true};
                        series.push(temp_series);

                    }
                    return {groups : groups ,category : names , series : series};
                case 2:
                    //用于存储类型名称
                    var groups = new Array();
                    //用于存储data.name数据
                    var names = new Array();
                    //存储返回series数据 （一个或者多个）
                    var series = new Array();

                    for(var i=0; i<data.length; i++){
                        //判断data[i].group是否存在数租groups中
                        if (!groups.contains(data[i].group)) {
                            //不存在则跳进 存放
                            groups.push(data[i].group);
                        }

                        //判断name数据是否存在 数组names中
                        if (!names.contains(data[i].name)) {
                            //不存在则跳进 存放
                            names.push(data[i].name);
                        }
                    }

                    //遍历分类
                    for (var i=0; i<groups.length; i++){
                        //定义一个series中间变量
                        var temp_series = {};
                        //定义data.value数据存储
                        var temp_data = new  Array();
                        //遍历所有数据
                        for(var j=0; j<data.length; j++){
                            //遍历data.name数据
                            for(var k=0; k<names.length; k++){
                                //判断所有分类中的所有数据含name数据分开
                                if(groups[i] == data[j].group && names[k] == data[j].name){
                                    temp_data.push(data[j].value);
                                }
                            }
                        }
                        temp_series = {name:groups[i],type:"bar",data:temp_data,areaStyle: {}};
                        series.push(temp_series);

                    }
                    return {groups : groups ,category : names , series : series};
                case 3:
                    //用于存储类型名称
                    var groups = new Array();
                    //用于存储data.name数据
                    var names = new Array();
                    //存储返回series数据 （一个或者多个）
                    var series = new Array();

                    for(var i=0; i<data.length; i++){
                        //判断data[i].group是否存在数租groups中
                        if (!groups.contains(data[i].group)) {
                            //不存在则跳进 存放
                            groups.push(data[i].group);
                        }

                        //判断name数据是否存在 数组names中
                        if (!names.contains(data[i].name)) {
                            //不存在则跳进 存放
                            names.push(data[i].name);
                        }
                    }

                    //遍历分类
                    for (var i=0; i<groups.length; i++){
                        //定义一个series中间变量
                        var temp_series = {};
                        //定义data.value数据存储
                        var temp_data = new  Array();
                        //遍历所有数据
                        for(var j=0; j<data.length; j++){
                            //遍历data.name数据
                            for(var k=0; k<names.length; k++){
                                //判断所有分类中的所有数据含name数据分开
                                if(groups[i] == data[j].group && names[k] == data[j].name){
                                    temp_data.push(data[j].value);
                                }
                            }
                        }
                        temp_series = {name:groups[i],type:"bar",data:temp_data,smooth: true,areaStyle: {}};
                        series.push(temp_series);

                    }
                    return {groups : groups ,category : names , series : series};
                default:
                    //用于存储类型名称
                    var groups = new Array();
                    //用于存储data.name数据
                    var names = new Array();
                    //存储返回series数据 （一个或者多个）
                    var series = new Array();

                    for(var i=0; i<data.length; i++){
                        //判断data[i].group是否存在数租groups中
                        if (!groups.contains(data[i].group)) {
                            //不存在则跳进 存放
                            groups.push(data[i].group);
                        }

                        //判断name数据是否存在 数组names中
                        if (!names.contains(data[i].name)) {
                            //不存在则跳进 存放
                            names.push(data[i].name);
                        }
                    }

                    //遍历分类
                    for (var i=0; i<groups.length; i++){
                        //定义一个series中间变量
                        var temp_series = {};
                        //定义data.value数据存储
                        var temp_data = new  Array();
                        //遍历所有数据
                        for(var j=0; j<data.length; j++){
                            //遍历data.name数据
                            for(var k=0; k<names.length; k++){
                                //判断所有分类中的所有数据含name数据分开
                                if(groups[i] == data[j].group && names[k] == data[j].name){
                                    temp_data.push(data[j].value);
                                }
                            }
                        }
                        temp_series = {name:groups[i],type:"bar",data:temp_data};
                        series.push(temp_series);

                    }
                    return {groups : groups ,category : names , series : series};
            }

        },

        LineFormate : function (data,type) {
            switch (type){
                case 1:
                    //用于存储类型名称
                    var groups = new Array();
                    //用于存储data.name数据
                    var names = new Array();
                    //存储返回series数据 （一个或者多个）
                    var series = new Array();

                    for(var i=0; i<data.length; i++){
                        //判断data[i].group是否存在数租groups中
                        if (!groups.contains(data[i].group)) {
                            //不存在则跳进 存放
                            groups.push(data[i].group);
                        }

                        //判断name数据是否存在 数组names中
                        if (!names.contains(data[i].name)) {
                            //不存在则跳进 存放
                            names.push(data[i].name);
                        }
                    }

                    //遍历分类
                    for (var i=0; i<groups.length; i++){
                        //定义一个series中间变量
                        var temp_series = {};
                        //定义data.value数据存储
                        var temp_data = new  Array();
                        //遍历所有数据
                        for(var j=0; j<data.length; j++){
                            //遍历data.name数据
                            for(var k=0; k<names.length; k++){
                                //判断所有分类中的所有数据含name数据分开
                                if(groups[i] == data[j].group && names[k] == data[j].name){
                                    temp_data.push(data[j].value);
                                }
                            }
                        }
                        temp_series = {name:groups[i],type:"line",data:temp_data,smooth: true};
                        series.push(temp_series);

                    }
                    return {groups : groups ,category : names , series : series};
                case 2:
                    //用于存储类型名称
                    var groups = new Array();
                    //用于存储data.name数据
                    var names = new Array();
                    //存储返回series数据 （一个或者多个）
                    var series = new Array();

                    for(var i=0; i<data.length; i++){
                        //判断data[i].group是否存在数租groups中
                        if (!groups.contains(data[i].group)) {
                            //不存在则跳进 存放
                            groups.push(data[i].group);
                        }

                        //判断name数据是否存在 数组names中
                        if (!names.contains(data[i].name)) {
                            //不存在则跳进 存放
                            names.push(data[i].name);
                        }
                    }

                    //遍历分类
                    for (var i=0; i<groups.length; i++){
                        //定义一个series中间变量
                        var temp_series = {};
                        //定义data.value数据存储
                        var temp_data = new  Array();
                        //遍历所有数据
                        for(var j=0; j<data.length; j++){
                            //遍历data.name数据
                            for(var k=0; k<names.length; k++){
                                //判断所有分类中的所有数据含name数据分开
                                if(groups[i] == data[j].group && names[k] == data[j].name){
                                    temp_data.push(data[j].value);
                                }
                            }
                        }
                        temp_series = {name:groups[i],type:"line",data:temp_data,areaStyle: {}};
                        series.push(temp_series);

                    }
                    return {groups : groups ,category : names , series : series};
                case 3:
                    //用于存储类型名称
                    var groups = new Array();
                    //用于存储data.name数据
                    var names = new Array();
                    //存储返回series数据 （一个或者多个）
                    var series = new Array();

                    for(var i=0; i<data.length; i++){
                        //判断data[i].group是否存在数租groups中
                        if (!groups.contains(data[i].group)) {
                            //不存在则跳进 存放
                            groups.push(data[i].group);
                        }

                        //判断name数据是否存在 数组names中
                        if (!names.contains(data[i].name)) {
                            //不存在则跳进 存放
                            names.push(data[i].name);
                        }
                    }

                    //遍历分类
                    for (var i=0; i<groups.length; i++){
                        //定义一个series中间变量
                        var temp_series = {};
                        //定义data.value数据存储
                        var temp_data = new  Array();
                        //遍历所有数据
                        for(var j=0; j<data.length; j++){
                            //遍历data.name数据
                            for(var k=0; k<names.length; k++){
                                //判断所有分类中的所有数据含name数据分开
                                if(groups[i] == data[j].group && names[k] == data[j].name){
                                    temp_data.push(data[j].value);
                                }
                            }
                        }
                        temp_series = {name:groups[i],type:"line",data:temp_data,smooth: true,areaStyle: {}};
                        series.push(temp_series);

                    }
                    return {groups : groups ,category : names , series : series};
                default:
                    //用于存储类型名称
                    var groups = new Array();
                    //用于存储data.name数据
                    var names = new Array();
                    //存储返回series数据 （一个或者多个）
                    var series = new Array();

                    for(var i=0; i<data.length; i++){
                        //判断data[i].group是否存在数租groups中
                        if (!groups.contains(data[i].group)) {
                            //不存在则跳进 存放
                            groups.push(data[i].group);
                        }

                        //判断name数据是否存在 数组names中
                        if (!names.contains(data[i].name)) {
                            //不存在则跳进 存放
                            names.push(data[i].name);
                        }
                    }

                    //遍历分类
                    for (var i=0; i<groups.length; i++){
                        //定义一个series中间变量
                        var temp_series = {};
                        //定义data.value数据存储
                        var temp_data = new  Array();
                        //遍历所有数据
                        for(var j=0; j<data.length; j++){
                            //遍历data.name数据
                            for(var k=0; k<names.length; k++){
                                //判断所有分类中的所有数据含name数据分开
                                if(groups[i] == data[j].group && names[k] == data[j].name){
                                    temp_data.push(data[j].value);
                                }
                            }
                        }
                        temp_series = {name:groups[i],type:"line",data:temp_data};
                        series.push(temp_series);

                    }
                    return {groups : groups ,category : names , series : series};
            }

        },
        /**
         * 雷达图数据格式化
         */
        RadarFormate : function(data){
            //用于存储类型名称
            var groups = new Array();
            //用于存储data.name数据
            var names = new Array();
            //存储最大值数组
            var indicators = new Array();
            //定义data.value数据存储
            var temp_data = new  Array();
            for(var i=0; i<data.length; i++){
                //判断data[i].group是否存在数租groups中
                if (!groups.contains(data[i].group)) {
                    //不存在则跳进 存放
                    groups.push(data[i].group);
                }

                //判断name数据是否存在 数组names中
                if (!names.contains(data[i].name)) {
                    //不存在则跳进 存放
                    names.push(data[i].name);
                }
            }

            for(var i=0; i<names.length; i++){
                //中
                var temp_maxValue = new Array();
                for(var j=0;j<data.length;j++){
                    if(names[i] == data[j].name){
                        temp_maxValue.push(data[j].value);
                    }
                }
                indicators.push({name:names[i],max:Number(temp_maxValue.max() * 2 / 1.5).toFixed(2)})
            }
            //遍历分类
            for (var i=0; i<groups.length; i++){
                //定义一个series中间变量
                var temp_series = {};
                //定义datavalue数组
                var dataValues = new Array();
                //遍历所有数据
                for(var j=0; j<data.length; j++){
                    if(groups[i] == data[j].group){
                        dataValues.push(data[j].value);
                    }
                }
                temp_data.push({value:dataValues,name:groups[i]});
            }
            series = {type:"radar",data:temp_data};
            return { indicators : indicators ,groups : groups ,category : names , series : series};
        },
        /**
         * 漏斗图数据格式化
         */
        FunnelFormate : function(data,type){
            //用于存储类型名称
            var groups = new Array();
            //用于存储data.name数据
            var names = new Array();
            //定义一个存放series的数组
            var series = new Array();
            for(var i=0; i<data.length; i++){
                //判断data[i].group是否存在数租groups中
                if (!groups.contains(data[i].group)) {
                    //不存在则跳进 存放
                    groups.push(data[i].group);
                }

                //判断name数据是否存在 数组names中
                if (!names.contains(data[i].name)) {
                    //不存在则跳进 存放
                    names.push(data[i].name);
                }
            }
            var width = parseInt(100/groups.length);
            //遍历分类
            for (var i=0; i<groups.length; i++){
                //定义data.value数据存储
                var temp_data = new  Array();
                var k = 0;
                //遍历所有数据
                for(var j=0; j<data.length; j++){
                    //判断所有分类中的所有数据含name数据分开
                    if(groups[i] == data[j].group){
                        k++;
                        temp_data.push({value:k,name:data[j].name+":"+data[j].value});
                    }
                }
                var left = width*i;
                series.push({
                    name:groups[i],
                    type:type,
                    sort:'ascending',
                    grap:2,
                    left: left+"%",
                    width: width-5+"%",
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        },
                        emphasis: {
                            textStyle: {
                                fontSize: 20
                            }
                        }
                    },
                    data:temp_data
                });
            }
            return { groups : groups ,category : names , series : series};
        },
        /**
         * 仪表盘图数据格式化
         */
        GaugeFormate : function (data,type){
            var temp_datas = [{value:data.value,name:data.name}];
            var names = data.name;
            //判断最大值和最小值几位数
            maxNum = Number(parseInt(data.value)).toString().length;
            minNum = Number(parseInt(data.value)).toString().length;
            if(minNum <= 2){
                min = 0;
            }else{
                //最小值
                min = Math.pow(10,(maxNum-1));
            }
            //最大值
            max = Math.pow(10,maxNum);
            var series = new Array();
            series.push({
                name:data.group,
                type:type,
                min:min,
                max:max,
                radius: '70%',
                startAngle:180,
                endAngle:-0,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.09, 'lime'],[0.82, '#1e90ff'],[1, '#ff4500']],
                        width: 3,
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisLabel: {            // 坐标轴小标记
                    textStyle: {       // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#444',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length :15,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: {           // 分隔线
                    length :25,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        width:3,
                        color: 'auto',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                pointer: {           // 分隔线
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 5
                },
                title : {
                    offsetCenter :['-10%','30%'],
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize:14,
                        fontStyle: 'italic',
                        color: '#',
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                detail : {
                    backgroundColor: 'rgba(30,144,255,0.8)',
                    borderWidth: 1,
                    borderColor: '#fff',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 5,
                    fontSize:14,
                    offsetCenter: ['20%', '30%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        color: '#fff'
                    }
                },
                data:temp_datas
            });
            return {category : names , series : series};
        }

    },

    //生成图形option
    /**
     * 自由图
     * @param data : 对象数组
     * @param title ： 标题 字符串类型加引号
     */
    free : function (data,title){
        var basicOption = {
            title :{
                text : title || "",	//标题
                x : 'center',	//位置默认居中
            },
            grid: {
                left: '50',
                right: '20',
                bottom: '15%',
                top: '15%',
                containLabel: false
            },
            tooltip: {
                trigger: 'item',
                textStyle:{
                    fontSize:11,
                },
                axisPointer: {
                    type:'shadow'
                }
            },
            legend: {
                x: 'left',
                itemWidth: 15,
                itemHeight: 10
            },
            dataset: {
                // 提供一份数据。
                source: data
            },
            // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
            xAxis: {type: 'category'},
            // 声明一个 Y 轴，数值轴。
            yAxis: {},
            // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
            series: [
                {type:'bar'}
            ]
        };
        return basicOption;
    },

    /**
     * 饼图
     * @param data : json 数据 [{  name: '男生', value: 10}，name: '女生', value: 20}]
     * @param type : 饼图类型 数值型 1表示环形图，2表示玫瑰饼图，3表示环形玫瑰图...
     * @param title ： 标题 字符串类型加引号
     */
    pie : function (data,type,title){
        //数据格式
        var datas = zhuEcharts.echartsDataFormate.NoGroupFormate(data);
        switch (type){
            case 1:
                var option1 = {
                    //标题
                    title :{
                        text : title || "",	//标题
                        x : 'center',	//位置默认居中
                    },
                    //提示
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    //组建
                    legend : {
                        orient: 'horizontal', //垂直：vertical； 水平 horizontal
                        // top: 'center',	//位置默认左
                        bottom:'5%',
                        data:datas.categorys
                    },
                    series: [
                        {
                            name : title || "",
                            type : 'pie',	//类型
                            radius : ['50%','70%'], //圆的大小
                            center : ['50%', '50%'],//位置居中
                            data : datas.data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            //引导线
                            labelLine :{
                                normal :{
                                    show: true,
                                    length:2,
                                }
                            }
                        }
                    ]
                };
                return option1;
            case 2:
                var option2 = {
                    //标题
                    title :{
                        text : title || "",	//标题
                        x : 'center',	//位置默认居中
                    },
                    //提示
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    //组建
                    legend : {
                        orient: 'horizontal', //垂直：vertical； 水平 horizontal
                        // top: 'center',	//位置默认左
                        bottom:'5%',
                        data:datas.categorys
                    },
                    series: [
                        {
                            name : title || "",
                            type : 'pie',	//类型
                            radius : '48%', //圆的大小
                            roseType: 'radius',
                            center : ['50%', '50%'],//位置居中
                            data : datas.data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            //引导线
                            labelLine :{
                                normal :{
                                    show: true,
                                    length:2,
                                }
                            }
                        }
                    ]
                };
                return option2;
            case 3:
                var option3 = {
                    //标题
                    title :{
                        text : title || "",	//标题
                        x : 'center',	//位置默认居中
                    },
                    //提示
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    //组建
                    legend : {
                        orient: 'horizontal', //垂直：vertical； 水平 horizontal
                        // top: 'center',	//位置默认左
                        bottom:'5%',
                        data:datas.categorys
                    },
                    series: [
                        {
                            name : title || "",
                            type : 'pie',	//类型
                            radius : ['50%','70%'], //圆的大小
                            roseType: 'radius',
                            center : ['50%', '50%'],//位置居中
                            data : datas.data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            //引导线
                            labelLine :{
                                normal :{
                                    show: true,
                                    length:2,
                                }
                            }
                        }
                    ]
                };
                return option3;
            case 4:
                var option4 = {
                    //标题
                    title :{
                        text : title || "",	//标题
                        x : 'center',	//位置默认居中
                    },
                    //提示
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    //组建
                    legend : {
                        orient: 'horizontal', //垂直：vertical； 水平 horizontal
                        // top: 'center',	//位置默认左
                        bottom:'5%',
                        data:datas.categorys
                    },
                    series: [
                        {
                            name : title || "",
                            type : 'pie',	//类型
                            radius : '48%', //圆的大小
                            roseType : 'area',
                            center : ['50%', '50%'],//位置居中
                            data : datas.data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            //引导线
                            labelLine :{
                                normal :{
                                    show: true,
                                    length:2,
                                }
                            }
                        }
                    ]
                };
                return option4;
            case 5:
                var option5 = {
                    //标题
                    title :{
                        text : title || "",	//标题
                        x : 'center',	//位置默认居中
                    },
                    //提示
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    //组建
                    legend : {
                        orient: 'horizontal', //垂直：vertical； 水平 horizontal
                        // top: 'center',	//位置默认左
                        bottom:'5%',
                        data:datas.categorys
                    },
                    series: [
                        {
                            name : title || "",
                            type : 'pie',	//类型
                            radius : ['50%','70%'], //圆的大小
                            roseType : 'area',
                            center : ['50%', '50%'],//位置居中
                            data : datas.data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            //引导线
                            labelLine :{
                                normal :{
                                    show: true,
                                    length:2,
                                }
                            }
                        }
                    ]
                };
                return option5;
            default:
                var option = {
                    //标题
                    title :{
                        text : title || "",	//标题
                        x : 'center',	//位置默认居中
                    },
                    //提示
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    //组建
                    legend : {
                        orient: 'horizontal', //垂直：vertical； 水平 horizontal
                        // top: 'center',	//位置默认左
                        bottom:'5%',
                        data:datas.categorys
                    },
                    series: [
                        {
                            name : title || "",
                            type : 'pie',	//类型
                            radius : '48%', //圆的大小
                            center : ['50%', '50%'],//位置居中
                            data : datas.data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            //引导线
                            labelLine :{
                                normal :{
                                    show: true,
                                    length:2,
                                }
                            }
                        }
                    ]
                };
                return option;
        }
    },
    /**
     * 柱形图
     * @param data : json 数据
     * @param type : 柱状图类型 数值型 1表示
     * @param data : json 数据
     */
    bar : function (data,type,title){
        var datas = zhuEcharts.echartsDataFormate.BarFormate(data,type);
        var option = {
            //标题
            title :{
                text : title || "",	//标题
                x : 'center',	//位置默认居中
            },
            //提示
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
            },
            //组建
            legend: {
                orient: 'vertical', //垂直：vertical； 水平 horizontal
                left: 'left',	//位置默认左
                data : datas.groups
            },
            //水平坐标
            xAxis : [
                {
                    type : 'category',
                    data : datas.category
                }
            ],
            //垂直坐标
            yAxis : [
                {
                    type : 'value'
                }
            ],
            //series数据
            series: datas.series
        };
        return option;
    },

    /**
     * 折线图
     * @param data : json 数据
     * @param type : 折线图类型
     * @param title : 标题
     */
    line : function (data,type,title){
        var datas = zhuEcharts.echartsDataFormate.LineFormate(data,type);
        var option = {
            //标题
            title :{
                text : title || "",	//标题
                x : 'center',	//位置默认居中
            },
            //提示
            tooltip: {
                show: true,
                trigger: 'axis',
            },
            //组建
            legend: {
                orient: 'vertical', //垂直：vertical； 水平 horizontal
                left: 'right',	//位置默认右
                data : datas.groups
            },
            grid:{
                left:'10%',
                top:'25%',
                right:'10%',
                bottom:'25%',
            },
            //水平坐标
            xAxis : [
                {
                    type : 'category',
                    data : datas.category,
                    splitLine:{
                        show:true,
                    },
                }
            ],
            //垂直坐标
            yAxis : [
                {
                    type : 'value'
                }
            ],
            //series数据
            series: datas.series
        };
        return option;
    },
    /**
     * 雷达图
     * @param title ： 标题<br>
     * @param subtext ：副标题<br>
     * @param data : json 数据
     */
    radar : function (data,title){
        var datas = zhuEcharts.echartsDataFormate.RadarFormate(data);
        var option = {
            //标题
            title :{
                text : title || "",	//标题
                x : 'center',	//位置默认居中
            },
            //提示
            tooltip: {
                show: true,
            },
            //组建
            legend: {
                orient: 'vertical', //垂直：vertical； 水平 horizontal
                left: 'left',	//位置默认左
                data : datas.groups
            },
            radar: {
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                indicator: datas.indicators
            },
            series: datas.series
        };
        return option;
    },
    /**
     * 漏斗图
     * @param title ： 标题<br>
     * @param subtext ：副标题<br>
     * @param data : json 数据
     */
    funnel : function (data,type,title){
        var datas = zhuEcharts.echartsDataFormate.NoGroupFormate(data);
        switch (type){
            case 1:
                var option1 = {
                    //标题
                    title :{
                        text : title || "",	//标题
                        x : 'center',	//位置默认居中
                    },
                    //提示
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{b} : {c}"
                    },
                    //组建
                    legend: {
                        orient: 'horizontal', //垂直：vertical； 水平 horizontal
                        left: 'left',	//位置默认左
                        data : datas.categorys
                    },
                    series: [
                        {
                            type:'funnel',
                            left: '10%',
                            top: 60,
                            bottom: 60,
                            width: '80%',
                            sort: 'ascending',
                            gap: 2,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                },
                                emphasis: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 10,
                                    lineStyle: {
                                        width: 1,
                                        type: 'solid'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderColor: '#fff',
                                    borderWidth: 1
                                }
                            },
                            data: datas.data
                        }
                    ]
                };
                return option1;
            case 2:
                var option2 = {
                    //标题
                    title :{
                        text : title || "",	//标题
                        x : 'center',	//位置默认居中
                    },
                    //提示
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{b} : {c}"
                    },
                    //组建
                    legend: {
                        orient: 'horizontal', //垂直：vertical； 水平 horizontal
                        left: 'left',	//位置默认左
                        data : datas.categorys
                    },
                    series: [
                        {
                            type:'funnel',
                            left: '10%',
                            top: 60,
                            bottom: 60,
                            width: '80%',
                            funnelAlign: 'left',
                            gap: 2,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                },
                                emphasis: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 10,
                                    lineStyle: {
                                        width: 1,
                                        type: 'solid'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderColor: '#fff',
                                    borderWidth: 1
                                }
                            },
                            data: datas.data
                        }
                    ]
                };
                return option2;
            case 3:
                var option3 = {
                    //标题
                    title :{
                        text : title || "",	//标题
                        x : 'center',	//位置默认居中
                    },
                    //提示
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{a} <br/>{b} ({c}%)"
                    },
                    //组建
                    legend: {
                        orient: 'horizontal', //垂直：vertical； 水平 horizontal
                        left: 'left',	//位置默认左
                        data : datas.categorys
                    },
                    series: [
                        {
                            type:'funnel',
                            left: '10%',
                            top: 60,
                            bottom: 60,
                            width: '80%',
                            funnelAlign: 'right',
                            gap: 2,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                },
                                emphasis: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 10,
                                    lineStyle: {
                                        width: 1,
                                        type: 'solid'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderColor: '#fff',
                                    borderWidth: 1
                                }
                            },
                            data: datas.data
                        }
                    ]
                };
                return option3;
            case 4:
                var option4 = {
                    //标题
                    title :{
                        text : title || "",	//标题
                        x : 'center',	//位置默认居中
                    },
                    //提示
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{a} <br/>{b} ({c}%)"
                    },
                    //组建
                    legend: {
                        orient: 'horizontal', //垂直：vertical； 水平 horizontal
                        left: 'left',	//位置默认左
                        data : datas.categorys
                    },
                    series: [
                        {
                            type:'funnel',
                            left: '10%',
                            top: 60,
                            bottom: 60,
                            width: '80%',
                            sort: 'ascending',
                            funnelAlign: 'left',
                            gap: 2,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                },
                                emphasis: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 10,
                                    lineStyle: {
                                        width: 1,
                                        type: 'solid'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderColor: '#fff',
                                    borderWidth: 1
                                }
                            },
                            data: datas.data
                        }
                    ]
                };
                return option4;
            case 5:
                var option5 = {
                    //标题
                    title :{
                        text : title || "",	//标题
                        x : 'center',	//位置默认居中
                    },
                    //提示
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{a} <br/>{b} ({c}%)"
                    },
                    //组建
                    legend: {
                        orient: 'horizontal', //垂直：vertical； 水平 horizontal
                        left: 'left',	//位置默认左
                        data : datas.categorys
                    },
                    series: [
                        {
                            type:'funnel',
                            left: '10%',
                            top: 60,
                            bottom: 60,
                            width: '80%',
                            sort: 'ascending',
                            funnelAlign: 'right',
                            gap: 2,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                },
                                emphasis: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 10,
                                    lineStyle: {
                                        width: 1,
                                        type: 'solid'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderColor: '#fff',
                                    borderWidth: 1
                                }
                            },
                            data: datas.data
                        }
                    ]
                };
                return option5;
            default:
                var option = {
                    //标题
                    title :{
                        text : title || "",	//标题
                        x : 'center',	//位置默认居中
                    },
                    //提示
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{b} : {c}"
                    },
                    //组建
                    legend: {
                        orient: 'horizontal', //垂直：vertical； 水平 horizontal
                        left: 'left',	//位置默认左
                        data : datas.categorys
                    },
                    series: [
                        {
                            type:'funnel',
                            left: '10%',
                            top: 60,
                            bottom: 60,
                            width: '80%',
                            gap: 2,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                },
                                emphasis: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 10,
                                    lineStyle: {
                                        width: 1,
                                        type: 'solid'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderColor: '#fff',
                                    borderWidth: 1
                                }
                            },
                            data: datas.data
                        }
                    ]
                };
                return option;
        }
    },
    /**
     * 仪表图
     * @param title ： 标题<br>
     * @param subtext ：副标题<br>
     * @param data : json 数据
     */
    gauge : function (title,subtext,data){
        var datas = zhuEcharts.echartsDataFormate.GaugeFormate(data, 'gauge');
        var option =  {
            //标题
            title :{
                text : title || "",	//标题
                x : 'center',	//位置默认居中
            },
            //提示
            tooltip: {
                show: true,
                formatter: "{a} <br/>{b}:{c}"
            },
            series :datas.series
        };
        return option;
    },
		/**
		 *
		 * @param option : option
		 * @param echartId : 图表的id 需要加引号
		 */
	renderChart : function (option,echartId,theme){
            var container = eval("document.getElementById('" + echartId + "')");
            var zhuChart = new Array();
            zhuChart.setContainer(echartId);
            var myChart = echarts.init(container,theme);
            //当无数据的时候显示；
        /*    if (option.series[0].data.length <= 0) {
                myChart.showLoading({
                    text: '无数据' //loading话术
                });
                return;
            }*/
            myChart.setOption(option);	// 为echarts对象加载数据
            window.onresize = function(){
                zhuChart.setContainer(echartId);
                myChart.resize();
            };
            return myChart;
        }
};


/**
 *
 *为echarts注册几套样式
 *
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    echarts.registerTheme('dark', {
        "color": [
            "#ff715e",
            "#ffaf51",
            "#ffee51",
            "#8c6ac4",
            "#715c87"
        ],
        "backgroundColor": "rgba(64,64,64,0.5)",
        "textStyle": {},
        "title": {
            "textStyle": {
                "color": "#ffaf51"
            },
            "subtextStyle": {
                "color": "#eeeeee"
            }
        },
        "line": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": "3"
                }
            },
            "symbolSize": "8",
            "symbol": "path://M237.062,81.761L237.062,81.761c-12.144-14.24-25.701-20.1-40.68-19.072 c-10.843,0.747-20.938,5.154-30.257,13.127c-9.51-5.843-19.8-9.227-30.859-10.366c0.521-3.197,1.46-6.306,2.85-9.363 c3.458-7.038,8.907-12.741,16.331-17.296c-5.609-3.384-11.227-6.799-16.854-10.279c-16.257,8.104-25.06,20.601-26.463,38.417 c-7.599,1.705-14.685,4.486-21.247,8.437c-9.164-7.677-18.996-11.917-29.496-12.632c-14.819-0.998-28.467,4.787-40.938,18.827 C6.445,96.182,0,114.867,0,136.242c-0.007,6.371,0.674,12.646,2.053,18.738c4.593,22.785,15.398,41.367,32.558,55.344 c15.43,12.773,29.901,18.023,43.362,16.981c7.074-0.561,13.624-3.977,19.685-10.192c10.534,5.49,20.391,8.217,29.561,8.203 c9.856-0.012,20.236-2.953,31.125-8.898c6.227,6.692,12.966,10.346,20.211,10.933c13.795,1.073,28.614-4.111,44.377-16.84 c17.49-14.104,28.043-32.79,31.796-55.485c0.836-5.624,1.272-11.292,1.272-16.966C255.998,115.814,249.707,96.601,237.062,81.761z  M54.795,97.7l40.661,14.496c-4.402,8.811-10.766,13.219-19.06,13.219c-2.542,0-4.917-0.419-7.122-1.274 C58.103,118.38,53.263,109.572,54.795,97.7z M150.613,185.396l-9.156-8.389l-7.619,12.951c-3.391,0.341-6.615,0.514-9.665,0.514 c-4.401,0-8.635-0.263-12.708-0.777l-8.634-14.973l-9.151,9.909c-4.91-2.717-9.15-5.856-12.708-9.413 c-8.81-8.295-13.384-17.959-13.727-28.97c2.877,1.692,7.427,3.461,13.675,5.308l10.636,13.629l9.44-9.852 c4.734,0.702,9.234,1.12,13.466,1.275l10.689,11.498l9.671-11.949c3.559-0.173,7.285-0.515,11.182-1.01l9.924,10.159l10.933-14.227 c5.931-1.351,11.196-2.798,15.771-4.323C179.747,163.538,169.068,176.414,150.613,185.396z M175.258,124.907 c-2.209,0.849-4.66,1.273-7.369,1.273c-8.134,0-14.489-4.415-19.052-13.224l40.905-14.477 C191.105,110.331,186.273,119.141,175.258,124.907z",
            "smooth": false
        },
        "radar": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": "3"
                }
            },
            "symbolSize": "8",
            "symbol": "path://M237.062,81.761L237.062,81.761c-12.144-14.24-25.701-20.1-40.68-19.072 c-10.843,0.747-20.938,5.154-30.257,13.127c-9.51-5.843-19.8-9.227-30.859-10.366c0.521-3.197,1.46-6.306,2.85-9.363 c3.458-7.038,8.907-12.741,16.331-17.296c-5.609-3.384-11.227-6.799-16.854-10.279c-16.257,8.104-25.06,20.601-26.463,38.417 c-7.599,1.705-14.685,4.486-21.247,8.437c-9.164-7.677-18.996-11.917-29.496-12.632c-14.819-0.998-28.467,4.787-40.938,18.827 C6.445,96.182,0,114.867,0,136.242c-0.007,6.371,0.674,12.646,2.053,18.738c4.593,22.785,15.398,41.367,32.558,55.344 c15.43,12.773,29.901,18.023,43.362,16.981c7.074-0.561,13.624-3.977,19.685-10.192c10.534,5.49,20.391,8.217,29.561,8.203 c9.856-0.012,20.236-2.953,31.125-8.898c6.227,6.692,12.966,10.346,20.211,10.933c13.795,1.073,28.614-4.111,44.377-16.84 c17.49-14.104,28.043-32.79,31.796-55.485c0.836-5.624,1.272-11.292,1.272-16.966C255.998,115.814,249.707,96.601,237.062,81.761z  M54.795,97.7l40.661,14.496c-4.402,8.811-10.766,13.219-19.06,13.219c-2.542,0-4.917-0.419-7.122-1.274 C58.103,118.38,53.263,109.572,54.795,97.7z M150.613,185.396l-9.156-8.389l-7.619,12.951c-3.391,0.341-6.615,0.514-9.665,0.514 c-4.401,0-8.635-0.263-12.708-0.777l-8.634-14.973l-9.151,9.909c-4.91-2.717-9.15-5.856-12.708-9.413 c-8.81-8.295-13.384-17.959-13.727-28.97c2.877,1.692,7.427,3.461,13.675,5.308l10.636,13.629l9.44-9.852 c4.734,0.702,9.234,1.12,13.466,1.275l10.689,11.498l9.671-11.949c3.559-0.173,7.285-0.515,11.182-1.01l9.924,10.159l10.933-14.227 c5.931-1.351,11.196-2.798,15.771-4.323C179.747,163.538,169.068,176.414,150.613,185.396z M175.258,124.907 c-2.209,0.849-4.66,1.273-7.369,1.273c-8.134,0-14.489-4.415-19.052-13.224l40.905-14.477 C191.105,110.331,186.273,119.141,175.258,124.907z",
            "smooth": false
        },
        "bar": {
            "itemStyle": {
                "normal": {
                    "barBorderWidth": "0",
                    "barBorderColor": "#ccc"
                },
                "emphasis": {
                    "barBorderWidth": "0",
                    "barBorderColor": "#ccc"
                }
            }
        },
        "pie": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            },
            "symbol": "path://M237.062,81.761L237.062,81.761c-12.144-14.24-25.701-20.1-40.68-19.072 c-10.843,0.747-20.938,5.154-30.257,13.127c-9.51-5.843-19.8-9.227-30.859-10.366c0.521-3.197,1.46-6.306,2.85-9.363 c3.458-7.038,8.907-12.741,16.331-17.296c-5.609-3.384-11.227-6.799-16.854-10.279c-16.257,8.104-25.06,20.601-26.463,38.417 c-7.599,1.705-14.685,4.486-21.247,8.437c-9.164-7.677-18.996-11.917-29.496-12.632c-14.819-0.998-28.467,4.787-40.938,18.827 C6.445,96.182,0,114.867,0,136.242c-0.007,6.371,0.674,12.646,2.053,18.738c4.593,22.785,15.398,41.367,32.558,55.344 c15.43,12.773,29.901,18.023,43.362,16.981c7.074-0.561,13.624-3.977,19.685-10.192c10.534,5.49,20.391,8.217,29.561,8.203 c9.856-0.012,20.236-2.953,31.125-8.898c6.227,6.692,12.966,10.346,20.211,10.933c13.795,1.073,28.614-4.111,44.377-16.84 c17.49-14.104,28.043-32.79,31.796-55.485c0.836-5.624,1.272-11.292,1.272-16.966C255.998,115.814,249.707,96.601,237.062,81.761z  M54.795,97.7l40.661,14.496c-4.402,8.811-10.766,13.219-19.06,13.219c-2.542,0-4.917-0.419-7.122-1.274 C58.103,118.38,53.263,109.572,54.795,97.7z M150.613,185.396l-9.156-8.389l-7.619,12.951c-3.391,0.341-6.615,0.514-9.665,0.514 c-4.401,0-8.635-0.263-12.708-0.777l-8.634-14.973l-9.151,9.909c-4.91-2.717-9.15-5.856-12.708-9.413 c-8.81-8.295-13.384-17.959-13.727-28.97c2.877,1.692,7.427,3.461,13.675,5.308l10.636,13.629l9.44-9.852 c4.734,0.702,9.234,1.12,13.466,1.275l10.689,11.498l9.671-11.949c3.559-0.173,7.285-0.515,11.182-1.01l9.924,10.159l10.933-14.227 c5.931-1.351,11.196-2.798,15.771-4.323C179.747,163.538,169.068,176.414,150.613,185.396z M175.258,124.907 c-2.209,0.849-4.66,1.273-7.369,1.273c-8.134,0-14.489-4.415-19.052-13.224l40.905-14.477 C191.105,110.331,186.273,119.141,175.258,124.907z"
        },
        "scatter": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            },
            "symbol": "path://M237.062,81.761L237.062,81.761c-12.144-14.24-25.701-20.1-40.68-19.072 c-10.843,0.747-20.938,5.154-30.257,13.127c-9.51-5.843-19.8-9.227-30.859-10.366c0.521-3.197,1.46-6.306,2.85-9.363 c3.458-7.038,8.907-12.741,16.331-17.296c-5.609-3.384-11.227-6.799-16.854-10.279c-16.257,8.104-25.06,20.601-26.463,38.417 c-7.599,1.705-14.685,4.486-21.247,8.437c-9.164-7.677-18.996-11.917-29.496-12.632c-14.819-0.998-28.467,4.787-40.938,18.827 C6.445,96.182,0,114.867,0,136.242c-0.007,6.371,0.674,12.646,2.053,18.738c4.593,22.785,15.398,41.367,32.558,55.344 c15.43,12.773,29.901,18.023,43.362,16.981c7.074-0.561,13.624-3.977,19.685-10.192c10.534,5.49,20.391,8.217,29.561,8.203 c9.856-0.012,20.236-2.953,31.125-8.898c6.227,6.692,12.966,10.346,20.211,10.933c13.795,1.073,28.614-4.111,44.377-16.84 c17.49-14.104,28.043-32.79,31.796-55.485c0.836-5.624,1.272-11.292,1.272-16.966C255.998,115.814,249.707,96.601,237.062,81.761z  M54.795,97.7l40.661,14.496c-4.402,8.811-10.766,13.219-19.06,13.219c-2.542,0-4.917-0.419-7.122-1.274 C58.103,118.38,53.263,109.572,54.795,97.7z M150.613,185.396l-9.156-8.389l-7.619,12.951c-3.391,0.341-6.615,0.514-9.665,0.514 c-4.401,0-8.635-0.263-12.708-0.777l-8.634-14.973l-9.151,9.909c-4.91-2.717-9.15-5.856-12.708-9.413 c-8.81-8.295-13.384-17.959-13.727-28.97c2.877,1.692,7.427,3.461,13.675,5.308l10.636,13.629l9.44-9.852 c4.734,0.702,9.234,1.12,13.466,1.275l10.689,11.498l9.671-11.949c3.559-0.173,7.285-0.515,11.182-1.01l9.924,10.159l10.933-14.227 c5.931-1.351,11.196-2.798,15.771-4.323C179.747,163.538,169.068,176.414,150.613,185.396z M175.258,124.907 c-2.209,0.849-4.66,1.273-7.369,1.273c-8.134,0-14.489-4.415-19.052-13.224l40.905-14.477 C191.105,110.331,186.273,119.141,175.258,124.907z"
        },
        "boxplot": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            },
            "symbol": "path://M237.062,81.761L237.062,81.761c-12.144-14.24-25.701-20.1-40.68-19.072 c-10.843,0.747-20.938,5.154-30.257,13.127c-9.51-5.843-19.8-9.227-30.859-10.366c0.521-3.197,1.46-6.306,2.85-9.363 c3.458-7.038,8.907-12.741,16.331-17.296c-5.609-3.384-11.227-6.799-16.854-10.279c-16.257,8.104-25.06,20.601-26.463,38.417 c-7.599,1.705-14.685,4.486-21.247,8.437c-9.164-7.677-18.996-11.917-29.496-12.632c-14.819-0.998-28.467,4.787-40.938,18.827 C6.445,96.182,0,114.867,0,136.242c-0.007,6.371,0.674,12.646,2.053,18.738c4.593,22.785,15.398,41.367,32.558,55.344 c15.43,12.773,29.901,18.023,43.362,16.981c7.074-0.561,13.624-3.977,19.685-10.192c10.534,5.49,20.391,8.217,29.561,8.203 c9.856-0.012,20.236-2.953,31.125-8.898c6.227,6.692,12.966,10.346,20.211,10.933c13.795,1.073,28.614-4.111,44.377-16.84 c17.49-14.104,28.043-32.79,31.796-55.485c0.836-5.624,1.272-11.292,1.272-16.966C255.998,115.814,249.707,96.601,237.062,81.761z  M54.795,97.7l40.661,14.496c-4.402,8.811-10.766,13.219-19.06,13.219c-2.542,0-4.917-0.419-7.122-1.274 C58.103,118.38,53.263,109.572,54.795,97.7z M150.613,185.396l-9.156-8.389l-7.619,12.951c-3.391,0.341-6.615,0.514-9.665,0.514 c-4.401,0-8.635-0.263-12.708-0.777l-8.634-14.973l-9.151,9.909c-4.91-2.717-9.15-5.856-12.708-9.413 c-8.81-8.295-13.384-17.959-13.727-28.97c2.877,1.692,7.427,3.461,13.675,5.308l10.636,13.629l9.44-9.852 c4.734,0.702,9.234,1.12,13.466,1.275l10.689,11.498l9.671-11.949c3.559-0.173,7.285-0.515,11.182-1.01l9.924,10.159l10.933-14.227 c5.931-1.351,11.196-2.798,15.771-4.323C179.747,163.538,169.068,176.414,150.613,185.396z M175.258,124.907 c-2.209,0.849-4.66,1.273-7.369,1.273c-8.134,0-14.489-4.415-19.052-13.224l40.905-14.477 C191.105,110.331,186.273,119.141,175.258,124.907z"
        },
        "parallel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            },
            "symbol": "path://M237.062,81.761L237.062,81.761c-12.144-14.24-25.701-20.1-40.68-19.072 c-10.843,0.747-20.938,5.154-30.257,13.127c-9.51-5.843-19.8-9.227-30.859-10.366c0.521-3.197,1.46-6.306,2.85-9.363 c3.458-7.038,8.907-12.741,16.331-17.296c-5.609-3.384-11.227-6.799-16.854-10.279c-16.257,8.104-25.06,20.601-26.463,38.417 c-7.599,1.705-14.685,4.486-21.247,8.437c-9.164-7.677-18.996-11.917-29.496-12.632c-14.819-0.998-28.467,4.787-40.938,18.827 C6.445,96.182,0,114.867,0,136.242c-0.007,6.371,0.674,12.646,2.053,18.738c4.593,22.785,15.398,41.367,32.558,55.344 c15.43,12.773,29.901,18.023,43.362,16.981c7.074-0.561,13.624-3.977,19.685-10.192c10.534,5.49,20.391,8.217,29.561,8.203 c9.856-0.012,20.236-2.953,31.125-8.898c6.227,6.692,12.966,10.346,20.211,10.933c13.795,1.073,28.614-4.111,44.377-16.84 c17.49-14.104,28.043-32.79,31.796-55.485c0.836-5.624,1.272-11.292,1.272-16.966C255.998,115.814,249.707,96.601,237.062,81.761z  M54.795,97.7l40.661,14.496c-4.402,8.811-10.766,13.219-19.06,13.219c-2.542,0-4.917-0.419-7.122-1.274 C58.103,118.38,53.263,109.572,54.795,97.7z M150.613,185.396l-9.156-8.389l-7.619,12.951c-3.391,0.341-6.615,0.514-9.665,0.514 c-4.401,0-8.635-0.263-12.708-0.777l-8.634-14.973l-9.151,9.909c-4.91-2.717-9.15-5.856-12.708-9.413 c-8.81-8.295-13.384-17.959-13.727-28.97c2.877,1.692,7.427,3.461,13.675,5.308l10.636,13.629l9.44-9.852 c4.734,0.702,9.234,1.12,13.466,1.275l10.689,11.498l9.671-11.949c3.559-0.173,7.285-0.515,11.182-1.01l9.924,10.159l10.933-14.227 c5.931-1.351,11.196-2.798,15.771-4.323C179.747,163.538,169.068,176.414,150.613,185.396z M175.258,124.907 c-2.209,0.849-4.66,1.273-7.369,1.273c-8.134,0-14.489-4.415-19.052-13.224l40.905-14.477 C191.105,110.331,186.273,119.141,175.258,124.907z"
        },
        "sankey": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            },
            "symbol": "path://M237.062,81.761L237.062,81.761c-12.144-14.24-25.701-20.1-40.68-19.072 c-10.843,0.747-20.938,5.154-30.257,13.127c-9.51-5.843-19.8-9.227-30.859-10.366c0.521-3.197,1.46-6.306,2.85-9.363 c3.458-7.038,8.907-12.741,16.331-17.296c-5.609-3.384-11.227-6.799-16.854-10.279c-16.257,8.104-25.06,20.601-26.463,38.417 c-7.599,1.705-14.685,4.486-21.247,8.437c-9.164-7.677-18.996-11.917-29.496-12.632c-14.819-0.998-28.467,4.787-40.938,18.827 C6.445,96.182,0,114.867,0,136.242c-0.007,6.371,0.674,12.646,2.053,18.738c4.593,22.785,15.398,41.367,32.558,55.344 c15.43,12.773,29.901,18.023,43.362,16.981c7.074-0.561,13.624-3.977,19.685-10.192c10.534,5.49,20.391,8.217,29.561,8.203 c9.856-0.012,20.236-2.953,31.125-8.898c6.227,6.692,12.966,10.346,20.211,10.933c13.795,1.073,28.614-4.111,44.377-16.84 c17.49-14.104,28.043-32.79,31.796-55.485c0.836-5.624,1.272-11.292,1.272-16.966C255.998,115.814,249.707,96.601,237.062,81.761z  M54.795,97.7l40.661,14.496c-4.402,8.811-10.766,13.219-19.06,13.219c-2.542,0-4.917-0.419-7.122-1.274 C58.103,118.38,53.263,109.572,54.795,97.7z M150.613,185.396l-9.156-8.389l-7.619,12.951c-3.391,0.341-6.615,0.514-9.665,0.514 c-4.401,0-8.635-0.263-12.708-0.777l-8.634-14.973l-9.151,9.909c-4.91-2.717-9.15-5.856-12.708-9.413 c-8.81-8.295-13.384-17.959-13.727-28.97c2.877,1.692,7.427,3.461,13.675,5.308l10.636,13.629l9.44-9.852 c4.734,0.702,9.234,1.12,13.466,1.275l10.689,11.498l9.671-11.949c3.559-0.173,7.285-0.515,11.182-1.01l9.924,10.159l10.933-14.227 c5.931-1.351,11.196-2.798,15.771-4.323C179.747,163.538,169.068,176.414,150.613,185.396z M175.258,124.907 c-2.209,0.849-4.66,1.273-7.369,1.273c-8.134,0-14.489-4.415-19.052-13.224l40.905-14.477 C191.105,110.331,186.273,119.141,175.258,124.907z"
        },
        "funnel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            },
            "symbol": "path://M237.062,81.761L237.062,81.761c-12.144-14.24-25.701-20.1-40.68-19.072 c-10.843,0.747-20.938,5.154-30.257,13.127c-9.51-5.843-19.8-9.227-30.859-10.366c0.521-3.197,1.46-6.306,2.85-9.363 c3.458-7.038,8.907-12.741,16.331-17.296c-5.609-3.384-11.227-6.799-16.854-10.279c-16.257,8.104-25.06,20.601-26.463,38.417 c-7.599,1.705-14.685,4.486-21.247,8.437c-9.164-7.677-18.996-11.917-29.496-12.632c-14.819-0.998-28.467,4.787-40.938,18.827 C6.445,96.182,0,114.867,0,136.242c-0.007,6.371,0.674,12.646,2.053,18.738c4.593,22.785,15.398,41.367,32.558,55.344 c15.43,12.773,29.901,18.023,43.362,16.981c7.074-0.561,13.624-3.977,19.685-10.192c10.534,5.49,20.391,8.217,29.561,8.203 c9.856-0.012,20.236-2.953,31.125-8.898c6.227,6.692,12.966,10.346,20.211,10.933c13.795,1.073,28.614-4.111,44.377-16.84 c17.49-14.104,28.043-32.79,31.796-55.485c0.836-5.624,1.272-11.292,1.272-16.966C255.998,115.814,249.707,96.601,237.062,81.761z  M54.795,97.7l40.661,14.496c-4.402,8.811-10.766,13.219-19.06,13.219c-2.542,0-4.917-0.419-7.122-1.274 C58.103,118.38,53.263,109.572,54.795,97.7z M150.613,185.396l-9.156-8.389l-7.619,12.951c-3.391,0.341-6.615,0.514-9.665,0.514 c-4.401,0-8.635-0.263-12.708-0.777l-8.634-14.973l-9.151,9.909c-4.91-2.717-9.15-5.856-12.708-9.413 c-8.81-8.295-13.384-17.959-13.727-28.97c2.877,1.692,7.427,3.461,13.675,5.308l10.636,13.629l9.44-9.852 c4.734,0.702,9.234,1.12,13.466,1.275l10.689,11.498l9.671-11.949c3.559-0.173,7.285-0.515,11.182-1.01l9.924,10.159l10.933-14.227 c5.931-1.351,11.196-2.798,15.771-4.323C179.747,163.538,169.068,176.414,150.613,185.396z M175.258,124.907 c-2.209,0.849-4.66,1.273-7.369,1.273c-8.134,0-14.489-4.415-19.052-13.224l40.905-14.477 C191.105,110.331,186.273,119.141,175.258,124.907z"
        },
        "gauge": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            },
            "symbol": "path://M237.062,81.761L237.062,81.761c-12.144-14.24-25.701-20.1-40.68-19.072 c-10.843,0.747-20.938,5.154-30.257,13.127c-9.51-5.843-19.8-9.227-30.859-10.366c0.521-3.197,1.46-6.306,2.85-9.363 c3.458-7.038,8.907-12.741,16.331-17.296c-5.609-3.384-11.227-6.799-16.854-10.279c-16.257,8.104-25.06,20.601-26.463,38.417 c-7.599,1.705-14.685,4.486-21.247,8.437c-9.164-7.677-18.996-11.917-29.496-12.632c-14.819-0.998-28.467,4.787-40.938,18.827 C6.445,96.182,0,114.867,0,136.242c-0.007,6.371,0.674,12.646,2.053,18.738c4.593,22.785,15.398,41.367,32.558,55.344 c15.43,12.773,29.901,18.023,43.362,16.981c7.074-0.561,13.624-3.977,19.685-10.192c10.534,5.49,20.391,8.217,29.561,8.203 c9.856-0.012,20.236-2.953,31.125-8.898c6.227,6.692,12.966,10.346,20.211,10.933c13.795,1.073,28.614-4.111,44.377-16.84 c17.49-14.104,28.043-32.79,31.796-55.485c0.836-5.624,1.272-11.292,1.272-16.966C255.998,115.814,249.707,96.601,237.062,81.761z  M54.795,97.7l40.661,14.496c-4.402,8.811-10.766,13.219-19.06,13.219c-2.542,0-4.917-0.419-7.122-1.274 C58.103,118.38,53.263,109.572,54.795,97.7z M150.613,185.396l-9.156-8.389l-7.619,12.951c-3.391,0.341-6.615,0.514-9.665,0.514 c-4.401,0-8.635-0.263-12.708-0.777l-8.634-14.973l-9.151,9.909c-4.91-2.717-9.15-5.856-12.708-9.413 c-8.81-8.295-13.384-17.959-13.727-28.97c2.877,1.692,7.427,3.461,13.675,5.308l10.636,13.629l9.44-9.852 c4.734,0.702,9.234,1.12,13.466,1.275l10.689,11.498l9.671-11.949c3.559-0.173,7.285-0.515,11.182-1.01l9.924,10.159l10.933-14.227 c5.931-1.351,11.196-2.798,15.771-4.323C179.747,163.538,169.068,176.414,150.613,185.396z M175.258,124.907 c-2.209,0.849-4.66,1.273-7.369,1.273c-8.134,0-14.489-4.415-19.052-13.224l40.905-14.477 C191.105,110.331,186.273,119.141,175.258,124.907z"
        },
        "candlestick": {
            "itemStyle": {
                "normal": {
                    "color": "#ffee51",
                    "color0": "#ffffff",
                    "borderColor": "#ff715e",
                    "borderColor0": "#797fba",
                    "borderWidth": "1"
                }
            }
        },
        "graph": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "0",
                    "borderColor": "#ccc"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": "1",
                    "color": "#888888"
                }
            },
            "symbolSize": "8",
            "symbol": "path://M237.062,81.761L237.062,81.761c-12.144-14.24-25.701-20.1-40.68-19.072 c-10.843,0.747-20.938,5.154-30.257,13.127c-9.51-5.843-19.8-9.227-30.859-10.366c0.521-3.197,1.46-6.306,2.85-9.363 c3.458-7.038,8.907-12.741,16.331-17.296c-5.609-3.384-11.227-6.799-16.854-10.279c-16.257,8.104-25.06,20.601-26.463,38.417 c-7.599,1.705-14.685,4.486-21.247,8.437c-9.164-7.677-18.996-11.917-29.496-12.632c-14.819-0.998-28.467,4.787-40.938,18.827 C6.445,96.182,0,114.867,0,136.242c-0.007,6.371,0.674,12.646,2.053,18.738c4.593,22.785,15.398,41.367,32.558,55.344 c15.43,12.773,29.901,18.023,43.362,16.981c7.074-0.561,13.624-3.977,19.685-10.192c10.534,5.49,20.391,8.217,29.561,8.203 c9.856-0.012,20.236-2.953,31.125-8.898c6.227,6.692,12.966,10.346,20.211,10.933c13.795,1.073,28.614-4.111,44.377-16.84 c17.49-14.104,28.043-32.79,31.796-55.485c0.836-5.624,1.272-11.292,1.272-16.966C255.998,115.814,249.707,96.601,237.062,81.761z  M54.795,97.7l40.661,14.496c-4.402,8.811-10.766,13.219-19.06,13.219c-2.542,0-4.917-0.419-7.122-1.274 C58.103,118.38,53.263,109.572,54.795,97.7z M150.613,185.396l-9.156-8.389l-7.619,12.951c-3.391,0.341-6.615,0.514-9.665,0.514 c-4.401,0-8.635-0.263-12.708-0.777l-8.634-14.973l-9.151,9.909c-4.91-2.717-9.15-5.856-12.708-9.413 c-8.81-8.295-13.384-17.959-13.727-28.97c2.877,1.692,7.427,3.461,13.675,5.308l10.636,13.629l9.44-9.852 c4.734,0.702,9.234,1.12,13.466,1.275l10.689,11.498l9.671-11.949c3.559-0.173,7.285-0.515,11.182-1.01l9.924,10.159l10.933-14.227 c5.931-1.351,11.196-2.798,15.771-4.323C179.747,163.538,169.068,176.414,150.613,185.396z M175.258,124.907 c-2.209,0.849-4.66,1.273-7.369,1.273c-8.134,0-14.489-4.415-19.052-13.224l40.905-14.477 C191.105,110.331,186.273,119.141,175.258,124.907z",
            "smooth": false,
            "color": [
                "#ff715e",
                "#ffaf51",
                "#ffee51",
                "#8c6ac4",
                "#715c87"
            ],
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#333333"
                    }
                }
            }
        },
        "map": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#555555",
                    "borderColor": "#999999",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "rgba(255,175,81,0.5)",
                    "borderColor": "#ffaf51",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#ffffff"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgb(255,238,81)"
                    }
                }
            }
        },
        "geo": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#555555",
                    "borderColor": "#999999",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "rgba(255,175,81,0.5)",
                    "borderColor": "#ffaf51",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#ffffff"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgb(255,238,81)"
                    }
                }
            }
        },
        "categoryAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#666666"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#999999"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#555555"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "valueAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#666666"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#999999"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#555555"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "logAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#666666"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#999999"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#555555"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "timeAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#666666"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#999999"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#555555"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "toolbox": {
            "iconStyle": {
                "normal": {
                    "borderColor": "#999999"
                },
                "emphasis": {
                    "borderColor": "#666666"
                }
            }
        },
        "legend": {
            "textStyle": {
                "color": "#999999"
            }
        },
        "tooltip": {
            "axisPointer": {
                "lineStyle": {
                    "color": "#cccccc",
                    "width": 1
                },
                "crossStyle": {
                    "color": "#cccccc",
                    "width": 1
                }
            }
        },
        "timeline": {
            "lineStyle": {
                "color": "#ffaf51",
                "width": 1
            },
            "itemStyle": {
                "normal": {
                    "color": "#ffaf51",
                    "borderWidth": 1
                },
                "emphasis": {
                    "color": "#ffaf51"
                }
            },
            "controlStyle": {
                "normal": {
                    "color": "#ffaf51",
                    "borderColor": "#ffaf51",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "color": "#ffaf51",
                    "borderColor": "#ffaf51",
                    "borderWidth": 0.5
                }
            },
            "checkpointStyle": {
                "color": "#ff715e",
                "borderColor": "rgba(255,113,94,0.4)"
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#ff715e"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#ff715e"
                    }
                }
            }
        },
        "visualMap": {
            "color": [
                "#ff715e",
                "#ffee51",
                "#797fba"
            ]
        },
        "dataZoom": {
            "backgroundColor": "rgba(255,255,255,0)",
            "dataBackgroundColor": "rgba(222,222,222,1)",
            "fillerColor": "rgba(255,113,94,0.2)",
            "handleColor": "#cccccc",
            "handleSize": "100%",
            "textStyle": {
                "color": "#999999"
            }
        },
        "markPoint": {
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#333333"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#333333"
                    }
                }
            }
        }
    });
    echarts.registerTheme('roma', {
        "color": [
            "#9b8bba",
            "#e098c7",
            "#8fd3e8",
            "#71669e",
            "#cc70af",
            "#7cb4cc"
        ],
        "backgroundColor": "rgba(91,92,110,1)",
        "textStyle": {},
        "title": {
            "textStyle": {
                "color": "#ffffff"
            },
            "subtextStyle": {
                "color": "#cccccc"
            }
        },
        "line": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": "3"
                }
            },
            "symbolSize": "7",
            "symbol": "circle",
            "smooth": true
        },
        "radar": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": "3"
                }
            },
            "symbolSize": "7",
            "symbol": "circle",
            "smooth": true
        },
        "bar": {
            "itemStyle": {
                "normal": {
                    "barBorderWidth": 0,
                    "barBorderColor": "#ccc"
                },
                "emphasis": {
                    "barBorderWidth": 0,
                    "barBorderColor": "#ccc"
                }
            }
        },
        "pie": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "scatter": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "boxplot": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "parallel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "sankey": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "funnel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "gauge": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "candlestick": {
            "itemStyle": {
                "normal": {
                    "color": "#e098c7",
                    "color0": "transparent",
                    "borderColor": "#e098c7",
                    "borderColor0": "#8fd3e8",
                    "borderWidth": "2"
                }
            }
        },
        "graph": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": 1,
                    "color": "#aaaaaa"
                }
            },
            "symbolSize": "7",
            "symbol": "circle",
            "smooth": true,
            "color": [
                "#9b8bba",
                "#e098c7",
                "#8fd3e8",
                "#71669e",
                "#cc70af",
                "#7cb4cc"
            ],
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#eeeeee"
                    }
                }
            }
        },
        "map": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#eeeeee",
                    "borderColor": "#444444",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "rgba(224,152,199,1)",
                    "borderColor": "#444444",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#000000"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgb(255,255,255)"
                    }
                }
            }
        },
        "geo": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#eeeeee",
                    "borderColor": "#444444",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "rgba(224,152,199,1)",
                    "borderColor": "#444444",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#000000"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgb(255,255,255)"
                    }
                }
            }
        },
        "categoryAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#cccccc"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#cccccc"
                }
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#eeeeee",
                        "#333333"
                    ]
                }
            },
            "splitArea": {
                "show": true,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "valueAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#cccccc"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#cccccc"
                }
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#eeeeee",
                        "#333333"
                    ]
                }
            },
            "splitArea": {
                "show": true,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "logAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#cccccc"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#cccccc"
                }
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#eeeeee",
                        "#333333"
                    ]
                }
            },
            "splitArea": {
                "show": true,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "timeAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#cccccc"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#cccccc"
                }
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#eeeeee",
                        "#333333"
                    ]
                }
            },
            "splitArea": {
                "show": true,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "toolbox": {
            "iconStyle": {
                "normal": {
                    "borderColor": "#999999"
                },
                "emphasis": {
                    "borderColor": "#666666"
                }
            }
        },
        "legend": {
            "textStyle": {
                "color": "#cccccc"
            }
        },
        "tooltip": {
            "axisPointer": {
                "lineStyle": {
                    "color": "#cccccc",
                    "width": 1
                },
                "crossStyle": {
                    "color": "#cccccc",
                    "width": 1
                }
            }
        },
        "timeline": {
            "lineStyle": {
                "color": "#8fd3e8",
                "width": 1
            },
            "itemStyle": {
                "normal": {
                    "color": "#8fd3e8",
                    "borderWidth": 1
                },
                "emphasis": {
                    "color": "#8fd3e8"
                }
            },
            "controlStyle": {
                "normal": {
                    "color": "#8fd3e8",
                    "borderColor": "#8fd3e8",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "color": "#8fd3e8",
                    "borderColor": "#8fd3e8",
                    "borderWidth": 0.5
                }
            },
            "checkpointStyle": {
                "color": "#8fd3e8",
                "borderColor": "rgba(138,124,168,0.37)"
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#8fd3e8"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#8fd3e8"
                    }
                }
            }
        },
        "visualMap": {
            "color": [
                "#8a7ca8",
                "#e098c7",
                "#cceffa"
            ]
        },
        "dataZoom": {
            "backgroundColor": "rgba(0,0,0,0)",
            "dataBackgroundColor": "rgba(255,255,255,0.3)",
            "fillerColor": "rgba(167,183,204,0.4)",
            "handleColor": "#a7b7cc",
            "handleSize": "100%",
            "textStyle": {
                "color": "#333333"
            }
        },
        "markPoint": {
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#eeeeee"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#eeeeee"
                    }
                }
            }
        }
    });
    echarts.registerTheme('basic', {
        "color": [
            "#59c4e6",
            "#fbcb30",
            "#f75942",
            "#af62fc",
            "#6bd7c6",
            "#fca123",
            "#e5845f",
            "#ca8d38",
            "#af936b",
            "#ffcfbd"
        ],
        "backgroundColor": "rgba(255,255,255,0)",
        "textStyle": {},
        "title": {
            "textStyle": {
                "color": "#329dff"
            },
            "subtextStyle": {
                "color": "#93c5ff"
            }
        },
        "line": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": "2"
                }
            },
            "symbolSize": "6",
            "symbol": "emptyCircle",
            "smooth": true
        },
        "radar": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": "2"
                }
            },
            "symbolSize": "6",
            "symbol": "emptyCircle",
            "smooth": true
        },
        "bar": {
            "itemStyle": {
                "normal": {
                    "barBorderWidth": "2",
                    "barBorderColor": "#ffffff"
                },
                "emphasis": {
                    "barBorderWidth": "2",
                    "barBorderColor": "#ffffff"
                }
            }
        },
        "pie": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                },
                "emphasis": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                }
            }
        },
        "scatter": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                },
                "emphasis": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                }
            }
        },
        "boxplot": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                },
                "emphasis": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                }
            }
        },
        "parallel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                },
                "emphasis": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                }
            }
        },
        "sankey": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                },
                "emphasis": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                }
            }
        },
        "funnel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                },
                "emphasis": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                }
            }
        },
        "gauge": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                },
                "emphasis": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                }
            }
        },
        "candlestick": {
            "itemStyle": {
                "normal": {
                    "color": "#edafda",
                    "color0": "transparent",
                    "borderColor": "#d680bc",
                    "borderColor0": "#8fd3e8",
                    "borderWidth": "2"
                }
            }
        },
        "graph": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2",
                    "borderColor": "#ffffff"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": 1,
                    "color": "#aaaaaa"
                }
            },
            "symbolSize": "6",
            "symbol": "emptyCircle",
            "smooth": true,
            "color": [
                "#59c4e6",
                "#fbcb30",
                "#f75942",
                "#af62fc",
                "#6bd7c6",
                "#ffcfbd"
            ],
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#eeeeee"
                    }
                }
            }
        },
        "map": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#f3f3f3",
                    "borderColor": "#516b91",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "rgba(165,231,240,1)",
                    "borderColor": "#516b91",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#777da6"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgb(81,107,145)"
                    }
                }
            }
        },
        "geo": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#f3f3f3",
                    "borderColor": "#516b91",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "rgba(165,231,240,1)",
                    "borderColor": "#516b91",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#777da6"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgb(81,107,145)"
                    }
                }
            }
        },
        "categoryAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#656565"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#656565"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#eeeeee"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "valueAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#656565"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#656565"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#eeeeee"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "logAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#656565"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#656565"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#eeeeee"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "timeAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#656565"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#656565"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#eeeeee"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "toolbox": {
            "iconStyle": {
                "normal": {
                    "borderColor": "#656565"
                },
                "emphasis": {
                    "borderColor": "#666666"
                }
            }
        },
        "legend": {
            "textStyle": {
                "color": "#656565"
            }
        },
        "tooltip": {
            "axisPointer": {
                "lineStyle": {
                    "color": "#656565",
                    "width": 1
                },
                "crossStyle": {
                    "color": "#656565",
                    "width": 1
                }
            }
        },
        "timeline": {
            "lineStyle": {
                "color": "#8fd3e8",
                "width": 1
            },
            "itemStyle": {
                "normal": {
                    "color": "#8fd3e8",
                    "borderWidth": 1
                },
                "emphasis": {
                    "color": "#8fd3e8"
                }
            },
            "controlStyle": {
                "normal": {
                    "color": "#8fd3e8",
                    "borderColor": "#8fd3e8",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "color": "#8fd3e8",
                    "borderColor": "#8fd3e8",
                    "borderWidth": 0.5
                }
            },
            "checkpointStyle": {
                "color": "#8fd3e8",
                "borderColor": "rgba(138,124,168,0.37)"
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#8fd3e8"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#8fd3e8"
                    }
                }
            }
        },
        "visualMap": {
            "color": [
                "#fdcfe3",
                "#2a99c9",
                "#afe8ff"
            ]
        },
        "dataZoom": {
            "backgroundColor": "rgba(0,0,0,0)",
            "dataBackgroundColor": "rgba(255,255,255,0.3)",
            "fillerColor": "rgba(167,183,204,0.4)",
            "handleColor": "#a7b7cc",
            "handleSize": "100%",
            "textStyle": {
                "color": "#333333"
            }
        },
        "markPoint": {
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#eeeeee"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#eeeeee"
                    }
                }
            }
        }
    });
    echarts.registerTheme('purple', {
        "color": [
            "#a999c8",
            "#a563ab",
            "#725fae",
            "#d5c6db",
            "#bd7bc3",
            "#bc5fca",
            "#907ce7",
            "#e13bfe",
            "#cb91fc",
            "#e987f7"
        ],
        "backgroundColor": "rgba(215,153,153,0)",
        "textStyle": {},
        "title": {
            "textStyle": {
                "color": "#333"
            },
            "subtextStyle": {
                "color": "#aaa"
            }
        },
        "line": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 1
                }
            },
            "lineStyle": {
                "normal": {
                    "width": 2
                }
            },
            "symbolSize": 4,
            "symbol": "emptyCircle",
            "smooth": false
        },
        "radar": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 1
                }
            },
            "lineStyle": {
                "normal": {
                    "width": 2
                }
            },
            "symbolSize": 4,
            "symbol": "emptyCircle",
            "smooth": false
        },
        "bar": {
            "itemStyle": {
                "normal": {
                    "barBorderWidth": 0,
                    "barBorderColor": "#ccc"
                },
                "emphasis": {
                    "barBorderWidth": 0,
                    "barBorderColor": "#ccc"
                }
            }
        },
        "pie": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "scatter": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "boxplot": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "parallel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "sankey": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "funnel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "gauge": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "candlestick": {
            "itemStyle": {
                "normal": {
                    "color": "#a563ab",
                    "color0": "#725fae",
                    "borderColor": "#a563ab",
                    "borderColor0": "#725fae",
                    "borderWidth": 1
                }
            }
        },
        "graph": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": 1,
                    "color": "#aaa"
                }
            },
            "symbolSize": 4,
            "symbol": "emptyCircle",
            "smooth": false,
            "color": [
                "#a999c8",
                "#a563ab",
                "#725fae",
                "#d5c6db",
                "#bd7bc3",
                "#bc5fca"
            ],
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#eee"
                    }
                }
            }
        },
        "map": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#eee",
                    "borderColor": "#444",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "rgba(213,198,219,1)",
                    "borderColor": "#777777",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#424242"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgb(47,47,47)"
                    }
                }
            }
        },
        "geo": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#eee",
                    "borderColor": "#444",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "rgba(213,198,219,1)",
                    "borderColor": "#777777",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#424242"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgb(47,47,47)"
                    }
                }
            }
        },
        "categoryAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#333"
                }
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#ccc"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "valueAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#333"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#ccc"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "logAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#333"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#ccc"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "timeAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#333"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#ccc"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "toolbox": {
            "iconStyle": {
                "normal": {
                    "borderColor": "#999"
                },
                "emphasis": {
                    "borderColor": "#666"
                }
            }
        },
        "legend": {
            "textStyle": {
                "color": "#333"
            }
        },
        "tooltip": {
            "axisPointer": {
                "lineStyle": {
                    "color": "#ccc",
                    "width": 1
                },
                "crossStyle": {
                    "color": "#ccc",
                    "width": 1
                }
            }
        },
        "timeline": {
            "lineStyle": {
                "color": "#293c55",
                "width": 1
            },
            "itemStyle": {
                "normal": {
                    "color": "#293c55",
                    "borderWidth": 1
                },
                "emphasis": {
                    "color": "#725fae"
                }
            },
            "controlStyle": {
                "normal": {
                    "color": "#293c55",
                    "borderColor": "#293c55",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "color": "#293c55",
                    "borderColor": "#293c55",
                    "borderWidth": 0.5
                }
            },
            "checkpointStyle": {
                "color": "#a563ab",
                "borderColor": "rgba(169,153,200,1)"
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#293c55"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#293c55"
                    }
                }
            }
        },
        "visualMap": {
            "color": [
                "#725fae",
                "#a563ab",
                "#a999c8"
            ]
        },
        "dataZoom": {
            "backgroundColor": "rgba(47,69,84,0)",
            "dataBackgroundColor": "rgba(47,69,84,0.3)",
            "fillerColor": "rgba(167,183,204,0.4)",
            "handleColor": "#a7b7cc",
            "handleSize": "100%",
            "textStyle": {
                "color": "#333"
            }
        },
        "markPoint": {
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#eee"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#eee"
                    }
                }
            }
        }
    });
    echarts.registerTheme('vintage', {
        "color": [
            "#00d0dd",
            "#0082d2",
            "#d33756",
            "#416a71",
            "#fdca00",
            "#9c5dc6",
            "#f17d37",
            "#46cc78",
            "#d32f8c",
            "#d7d7d7"
        ],
        "backgroundColor": "rgba(5,26,47,0.5)",
        "textStyle": {},
        "title": {
            "textStyle": {
                "color": "#ffffff"
            },
            "subtextStyle": {
                "color": "#eff9fa"
            }
        },
        "line": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": "3"
                }
            },
            "symbolSize": "7",
            "symbol": "circle",
            "smooth": true
        },
        "radar": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "2"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": "3"
                }
            },
            "symbolSize": "7",
            "symbol": "circle",
            "smooth": true
        },
        "bar": {
            "itemStyle": {
                "normal": {
                    "barBorderWidth": 0,
                    "barBorderColor": "#ccc"
                },
                "emphasis": {
                    "barBorderWidth": 0,
                    "barBorderColor": "#ccc"
                }
            }
        },
        "pie": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "scatter": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "boxplot": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "parallel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "sankey": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "funnel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "gauge": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "candlestick": {
            "itemStyle": {
                "normal": {
                    "color": "#e098c7",
                    "color0": "transparent",
                    "borderColor": "#e098c7",
                    "borderColor0": "#8fd3e8",
                    "borderWidth": "2"
                }
            }
        },
        "graph": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": 1,
                    "color": "#aaaaaa"
                }
            },
            "symbolSize": "7",
            "symbol": "circle",
            "smooth": true,
            "color": [
                "#9b8bba",
                "#e098c7",
                "#8fd3e8",
                "#71669e",
                "#cc70af",
                "#7cb4cc"
            ],
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#eeeeee"
                    }
                }
            }
        },
        "map": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#eeeeee",
                    "borderColor": "#444444",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "rgba(224,152,199,1)",
                    "borderColor": "#444444",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#000000"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgb(255,255,255)"
                    }
                }
            }
        },
        "geo": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#eeeeee",
                    "borderColor": "#444444",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "rgba(224,152,199,1)",
                    "borderColor": "#444444",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#000000"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgb(255,255,255)"
                    }
                }
            }
        },
        "categoryAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#eff9fa"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#eff9fa"
                }
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#eeeeee",
                        "#333333"
                    ]
                }
            },
            "splitArea": {
                "show": true,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "valueAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#eff9fa"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#eff9fa"
                }
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#eeeeee",
                        "#333333"
                    ]
                }
            },
            "splitArea": {
                "show": true,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "logAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#eff9fa"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#eff9fa"
                }
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#eeeeee",
                        "#333333"
                    ]
                }
            },
            "splitArea": {
                "show": true,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "timeAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#eff9fa"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#eff9fa"
                }
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#eeeeee",
                        "#333333"
                    ]
                }
            },
            "splitArea": {
                "show": true,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "toolbox": {
            "iconStyle": {
                "normal": {
                    "borderColor": "#eff9fa"
                },
                "emphasis": {
                    "borderColor": "#666666"
                }
            }
        },
        "legend": {
            "textStyle": {
                "color": "#eff9fa"
            }
        },
        "tooltip": {
            "axisPointer": {
                "lineStyle": {
                    "color": "#eff9fa",
                    "width": 1
                },
                "crossStyle": {
                    "color": "#eff9fa",
                    "width": 1
                }
            }
        },
        "timeline": {
            "lineStyle": {
                "color": "#8fd3e8",
                "width": 1
            },
            "itemStyle": {
                "normal": {
                    "color": "#8fd3e8",
                    "borderWidth": 1
                },
                "emphasis": {
                    "color": "#8fd3e8"
                }
            },
            "controlStyle": {
                "normal": {
                    "color": "#8fd3e8",
                    "borderColor": "#8fd3e8",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "color": "#8fd3e8",
                    "borderColor": "#8fd3e8",
                    "borderWidth": 0.5
                }
            },
            "checkpointStyle": {
                "color": "#8fd3e8",
                "borderColor": "rgba(138,124,168,0.37)"
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#8fd3e8"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#8fd3e8"
                    }
                }
            }
        },
        "visualMap": {
            "color": [
                "#8a7ca8",
                "#e098c7",
                "#cceffa"
            ]
        },
        "dataZoom": {
            "backgroundColor": "rgba(0,0,0,0)",
            "dataBackgroundColor": "rgba(255,255,255,0.3)",
            "fillerColor": "rgba(167,183,204,0.4)",
            "handleColor": "#a7b7cc",
            "handleSize": "100%",
            "textStyle": {
                "color": "#333333"
            }
        },
        "markPoint": {
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#eeeeee"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#eeeeee"
                    }
                }
            }
        }
    });
}));




