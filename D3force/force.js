function force(){

  var APP_NAME = 'force_APP';//アプリ名

  //初期設定
  var width = $(document).width(),//ページを開いた時の横幅を取得
      height= $(document).height();//縦幅を取得

  var collentNode = null;//現在選択しているノードのIDを格納
  var collentNodeObj = null;//現在選択しているノードのオブジェクトを格納

  var NodeId = 0;//ノードに振られるユニークなidの変数(常に最大値が入る)

  var conf = {//設定用オブジェクト (ローカルストレージに格納)
              NodeId:0
            　};

  var setJson = {//ローカルストレージに格納するためのオブジェクト
                data:null,
                conf:null
                }

  var testUpdate = 0;//のちに消す予定

  var force = d3.layout.force()//forcelayoutの初期設定
                       .linkDistance(50)//リンク距離
                       .friction(0.60)//摩擦力
                       .charge(-100)// 寄っていこうとする力。推進力(反発力)というらしい。
                       .gravity(0.001)// 画面の中央に引っ張る力。引力。
                       .size([width, height])//画面サイズに合わせる
                       .on("tick", tick);

  // svg領域の作成
  var svg = d3.select("body")
              .append("svg")
              .attr("width", width)//画面サイズに合わせる
              .attr("height", height);

  var link = svg.selectAll(".link"),
      node = svg.selectAll(".node");


      //テンプレートオブジェクトデータ
      var treeData ={
          name:"root",
          children:[
          ]
      };






  function init(){


    //データが格納されている場合 ローカルストレージからのデータ取得
    if(result = JSON.parse(localStorage.getItem(APP_NAME))){
      treeData = result.data;//オブジェクトデータの取得
      conf = result.conf;//設定データの取得
    }else{
      setJson.data = treeData;//オブジェクトデータの格納
      setJson.conf = conf;//設定データの格納
      localStorage.setItem(APP_NAME,JSON.stringify(setJson));
    }



//各ボタンの処理群-----------------------------------------------------------------

    //ノード(オブジェクト)追加ボタンの処理
    $("#addNodeButton").click(function(){

      console.log("オブジェクトの追加");
      //追加用テンプレデータオブジェクト
      addData = {
        name:"new",
        size:200000,
        type:"obj",
        children: [
          {name:"前期",
          type:"time",
          size:100000,
          children:[
                    {
                name: "カテ",
                size:1000,
                type:"cate",
                children: [
                  {
                     name: "科目1",
                     type:"subj",
                     size:{
                       point:10000,
                       goalPoint:null,
                       unit:{
                            type:null,
                            kind:null,
                            }
                     }
                  }
                          ]
                    }
                    ]
          }
        ]
      };

    treeData.children.push(addData);
    update();
    update();
    });



    //カテゴリ-追加ボタンの処理
    $("#addCategoryButton").click(function(){
      if(collentNodeObj == null){
        return;
      }else{
        if(collentNodeObj.type != 'obj'){
          alert(collentNodeObj.type+'ノードにはカテゴリは追加できません');
        }else{
          console.log()
          console.log("カテゴリの追加");
          //追加用テンプレデータオブジェクト
          addData =
             {
               name: "カテゴリ1",
               size:1000,
               type:"cate",
                 children: [
                   {
                      name: "科目1",
                      type:"subj",
                      size:{
                        point:10000,
                        goalPoint:null,
                        unit:{
                             type:null,
                             kind:null,
                             }
                      }
                   }
                 ]
             };

          //カテゴリ追加用
          function addCategory(node) {
            if (node.children){
              node.children.forEach(addCategory);
            };


            if(node.id == collentNode){
              console.log(node.children);

              if (node.children){
                node.children.push(addData);
              }else{
                alert("時間が選択されていません");
              };

            }

          }

          addCategory(treeData);

          update();
        };
      }
    });

    $("#dialog_InputData").dialog({
      autoOpen:false,
    });

    $("#dialog_SelectNum").dialog({
      autoOpen:false,
    });




    // ダイアログの初期設定
    $("#dialog_SelectUnit").dialog({
      autoOpen: false,  // 自動的に開かないように設定
      width: 500,       // 横幅のサイズを設定
      modal: true,      // モーダルダイアログにする
      buttons: [// ボタン名 : 処理 を設定
        {
          text:'上限100のテスト',
          click: function(){
              $("#dialog_SelectNum").dialog({
                autoOpen:false,
                width:500,
                model:true,
                buttons:[
                  {
                    text:'決定',
                    click:function(){
                      var num = $("#dialog_SelectNum_Num").val();

                      var htmlStr = "";
                      for(var i = 0;i < num;i++){
                        htmlStr = htmlStr + "<input id='newSubj_"+i+"_name' type='text' placeholder='"+(i+1)+"個目の名前'></><input id='newSubj_"+i+"_num' type='number' placeholder='"+(i+1)+"個目の記録'></></br>";
                      }

                      $("#dialog_InputData").html(htmlStr);
                      $("#dialog_InputData").dialog({
                        autoOpen:false,
                        width:500,
                        model:true,
                        buttons:[
                          {
                            text:'決定',
                            click:function(){


                                  function addSubject(node) {
                                    if (node.children){
                                      node.children.forEach(addSubject);
                                    } else if(node._chidlren){
                                      node._chidlren.forEach(addSubject);
                                    };

                                    if(node.id == collentNode){

                                      if (node.children){
                                    //    console.log(node.children);
                                        node.children.push(addData);
                                      } else if(node._children){
                                    //    console.log(node._chidlren);
                                        node._children.push(addData);
                                      };

                                    };
                                  }

                              for(var i = 0;i < num;i++){

                                console.log($("#newSubj_"+i+"_num").val());

                                //追加用テンプレデータオブジェクト
                                addData =
                                {
                                   name: $("#newSubj_"+i+"_name").val(),
                                   type:"subj",
                                   size:{
                                     point:($("#newSubj_"+i+"_num").val())*1000,
                                     goalPoint:null,
                                     unit:{
                                          type:"max100",
                                          kind:"点",
                                          }
                                   }
                                };

                                addSubject(treeData);
                              }
                              $(this).dialog("close");
                              update();
                            }
                          }
                        ]
                      });
                      $("#dialog_InputData").dialog("open");
                      $(this).dialog("close");
                    }
                  }
                ]
              });
              $("#dialog_SelectNum").dialog("open");
              $(this).dialog("close");
          }
        },
        {
          text: 'その他の記録',
          click: function(){
            $("#dialog_SelectNum").dialog({
              autoOpen:false,
              width:500,
              model:true,
              buttons:[
                {
                  text:'決定',
                  click:function(){
                    var num = $("#dialog_SelectNum_Num").val();
                    console.log(num);

                    var htmlStr = "";
                    for(var i = 0;i < num;i++){
                      htmlStr = htmlStr + "<input id='newSubj_"+i+"_name' type='text' style='width:100px;' placeholder='"+(i+1)+"個目の名前'></><input id='newSubj_"+i+"_num' type='number' style='width:80px;' placeholder='記録'></><input id='newSubj_"+i+"_goalnum' type='number' style='width:80px;' placeholder='目標値'></><input id='newSubj_"+i+"_unit' type='text' style='width:80px;' placeholder='単位' list='data1'></br>";
                    }

                    $("#dialog_InputData").html(htmlStr);
                    $("#dialog_InputData").dialog({
                      autoOpen:false,
                      width:500,
                      model:true,
                      buttons:[
                        {
                          text:'決定',
                          click:function(){
                            function addSubject(node) {
                              if (node.children){
                                node.children.forEach(addSubject);
                              } else if(node._chidlren){
                                node._chidlren.forEach(addSubject);
                              };

                              if(node.id == collentNode){

                                if (node.children){
                              //    console.log(node.children);
                                  node.children.push(addData);
                                } else if(node._children){
                              //    console.log(node._chidlren);
                                  node._children.push(addData);
                                };

                              };
                            }


                          for(var i = 0;i < num;i++){
                          console.log($("#newSubj_"+i+"_goalnum").val());
                          //追加用テンプレデータオブジェクト
                          addData =
                          {
                             name: $("#newSubj_"+i+"_name").val(),
                             type:"subj",
                             size:{
                               point:($("#newSubj_"+i+"_num").val())*1000,
                               goalPoint:($("#newSubj_"+i+"_goalnum").val())*1000,
                               unit:{
                                    type:"other",
                                    kind:$("#newSubj_"+i+"_unit").val(),
                                    }
                             }
                          };
                          addSubject(treeData);
                          }
                          $(this).dialog("close");
                          update();
                          }
                        }
                      ]
                    });
                    $("#dialog_InputData").dialog("open");
                    $(this).dialog("close");
                  }
                }
              ]
            });
            $("#dialog_SelectNum").dialog("open");
            $(this).dialog("close");
          }
        }
      ]
    });


    //科目追加ボタンの処理
    $("#addSubjectButton").click(function(){
      if(collentNodeObj == null){
        return;
      }else{
        if(collentNodeObj.type != 'cate'){
          alert(collentNodeObj.type+'ノードにはサブジェクトは追加できません');
        }else{
          console.log("サブジェクトの追加");
          $("#dialog_SelectUnit").dialog("open");
        };
      };
    });



    $("#addTimeButton").click(function(){

      if(collentNodeObj == null){
        return;
      }else{
        if(collentNodeObj.type != 'obj'){
          alert(collentNodeObj.type+'ノードにはタイムは追加できません');
        }else{
          console.log("時間追加");
          //追加用テンプレデータオブジェクト
          addData =
         {name:"前期",
          type:"time",
          size:100000,
          children:[
                    {
                name: "カテ",
                size:1000,
                type:"cate",
                children: [
                                    {
                                       name: "科目1",
                                       type:"subj",
                                       size:{
                                         point:10000,
                                         goalPoint:null,
                                         unit:{
                                              type:null,
                                              kind:null,
                                              }
                                       }
                                    }
                          ]
                    }
                    ]
          };


          //時間追加用
          function addTime(node) {
            console.log("時間関数");
            if (node.children)node.children.forEach(addTime);
            if(node.id == collentNode){
              console.log(node._SUMchildren);
              node._SUMchildren.push(addData);
            };

          }

          addTime(treeData);

          update();
        };
      }


      console.log("時間追加");
    });



    //名前変更ボタンの処理
    $("#renamebutton").click(function(){
      console.log("名前変更");


      //名前変更関数
      function reName(node) {
        if (node.children)node.children.forEach(reName);

        if(collentNode == 'time' && collentNodeObj.data.id == node.id){
          console.log(collentNodeObj);
          node._SUMchildren[collentNodeObj.data.index].name = $("#renameBox").val();
        }else if(node.id == collentNode){
          node.name = $("#renameBox").val();
        }
      }

      //ノードが選択されているかつ名前が入力されている場合のみ実行
      if(collentNode && $("#renameBox").val()){
        reName(treeData);
      }else{
        console.log("名称未設定");
      }

      update();
    });



    //数字変更ボタンの処理
    $("#numChange").click(function(){
      console.log("数値変更");
      //数値変更関数
      function reNumber(node) {
        if (node.children)node.children.forEach(reNumber);
        if(node.id == collentNode)node.size.point = $("#number").val()*1000;
      }
      reNumber(treeData);
      update();
    });







    //削除ボタンの処理
    $("#deleteButton").click(function(){
      //カレントノードを削除する機能
      function deleteObj(node) {
        if (node.children)node.children.forEach(deleteObj);//子要素がある限りそこまで繰り返す

        //カレントノードの検索
        if(node.id == collentNode && node.type=='obj'){
          console.log(treeData.children.indexOf(node));//インデックス取得
          treeData.children.splice(treeData.children.indexOf(node),1);//カレントノードの削除
        }else if(node.id == collentNode && node.type=='cate' && treeData.children != null){
          for(var i=0;i<treeData.children.length;i++){
            console.log(treeData.children[i].children.indexOf(node)+'-'+i);
            if(treeData.children[i].children != null){
              if(treeData.children[i].children.indexOf(node) != -1){
                var index = treeData.children[i].children.indexOf(node);
                treeData.children[i].children.splice(index,1);
                console.log('削除'+i);
              }
            }
          }
        }else if(node.id == collentNode && node.type=='subj'){
          console.log(node);
          console.log(treeData.children.length);

          for(var i=0;i<treeData.children.length;i++){
            if(treeData.children[i].children != null){
              console.log(treeData.children[i].children);
              for(var y=0;y<treeData.children[i].children.length;y++){
                //console.log(treeData.children[i].children[y].children);
                //var index = treeData.children[i].children[y].children.indexOf(node);
                if(treeData.children[i].children[y].children != null){
                  if(treeData.children[i].children[y].children.indexOf(node) != -1){
                    var index = treeData.children[i].children[y].children.indexOf(node);
                    treeData.children[i].children[y].children.splice(index,1);
                    console.log('削除'+i);
                  }
                }




                console.log(i);
              }
            }
          }
        }
      }
      deleteObj(treeData);
      update();
    });
    update();
    update();

  };



//---------------------------------------------------------------------------------------------



  var updateX = 0;

  //描画/再描画処理
  function update(){



    var color10 = d3.scale.category10();

     var colorList = ["lightblue","orange","lightyellow","lightgreen","purple","pink"];

    var nodes = flatten(treeData);
    //console.log(treeData);

    var links = d3.layout.tree()
                  .links(nodes);


    //


    // Restart the force layout.
    force.nodes(nodes)
         .links(links)
         .distance(function(d){
             if(d.source.type=='obj'){
               return 100;
             }else{
               return 50;
             }
         })
         .start();


         // Update nodes.
         node = node.data(nodes,function(d){

           var id = d.id;
           var resultChildren;//オブジェクト格納よう


           //children関係の初期設定
             function SearchNode(node){

             if(node.children){
               node.children.forEach(SearchNode);
             }else if(node._children){
               node._children.forEach(SearchNode);
             };

             if(node.id == id && node._children != null){
               resultChildren = node._children;
             }else if(node.id == id && node.children != null){
               resultChildren = node.children;
             }

             }


           if(d.type == 'obj'){
             SearchNode(treeData);//オブジェクトに含まれる全timeノードを格納する
             d._SUMchildren = resultChildren;
             d._children = resultChildren;
           }

           //console.log(d.children[0]);
           if(d.type == 'obj'){
             if(d.children){
               if(d.children[0]){
                 if(d.children[0].type == "time"){
                   console.log("初回起動及びオブジェクトの追加");
                   //alert("まだ描画してない");
                   console.log(d._SUMchildren[0].children);
                   //d.children = d._SUMchildren[0].children;

                   d.children = d._SUMchildren[0].children;
                   d._children = d._SUMchildren;
                 }
               }
             }
           }




           return d.id;
         });



         node.exit().remove();



    // Update links.
    link = link.data(links, function(d) {return (d.target.id);});

    link.exit().remove();


    link.enter().insert("line", ".node")
                .attr("class", "link")
                .style("stroke",function(d){

                  console.log(d);

                  if(d.source._SUMchildren != undefined){
                    for(var i = 0;i < d.source._SUMchildren.length;i++){
                      if(d.source.children != null && d.source.children.length != 0){
                        if(d.source.children[0].id == d.source._SUMchildren[i].children[0].id){
                          console.log(i);
                          return colorList[i];
                        }
                      }
                    }
                  }


                  if(d.source.type == "cate"){
                    for(var i = 0; i < treeData.children.length;i++){
                      for(var j = 0; j < treeData.children[i]._SUMchildren.length;j++){
                        for(var k = 0;k < treeData.children[i]._SUMchildren[j].children.length;k++){
                          if(treeData.children[i]._SUMchildren[j].children[k].id == d.source.id){
                            console.log("一致");
                            console.log(j);
                            return colorList[j];
                          }
                        }
                      }
                    }
                  }

                  return colorList[0];
                });





    var nodeEnter = node.enter().append("g")
                                .attr("class",function(d){
                                  if(d.type == "obj"){
                                    return "node node-obj";
                                  }else{
                                    return "node";
                                  }
                                })
                                .call(force.drag);



    //サークルの描画設定
    nodeEnter.append("circle")
        .attr("class","node-circle")
        .attr("r", function(d){
          if(d.type=='cate'&&d.children==null){
              return Math.sqrt(ave(d._children)) / 10 ;
          }else if(d.type=='cate'&&d.children.length == 0){//科目要素が一つもない
              return 10;
          }else if(d.type=='cate'&&d.children!=null){
            return Math.sqrt(d.size) / 10 ;
          }else if(d.type=='time'){
            return 10;
          }else if(d.type == 'subj'){
            if(d.size.unit.type == null || d.size.unit.type == "max100"){
              console.log("ok");
              return Math.sqrt(d.size.point) / 10;
            }else if(d.size.unit.type == "other"){
              return Math.sqrt((d.size.point / d.size.goalPoint)*100)/10;
            }
          }else{
            return Math.sqrt(d.size) / 10 ;
          }
        })
        .on("click", click)
        .on("mouseover",function(d){
        })
        .on("mouseout",function(d){
        });


        //円の更新
        node.selectAll("circle")
            .attr("r", function(d) {
              if(d.type=='cate'&&d.children==null){
                return Math.sqrt(ave(d._children)) / 10 ;
              }else if(d.type=='cate'&&d.children.length == 0){//科目要素が一つもない
                  return 10;
              }else if(d.type=='cate'&&d.children!=null){
                return Math.sqrt(d.size) / 10 ;
              }else if(d.type=='time'){
                return 10;
              }else if(d.type == "subj"){

                if(d.size.unit.type == null || d.size.unit.type == "max100"){
                  return Math.sqrt(d.size.point) / 10;
                }else if(d.size.unit.type == "other"){

                  var size = ((d.size.point / d.size.goalPoint)*100)*100;



                  console.log(size);
                  return Math.sqrt(size/10);
                }

              }else{
                return Math.sqrt(d.size) / 10 ;
              }
            }).attr("fill",color_circle);


/*

         imgEnter = svg.selectAll(".node-obj")
                      .append("svg:image")
                      .attr("href","./img/human.png")
                      .attr("x", function(d) { return -30;})
                      .attr("y", function(d) { return -30;})
                      .attr("height", 60)
                      .attr("width", 60);

*/




    //名前要素のテキスト
    nodeEnter.append("text")
        .attr("class","node-name")
        .attr("dy", ".03em")
        .text(function(d) { return (d.name);}
      ).style("fill","white");


        //テキストのアップデートに対応
        node.selectAll(".node-name")
            .text(function(d) { return (d.name);});


            //点数要素のテキスト
            nodeEnter.append("text")
                .attr("class","node-size")
                .attr("dy", "1em")
                .style("fill","white")
                .text(function(d) {

                if(d.type=='obj'){
                  return '';
                }else if(d.type=='cate'&&d.children!=null){
                  console.log(d.children.length);
                  return '';
                }else if(d.type=='cate'&&d.children!=null&&d.children.length == 0){
                  return '';
                }else if(d.type=='cate'&&d.children==null){
                  console.log(ave(d._children));
                  return '平均:'+parseInt(ave(d._children)/1000);
                }else if(d.type == "subj"){
                  return d.size.point/1000;
                }

                })
                .style("fill",'blue');


        node.selectAll(".node-size")
            .text(function(d){
            //console.log(d.type);
            if(d.type=='obj'){
              return '';
            }else if(d.type=='cate'&&d.children!=null &&d.children.length == 0){
              return '';
            }else if(d.type=='cate'&&d.children==null){
              return '平均:'+parseInt(ave(d._children)/1000);
            }else if(d.type == "subj"){
              return d.size.point/1000;
            }}).style("fill","white");


////////////////////////////////////////////////////////////////////////////////////////////



        //パイチャートの描画
        var pie = d3.layout.pie()
                           .padAngle(.12)
                           .value(function(d){
                             return d.size;
                           }).sort(null);




        var arcEnter = svg.selectAll(".node-obj")
                          .selectAll("path")
                            .data(function(d){
                              var dataobj = {
                                data:[
                                      ]
                              };
                           if(d._SUMchildren != undefined){
                              var k = d._SUMchildren.length;
                              for(var i = 0;i<k;i++){

                                  var putdata = {
                                    name:d.name,
                                    index:i,
                                    id:d.id,
                                    size:10,
                                    size_parent:d.size,
                                    arc_name:d._SUMchildren[i].name,
                                  }

                                  dataobj.data.push(putdata);
                              }
                           }
                            //  console.log(dataobj.data);
                              return pie(dataobj.data);
                           })
                           .enter()
                           .append("g")
                           .attr("class","arc");


     var arc =  d3.svg.arc()
                      .innerRadius(function(d){
                      return (Math.sqrt(d.data.size_parent) / 10)/1.5;
                      })
                      .outerRadius(function(d){
                      return (Math.sqrt(d.data.size_parent) / 10)/0.9;
                      });





                   arcEnter.append("path")
                           .attr("id",function(d,i){return i;})
                           .attr("class",function(d,i){
                             return "time-arc time-arc-"+d.data.name;
                           })
                           .attr("d",arc)
                           .style("fill",function(d, i) {
                             return colorList[i];
                           })
                           .on("click",function(d){


                             $("#number").val(0);
                             $("#nodeName").text(d.data.arc_name);
                             collentNode = 'time';

                             collentNodeObj = d;

                             $("#renameBox").val(d.data.arc_name);


                            var thisid = $(this).attr("id");

                             var resid = d.data.id;
                             //折りたたみ用関数
                             function oritatami(node) {
                               if (node.children)node.children.forEach(oritatami);
                               if(node.id != NaN  && node.id != undefined && node.id == resid){
                                    //折りたたみ処理
                                    if (node.children) {//畳まれていない場合
                                      var allay = node._SUMchildren;
                                      node._children = allay;
                                      node.children = null;
                                    } else {//畳まれている場合
                                      node.children = node._SUMchildren[thisid].children;
                                      var allaySUM = node._SUMchildren;
                                      node._children = allaySUM;
                                    }
                               };
                             }

                             oritatami(treeData);
                             update();

                           }).each(function(d) {
                  //           console.log(d);
                            this._current = d;
                          });




                   arcEnter.append("text")
                           .attr("transform",function(d){
                             return "translate("+arc.centroid(d)+")";
                           })
                           .text(function(d){
              //               console.log(d);
                             return d.name;
                           }).style("text-anchor", "middle")
                           .style("fill","green")
                           .attr("class","arc_text")
                           .each(function(d) {
                             this._current = d;
                           });


                                    node.selectAll(".arc_text")
                                       .data(function(d){
                                      //   console.log(d);
                                         var dataobj = {
                                           data:[
                                                 ]
                                         };
                                      if(d._SUMchildren != undefined){
                                         var k = d._SUMchildren.length;
                                         for(var i = 0;i<k;i++){

                                             var putdata = {
                                               name:d.name,
                                               index:i,
                                               id:d.id,
                                               size:10,
                                               size_parent:d.size,
                                               arc_name:d._SUMchildren[i].name,
                                             }

                                             dataobj.data.push(putdata);
                                         }
                                      }
                                        // console.log(dataobj.data);
                                         return pie(dataobj.data);
                                       })
                                       .text(function(d){
                                        // console.log(updateX);
                                         return d.data.arc_name;
                                       })    // トランジションを設定。
    .transition()
     // アニメーションの秒数を設定。
    .duration(800)
    // アニメーションの間の数値を補完。
    .attrTween("transform", function(d) {
        var interpolate = d3.interpolate(arc.centroid(this._current), arc.centroid(d));
        this._current = d;
        return function(t) {
                return "translate(" + interpolate(t) + ")";
        };
    });





                       node.selectAll("path")
                           .data(function(d){

                            // console.log(d);

                            var dataobj = {
                                data:[]
                                };

                      if(d._SUMchildren != undefined){
                                                 var k = d._SUMchildren.length;
                                                 for(var i = 0;i<k;i++){

                                                     var putdata = {
                                                       name:d.name,
                                                       index:i,
                                                       id:d.id,
                                                       size:10,
                                                       size_parent:d.size,
                                                       arc_name:d._SUMchildren[i].name,
                                                     }

                                                     dataobj.data.push(putdata);
                                                 }
                                              }
                                            //  console.log(pie(dataobj.data));
                                                 return pie(dataobj.data);
                                              }).transition()
    // アニメーションの秒数を設定します。
    .duration(800)
    // アニメーションの間の数値を補完します。
    .attrTween("d", function(d) {
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
            return arc(interpolate(t));
        };
    });;




    $("#nodeLength").text(treeData.children.length);


    //ローカルストレージに保存
  //  localStorage.setItem(APP_NAME,JSON.stringify(treeData));
    setJson.data = treeData;
    setJson.conf = conf;
    localStorage.setItem(APP_NAME,JSON.stringify(setJson));

    testUpdate++;
    //console.log(testUpdate);

    console.log(treeData.children);

    updateX++;
  }


  //平均点算出関数
  function ave(node){
    var sum = 0;

    if(node == null){
      return 0;
    }


    for(var i=0;i < node.length;i++){
      sum += node[i].size.point;
    }


    return parseInt(sum/node.length);

  }


  //リンク・ノードの座標移動処理
  function tick() {


    link.attr("x1", function(d) { return d.source.x;})
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) {
                                      //  console.log(d);
                                         if(d.x > width-50){
                                           d.x--;
                                         }else if(d.y > height-50){
                                           d.y--;
                                         }else if(d.x < 50){
                                           d.x++;
                                         }else if(d.y < 50){
                                           d.y++;
                                         }
                                         return "translate(" + d.x + "," + d.y + ")"; });

  }


  //circleの色指定関数
  function color_circle(d) {
    return d.id == collentNode ? "gray" // collapsed package
        : d.children ? "green" // expanded package
        : d._children ? "lightgreen"
        : "red"; // leaf node
  }




  //クリック時の処理
  function click(d) {

    //$("#number").val(d.size/1000);
    $("#nodeName").text(d.name);
    collentNode = d.id;
    collentNodeObj = d;
    $("#renameBox").val(d.name);

    if (d3.event.defaultPrevented) return; // ignore drag


    //折りたたみ処理
    if(d.type != "obj"){
        if (d.children && d.children.length != 0){//畳まれていない場合
          d._children = d.children;
          d.children = null;
        } else if(d._children != null){//畳まれている場合
          d.children = d._children;
          d._children = null;
        }
    }

    update();
  }



  // Returns a list of all nodes under the root.
  function flatten(root) {
    var nodes = [];

    function recurse(node) {

      if(node.children){
        node.children.forEach(recurse);
      }else if(node._chidlren){
      //  node._children.forEach(recurse);
      };

      if (!node.id && node.name != "root"){
      //  console.log(conf.NodeId);
        node.id = ++(conf.NodeId);
      }

      if(node.name == "root"){
        //親rootのノードは追加しない
      }else{
        nodes.push(node);//
      }

      //nodeIdMax = node.id;
    }

    recurse(treeData);
    return nodes;
  }





  init();
};

$(function(){
  force();
});
