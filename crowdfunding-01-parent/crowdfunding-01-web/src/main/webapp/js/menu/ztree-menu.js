/**
 *
 * @CreateAuthor: DENGQI
 * @Description: 树形结构的JS
 * @CreateDate: 2020/3/27 9:53
 *
 */
/**
 * 显示树形结构的方法
 */
function generateTree() {
    // 1.准备生成树形结构的 JSON 数据，数据的来源是发送 Ajax 请求得到
    $.ajax({
        "url": "menu/get/whole/terr.json",
        "type": "post",
        "dataType": "json",
        "success": function (response) {
            var result = response.result;

            if (result == "SUCCESS") {
                // 2.创建 JSON 对象用于存储对 zTree 所做的设置
                var setting = {
                    "view": {
                        "addDiyDom": myAddDiyDom,       // 调用显示树形结构函数
                        "addHoverDom": myAddHoverDom,   // 调用鼠标移入节点范围时添加按钮函数
                        "removeHoverDom": myRemoveHoverDom  // 调用鼠标离开节点范围时删除按钮函数
                    },
                    "data": {
                        "key": {
                            "url": "maomi"
                        }
                    }
                };
                // 3.从响应体中获取用来生成树形结构的 JSON 数据
                var zNodes = response.data;
                // 4.初始化树形结构
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            }
            if (result == "FAILED") {
                layer.msg(response.message);
            }
        }
    });
}
/**
 * 修改默认图标
 * @param treeId
 * @param treeNode
 */
function myAddDiyDom(treeId,treeNode) {
    // treeId是整个树形结构附着的ul标签的id
        //console.log("treeId="+treeId    );
    // 当前树形节点的全部的数据，包括从后端查询得到的Menu对象的全部属性
        //console.log(treeNode);

    // 根据id的生成规则拼接出来span标签的id
    var spanId = treeNode.tId+"_ico";
    // 根据控制图标的span标签的id找到这个span标签
    // removeClass()删除class -- addClass(treeNode.icon)添加class
    $("#"+spanId)
        .removeClass()
        .addClass(treeNode.icon);

}

/**
 * 在鼠标移入节点范围时添加按钮组
 * @param treeId
 * @param treeNode
 */
function myAddHoverDom(treeId,treeNode) {
    // 按钮组的标签结构：<span><a><i></i></a><a><i></i></a></span>
    // 按钮组出现的位置：节点中 treeDemo_n_a 超链接的后面
    // 为了在需要移除按钮组的时候能够精确定位到按钮组所在 span，需要给 span 设置有 规律的 id
    var btnGroupId = treeNode.tId+"_btnGrp";
    // 判断一下以前是否添加了按钮组
    if ($("#"+btnGroupId).length > 0){
        return;
    }

    // 准备各个按钮的HTML标签
    // 添加
    var addBtn = "<a id='"+treeNode.id+"' class='addBtn btn btn-info dropdown-toggle btn-xs' style='margin-left:10px;padding-top:0px;' href='#' title='添加子节点'>&nbsp;&nbsp;<i class='fa fa-fw fa-plus rbg '></i></a>";
    // 删除
    var removeBtn = "<a id='"+treeNode.id+"' class='removeBtn btn btn-info dropdown-toggle btn-xs' style='margin-left:10px;padding-top:0px;' href='#' title=' 删 除 节 点 '>&nbsp;&nbsp;<i class='fa fa-fw fa-times rbg '></i></a>";
    // 修改
    var editBtn = "<a id='"+treeNode.id+"' class='editBtn btn btn-info dropdown-toggle btn-xs' style='margin-left:10px;padding-top:0px;' href='#' title=' 修 改 节 点 '>&nbsp;&nbsp;<i class='fa fa-fw fa-edit rbg '></i></a>";

    // 获取当前节点的级别数据
    var level = treeNode.level;
    // 声明变量存储拼装好的按钮代码
    var btnHTML = "";
    // 判断当前节点的级别
    if (level == 0){
        // 级别为 0 时是根节点，只能添加子节点
        btnHTML = addBtn;
    }
    if (level == 1){
        // 级别为 1 时是分支节点，可以添加子节点、修改
        btnHTML = addBtn + " " + editBtn;
        // 获取当前节点的子节点数量
        var length = treeNode.children.length;
        // 如果没有子节点，可以删除
        if (length == 0){
            btnHTML = btnHTML+""+removeBtn;
        }
    }

    if (level == 2){
        // 级别为 2 时是叶子节点，可以修改、删除
        btnHTML = editBtn+""+removeBtn;
    }

    // 找到附着按钮组的超链接
    var anchorId = treeNode.tId+"_a";
    // 执行在超链接后面附加 span 元素的操作
    $("#"+anchorId).after("<span id='"+btnGroupId+"'>"+btnHTML+"</span>");
}

/**
 * 在鼠标离开节点范围时删除按钮组
 * @param treeId
 * @param treeNode
 */
function myRemoveHoverDom(treeId,treeNode) {
    // 拼接按钮组的 id
    var btnGroupId = treeNode.tId + "_btnGrp";
    // 移除对应的元素
    $("#"+btnGroupId).remove();
}

