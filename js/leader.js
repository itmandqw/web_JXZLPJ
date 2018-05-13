angular.module("myApp",[])
.controller("myCtrl",["$http","$scope",function($http,$scope){
    var teacher_name = [];
    var teacher_score = [];
    var scoreAndNameObj = [];

    //需要的数据：被评价的教师姓名   及总分数  两个数组
    // 获取所有教师姓名组成数组
    $http.get("data/courseMess.json")
        .then(function(data){
            var datas = data.data.lists;

            //获取教师姓名组成数组
            for(var i=0;i<datas.length;i++){
                var item = datas[i].teacher_name;
                teacher_name.push(item);
            }
            console.log("teacher_name",teacher_name)

            // 获取被评价的教师总分数组成数组
            for(var j=0;j<datas.length;j++){
                var sumvalue = "";
                if(window.localStorage){
                    var storage = window.localStorage;
                    var res = storage.getItem("assessment"+j);
                    res1 = JSON.parse(res);
                    if(!res1){
                        sumvalue = 0;
                    }else{
                        sumvalue = getSum(res1);
                    }
                    teacher_score.push(sumvalue);
                }else{
                    console.log("浏览器不支持localStorage!请尝试使用最新版的chrome浏览器");
                }
            }
            console.log("teacher_score",teacher_score);

            //获取被评价的教师平均分组成数组
            if(window.localStorage){
                var avgvalue = "";
                var newArr = getNewArr();
                console.log("newArr",newArr);

                for(var i=0;i<newArr.length;i++){
                    for(var j=0;j<i;j++){
                        if(newArr[i].k == newArr[j].k){
                            console.log(i,j)
                        }
                    }
                }
                console.log("改变之后的newArr",newArr);

            }else{
                alert("浏览器不支持localStorage,请使用最新版的chrome浏览器");
            }


            //柱状图
            var myBarChart = echarts.init(document.getElementById('bar_chart'));
            // 指定图表的配置项和数据
            var option1 = {
                title: {
                    text: '教师综合评比表'
                },
                tooltip: {},
                legend: {
                    data:['平均分']
                },
                xAxis: {
                    type: 'category',
                    data: teacher_name
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '平均分',
                    type: 'bar',
                    data: teacher_score
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myBarChart.setOption(option1);
            myBarChart.on('click', function (params) {
                console.log('你点击的是: ' + params.name);
                for(var i=0;i<teacher_name.length;i++){
                    if(teacher_name[i] == params.name){
                        console.log(i);
                        if(window.localStorage){
                            var storage = window.localStorage;
                            var result = storage.getItem("assessment"+i);
                            var resultObj = []
                            resultObj = JSON.parse(result)
                            console.log("该教师分数分布resultObj",resultObj);

                            var singleScore = [];
                            for(var j=0;j<resultObj.length;j++){
                                singleScore.push(resultObj[j].score);
                            }
                            console.log("singleScore",singleScore);
                            var addedScore = addScore(singleScore);
                            console.log("addedScore",addedScore)

                            var nameObj = [
                                {name:'职业道德'},
                                {name:'学科知识'},
                                {name:'教学能力'},
                                {name:'文化素养'},
                                {name:'交往能力'},
                            ];
                            scoreAndNameObj = appendObj(addedScore,nameObj);
                            console.log(scoreAndNameObj)

                            // 饼状图
                            //需要的数据：被评价的教师姓名及分数分布构成一个对象组成一个数组
                            var myPieChart = echarts.init(document.getElementById('pie_chart'));
                            var option2 = {
                                title : {
                                    text: '教师的综合评价分布',
                                    subtext: params.name,
                                    x:'center'
                                },
                                tooltip : {
                                    trigger: 'item',
                                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                                },
                                legend: {
                                    orient: 'vertical',
                                    left: 'left',
                                    data: ['职业道德','学科知识','教学能力','文化素养','交往能力']
                                },
                                series : [
                                    {
                                        name: '访问来源',
                                        type: 'pie',
                                        radius : '55%',
                                        center: ['50%', '60%'],
                                        data: scoreAndNameObj,
                                        itemStyle: {
                                            emphasis: {
                                                shadowBlur: 10,
                                                shadowOffsetX: 0,
                                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                            }
                                        }
                                    }
                                ]
                            };
                            // 使用刚指定的配置项和数据显示图表。
                            myPieChart.setOption(option2);
                        }else{
                            console.log("浏览器不支持localStorage!");
                        }
                    }
                }
            });

        },function(){
            console.log("获取教师信息失败")
        })
    $scope.logout = function(){
        window.location.href = "login.html"
    }
}])

function getSum(res){
    var sum = 0;
    for(var i=0;i<res.length;i++){
        sum = sum + parseInt(res[i].score);
    }
    return sum;
}

function addScore(arr){
    var newArr = [];
        for(var i=0;i<arr.length/2;i++){
            newArr.push({"value": parseInt(arr[2*i])+parseInt(arr[2*i+1])});
        }
    return newArr
}

function appendObj(arr1,arr2){
    var newArr = [];
    for(var i =0;i<arr1.length;i++){
        obj1 = $.extend(arr1[i],arr2[i]);
        newArr.push(obj1);
    }
    return newArr;
}

function getNewArr(){
    var newArr = [];
    var storage = window.localStorage;
    //k代表teac ,j代表stu
    for(var k =0;k<10;k++){
        // console.log(k);
        for(var j=0;j<10;j++){
            var assessmentId = "assessment_tea_id"+ k + "_stu_id" + j;
            var res = storage.getItem(assessmentId);
            if(!res){
                avgvalue = 0;
            }else{
                var resArr = JSON.parse(res);
                res1 = getSum(resArr)
                // console.log(k,j,res1);
                newArr.push({
                    "k":k,
                    "j":j,
                    "sum":res1
                })
            }
        }
    }
    return newArr;
}