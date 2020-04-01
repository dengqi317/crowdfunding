$(function(){
    // 1.为分页操作准备初始化数据
    window.pageNum = 1;
    window.pageSize = 15;
    window.keyword = "";
    // 2.调用执行分页的函数，显示分页效果
    generatePage();
    // 3.给查询按钮绑定单击响应函数
    $("#searchBtn").click(function(){
        // ①获取关键词数据赋值给对应的全局变量
        window.keyword = $("#keywordInput").val();
        // ②调用分页函数刷新页面
        generatePage();
    });
    /**
     *  4.点击新增按钮打开模态框
     */
    $("#showAddModalBtn").click(function(){
        $("#addModal").modal("show");
    });
    /**
     * 5.给新增模态框中的保存按钮绑定单击响应函数
     */
    $("#saveRoleBtn").click(function(){
        // ①获取用户在文本框中输入的角色名称
        // #addModal表示找到整个模态框
        // 空格表示在后代元素中继续查找
        // [name=roleName]表示匹配name属性等于roleName的元素
        var roleName = $.trim($("#addModal [name=roleName]").val());
        // ②发送Ajax请求
        $.ajax({
            "url": "role/save.json",
            "type":"post",
            "data": {
                "name": roleName
            },
            "dataType": "json",
            "success":function(response){
                var result = response.result;
                if(result == "SUCCESS") {
                    layer.msg("操作成功！");
                    // 将页码定位到最后一页
                    window.pageNum = 99999999;
                    // 重新加载分页数据
                    generatePage();
                }
                if(result == "FAILED") {
                    layer.msg("操作失败！"+response.message);
                }
            },
            "error":function(response){
                layer.msg(response.status+" "+response.statusText);
            }
        });
        // 关闭模态框
        $("#addModal").modal("hide");
        // 清理模态框
        $("#addModal [name=roleName]").val("");
    });
    /**
     *
     *  6.给页面上的“铅笔”按钮绑定单击响应函数，目的是打开模态框
     传统的事件绑定方式只能在第一个页面有效，翻页后失效了
     $(".pencilBtn").click(function(){
     	alert("aaaa...");
    });
     使用jQuery对象的on()函数可以解决上面问题
     ①首先找到所有“动态生成”的元素所附着的“静态”元素
     ②on()函数的第一个参数是事件类型
     ③on()函数的第二个参数是找到真正要绑定事件的元素的选择器
     ③on()函数的第三个参数是事件的响应函数
     */
    $("#rolePageBody").on("click",".pencilBtn",function(){
        // 打开模态框
        $("#editModal").modal("show");
        // 获取表格中当前行中的角色名称
        var roleName = $(this).parent().prev().text();
        // 获取当前角色的id
        // 依据是：var pencilBtn = "<button id='"+roleId+"' ……这段代码中我们把roleId设置到id属性了
        // 为了让执行更新的按钮能够获取到roleId的值，把它放在全局变量上
        window.roleId = this.id;
        // 使用roleName的值设置模态框中的文本框
        $("#editModal [name=roleName]").val(roleName);
    });
    /**
     * 7.给更新模态框中的更新按钮绑定单击响应函数
     */
    $("#updateRoleBtn").click(function(){
        // ①从文本框中获取新的角色名称
        var roleName = $("#editModal [name=roleName]").val();
        // ②发送Ajax请求执行更新
        $.ajax({
            "url":"role/update.json",
            "type":"post",
            "data":{
                "id":window.roleId,
                "name":roleName
            },
            "dataType":"json",
            "success":function(response){
                var result = response.result;
                if(result == "SUCCESS") {
                    layer.msg("操作成功！");
                    // 重新加载分页数据
                    generatePage();
                }
                if(result == "FAILED") {
                    layer.msg("操作失败！"+response.message);
                }
            },
            "error":function(response){
                layer.msg(response.status+" "+response.statusText);
            }
        });
        // ③关闭模态框
        $("#editModal").modal("hide");
    });
    /**
     * 8.点击确认模态框中的确认删除按钮执行删除
     */
    $("#removeRoleBtn").click(function(){
        // 从全局变量范围获取roleIdArray，转换为JSON字符串
        var requestBody = JSON.stringify(window.roleIdArray);
        $.ajax({
            "url":"role/remove/by/role/id/array.json",
            "type":"post",
            "data":requestBody,
            "contentType":"application/json;charset=UTF-8",
            "dataType":"json",
            "success":function(response){
                var result = response.result;
                if(result == "SUCCESS") {
                    layer.msg("操作成功！");
                    // 重新加载分页数据
                    generatePage();
                }
                if(result == "FAILED") {
                    layer.msg("操作失败！"+response.message);
                }
            },
            "error":function(response){
                layer.msg(response.status+" "+response.statusText);
            }
        });
        // 关闭模态框
        $("#confirmModal").modal("hide");

    });
    /**
     * 9.给单条删除按钮绑定单击响应函数
     */
    $("#rolePageBody").on("click",".removeBtn",function(){
        // 从当前按钮出发获取角色名称
        var roleName = $(this).parent().prev().text();
        // 创建role对象存入数组
        var roleArray = [{
            roleId:this.id,
            roleName:roleName
        }];
        // 调用专门的函数打开模态框
        showConfirmModal(roleArray);
    });
    /**
     * 10.给总的checkbox绑定单击响应函数
      */
    $("#summaryBox").click(function(){
        // ①获取当前多选框自身的状态
        var currentStatus = this.checked;
        // ②用当前多选框的状态设置其他多选框
        $(".itemBox").prop("checked", currentStatus);
    });
    /**
     * 11.全选、全不选的反向操作
     */
    $("#rolePageBody").on("click",".itemBox",function(){
        // 获取当前已经选中的.itemBox的数量
        var checkedBoxCount = $(".itemBox:checked").length;
        // 获取全部.itemBox的数量
        var totalBoxCount = $(".itemBox").length;
        // 使用二者的比较结果设置总的checkbox
        $("#summaryBox").prop("checked", checkedBoxCount == totalBoxCount);
    });
    /**
     * 12.给批量删除的按钮绑定单击响应函数
     */
    $("#batchRemoveBtn").click(function(){
        // 创建一个数组对象用来存放后面获取到的角色对象
        var roleArray = [];
        // 遍历当前选中的多选框
        $(".itemBox:checked").each(function(){
            // 使用this引用当前遍历得到的多选框
            var roleId = this.id;
            // 通过DOM操作获取角色名称
            var roleName = $(this).parent().next().text();
            roleArray.push({
                "roleId":roleId,
                "roleName":roleName
            });
        });
        // 检查roleArray的长度是否为0
        if(roleArray.length == 0) {
            layer.msg("请至少选择一个执行删除");
            return ;
        }
        // 调用专门的函数打开模态框
        showConfirmModal(roleArray);
    });
    /**
     * 声明专门的函数显示确认模态框
     * @param roleArray
     */
    function showConfirmModal(roleArray) {
        // 打开模态框
        $("#confirmModal").modal("show");
        // 清除旧的数据
        $("#roleNameDiv").empty();
        // 在全局变量范围创建数组用来存放角色id
        window.roleIdArray = [];
        // 遍历roleArray数组
        for(var i = 0; i < roleArray.length; i++) {
            var role = roleArray[i];
            var roleName = role.roleName;
            $("#roleNameDiv").append(roleName+"<br/>");
            var roleId = role.roleId;
            // 调用数组对象的push()方法存入新元素
            window.roleIdArray.push(roleId);
        }
    }
});