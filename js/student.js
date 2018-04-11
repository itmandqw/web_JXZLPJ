angular.module("myApp",[])
.controller("myCtrl",["$scope","$http","$location",function($scope,$http,$location){
    var lists = [];
    var storageLists = [];

    if(window.localStorage){
        console.log("浏览器支持localStorage");
        var storage = window.localStorage;
        if(storage.length==""){
            //如果localStorage不存在，则请求数据进行储存操作
            console.log("localStorage不存在")
            $http.get("data/courseMess.json",{
            })
                .then(function(data){
                    lists = data.data.lists;
                    storageLists = storeLocal(lists);
                },function(err){
                    console.log(err)
                })
        }else{
            //如果localStorage存在，则使用localStorage的数据
            console.log("localStorage存在,使用localStorage的数据")
            storageLists = getLocal();
            // 如果页面中带有参数，说明是从刚填完信息跳转回来的,把刚才填写的信息的那个科目设置为已完成
            var params = $location.search();
            if(params.id){
                var id = params.id;
                storageLists[id].status = true;
                var storagelist = storageLists[id];
                console.log("被修改的storagelist",storagelist)
                var changedList = JSON.stringify(storagelist);
                storage.setItem(id,changedList)
            }
        }
        $scope.lists = storageLists;
    }
    $scope.urlHandle = function(i){
        console.log(i);
        if(storageLists[i].status){
            $scope.linkUrl = "###";
            alert("您已经完成该课程的评价");
        }else{
            $scope.linkUrl = "assessment.html?id="+ i;
        }

        // var storage = window.localStorage;
        // if(storage.length==0){
        //     if(lists[i].status){
        //         $scope.linkUrl = "###";
        //         alert("您已经完成该课程的评价");
        //     }else{
        //         $scope.linkUrl = "assessment.html?id="+ i;
        //     }
        // }else{
        //     if(storageLists[i].status){
        //         $scope.linkUrl = "###";
        //         alert("您已经完成该课程的评价");
        //     }else{
        //         $scope.linkUrl = "assessment.html?id="+ i;
        //     }
        // }

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
    var storage = window.localStorage;
    for(var i=0;i<lists.length;i++){
        // 将json数据存入localStorage中的时候，在localStorage会自动将localStorage
        // 转换为字符串形式，这个时候我们可以使用JSON.stringfy()方法，将JSON转换为
        // JSON字符串进行存储
        var data = JSON.stringify(lists[i]);
        storage.setItem(i,data);

        // storage.clear();

        //在localStorage中读取JSON的数据时候，要把JSON字符串转换为JSON格式的数据
        // JSON.parse()方法，将JSON字符串转化为JSON数据
        var json = storage.getItem(i);
        var jsonObj = JSON.parse(json);

        storageLists.push(jsonObj);
    }
    console.log("取出刚刚存入本地的storageLists",storageLists);
    return storageLists;
}

function getLocal (){
    var storageLists = [];
    var storage = window.localStorage;
    for(var i=0;i<storage.length;i++){
        var json = storage.getItem(i);
        var jsonObj = JSON.parse(json);
        storageLists.push(jsonObj);
    }
    console.log("取出本地存储的storageLists",storageLists);
    return storageLists;
}