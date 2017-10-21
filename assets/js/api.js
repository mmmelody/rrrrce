$(document).ready(function()
{
  init();
});

var rce_width = 30;
var rce_height = 17;
var position = new Array();
var Record_x = new Array();
var Record_y = new Array();
var Record_c = new Array();
var range_count = 0;
var onclick_count = 0;
var range_val = 3;

function init()
{
  rce_box = document.getElementById('box');

  for(var i = 0; i < rce_height; i++){

    position[i] = new Array();
    for (var j = 0; j < rce_width; j++){
      cell = document.createElement('button');
      cell.setAttribute('id',i + '_' + j);
      cell.setAttribute('class','box_cell');
      cell.setAttribute('type','button'); //click on the btn not submit
      cell.setAttribute('onclick','act(this)');
      cell.innerHTML='&nbsp;';
      box.appendChild(cell);
      position[i][j]=0;
    }
    box.innerHTML=box.innerHTML+'<BR/>';
  }

}
function act(obj) {
  var x = parseInt(obj.id.split('_')[0]);
  var y = parseInt(obj.id.split('_')[1]);
  var drawing = "none";
  if ( $('input[name=drawing][value=g_pen]').filter(':checked').val() )
    drawing = "g";
  if ( $('input[name=drawing][value=y_pen]').filter(':checked').val() )
    drawing = "y";

  var color = (drawing=="g") ? "#74cfae":"yellow";
  obj.style.backgroundColor = color;
  Record_c.push(color);
  Record_x.push(x);
  Record_y.push(y);
  onclick_count++;
  //console.log('cell(x='+x+', y='+y+', color='+color+')');
  //console.log('Total : count='+onclick_count);
}
function start_learn(){
  if ( onclick_count==0 ) {
    alert("no any button ON!");
    return;
  }
  range_val = ($('input[name=rangenum]').val()>1)?$('input[name=rangenum]').val():3;
  range_val = parseInt(range_val);
  for (var i = 0 ; i < onclick_count ; i++){
    if(!cellinrange(Record_x[i], Record_y[i],Record_c[i]))
    add_range(Record_x[i], Record_y[i],range_val , Record_c[i]);
  }
  
}
function add_range(x, y, r, color) {
  var r_id = range_count;
  var check = false;
  var setColor = (color=="#74cfae") ? "rgb(116, 207, 174)":"yellow";
  console.log(r);
  do{
    check = false;
    for(var o_x = x-r ; (o_x <= x+r) && (o_x < 17) ; o_x++ ){
      for(var o_y = y-r; o_y <= y+r && o_y < 30 ; o_y++){
        if(o_x<0)o_x=0;
        if(o_y<0)o_y=0;
        console.log('current t_x: '+o_x+'t_y: '+o_y+'setColor:'+setColor);
        var value = document.getElementById(o_x+'_'+o_y).style.borderColor;
        var value1 = document.getElementById(o_x+'_'+o_y).style.backgroundColor;
        console.log(value);
        if((value!=setColor && value!="" && value!="white") || (value1!=setColor && value1!="")){
          check = true;
          console.log('color not same,t_x: '+o_x+'t_y: '+o_y+'value: '+value+'r:'+r);
          break;
        }
      }
    }
    if(check)
      r--;
  }while(check && r>=0);
  var remove=0;
  for (var c = range_val; c >r ; c--)
  { 
    var minx = (x-c<0)?0:x-c;
    var maxx = (x+c>16)?16:x+c;
    var miny = (y-c<0)?0:y-c;
    var maxy = (y+c>29)?29:y+c;

    var v1 = document.getElementById(maxx+'_'+maxy).style.borderColor;
    var v2 = document.getElementById(minx+'_'+miny).style.borderColor;
    var v3 = document.getElementById(maxx+'_'+miny).style.borderColor;
    var v4 = document.getElementById(minx+'_'+maxy).style.borderColor;
    if(v1==v2 && v2==v3 && v3==v4 && v4!="white")
      remove++;
  }

  for(var o_x = x-r-remove ; (o_x <= x+r+remove) && o_x<17 ; o_x++ ){
    for(var o_y = y-r-remove ; (o_y <= y+r+remove) && o_y<30 ; o_y++){
      if(o_x<0)o_x=0;
      if(o_y<0)o_y=0;
      console.log('set -> t_x: '+o_x+'t_y: '+o_y+'color: '+setColor+'r:'+r+'remove:'+remove);
      if(o_x<x-r || o_y<y-r || o_x>x+r ||o_y>y+r){
        var old = document.getElementById(o_x+'_'+o_y).style.borderColor;
        if(old==setColor)
          document.getElementById(o_x+'_'+o_y).style.borderColor = "white";
      }
      else
        document.getElementById(o_x+'_'+o_y).style.borderColor = setColor;
    }
  } 

  console.log(' ranx: '+x+' rany: '+y+' r: '+r+'rcout:'+range_count);
  return range_count++; 
}
function cellinrange(x, y, color){
  var bcolor = document.getElementById(x+'_'+y).style.borderColor
  bcolor = (bcolor=="#74cfae")?"g":"y";
  if(range_count==0 || bcolor=="white")
    return false;
  if(bcolor==color)
    return true;
  else{
    return false;
  }
}