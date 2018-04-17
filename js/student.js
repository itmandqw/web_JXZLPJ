angular.module("myApp",[])
.controller("myCtrl",["$scope","$http","$location",function($scope,$http,$location){
    var lists = [];
    var storageLists = [];
    var stu_id1;
    var params = $location.search();
    if(params.stu_id){
        stu_id1 = params.stu_id;
        $scope.name = "student" + stu_id1;
    }

    if(window.localStorage){
        console.log("浏览器支持localStorage");
        var storage = window.localStorage;
        var item = storage.getItem("courses");
        if(!item){
            //如果localStorage不存在，则请求数据进行储存操作
            console.log("localStorage不存在,请求数据进行储存操作")
            $http.get("data/courseMess.json",{
            })
                .then(function(data){
                    lists = data.data.lists;
                    storageLists = storeLocal(lists);
                    $scope.lists = storageLists;
                },function(err){
                    console.log(err)
                })
        }else{
            //如果localStorage存在，则使用localStorage的数据
            storageLists = getLocal();
            console.log("localStorage存在,使用localStorage的数据",storageLists)
            // 如果页面中带有参数，说明是从刚填完信息跳转回来的,把刚才填写的信息的那个科目设置为已完成

            if(params.id){
                var id = params.id;
                console.log(id);
                storageLists[id].status = true;
                console.log(storageLists)
                var changedList = JSON.stringify(storageLists);
                storage.setItem("courses",changedList)
            }
            $scope.lists = storageLists;
        }
    }
    $scope.urlHandle = function(i){
        console.log(i);
        if(storageLists[i].status){
            $scope.linkUrl = "###";
            alert("您已经完成该课程的评价");
        }else{
            $scope.linkUrl = "assessment.html?id="+ i + "&stu_id=" + stu_id1;
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

function storeLocal(lists){
    var storageLists = [];
    var storage = window.localStorage
    ;
    var data = JSON.stringify(lists);
    storage.setItem("courses",data);
    var json = storage.getItem("courses");
    storageLists = JSON.parse(json);

    console.log("取出刚刚存入本地的storageLists",storageLists);
    return storageLists;
}

function getLocal (){
    var storageLists = [];
    var storage = window.localStorage;

    var json = storage.getItem("courses");
    storageLists = JSON.parse(json);

    console.log("取出本地存储的storageLists",storageLists);
    return storageLists;
}