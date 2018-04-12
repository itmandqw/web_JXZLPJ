angular.module("myApp",[])
    .controller("myCtrl",["$scope","$http",function($scope,$http){
        // 都需要教师id
        // 根据localStorage中存储的数据CourseAndExam结果获取m得到试卷，  GET!!!
        // 获取到assessment+params 中的分数值填充到页面中
        var param = getUrlParams();
        var assessmentId = "assessment" + param;
        console.log(typeof assessmentId)

        getScoreArr(assessmentId);

        function getScoreArr(assessmentId){
            //获取分数
            if(window.localStorage){
                var storage = window.localStorage;
                console.log(assessmentId);

                var item = storage.getItem(assessmentId);

                if(!item){
                    alert("您的学生还没有参加对您的评价,所以你没有分数可显示");
                }else{
                    var jsonObj = JSON.parse(item);
                    console.log("获取到该教师对应的分数",jsonObj);
                    return jsonObj;
                }
            }
        }

        var m = getM(param);
        $http.get("data/questions"+ m +".json")
            .then(function(data){
                var questions = data.data.questions;
                $scope.questions = questions;
            },function(err){
                console.log(err)
            })

        // var arr = [];
        // var res;
        // $scope.radioChange = function(index){
        //     var score = this.a;
        //     console.log("第"+ index +"项的分数",score);
        //     arr.push({
        //         index:index,
        //         score:score
        //     })
        //     res = unique(arr);
        //     // res是最终分数值
        //     console.log("去重得到最新值的res",res);
        //
        //     storeLocal(param,res);
        // }


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
                alert("您已经完成了本次评价");
                setTimeout(function(){
                    window.location.href = "student.html?"+ param;
                },1000);
            }
        }

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

function getUrlParams(){
    var params = window.location.href;
    console.log(params)
    var param = params.split("?")[1];
    return param;
}

function storeLocal(param,res){
    if(window.localStorage){
        var storage = window.localStorage;
        console.log("转换之前",param,res)
        param = JSON.stringify("assessment" + param);
        res = JSON.stringify(res);
        console.log("转换之后",param,res);
        storage.setItem(param,res);

        var json = storage.getItem(param);
        var jsonObj = JSON.parse(json);
        console.log(jsonObj)
    }
}

function getM(param){
    //获取试卷
    if(window.localStorage){
        var storage = window.localStorage;
        var item = storage.getItem("CourseAndExam");
        if(!item){
            alert("您的学生还没有参加对您的评价")
        }else{
            var jsonObj = JSON.parse(item);
            console.log("获取到所有的m",jsonObj);
            for(var i = 0;i<jsonObj.length;i++){
                if(jsonObj[i].param == param){
                    m = jsonObj[i].m;
                    return m;
                }
            }
        }
    }
}
