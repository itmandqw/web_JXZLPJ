angular.module("myApp",[])
    .controller("myCtrl",["$scope","$http","$location",function($scope,$http,$location){
        var lists = [];
        var tea_id;
        var params = $location.search();
        if(params.tea_id){
            tea_id = params.tea_id;
            $scope.name = "teacher" + tea_id;
        }
        if(window.localStorage){
            var storage = window.localStorage;
            for(var i=0;i<10;i++){
                var str = "assessment_tea_id"+tea_id+"_stu_id"+i;
                var stuNum =  storage.getItem(str);
                if(stuNum){
                    lists.push({
                        "stu_id":i
                    })
                }
            }
            console.log(lists);
            $scope.lists = lists;
            $scope.totalStu = lists.length;
        }else{
            alert("浏览器不支持localStorage,请尝试使用最新版的chrome浏览器");
        }
        $scope.urlHandle = function(i){
            $scope.linkUrl = "teacher_result.html?tea_id="+ tea_id +"&stu_id="+i;
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