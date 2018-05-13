angular.module("myApp",[])
    .controller("myCtrl",["$scope","$http","$location",function($scope,$http,$location){

        var params = $location.search();
        console.log(params);

        if(!params){
            window.location.href = "login.html";
        }else{
            var tea_id = params.tea_id
            $scope.name = "teacher" +tea_id ;
            var stu_id = params.stu_id;

            var assessmentId = "assessment_tea_id" + tea_id+"_stu_id"+stu_id;
            console.log(assessmentId);

            var scoreArr = getScoreArr(assessmentId);
            console.log("该老师对应的分数",scoreArr);

            var sum = 0;
            if(scoreArr){
                for(var i = 0;i<scoreArr.length;i++){
                    sum = sum + Number(scoreArr[i].score);
                }
                $scope.sum_score = sum;
            }

            var m = getM(tea_id,stu_id);
            $http.get("data/questions"+ m +".json")
                .then(function(data){
                    var questions = data.data.questions;
                    console.log("获取到随机的问题questions",questions);
                    var newArr = appendObj(scoreArr,questions);

                    $scope.questions = newArr;
                },function(err){
                    console.log(err)
                })

            $scope.logout = function(){
                window.location.href = "login.html"
            }
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

function getM(teaid,stuid){
    //获取试卷
    if(window.localStorage){
        var storage = window.localStorage;
        var item = storage.getItem("CourseAndExam");
        if(!item){
            // alert("您的学生还没有参加对您的评价");
            console.log("您的学生还没有参加对您的评价")
        }else{
            var jsonObj = JSON.parse(item);
            console.log("获取到所有的m",jsonObj);
            for(var i = 0;i<jsonObj.length;i++){
                if(jsonObj[i].tea_id == teaid && jsonObj[i].stu_id == stuid){
                    m = jsonObj[i].m;
                    return m;
                }
            }
        }
    }
}

function getScoreArr(assessmentId){
    //获取分数
    if(window.localStorage){
        var storage = window.localStorage;

        var item = storage.getItem(assessmentId);

        if(!item){
            alert("您的学生还没有参加对您的评价,所以你没有分数可显示");
            $(".returnMes").css("display","block");
            var time = $(".timeLeft").html();
            var timer = setInterval(function(){
                time -- ;
                $(".timeLeft").text(time);
                if(time<=0){
                    clearInterval(timer);
                    window.location.href = "login.html"
                }
            },1000)
        }else{
            var jsonObj = JSON.parse(item);
            return jsonObj;
        }
    }
}

function appendObj(arr1,arr2){
    var newArr = [];
    for(var i =0;i<arr1.length;i++){
        obj1 = $.extend(arr1[i],arr2[i]);
        newArr.push(obj1);
    }
    return newArr;
}