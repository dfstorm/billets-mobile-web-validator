// QRCODE reader Copyright 2011 Lazar Laszlo
// http://www.webqr.com


var gCtx = null;
var gCanvas = null;
var c=0;
var stype=0;
var gUM=false;
var webkit=false;
var moz=false;
var v=null;

var iInterval = 500;

var imghtml='<div id="qrfile"><canvas id="out-canvas"></canvas>'+
    '<div id="imghelp">drag and drop a QRCode here'+
	'<br>or select a file'+
	'<input type="file" onchange="handleFiles(this.files)"/>'+
	'</div>'+
'</div>';

var vidhtml = '<video id="v" autoplay style=" background-size: cover; object-fit: cover; width: 100%;"></video>';

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}
function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;
  if(files.length>0)
  {
	handleFiles(files);
  }
  else
  if(dt.getData('URL'))
  {
	qrcode.decode(dt.getData('URL'));
  }
}

function handleFiles(f)
{
	var o=[];

	for(var i =0;i<f.length;i++)
	{
        var reader = new FileReader();
        reader.onload = (function(theFile) {
        return function(e) {
            gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);

			qrcode.decode(e.target.result);
        };
        })(f[i]);
        reader.readAsDataURL(f[i]);
    }
}

function initCanvas(w,h)
{
    gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = "50px";
    gCanvas.style.height = "50px";
    gCanvas.width = 1200;
    gCanvas.height =1200;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
}


function captureToCanvas() {
    if(stype!=1)
        return;
    if(gUM)
    {
        try{
            gCtx.drawImage(v,0,0);
            try{
                qrcode.decode();
            }
            catch(e){
                console.log(e);
                setTimeout(captureToCanvas, iInterval);
            };
        }
        catch(e){
                console.log(e);
                setTimeout(captureToCanvas, iInterval);
        };
    } else {

    }

}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function read(a)
{
    doCheckDatabase(a);
}

function doCheckDatabase(html)
{
    $('#forfaitName').html('(Aucune donnée)');
    $('#guestName').html('(Aucune donnée)');

	var bOkay = false;
	$.each(arrDatabase, function(index, value) {
      if(index == html) {
        bOkay = true;

        var audio = new Audio('served.ogg');
        audio.play();

        $('#forfaitName').html(value.sName);
        $('#guestName').html(value.sGuestName);

        $('#divSuccess').show();


	// signal system
    	$.ajax({
                type: "POST",
                url: 'https://billets.io/ajax/api/setTicketPass/'+html,
                success: function(data) {
                  console.info('loged');
                },
                dataType: 'json'
            });


      }
    });
    if(!bOkay) {
        $('#notGood').modal();
    }
    load();
}

function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
function success(stream) {

    if(webkit)
        v.src = window.webkitURL.createObjectURL(stream);
    else
    if(moz)
    {
        v.mozSrcObject = stream;
        v.play();
    }
    else
        v.src = stream;
    gUM=true;
    setTimeout(captureToCanvas, iInterval);
}

function error(error) {

    gUM=false;
    return;
}

function load()
{
    var winW = 200, winH = 200;
    if (document.body && document.body.offsetWidth) {
     winW = document.body.offsetWidth;
     winH = document.body.offsetHeight;
    }
    if (document.compatMode=='CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth ) {
     winW = document.documentElement.offsetWidth;
     winH = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
     winW = window.innerWidth;
     winH = window.innerHeight;
    }
    winH = winH - 100;

	if(isCanvasSupported() && window.File && window.FileReader)
	{
		initCanvas(1000, 1000);
		qrcode.callback = read;
		document.getElementById("mainbody").style.display="inline";

        setwebcam();
	}
	else
	{
		document.getElementById("mainbody").style.display="inline";
		document.getElementById("mainbody").innerHTML='<p id="mp1">QR code scanner for HTML5 capable browsers</p><br>'+
        '<br><p id="mp2">sorry your browser is not supported</p><br><br>'+
        '<p id="mp1">try <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or <a href="http://www.opera.com"><img src="Opera-logo.png"/></a></p>';
	}
}

function setwebcam()
{


    if(stype==1)
    {
        setTimeout(captureToCanvas, iInterval);
        return;
    }
    var n=navigator;
    document.getElementById("outdiv").innerHTML = vidhtml;

    v=document.getElementById("v");

    if(n.getUserMedia)  {

        n.getUserMedia({video: true, audio: false}, success, error);
   } else if(n.webkitGetUserMedia) {


        webkit=true;
        n.webkitGetUserMedia({video:true, audio: false}, success, error);
    }  else if(n.mozGetUserMedia) {

        moz=true;
        n.mozGetUserMedia({video: true, audio: false}, success, error);
    } else {


    }






    stype=1;
    setTimeout(captureToCanvas, iInterval);


}
function setimg()
{
	document.getElementById("result").innerHTML="";
    if(stype==2)
        return;
    document.getElementById("outdiv").innerHTML = imghtml;

    var qrfile = document.getElementById("qrfile");

    stype=2;
}
