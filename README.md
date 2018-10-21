# EchartsUtil
本工具是用于echarts进行数据可视化的图表制作，由于在项目开发中经常会重复书写大量的echarts相关代码，现将这些公共配置项和重复代码封装集成到这个辅助工具里面，只需要根据后台返回的数据形式调用相应的方法，传入一个data和DOM容器ID就能呈现图形，省去了诸多前后端数据处理的工作。此插件尚有诸多不足之处还请各位大牛指教，如有特定需求可以自行修改源码，若有好的想法和意见也非常欢迎反馈给我，如果觉得对你有一定的帮助，还请给个小星星（star）。

使用步骤：

1、引入echart4.0(可官网下载最新版)和echart-util.js文件；

     <script src="../src/echarts-4.0.js"></script>
     <script src="../echarts-util.js"></script>
   
2、定义一个图形dom容器；

      <echart id="chartid" width="100%" height="400px"></echart>
      
id必要属性，width、height不必要属性，根据需要可选择省略不写还是自定义

3、传入数据调用图形方法生成option；

    var option = zhuEcharts.line(data,3,"本月销售情况");
    
   option为echart的配置项，zhuEcharts为方法体，line表示生成线图的方法，传入的第一个参数为图形所需要的数据,必要参数，传入的第二个参数为图表类型，不必要参数（可选，1表示曲线，2表示折线面积，3表示曲线面积），传入的第三个参数为图表的标题，不必要参数（这个参数需要加双引号）
    
4、传入option和容器id调用绘制方法生成图表；

    var initChart = zhuEcharts.renderChart(option,"chartid","purple");　
  
   initChart是定义这个图表对象，方便后面操作，可不定义，renderChart为绘制图表方法，传入的第一个参数为上面方法返回的option，也可以自定义配置项或者对生成的option做相应的修改，必要参数，传入的第二个参数为DOM容器ID，必要参数（加双引号）,传入的第三个参数为图形需要引用的echart样式主题名称，不必要参数（加双引号,目前插件集成了5套主题样式供选择，basic常规色，dark深黑色，roma灰黑色，purple紫色，vintage蓝色）

