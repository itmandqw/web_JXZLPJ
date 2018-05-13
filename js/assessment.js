angular.module("myApp",[])
.controller("myCtrl",["$scope","$http","$location",function($scope,$http,$location){
    // var params = getUrlParams();
    // console.log(params);     //例如id=2&stu_id=2,指的是所选的课程id
    var params = $location.search();
    console.log(params)

    var stu_id = params.stu_id;
    console.log(stu_id)
    $scope.name = "student" +stu_id ;

    var tea_id = params.tea_id;
    console.log(tea_id);

    // var param = getIdParam(params);
    var param = "tea_id"+tea_id+"_stu_id"+stu_id;
    console.log(param);
    var teacher = tea_id;

    var m = parseInt(Math.random()*3+1);   //m取值1-3,用于随机试卷
    console.log(m)
    $http.get("data/questions"+ m +".json")
        .then(function(data){
            console.log(data);
            var questions = data.data.questions;
            $scope.questions = questions;
        },function(err){
            console.log(err)
        })


    var arr = [];
    var res;
    $scope.radioChange = function(index){
        var score = this.a;
        console.log("第"+ index +"项的分数",score);
        arr.push({
            index:index,
            score:score
        })
        res = unique(arr);
        // res是最终分数值
        console.log("去重得到最新值的res",res);

        storeLocal(param,res);
        teacherScore(teacher,res)

    }

    $scope.tijiao = function(){
        var a1 = $("#question1").val();
        var a2 = $("#question2").val();
        var a3 = $("#question3").val();
        var a4 = $("#question4").val();
        var a5 = $("#question5").val();
        var a6 = $("#question6").val();
        var a7 = $("#question7").val();
        var a8 = $("#question8").val();
        var a9 = $("#question9").val();
        var a10 = $("#question10").val();

        if(a1=="" || a2=="" || a3=="" || a4=="" || a5=="" || a6=="" || a7=="" || a8=="" || a9=="" || a10==""){
            alert("请将问题填写完整!!!")
        }else{
            createCourseAndExamMark(stu_id,tea_id,m);

            alert("您已经完成了本次评价");
            setTimeout(function(){
                window.location.href = "student.html?tea_id="+tea_id+"&stu_id="+stu_id;
            },1000);
        }
    }

    $scope.logout = function(){
        window.location.href = "login.html"
    }

}])
    .config(['$locationProvider',function($locationProvider){
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        })
    }])
function unique(arr){

    var res = [arr[0]];

    for(var i=1;i<arr.length;i++){

        var repeat = false;

        for(var j=0;j<res.length;j++){
            if(arr[i].index == res[j].index){
                repeat = true;
                res[j].score = arr[i].score;
                break;
            }
        }
        if(!repeat){
            res.push(arr[i]);
        }

    }

    return res;

}



function storeLocal(param,res){
    if(window.localStorage){
        var storage = window.localStorage;

        param = "assessment_" + param;

        res = JSON.stringify(res);
        console.log("转换之后",param,res);
        storage.setItem(param,res);

        var json = storage.getItem(param);
        var jsonObj = JSON.parse(json);
        console.log(jsonObj)
    }
}

function createCourseAndExamMark(stu_id,tea_id,m){
    if(window.localStorage){
        var storage = window.localStorage;

        var item = storage.getItem("CourseAndExam");
        if(!item){
            console.log("没有课程与随机试卷的记录！");
            var CourseAndExam = [];
            CourseAndExam.push({
                "stu_id":stu_id,
                "tea_id":tea_id,
                "m":m
            });
            var CourseAndExamNO = JSON.stringify(CourseAndExam);
            storage.setItem("CourseAndExam",CourseAndExamNO);
            console.log("已加入投票的奇偶暗示id和随机的m试卷")
        }else{
            console.log("有课程与随机试卷的记录！")
            var json = storage.getItem("CourseAndExam");
            var jsonObj = JSON.parse(json);
            console.log("从localStroage中取出来的原来的记录",jsonObj);
            jsonObj.push({
                "stu_id":stu_id,
                "tea_id":tea_id,
                "m":m
            });
            var CourseAndExamYes = JSON.stringify(jsonObj);
            storage.setItem("CourseAndExam",CourseAndExamYes);
            console.log("新数据已加入")
        }
    }else{
        alert("浏览器不支持localStorage,请尝试使用最新版的chrome浏览器");
    }
}

function teacherScore(teacher,res){
    if(window.localStorage){
        var storage = window.localStorage;

        var param = "assessment" + teacher;

        res = JSON.stringify(res);
        console.log("转换之后",param,res);
        storage.setItem(param,res);

        var json = storage.getItem(param);
        var jsonObj = JSON.parse(json);
        console.log("存储的是教师的分数",jsonObj)
    }
}