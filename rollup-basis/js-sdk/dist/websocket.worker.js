function calBcc(e){var n=0;for(i=0;i<e.length;i++)n^=e[i];return n}function PrintArry(e){var n="";for(i=0;i<e.length;i++)n+=e[i].toString(16).padStart(2,"0");return n=n.toUpperCase()}function makeFrame(e,n,t){var r=0,a=t.length,o=a+26,c=new Uint8Array(o);for(c[r++]=104,c[r++]=(4278190080&a)>>24,c[r++]=(16711680&a)>>16,c[r++]=(65280&a)>>8,c[r++]=255&a,c[r++]=0,i=0;i<e.length;i++)c[r++]=e[i].charCodeAt();for(c[r++]=n,i=0;i<t.length;i++)c[r++]=t[i].charCodeAt();a=c.slice(1,o-3+1);return c[r++]=calBcc(a),c[r++]=22,c}function ExexuteKeyDown(e){return makeFrame("RK3923C1201900139",0,JSON.stringify({data:{keyCode:e},event:"keyCode"}))}function ExexuteMouseDown(e,n){return makeFrame("RK3923C1201900139",0,JSON.stringify({data:{action:0,count:1,pointerId:0,x:e,y:n},event:"0"}))}function ExexuteMouseMove(e,n){return makeFrame("RK3923C1201900139",0,JSON.stringify({data:{action:2,count:1,pointerId:0,x:e,y:n},event:"2"}))}function ExexuteMouseUp(e,n){return makeFrame("RK3923C1201900139",0,JSON.stringify({data:{action:1,count:1,pointerId:0,x:e,y:n},event:"1"}))}function makeFrameExtend(e,n,t){var r=0,a=t.length,o=a+26,c=new Uint8Array(o);for(c[r++]=104,c[r++]=(4278190080&a)>>24,c[r++]=(16711680&a)>>16,c[r++]=(65280&a)>>8,c[r++]=255&a,c[r++]=0,i=0;i<e.length;i++)c[r++]=e[i].charCodeAt();for(c[r++]=n,i=0;i<t.length;i++)c[r++]=t[i];a=c.slice(1,o-3+1);return c[r++]=calBcc(a),c[r++]=22,c}function CheckScreenDirection(e){if(0==e[0]&&0==e[1]&&0==e[2]&&1==e[3]&&1==e[4]&&1==e[5]&&1==e[6])return screen=e[7]}var emptyCount=0;function GetEmptyFrame(){return new Uint8Array([255,241,80,128,18,95,252,33,26,200,1,39,252,192,0,126,3,16,64,99,61,119,226,182,227,110,0,55,86,120,235,112,171,197,88,8,89,118,240,71,61,35,108,166,43,89,78,156,224,35,28,45,116,203,226,252,119,125,38,19,195,4,64,2,96,246,3,32,128,199,154,17,14,155,218,160,132,0,42,149,74,30,116,165,64,42,202,168,202,240,242,30,168,119,134,160,98,140,184,95,166,103,191,13,39,139,249,88,189,227,45,12,191,72,60,253,112,120,94,169,11,36,156,19,152,164,160,110,202,170,122,136,165,12,46,131,89,2,36,1,65,3,146,16,64,7])}function GetScreenState(){return makeFrameExtend("RK3923C1201900139",5,new Uint8Array([0,0,0,1,1,1,1,2]))}function VerifyCode(e,n){var t=n.length+1,r=new TextEncoder("utf-8").encode(n),a=new Uint8Array(t);for(a[0]=4,i=0;i<r.length;i++)a[i+1]=r[i];return makeFrameExtend(e,6,a)}function CheckVerifyCode(e){var n=e.length-26;return 3==e.slice(24,24+n)[3]}function ConfigChannel(e,n){var t=new TextEncoder("utf-8").encode(n),r=[];for(r.push(7),i=0;i<t.length;i++)r.push(t[i]);return makeFrameExtend(e,6,r)}function OpenFileLog(e){return makeFrameExtend(e,7,new Uint8Array([1]))}function makeMultiLogin(e,n){n=JSON.stringify({type:3,data:n});return makeFrameExtend(e,13,new TextEncoder("utf-8").encode(n))}function makeStatistics(e,n){n=JSON.stringify({type:4,data:n});return makeFrameExtend(e,13,new TextEncoder("utf-8").encode(n))}function checkMultiLoginInfo(e){var n=e.length-26,e=e.slice(24,24+n),n=new TextDecoder("utf-8").decode(e);return void 0,JSON.parse(n)}function ExexuteSetPhoneSize(e,n){return void 0,JSON.stringify({data:{width:e,height:n},type:"setPhoneSize"})}function ExexuteSendBitRate(e){return JSON.stringify({type:2,data:{definition:1,clientType:"h5",sceneType:"cloudGame"}})}function makeSharpness(e){e=JSON.stringify({type:2,data:{definition:e,clientType:"h5",sceneType:"cloudGame"}});return makeFrameExtend("RK3923C1201900139",13,new TextEncoder("utf-8").encode(e))}function RequestIFrame(){return makeFrameExtend("RK3923C1201900139",6,new Uint8Array([32]))}function fpsSet(e){e=JSON.stringify({type:1,data:{frame_rate:e}});return makeFrameExtend("RK3923C1201900139",13,new TextEncoder("utf-8").encode(e))}
var videoPacketNum=0,hasPPS=!1,curTime=(new Date).getTime(),frameCount=0,socketURL=null,ws=null,sn=null,cardToken=null;function doConnect(){ws.binaryType="arraybuffer",ws.addEventListener("open",function(e){var s;void 0,s=VerifyCode(sn,cardToken),ws.send(s),s=GetScreenState(sn),ws.send(s)}),self.addEventListener("open",function(e){void 0,ws.send(e.data)},!1),ws&&setInterval(()=>{ws.send("ping"),self.postMessage({readyState:ws.readyState})},3e3),ws.addEventListener("message",function(e){var s,e=new Uint8Array(e.data);2e3<(new Date).getTime()-curTime&&(ws.send("ping"),curTime=(new Date).getTime()),0==e[0]&&0==e[1]&&0==e[2]&&1==e[3]?(s=31&e[4],frameCount++,5!=s&&7!=s||(self.postMessage(e),hasPPS=!0,ws.send("ping")),hasPPS?self.postMessage(e):2<++videoPacketNum&&!hasPPS&&(void 0,videoPacketNum=0,ws.send(RequestIFrame(sn)),hasPPS=!0)):255==e[0]&&self.postMessage(e),104==e[0]&&(92==e[23]&&(CheckVerifyCode(e)?(void 0,ws.send(ConfigChannel(sn)),s=makeSharpness(3),ws.send(s),s=fpsSet(20),ws.send(s)):void 0),5==e[23]&&1==e[28]&&1==e[29]&&(1==CheckScreenDirection(e.slice(24,32))?(void 0,self.postMessage({setResolving:1})):(void 0,self.postMessage({setResolving:0}))))}),ws.addEventListener("close",function(e){void 0,self.postMessage("close")})}self.addEventListener("message",function(e){"object"==typeof e.data&&e.data.socketURL&&(sn=e.data.sn,cardToken=e.data.token,socketURL=e.data.socketURL,ws=new WebSocket(socketURL),doConnect()),"restart"===e.data&&(void 0,ws=null,ws=new WebSocket(socketURL),doConnect()),void 0;try{ws&&ws.send(e.data)}catch(e){void 0}},!1);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlbHBlci5qcyIsIndlYnNvY2tldC53b3JrZXIuanMiXSwibmFtZXMiOlsiY2FsQmNjIiwiYXJyeSIsImJjYyIsImkiLCJsZW5ndGgiLCJQcmludEFycnkiLCJkYXRhIiwic3RyIiwidG9TdHJpbmciLCJwYWRTdGFydCIsInRvVXBwZXJDYXNlIiwibWFrZUZyYW1lIiwic24iLCJkYXRhVHlwZSIsImpzb25DbWQiLCJpbmRleCIsImRhdGFMZW4iLCJmcmFtZUxlbiIsIm91dFB1dCIsIlVpbnQ4QXJyYXkiLCJjaGFyQ29kZUF0IiwiYmNjQnVmZmVyIiwic2xpY2UiLCJFeGV4dXRlS2V5RG93biIsImNvZGUiLCJKU09OIiwic3RyaW5naWZ5Iiwia2V5Q29kZSIsImV2ZW50IiwiRXhleHV0ZU1vdXNlRG93biIsIngiLCJ5IiwiYWN0aW9uIiwiY291bnQiLCJwb2ludGVySWQiLCJFeGV4dXRlTW91c2VNb3ZlIiwiRXhleHV0ZU1vdXNlVXAiLCJtYWtlRnJhbWVFeHRlbmQiLCJib2R5IiwiQ2hlY2tTY3JlZW5EaXJlY3Rpb24iLCJzY3JlZW4iLCJlbXB0eUNvdW50IiwiR2V0RW1wdHlGcmFtZSIsIkdldFNjcmVlblN0YXRlIiwiVmVyaWZ5Q29kZSIsImxlbiIsImNvZGVCdWZmZXIiLCJUZXh0RW5jb2RlciIsImVuY29kZSIsImJ1ZmZlciIsIkNoZWNrVmVyaWZ5Q29kZSIsIkNvbmZpZ0NoYW5uZWwiLCJjaGFubmVsTmFtZSIsImNoYW5lbEJ1ZmZlciIsInB1c2giLCJPcGVuRmlsZUxvZyIsIm1ha2VNdWx0aUxvZ2luIiwianNvbkRhdGEiLCJqc29uU3RyIiwidHlwZSIsIm1ha2VTdGF0aXN0aWNzIiwiY2hlY2tNdWx0aUxvZ2luSW5mbyIsImlucHV0IiwianNvbkhleCIsIlRleHREZWNvZGVyIiwiZGVjb2RlIiwiY29uc29sZSIsImxvZyIsInBhcnNlIiwiRXhleHV0ZVNldFBob25lU2l6ZSIsIndpZHRoIiwiaGVpZ2h0IiwiRXhleHV0ZVNlbmRCaXRSYXRlIiwiZGVmaW5pdGlvbiIsImNsaWVudFR5cGUiLCJzY2VuZVR5cGUiLCJtYWtlU2hhcnBuZXNzIiwibGV2ZWwiLCJSZXF1ZXN0SUZyYW1lIiwiZnBzU2V0IiwiZnJhbWVSYXRlIiwiZnJhbWVfcmF0ZSIsInZpZGVvUGFja2V0TnVtIiwiaGFzUFBTIiwiY3VyVGltZSIsIkRhdGUiLCJnZXRUaW1lIiwiZnJhbWVDb3VudCIsInNvY2tldFVSTCIsIndzIiwiY2FyZFRva2VuIiwiZG9Db25uZWN0IiwiYmluYXJ5VHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJ2ZXJpZnlCdWZmZXIiLCJzZW5kIiwiY2hlY2tCdWZmZXIiLCJzZWxmIiwiZSIsInNldEludGVydmFsIiwicG9zdE1lc3NhZ2UiLCJyZWFkeVN0YXRlIiwiYnVmZmVyRnBzIiwibmFsVHlwZSIsInNldFJlc29sdmluZyIsInRva2VuIiwiV2ViU29ja2V0IiwiZXJyb3IiXSwibWFwcGluZ3MiOiJBQU1DLFNBQVNBLE9BQU9DLEdBRWhCLElBQUlDLEVBQU0sRUFDVixJQUFJQyxFQUFJLEVBQUVBLEVBQUlGLEVBQUtHLE9BQU9ELElBRXpCRCxHQUFPRCxFQUFLRSxHQUViLE9BQU9ELEVBSVAsU0FBU0csVUFBVUMsR0FFbEIsSUFBSUMsRUFBTSxHQUVWLElBQUlKLEVBQUksRUFBRUEsRUFBSUcsRUFBS0YsT0FBT0QsSUFFekJJLEdBQWFELEVBQUtILEdBQUdLLFNBQVMsSUFBSUMsU0FBUyxFQUFFLEtBSTlDLE9BREFGLEVBQU1BLEVBQUlHLGNBUVgsU0FBU0MsVUFBVUMsRUFBSUMsRUFBVUMsR0FFaEMsSUFBSUMsRUFBUSxFQUNSQyxFQUFXRixFQUFRVixPQUNuQmEsRUFBV0QsRUFBVSxHQUNyQkUsRUFBUyxJQUFJQyxXQUFXRixHQVM1QixJQVJBQyxFQUFPSCxLQUFXLElBQ2xCRyxFQUFPSCxNQUFzQixXQUFWQyxJQUF5QixHQUM1Q0UsRUFBT0gsTUFBc0IsU0FBVkMsSUFBeUIsR0FDNUNFLEVBQU9ILE1BQXNCLE1BQVZDLElBQXlCLEVBQzVDRSxFQUFPSCxLQUFzQixJQUFWQyxFQUNuQkUsRUFBT0gsS0FBVyxFQUdiWixFQUFJLEVBQUVBLEVBQUdTLEVBQUdSLE9BQU9ELElBRXZCZSxFQUFPSCxLQUFXSCxFQUFHVCxHQUFHaUIsYUFLekIsSUFGQUYsRUFBT0gsS0FBV0YsRUFFYlYsRUFBSSxFQUFFQSxFQUFHVyxFQUFRVixPQUFPRCxJQUU1QmUsRUFBT0gsS0FBV0QsRUFBUVgsR0FBR2lCLGFBRzFCQyxFQUFZSCxFQUFPSSxNQUFNLEVBQUdMLEVBQVMsRUFBSSxHQUs3QyxPQUpBQyxFQUFPSCxLQUFXZixPQUFPcUIsR0FDekJILEVBQU9ILEtBQVcsR0FHWEcsRUFLUixTQUFTSyxlQUFlQyxHQUt2QixPQUFPYixVQURFLG9CQUNZLEVBRlZjLEtBQUtDLFVBREYsQ0FBQ3BCLEtBQU8sQ0FBQ3FCLFFBQVVILEdBQU9JLE1BQVEsYUFRakQsU0FBU0MsaUJBQWlCQyxFQUFHQyxHQUs1QixPQUFRcEIsVUFEQyxvQkFDYSxFQUZYYyxLQUFLQyxVQURGLENBQUNwQixLQUFPLENBQUMwQixPQUFTLEVBQUdDLE1BQVEsRUFBR0MsVUFBWSxFQUFFSixFQUFJQSxFQUFHQyxFQUFJQSxHQUFJSCxNQUFRLE9BTXBGLFNBQVNPLGlCQUFpQkwsRUFBR0MsR0FLNUIsT0FBUXBCLFVBREMsb0JBQ2EsRUFGWGMsS0FBS0MsVUFERixDQUFDcEIsS0FBTyxDQUFDMEIsT0FBUyxFQUFHQyxNQUFRLEVBQUdDLFVBQVksRUFBRUosRUFBSUEsRUFBR0MsRUFBSUEsR0FBSUgsTUFBUSxPQU1wRixTQUFTUSxlQUFlTixFQUFHQyxHQUsxQixPQUFPcEIsVUFERSxvQkFDWSxFQUZWYyxLQUFLQyxVQURGLENBQUNwQixLQUFPLENBQUMwQixPQUFTLEVBQUdDLE1BQVEsRUFBR0MsVUFBWSxFQUFFSixFQUFJQSxFQUFHQyxFQUFJQSxHQUFJSCxNQUFRLE9BTXBGLFNBQVNTLGdCQUFnQnpCLEVBQUlDLEVBQVV5QixHQUV0QyxJQUFJdkIsRUFBUSxFQUNSQyxFQUFXc0IsRUFBS2xDLE9BQ2hCYSxFQUFXRCxFQUFVLEdBQ3JCRSxFQUFTLElBQUlDLFdBQVdGLEdBUzVCLElBUkFDLEVBQU9ILEtBQVcsSUFDbEJHLEVBQU9ILE1BQXNCLFdBQVZDLElBQXlCLEdBQzVDRSxFQUFPSCxNQUFzQixTQUFWQyxJQUF5QixHQUM1Q0UsRUFBT0gsTUFBc0IsTUFBVkMsSUFBeUIsRUFDNUNFLEVBQU9ILEtBQXNCLElBQVZDLEVBQ25CRSxFQUFPSCxLQUFXLEVBR2JaLEVBQUksRUFBRUEsRUFBR1MsRUFBR1IsT0FBT0QsSUFFdkJlLEVBQU9ILEtBQVdILEVBQUdULEdBQUdpQixhQUt6QixJQUZBRixFQUFPSCxLQUFXRixFQUViVixFQUFJLEVBQUVBLEVBQUltQyxFQUFLbEMsT0FBT0QsSUFFMUJlLEVBQU9ILEtBQVd1QixFQUFLbkMsR0FHcEJrQixFQUFZSCxFQUFPSSxNQUFNLEVBQUdMLEVBQVMsRUFBSSxHQU03QyxPQUxBQyxFQUFPSCxLQUFXZixPQUFPcUIsR0FDekJILEVBQU9ILEtBQVcsR0FJWEcsRUFJUixTQUFTcUIscUJBQXFCakMsR0FFOUIsR0FBZSxHQUFYQSxFQUFLLElBQXNCLEdBQVhBLEVBQUssSUFBc0IsR0FBWEEsRUFBSyxJQUFxQixHQUFYQSxFQUFLLElBRXhDLEdBQVhBLEVBQUssSUFBc0IsR0FBWEEsRUFBSyxJQUVULEdBQVhBLEVBQUssR0FHUixPQURBa0MsT0FBU2xDLEVBQUssR0FPakIsSUFBSW1DLFdBQWEsRUFHakIsU0FBU0MsZ0JBR1QsT0FEaUIsSUFBSXZCLFdBQVcsQ0FBQyxJQUFLLElBQUssR0FBSyxJQUFLLEdBQUssR0FBSyxJQUFLLEdBQUssR0FBSyxJQUFLLEVBQUssR0FBSyxJQUFLLElBQUssRUFBSyxJQUFLLEVBQUssR0FBSyxHQUFLLEdBQUssR0FBSyxJQUFLLElBQUssSUFBSyxJQUFLLElBQUssRUFBSyxHQUFLLEdBQUssSUFBSyxJQUFLLElBQUssSUFBSyxJQUFLLEdBQUssRUFBSyxHQUFLLElBQUssSUFBSyxHQUFLLEdBQUssR0FBSyxJQUFLLElBQUssR0FBSyxHQUFLLEdBQUssSUFBSyxJQUFLLEdBQUssR0FBSyxHQUFLLElBQUssSUFBSyxJQUFLLElBQUssSUFBSyxJQUFLLEdBQUssR0FBSyxJQUFLLEVBQUssR0FBSyxFQUFLLEdBQUssSUFBSyxFQUFLLEdBQUssSUFBSyxJQUFLLElBQUssR0FBSyxHQUFLLElBQUssSUFBSyxJQUFLLElBQUssRUFBSyxHQUFLLElBQUssR0FBSyxHQUFLLElBQUssSUFBSyxHQUFLLEdBQUssSUFBSyxJQUFLLElBQUssSUFBSyxJQUFLLEdBQUssSUFBSyxJQUFLLElBQUssSUFBSyxHQUFLLElBQUssSUFBSyxHQUFLLElBQUssSUFBSyxJQUFLLEdBQUssR0FBSyxJQUFLLElBQUssR0FBSyxJQUFLLElBQUssR0FBSyxHQUFLLElBQUssR0FBSyxHQUFLLElBQUssSUFBSyxJQUFLLEdBQUssSUFBSyxHQUFLLEdBQUssSUFBSyxHQUFLLElBQUssSUFBSyxJQUFLLElBQUssSUFBSyxJQUFLLElBQUssSUFBSyxJQUFLLEdBQUssR0FBSyxJQUFLLEdBQUssRUFBSyxHQUFLLEVBQUssR0FBSyxFQUFLLElBQUssR0FBSyxHQUFLLElBS3R2QixTQUFTd0IsaUJBSVQsT0FBT04sZ0JBRkUsb0JBRW1CLEVBRGYsSUFBSWxCLFdBQVcsQ0FBQyxFQUFLLEVBQUssRUFBSyxFQUFLLEVBQUssRUFBSyxFQUFLLEtBS2pFLFNBQVN5QixXQUFXaEMsRUFBSVksR0FFdkIsSUFBSXFCLEVBQU1yQixFQUFLcEIsT0FBUyxFQUNwQjBDLEVBQWEsSUFBSUMsWUFBWSxTQUFTQyxPQUFPeEIsR0FDN0N5QixFQUFTLElBQUk5QixXQUFXMEIsR0FHNUIsSUFGQUksRUFBTyxHQUFLLEVBRVI5QyxFQUFJLEVBQUVBLEVBQUkyQyxFQUFXMUMsT0FBT0QsSUFFL0I4QyxFQUFPOUMsRUFBSSxHQUFLMkMsRUFBVzNDLEdBRzVCLE9BQU9rQyxnQkFBZ0J6QixFQUFJLEVBQUdxQyxHQUkvQixTQUFTQyxnQkFBZ0I1QyxHQUV4QixJQUFJVSxFQUFVVixFQUFLRixPQUFTLEdBSTVCLE9BQWMsR0FISEUsRUFBS2dCLE1BQU0sR0FBSSxHQUFLTixHQUd2QixHQVNULFNBQVNtQyxjQUFjdkMsRUFBSXdDLEdBRTFCLElBQUlDLEVBQWUsSUFBSU4sWUFBWSxTQUFTQyxPQUFPSSxHQUMvQ2xDLEVBQVMsR0FHYixJQUZBQSxFQUFPb0MsS0FBSyxHQUVSbkQsRUFBSSxFQUFFQSxFQUFJa0QsRUFBYWpELE9BQU9ELElBQ2pDZSxFQUFPb0MsS0FBS0QsRUFBYWxELElBRTFCLE9BQU9rQyxnQkFBZ0J6QixFQUFJLEVBQUdNLEdBRy9CLFNBQVNxQyxZQUFZM0MsR0FHcEIsT0FBT3lCLGdCQUFnQnpCLEVBQUksRUFEZCxJQUFJTyxXQUFXLENBQUMsS0FLOUIsU0FBU3FDLGVBQWU1QyxFQUFJNkMsR0FPdkJDLEVBQVVqQyxLQUFLQyxVQUxMLENBQ2JpQyxLQUFLLEVBQ0xyRCxLQUFNbUQsSUFLUCxPQUFPcEIsZ0JBQWdCekIsRUFBSSxHQURkLElBQUltQyxZQUFZLFNBQVNDLE9BQU9VLElBTTlDLFNBQVNFLGVBQWVoRCxFQUFJNkMsR0FPdkJDLEVBQVVqQyxLQUFLQyxVQUxMLENBQ2JpQyxLQUFLLEVBQ0xyRCxLQUFNbUQsSUFLUCxPQUFPcEIsZ0JBQWdCekIsRUFBSSxHQURkLElBQUltQyxZQUFZLFNBQVNDLE9BQU9VLElBSzlDLFNBQVNHLG9CQUFvQkMsR0FFNUIsSUFBSTlDLEVBQVU4QyxFQUFNMUQsT0FBUyxHQUN6QjJELEVBQVVELEVBQU14QyxNQUFNLEdBQUksR0FBS04sR0FDL0IwQyxFQUFVLElBQUlNLFlBQVksU0FBU0MsT0FBT0YsR0FHOUMsT0FGQUcsUUFBUUMsSUFBSSxjQUFnQlQsR0FDZGpDLEtBQUsyQyxNQUFNVixHQU16QixTQUFTVyxvQkFBb0JDLEVBQU1DLEdBYWhDLE9BWkhMLFFBQVFDLElBQUksZ0JBU0UxQyxLQUFLQyxVQVBGLENBQ1ZwQixLQUFNLENBQ0ZnRSxNQUFNQSxFQUNQQyxPQUFPQSxHQUVWWixLQUFNLGlCQVFkLFNBQVNhLG1CQUFtQmxFLEdBYXhCLE9BSFdtQixLQUFLQyxVQVJGLENBQ1ZpQyxLQUFVLEVBQ2hCckQsS0FBVSxDQUNUbUUsV0FBYyxFQUNkQyxXQUFjLEtBQ2RDLFVBQWMsZUFVakIsU0FBU0MsY0FBY0MsR0FLakJuQixFQUFVakMsS0FBS0MsVUFEVCxDQUFDaUMsS0FBTyxFQUFFckQsS0FBTyxDQUFDbUUsV0FBYUksRUFBT0gsV0FBYSxLQUFNQyxVQUFZLGVBRy9FLE9BQU90QyxnQkFMRSxvQkFLa0IsR0FEZCxJQUFJVSxZQUFZLFNBQVNDLE9BQU9VLElBSzlDLFNBQVNvQixnQkFJUixPQUFPekMsZ0JBRkUsb0JBRWtCLEVBRGQsSUFBSWxCLFdBQVcsQ0FBQyxNQUk5QixTQUFTNEQsT0FBT0MsR0FJVHRCLEVBQVVqQyxLQUFLQyxVQURMLENBQUVpQyxLQUFRLEVBQUdyRCxLQUFRLENBQUUyRSxXQUFjRCxLQUduRCxPQUFPM0MsZ0JBSkQsb0JBSXFCLEdBRGQsSUFBSVUsWUFBWSxTQUFTQyxPQUFPVTtBQzlUakQsSUFBSXdCLGVBQWlCLEVBQ2pCQyxRQUFTLEVBQ1RDLFNBQVUsSUFBSUMsTUFBT0MsVUFDckJDLFdBQWEsRUFFYkMsVUFBWSxLQUNaQyxHQUFLLEtBQ0w3RSxHQUFLLEtBQ0w4RSxVQUFZLEtBZ0NoQixTQUFTQyxZQUNSRixHQUFHRyxXQUFhLGNBQ2hCSCxHQUFHSSxpQkFBaUIsT0FBUSxTQUFVakUsR0FrQ3RDLElBQ0trRSxFQWxDSjVCLFFBQVFDLElBQUksU0FrQ1IyQixFQUFlbEQsV0FBV2hDLEdBQUk4RSxXQUNsQ0QsR0FBR00sS0FBS0QsR0FFSkUsRUFBY3JELGVBQWUvQixJQUNqQzZFLEdBQUdNLEtBQUtDLEtBbENUQyxLQUFLSixpQkFBaUIsT0FBUSxTQUFVSyxHQUN2Q2hDLFFBQVFDLElBQUksa0NBQ1pzQixHQUFHTSxLQUFLRyxFQUFFNUYsUUFDUixHQUVDbUYsSUFDSFUsWUFBWSxLQUNYVixHQUFHTSxLQUFLLFFBQ1JFLEtBQUtHLFlBQVksQ0FDaEJDLFdBQWNaLEdBQUdZLGNBYWhCLEtBZUpaLEdBQUdJLGlCQUFpQixVQUFXLFNBQVVqRSxHQU94QyxJQXlDTzBFLEVBekNIeEMsRUFBUSxJQUFJM0MsV0FBV1MsRUFBTXRCLE1BQ0ksS0FBakMsSUFBSStFLE1BQU9DLFVBQVlGLFVBQzFCSyxHQUFHTSxLQUFLLFFBQ1JYLFNBQVUsSUFBSUMsTUFBT0MsV0FHTixHQUFaeEIsRUFBTSxJQUF1QixHQUFaQSxFQUFNLElBQXVCLEdBQVpBLEVBQU0sSUFBdUIsR0FBWkEsRUFBTSxJQUN4RHlDLEVBQXFCLEdBQVh6QyxFQUFNLEdBQ3BCeUIsYUFDZSxHQUFYZ0IsR0FBaUQsR0FBWEEsSUFFekNOLEtBQUtHLFlBQVl0QyxHQUNqQnFCLFFBQVMsRUFDVE0sR0FBR00sS0FBSyxTQUdKWixPQVdKYyxLQUFLRyxZQUFZdEMsR0FSSSxJQURyQm9CLGlCQUMyQkMsU0FDMUJqQixRQUFRQyxJQUFJLGVBQWlCZSxnQkFDN0JBLGVBQWlCLEVBQ2pCTyxHQUFHTSxLQUFLakIsY0FBY2xFLEtBQ3RCdUUsUUFBUyxJQU9TLEtBQVpyQixFQUFNLElBQ2RtQyxLQUFLRyxZQUFZdEMsR0FHRixLQUFaQSxFQUFNLEtBQ1EsSUFBYkEsRUFBTSxNQUNMWixnQkFBZ0JZLElBQ25CSSxRQUFRQyxJQUFJLGFBdkRmc0IsR0FBR00sS0FBSzVDLGNBQWN2QyxLQXlEZnFDLEVBQVMyQixjQUFjLEdBQzNCYSxHQUFHTSxLQUFLOUMsR0FDSnFELEVBQVl2QixPQUFPLElBQ3ZCVSxHQUFHTSxLQUFLTyxJQUdScEMsUUFBUUMsSUFBSSxVQUlHLEdBQWJMLEVBQU0sS0FFUSxHQUFiQSxFQUFNLEtBQTRCLEdBQWJBLEVBQU0sTUFFakIsR0FERHZCLHFCQUFxQnVCLEVBQU14QyxNQUFNLEdBQUksTUFFaEQ0QyxRQUFRQyxJQUFJLFdBQ1o4QixLQUFLRyxZQUFZLENBQ2hCSSxhQUFnQixNQUdqQnRDLFFBQVFDLElBQUksZ0JBQ1o4QixLQUFLRyxZQUFZLENBQ2hCSSxhQUFnQixTQVF0QmYsR0FBR0ksaUJBQWlCLFFBQVMsU0FBVWpFLEdBQ3RDc0MsUUFBUUMsSUFBSSxpQkFDWjhCLEtBQUtHLFlBQVksV0FySm5CSCxLQUFLSixpQkFBaUIsVUFBVyxTQUFVSyxHQUVwQixpQkFBWEEsRUFBRTVGLE1BQXFCNEYsRUFBRTVGLEtBQUtrRixZQUN4QzVFLEdBQUtzRixFQUFFNUYsS0FBS00sR0FDWjhFLFVBQVlRLEVBQUU1RixLQUFLbUcsTUFFbkJqQixVQUFZVSxFQUFFNUYsS0FBS2tGLFVBRW5CQyxHQUFLLElBQUlpQixVQUFVbEIsV0FDbkJHLGFBRWMsWUFBWE8sRUFBRTVGLE9BQ0w0RCxRQUFRQyxJQUFJLG9CQUNac0IsR0FBSyxLQUNMQSxHQUFLLElBQUlpQixVQUFVbEIsV0FDbkJHLGFBR0R6QixRQUFRQyxJQUFJLFNBQTRCLElBQWxCc0IsR0FBR1ksWUFFekIsSUFDQ1osSUFBTUEsR0FBR00sS0FBS0csRUFBRTVGLE1BQ2YsTUFBT3FHLEdBQ1J6QyxRQUFRQyxJQUFJd0MsTUFFWCIsImZpbGUiOiJ3ZWJzb2NrZXQud29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIC8v5q2k5paH5Lu25a6e546w5bCG5o6n5Yi25ZG95Luk5bCB6KOF5oiQ5Y2P6K6u77yM5YW35L2T5Y2P6K6u5YaF5a656K+355yL77yaXHJcbi8v6ZO+5o6l77yaaHR0cDovL25vdGUueW91ZGFvLmNvbS9ub3Rlc2hhcmU/aWQ9ZGFiZGE2YzYxM2FkZWY3YTQxNmJkMjYyNWNkNzcwYTFcclxuIFxyXG4gLy9iY2PmoKHpqoznoIHorqHnrpdcclxuIC8vYXJyeTog6KaB6K6h566X55qE5pWw57uEXHJcbiAvL+i/lOWbnuiuoeeul+WNj+iuruS4reagoemqjOS9jeeahOagoemqjOeggVxyXG4gZnVuY3Rpb24gY2FsQmNjKGFycnkpXHJcbiB7XHJcblx0dmFyIGJjYyA9IDA7XHJcblx0Zm9yKGkgPSAwO2kgPCBhcnJ5Lmxlbmd0aDtpKyspXHJcblx0e1xyXG5cdFx0YmNjIF49IGFycnlbaV07XHJcblx0fVxyXG5cdHJldHVybiBiY2M7XHJcbiB9XHJcbiBcclxuIC8v5pWw57uE5omT5Y2w77yM6LCD6K+V55SoXHJcbiBmdW5jdGlvbiBQcmludEFycnkoZGF0YSlcclxuIHtcclxuXHQgdmFyIHN0ciA9IFwiXCI7XHJcblx0IFxyXG5cdCBmb3IoaSA9IDA7aSA8IGRhdGEubGVuZ3RoO2krKylcclxuXHQge1xyXG5cdFx0IHN0ciA9ICBzdHIgKyBkYXRhW2ldLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCcwJyk7XHJcblx0IH1cclxuXHQgXHJcblx0IHN0ciA9IHN0ci50b1VwcGVyQ2FzZSgpO1xyXG5cdCByZXR1cm4gc3RyO1xyXG4gfVxyXG4gXHJcbiAvL3NuOuadv+WNoXNu5Y+377yMc3Rpcm5nXHJcbiAvL3R5cGXvvJrmlbDmja7nsbvlnovvvIzmlbDlrZdcclxuIC8vanNvbkNtZDoganNvbuWRveS7pFxyXG4gLy/ov5Tlm57lgLzvvJrnlJ/miJDkuIDkuKpVaW50OEFycmF577yM6YCa6L+Hd2Vic29ja2V05Y+R6YCB57uZ5p2/5Y2hXHJcbiBmdW5jdGlvbiBtYWtlRnJhbWUoc24sIGRhdGFUeXBlLCBqc29uQ21kKVxyXG4ge1xyXG5cdCB2YXIgaW5kZXggPSAwO1xyXG5cdCB2YXIgZGF0YUxlbiAgPSBqc29uQ21kLmxlbmd0aDtcclxuXHQgdmFyIGZyYW1lTGVuID0gZGF0YUxlbiArIDI2O1xyXG5cdCB2YXIgb3V0UHV0ID0gbmV3IFVpbnQ4QXJyYXkoZnJhbWVMZW4pO1xyXG5cdCBvdXRQdXRbaW5kZXgrK10gPSAweDY4O1xyXG5cdCBvdXRQdXRbaW5kZXgrK10gPSAoZGF0YUxlbiAmIDB4ZmYwMDAwMDApID4+IDI0O1xyXG5cdCBvdXRQdXRbaW5kZXgrK10gPSAoZGF0YUxlbiAmIDB4MDBmZjAwMDApID4+IDE2O1xyXG5cdCBvdXRQdXRbaW5kZXgrK10gPSAoZGF0YUxlbiAmIDB4MDAwMGZmMDApID4+IDg7XHJcblx0IG91dFB1dFtpbmRleCsrXSA9ICBkYXRhTGVuICYgMHgwMDAwMDBmZjtcclxuXHQgb3V0UHV0W2luZGV4KytdID0gMDsvL+exu+Wei+S4umNsaWVudFxyXG5cdCBcclxuXHQgLy9zbuWPt+i1i+WAvO+8jHN0cmluZ+i9rGFzY2lpXHJcblx0IGZvciggaSA9IDA7aTwgc24ubGVuZ3RoO2krKylcclxuXHQge1xyXG5cdFx0IG91dFB1dFtpbmRleCsrXSA9IHNuW2ldLmNoYXJDb2RlQXQoKTtcclxuXHQgfVxyXG5cdCBcclxuXHQgb3V0UHV0W2luZGV4KytdID0gZGF0YVR5cGU7Ly/mjIflrprmlbDmja7nsbvlnovkuLpqc29uXHJcblx0IC8vanNvbiBzdHJpbmfovaxhc2NpaVxyXG5cdCBmb3IoIGkgPSAwO2k8IGpzb25DbWQubGVuZ3RoO2krKylcclxuXHQge1xyXG5cdFx0IG91dFB1dFtpbmRleCsrXSA9IGpzb25DbWRbaV0uY2hhckNvZGVBdCgpO1xyXG5cdCB9XHJcblx0IFxyXG5cdCB2YXIgYmNjQnVmZmVyID0gb3V0UHV0LnNsaWNlKDEsIGZyYW1lTGVuLTMgKyAxKTsvL+W/veeVpeWNj+iuruWktOWSjOWNj+iuruWwvlxyXG5cdCBvdXRQdXRbaW5kZXgrK10gPSBjYWxCY2MoYmNjQnVmZmVyKTtcclxuXHQgb3V0UHV0W2luZGV4KytdID0gMHgxNjtcclxuXHQgLy9jb25zb2xlLmxvZyhcIuaJk+WNsOaVsOe7hDolc1wiLCBQcmludEFycnkob3V0UHV0KSk7XHJcblx0Ly8gcmV0dXJuIFByaW50QXJyeShvdXRQdXQpOy8vQyMg6L2s5Y+R5Zmo5LiT55SoXHJcblx0IHJldHVybiBvdXRQdXQ7XHJcbiB9XHJcblxyXG4gLy97XCJkYXRhXCI6e1wia2V5Q29kZVwiOlwiMjVcIn0sXCJldmVudFwiOlwia2V5Q29kZVwifVxyXG4gLy/op6blj5HplK7nm5jkuovku7YsIGNvZGXooajnpLrplK7nm5jlgLxcclxuIGZ1bmN0aW9uIEV4ZXh1dGVLZXlEb3duKGNvZGUpXHJcbiB7XHQgXHJcblx0IHZhciBqc29uT2JqID0ge1wiZGF0YVwiOntcImtleUNvZGVcIjpjb2RlfSwgXCJldmVudFwiOlwia2V5Q29kZVwifTtcclxuXHQgdmFyIGpzb24gPSBKU09OLnN0cmluZ2lmeShqc29uT2JqKTtcclxuXHQgdmFyIHNuID0gXCJSSzM5MjNDMTIwMTkwMDEzOVwiO1xyXG5cdCByZXR1cm4gbWFrZUZyYW1lKHNuLCAwLCBqc29uKTtcclxuIH1cclxuIC8v6Kem5Y+R6byg5qCH5oyJ5LiL5LqL5Lu277yMeO+8mnjlnZDmoIfvvIwgee+8mnnlnZDmoIdcclxuIFxyXG4gXHJcbiBmdW5jdGlvbiBFeGV4dXRlTW91c2VEb3duKHgsIHkpXHJcbiB7XHJcblx0IHZhciBqc29uT2JqID0ge1wiZGF0YVwiOntcImFjdGlvblwiOjAsIFwiY291bnRcIjoxLCBcInBvaW50ZXJJZFwiOjAsXCJ4XCI6eCwgXCJ5XCI6eX0sIFwiZXZlbnRcIjpcIjBcIn07XHJcblx0IHZhciBqc29uID0gSlNPTi5zdHJpbmdpZnkoanNvbk9iaik7XHJcblx0IHZhciBzbiA9IFwiUkszOTIzQzEyMDE5MDAxMzlcIjtcclxuXHQgcmV0dXJuICBtYWtlRnJhbWUoc24sIDAsIGpzb24pO1xyXG4gfVxyXG4gIC8v6Kem5Y+R6byg5qCH56e75Yqo5LqL5Lu277yMeO+8mnjlnZDmoIfvvIwgee+8mnnlnZDmoIdcclxuIGZ1bmN0aW9uIEV4ZXh1dGVNb3VzZU1vdmUoeCwgeSlcclxuIHtcclxuXHQgdmFyIGpzb25PYmogPSB7XCJkYXRhXCI6e1wiYWN0aW9uXCI6MiwgXCJjb3VudFwiOjEsIFwicG9pbnRlcklkXCI6MCxcInhcIjp4LCBcInlcIjp5fSwgXCJldmVudFwiOlwiMlwifTtcclxuXHQgdmFyIGpzb24gPSBKU09OLnN0cmluZ2lmeShqc29uT2JqKTtcclxuXHQgdmFyIHNuID0gXCJSSzM5MjNDMTIwMTkwMDEzOVwiO1xyXG5cdCByZXR1cm4gIG1ha2VGcmFtZShzbiwgMCwganNvbik7XHQgXHJcbiB9XHJcbiAgLy/op6blj5HpvKDmoIfmiqzotbfkuovku7bvvIx477yaeOWdkOagh++8jCB577yaeeWdkOagh1xyXG4gZnVuY3Rpb24gRXhleHV0ZU1vdXNlVXAoeCwgeSlcclxuIHtcclxuXHQgdmFyIGpzb25PYmogPSB7XCJkYXRhXCI6e1wiYWN0aW9uXCI6MSwgXCJjb3VudFwiOjEsIFwicG9pbnRlcklkXCI6MCxcInhcIjp4LCBcInlcIjp5fSwgXCJldmVudFwiOlwiMVwifTtcclxuXHQgdmFyIGpzb24gPSBKU09OLnN0cmluZ2lmeShqc29uT2JqKTtcclxuXHQgdmFyIHNuID0gXCJSSzM5MjNDMTIwMTkwMDEzOVwiO1xyXG5cdCByZXR1cm4gbWFrZUZyYW1lKHNuLCAwLCBqc29uKTtcdCBcclxuIH1cclxuICBcclxuIGZ1bmN0aW9uIG1ha2VGcmFtZUV4dGVuZChzbiwgZGF0YVR5cGUsIGJvZHkpXHJcbiB7XHJcblx0IHZhciBpbmRleCA9IDA7XHJcblx0IHZhciBkYXRhTGVuICA9IGJvZHkubGVuZ3RoO1xyXG5cdCB2YXIgZnJhbWVMZW4gPSBkYXRhTGVuICsgMjY7XHJcblx0IHZhciBvdXRQdXQgPSBuZXcgVWludDhBcnJheShmcmFtZUxlbik7XHJcblx0IG91dFB1dFtpbmRleCsrXSA9IDB4Njg7XHJcblx0IG91dFB1dFtpbmRleCsrXSA9IChkYXRhTGVuICYgMHhmZjAwMDAwMCkgPj4gMjQ7XHJcblx0IG91dFB1dFtpbmRleCsrXSA9IChkYXRhTGVuICYgMHgwMGZmMDAwMCkgPj4gMTY7XHJcblx0IG91dFB1dFtpbmRleCsrXSA9IChkYXRhTGVuICYgMHgwMDAwZmYwMCkgPj4gODtcclxuXHQgb3V0UHV0W2luZGV4KytdID0gIGRhdGFMZW4gJiAweDAwMDAwMGZmO1xyXG5cdCBvdXRQdXRbaW5kZXgrK10gPSAwOy8v57G75Z6L5Li6Y2xpZW50XHJcblx0IFxyXG5cdCAvL3Nu5Y+36LWL5YC877yMc3RyaW5n6L2sYXNjaWlcclxuXHQgZm9yKCBpID0gMDtpPCBzbi5sZW5ndGg7aSsrKVxyXG5cdCB7XHJcblx0XHQgb3V0UHV0W2luZGV4KytdID0gc25baV0uY2hhckNvZGVBdCgpO1xyXG5cdCB9XHJcblx0IFxyXG5cdCBvdXRQdXRbaW5kZXgrK10gPSBkYXRhVHlwZTsvL+aMh+WumuaVsOaNruexu+Wei+S4umpzb25cclxuXHQgLy9qc29uIHN0cmluZ+i9rGFzY2lpXHJcblx0IGZvciggaSA9IDA7aSA8IGJvZHkubGVuZ3RoO2krKylcclxuXHQge1xyXG5cdFx0IG91dFB1dFtpbmRleCsrXSA9IGJvZHlbaV07XHJcblx0IH1cclxuXHQgXHJcblx0IHZhciBiY2NCdWZmZXIgPSBvdXRQdXQuc2xpY2UoMSwgZnJhbWVMZW4tMyArIDEpOy8v5b+955Wl5Y2P6K6u5aS05ZKM5Y2P6K6u5bC+XHJcblx0IG91dFB1dFtpbmRleCsrXSA9IGNhbEJjYyhiY2NCdWZmZXIpO1xyXG5cdCBvdXRQdXRbaW5kZXgrK10gPSAweDE2O1xyXG5cdCAvL3ZhciBzdHIgPSBQcmludEFycnkob3V0UHV0KTtcclxuXHQgLy9jb25zb2xlLmxvZyhcIuaJk+WNsOaVsOe7hDolc1wiLCBQcmludEFycnkob3V0UHV0KSk7XHJcblx0IC8vcmV0dXJuIFByaW50QXJyeShvdXRQdXQpO1xyXG5cdCByZXR1cm4gb3V0UHV0O1xyXG4gfVxyXG4gXHJcbiAvL+agueaNruaKpeaWh+ivhuWIq+Wxj+W5leaWueWQkSwgMOaoquWxj++8jDHnq5blsY9cclxuIGZ1bmN0aW9uIENoZWNrU2NyZWVuRGlyZWN0aW9uKGRhdGEpXHJcbiB7XHRcclxuXHRpZiAoZGF0YVswXSA9PSAwICYmIGRhdGFbMV0gPT0gMCAmJiBkYXRhWzJdID09IDAgJiZkYXRhWzNdID09IDEpXHJcblx0e1xyXG5cdFx0aWYgKGRhdGFbNF0gPT0gMSAmJiBkYXRhWzVdID09IDEpXHJcblx0XHR7XHJcblx0XHRcdGlmIChkYXRhWzZdID09IDEpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzY3JlZW4gPSBkYXRhWzddO1xyXG5cdFx0XHRcdHJldHVybiBzY3JlZW47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHRcclxuIH1cclxuIFxyXG4gdmFyIGVtcHR5Q291bnQgPSAwO1xyXG4gXHJcblxyXG4gZnVuY3Rpb24gR2V0RW1wdHlGcmFtZSgpXHJcbiB7XHJcblx0dmFyIGVtcHR5RnJhbWUgPSBuZXcgVWludDhBcnJheShbMHhGRiwweEYxLDB4NTAsMHg4MCwweDEyLDB4NUYsMHhGQywweDIxLDB4MUEsMHhDOCwweDAxLDB4MjcsMHhGQywweEMwLDB4MDAsMHg3RSwweDAzLDB4MTAsMHg0MCwweDYzLDB4M0QsMHg3NywweEUyLDB4QjYsMHhFMywweDZFLDB4MDAsMHgzNywweDU2LDB4NzgsMHhFQiwweDcwLDB4QUIsMHhDNSwweDU4LDB4MDgsMHg1OSwweDc2LDB4RjAsMHg0NywweDNELDB4MjMsMHg2QywweEE2LDB4MkIsMHg1OSwweDRFLDB4OUMsMHhFMCwweDIzLDB4MUMsMHgyRCwweDc0LDB4Q0IsMHhFMiwweEZDLDB4NzcsMHg3RCwweDI2LDB4MTMsMHhDMywweDA0LDB4NDAsMHgwMiwweDYwLDB4RjYsMHgwMywweDIwLDB4ODAsMHhDNywweDlBLDB4MTEsMHgwRSwweDlCLDB4REEsMHhBMCwweDg0LDB4MDAsMHgyQSwweDk1LDB4NEEsMHgxRSwweDc0LDB4QTUsMHg0MCwweDJBLDB4Q0EsMHhBOCwweENBLDB4RjAsMHhGMiwweDFFLDB4QTgsMHg3NywweDg2LDB4QTAsMHg2MiwweDhDLDB4QjgsMHg1RiwweEE2LDB4NjcsMHhCRiwweDBELDB4MjcsMHg4QiwweEY5LDB4NTgsMHhCRCwweEUzLDB4MkQsMHgwQywweEJGLDB4NDgsMHgzQywweEZELDB4NzAsMHg3OCwweDVFLDB4QTksMHgwQiwweDI0LDB4OUMsMHgxMywweDk4LDB4QTQsMHhBMCwweDZFLDB4Q0EsMHhBQSwweDdBLDB4ODgsMHhBNSwweDBDLDB4MkUsMHg4MywweDU5LDB4MDIsMHgyNCwweDAxLDB4NDEsMHgwMywweDkyLDB4MTAsMHg0MCwweDA3XSlcclxuXHRyZXR1cm4gZW1wdHlGcmFtZTtcclxuIH1cclxuIFxyXG4gLy/mn6Xor6LlsY/luZXmlrnlkJFcclxuIGZ1bmN0aW9uIEdldFNjcmVlblN0YXRlKClcclxuIHtcclxuXHR2YXIgc24gPSBcIlJLMzkyM0MxMjAxOTAwMTM5XCI7XHJcblx0dmFyIG91dFB1dCA9IG5ldyBVaW50OEFycmF5KFsweDAwLDB4MDAsMHgwMCwweDAxLDB4MDEsMHgwMSwweDAxLDB4MDJdKTtcclxuXHRyZXR1cm4gbWFrZUZyYW1lRXh0ZW5kKHNuLCAgNSwgb3V0UHV0KTtcclxuIH1cclxuXHJcbi8v55Sf5oiQ6Ym05p2D5oql5paHXHJcbmZ1bmN0aW9uIFZlcmlmeUNvZGUoc24sIGNvZGUpXHJcbntcclxuXHR2YXIgbGVuID0gY29kZS5sZW5ndGggKyAxO1xyXG5cdHZhciBjb2RlQnVmZmVyID0gbmV3IFRleHRFbmNvZGVyKFwidXRmLThcIikuZW5jb2RlKGNvZGUpOy8v6I635Y+W5a2X56ym5LiyYXNjaWnnoIFcclxuXHR2YXIgYnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkobGVuKTtcclxuXHRidWZmZXJbMF0gPSAweDA0O1xyXG5cdFxyXG5cdGZvcihpID0gMDtpIDwgY29kZUJ1ZmZlci5sZW5ndGg7aSsrKVxyXG5cdHtcclxuXHRcdGJ1ZmZlcltpICsgMV0gPSBjb2RlQnVmZmVyW2ldO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gbWFrZUZyYW1lRXh0ZW5kKHNuLCA2LCBidWZmZXIpO1xyXG59XHJcblxyXG4vL1xyXG5mdW5jdGlvbiBDaGVja1ZlcmlmeUNvZGUoZGF0YSlcclxue1xyXG5cdHZhciBkYXRhTGVuID0gZGF0YS5sZW5ndGggLSAyNjtcclxuXHR2YXIgYm9keSA9IGRhdGEuc2xpY2UoMjQsIDI0ICsgZGF0YUxlbik7XHJcblx0Ly9jb25zb2xlLmxvZyhcIuaJk+WNsDpcIiArIFByaW50QXJyeShib2R5KSk7XHJcblx0XHJcblx0aWYoYm9keVszXSA9PSAweDAzKVxyXG5cdHtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8v6YCa6YGT6YWN572uXHJcbmZ1bmN0aW9uIENvbmZpZ0NoYW5uZWwoc24sIGNoYW5uZWxOYW1lKVxyXG57XHRcclxuXHR2YXIgY2hhbmVsQnVmZmVyID0gbmV3IFRleHRFbmNvZGVyKFwidXRmLThcIikuZW5jb2RlKGNoYW5uZWxOYW1lKTtcclxuXHR2YXIgb3V0UHV0ID0gW107XHJcblx0b3V0UHV0LnB1c2goMHgwNyk7XHJcblx0XHJcblx0Zm9yKGkgPSAwO2kgPCBjaGFuZWxCdWZmZXIubGVuZ3RoO2krKykge1xyXG5cdFx0b3V0UHV0LnB1c2goY2hhbmVsQnVmZmVyW2ldKTtcclxuXHR9XHJcblx0cmV0dXJuIG1ha2VGcmFtZUV4dGVuZChzbiwgNiwgb3V0UHV0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gT3BlbkZpbGVMb2coc24pXHJcbntcclxuXHR2YXIgb3V0UHV0ID0gbmV3IFVpbnQ4QXJyYXkoWzB4MDFdKTtcclxuXHRyZXR1cm4gbWFrZUZyYW1lRXh0ZW5kKHNuLCA3LCBvdXRQdXQpO1xyXG59XHJcblxyXG4vL+Wkmuerr+eZu+W9lWpzb24g5rGH5oql55Sf5oiQXHJcbmZ1bmN0aW9uIG1ha2VNdWx0aUxvZ2luKHNuLCBqc29uRGF0YSlcclxue1xyXG5cdHZhciBqc29uT2JqID0ge1xyXG5cdFx0dHlwZTozLFxyXG5cdFx0ZGF0YToganNvbkRhdGEsXHJcblx0fTtcclxuXHRcclxuXHR2YXIganNvblN0ciA9IEpTT04uc3RyaW5naWZ5KGpzb25PYmopO1xyXG5cdHZhciBvdXRQdXQgPSBuZXcgVGV4dEVuY29kZXIoXCJ1dGYtOFwiKS5lbmNvZGUoanNvblN0cik7XHJcblx0cmV0dXJuIG1ha2VGcmFtZUV4dGVuZChzbiwgMHgwRCwgb3V0UHV0KTtcclxufVxyXG5cclxuXHJcbi8v57uf6K6h55m75b2V5L+h5oGvXHJcbmZ1bmN0aW9uIG1ha2VTdGF0aXN0aWNzKHNuLCBqc29uRGF0YSlcclxue1xyXG5cdHZhciBqc29uT2JqID0ge1xyXG5cdFx0dHlwZTo0LFxyXG5cdFx0ZGF0YToganNvbkRhdGEsXHJcblx0fTtcclxuXHRcclxuXHR2YXIganNvblN0ciA9IEpTT04uc3RyaW5naWZ5KGpzb25PYmopO1xyXG5cdHZhciBvdXRQdXQgPSBuZXcgVGV4dEVuY29kZXIoXCJ1dGYtOFwiKS5lbmNvZGUoanNvblN0cik7XHJcblx0cmV0dXJuIG1ha2VGcmFtZUV4dGVuZChzbiwgMHgwRCwgb3V0UHV0KTtcclxufVxyXG5cclxuLy/lpJrnq6/nmbvlvZXmlbDmja7op6PmnpBcclxuZnVuY3Rpb24gY2hlY2tNdWx0aUxvZ2luSW5mbyhpbnB1dClcclxue1xyXG5cdHZhciBkYXRhTGVuID0gaW5wdXQubGVuZ3RoIC0gMjY7Ly/lvpfliLBqc29uIOmVv+W6plxyXG5cdHZhciBqc29uSGV4ID0gaW5wdXQuc2xpY2UoMjQsIDI0ICsgZGF0YUxlbik7Ly/miKrlj5Zqc29uIGhleOS6jOi/m+WItuaVsOaNrlx0XHRcclxuXHR2YXIganNvblN0ciA9IG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpLmRlY29kZShqc29uSGV4KTtcclxuXHRjb25zb2xlLmxvZyhcIuWPluW+l2pzb24g5a2X56ym5LiyOlwiICsganNvblN0cik7XHJcblx0dmFyIGpzb25PYmogPSBKU09OLnBhcnNlKGpzb25TdHIpO1xyXG5cdHJldHVybiBqc29uT2JqO1xyXG59XHJcblxyXG5cclxuIC8vIOiuvue9ruWIhui+qOeOh1xyXG4gZnVuY3Rpb24gRXhleHV0ZVNldFBob25lU2l6ZSh3aWR0aCxoZWlnaHQpIHtcclxuXHRjb25zb2xlLmxvZygnPT0g6L+b5p2l5LqGIOiuvue9ruWIhui+qOeOhycpXHJcbiAgICAvLyB2YXIganNvbk9iaiA9IHtcImRhdGFcIjp7XCJrZXlDb2RlXCI6Y29kZX0sIFwiZXZlbnRcIjpcImtleUNvZGVcIn07XHJcbiAgICB2YXIganNvbk9iaiA9IHtcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIHdpZHRoOndpZHRoLFxyXG4gICAgICAgICAgIGhlaWdodDpoZWlnaHRcclxuICAgICAgICB9LFxyXG4gICAgICAgIHR5cGU6ICdzZXRQaG9uZVNpemUnXHJcbiAgICB9XHJcbiAgICB2YXIganNvbiA9IEpTT04uc3RyaW5naWZ5KGpzb25PYmopO1xyXG4gICAgLy8gdmFyIHNuID0gXCJSSzM5MjNDMTIwMTkwMDEzOVwiO1xyXG4gICAgLy8gcmV0dXJuIG1ha2VGcmFtZShzbiwgMCwganNvbik7XHJcbiAgICByZXR1cm4ganNvblxyXG59XHJcblxyXG5mdW5jdGlvbiBFeGV4dXRlU2VuZEJpdFJhdGUoZGF0YSkge1xyXG4gICAgLy8gdmFyIGpzb25PYmogPSB7XCJkYXRhXCI6e1wia2V5Q29kZVwiOmNvZGV9LCBcImV2ZW50XCI6XCJrZXlDb2RlXCJ9O1xyXG4gICAgdmFyIGpzb25PYmogPSB7XHJcbiAgICAgICAgXCJ0eXBlXCIgIDogMixcclxuXHRcdFwiZGF0YVwiICA6IHtcclxuXHRcdFx0XCJkZWZpbml0aW9uXCI6IDEsICAgICAgICAgICAgIC8v5YC85Li6MeWIsDUg5Liq562J57qnXHJcblx0XHRcdFwiY2xpZW50VHlwZVwiOiBcImg1XCIsICAgICAgICAgIC8vcGMgYW5kcm9pZCBpb3MgIGg1XHJcblx0XHRcdFwic2NlbmVUeXBlXCIgOiBcImNsb3VkR2FtZVwiICAvL2Nsb3VkUGhvbmUgICBjbG91ZEdhbWVcclxuXHRcdH1cclxuICAgIH1cclxuICAgIHZhciBqc29uID0gSlNPTi5zdHJpbmdpZnkoanNvbk9iaik7XHJcbiAgICAvLyB2YXIgc24gPSBcIlJLMzkyM0MxMjAxOTAwMTM5XCI7XHJcbiAgICAvLyByZXR1cm4gbWFrZUZyYW1lKHNuLCAwLCBqc29uKTtcclxuICAgIHJldHVybiBqc29uXHJcbn1cclxuXHJcbi8v5YiH5o2i5riF5pmw5bqmXHJcbmZ1bmN0aW9uIG1ha2VTaGFycG5lc3MobGV2ZWwpXHJcbntcclxuXHQgdmFyIHNuID0gXCJSSzM5MjNDMTIwMTkwMDEzOVwiO1xyXG5cdCB2YXIganNvbk9iaiA9IHtcInR5cGVcIjoyLFwiZGF0YVwiOntcImRlZmluaXRpb25cIjpsZXZlbH19O1x0IFxyXG5cdCBqc29uT2JqID0ge1widHlwZVwiOjIsXCJkYXRhXCI6e1wiZGVmaW5pdGlvblwiOmxldmVsLCBcImNsaWVudFR5cGVcIjpcImg1XCIsIFwic2NlbmVUeXBlXCI6XCJjbG91ZEdhbWVcIn19O1x0IFxyXG5cdCB2YXIganNvblN0ciA9IEpTT04uc3RyaW5naWZ5KGpzb25PYmopO1xyXG5cdCB2YXIgb3V0UHV0ID0gbmV3IFRleHRFbmNvZGVyKFwidXRmLThcIikuZW5jb2RlKGpzb25TdHIpO1xyXG5cdCByZXR1cm4gbWFrZUZyYW1lRXh0ZW5kKHNuLCAweEQsIG91dFB1dCk7XHJcbn1cclxuXHJcbiAvL0kg5bin6K+35rGC5oql5paH55Sf5oiQXHJcbiBmdW5jdGlvbiBSZXF1ZXN0SUZyYW1lKClcclxuIHtcclxuXHQgdmFyIHNuID0gXCJSSzM5MjNDMTIwMTkwMDEzOVwiO1xyXG5cdCB2YXIgb3V0UHV0ID0gbmV3IFVpbnQ4QXJyYXkoWzB4MjBdKTtcclxuXHQgcmV0dXJuIG1ha2VGcmFtZUV4dGVuZChzbiwgNiwgb3V0UHV0KTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBmcHNTZXQoZnJhbWVSYXRlKVxyXG57XHJcblx0dmFyIHNuID0gXCJSSzM5MjNDMTIwMTkwMDEzOVwiO1xyXG4gICAgdmFyIGpzb25PYmogPSB7IFwidHlwZVwiOiAxLCBcImRhdGFcIjogeyBcImZyYW1lX3JhdGVcIjogZnJhbWVSYXRlIH0gfTtcclxuICAgIHZhciBqc29uU3RyID0gSlNPTi5zdHJpbmdpZnkoanNvbk9iaik7XHJcbiAgICBsZXQgb3V0UHV0ID0gbmV3IFRleHRFbmNvZGVyKFwidXRmLThcIikuZW5jb2RlKGpzb25TdHIpO1xyXG4gICAgcmV0dXJuIG1ha2VGcmFtZUV4dGVuZChzbiwgMHhELCBvdXRQdXQpO1xyXG59XHJcbiAiLCJ2YXIgdmlkZW9QYWNrZXROdW0gPSAwOy8vXHJcbnZhciBoYXNQUFMgPSBmYWxzZTtcclxudmFyIGN1clRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxudmFyIGZyYW1lQ291bnQgPSAwO1xyXG5cclxudmFyIHNvY2tldFVSTCA9IG51bGw7XHJcbnZhciB3cyA9IG51bGw7XHJcbnZhciBzbiA9IG51bGw7XHJcbnZhciBjYXJkVG9rZW4gPSBudWxsO1xyXG5cclxuLy8gR3VscCDmiZPljIXvvJog5LiN6ZyA6KaB5YaN5Y2V54us5byV5YWl5q2kIGpzXHJcbi8vIHNlbGYuaW1wb3J0U2NyaXB0cyhcImhlbHBlci5qc1wiKTtcclxuXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChlKSB7XHJcblxyXG5cdGlmICh0eXBlb2YgZS5kYXRhID09PSAnb2JqZWN0JyAmJiBlLmRhdGEuc29ja2V0VVJMKSB7XHJcblx0XHRzbiA9IGUuZGF0YS5zbjtcclxuXHRcdGNhcmRUb2tlbiA9IGUuZGF0YS50b2tlbjtcclxuXHRcdC8vIHNvY2tldFVSTCA9IGB3czovLzE0LjE4LjE5MC4xMzg6MTY5MjVgO1xyXG5cdFx0c29ja2V0VVJMID0gZS5kYXRhLnNvY2tldFVSTDtcclxuXHRcdC8vIHNvY2tldFVSTCA9IGB3czovLzE0LjE4LjE5MC4xMzg6NDExMjVgO1xyXG5cdFx0d3MgPSBuZXcgV2ViU29ja2V0KHNvY2tldFVSTClcclxuXHRcdGRvQ29ubmVjdCgpO1xyXG5cdH1cclxuXHRpZiAoZS5kYXRhID09PSAncmVzdGFydCcpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdEbyBjb25uZWN0Li4uLi4uJylcclxuXHRcdHdzID0gbnVsbDtcclxuXHRcdHdzID0gbmV3IFdlYlNvY2tldChzb2NrZXRVUkwpXHJcblx0XHRkb0Nvbm5lY3QoKTtcclxuXHR9XHJcblx0XHJcblx0Y29uc29sZS5sb2coJ1Rlc3Q6ICcsIHdzLnJlYWR5U3RhdGUgPT09IDEpXHJcblx0Ly8g5re75Yqg54q25oCB5Yik5pat77yM5b2T5Li6T1BFTuaXtu+8jOWPkemAgea2iOaBr1xyXG5cdHRyeSB7XHJcblx0XHR3cyAmJiB3cy5zZW5kKGUuZGF0YSk7XHJcblx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdGNvbnNvbGUubG9nKGVycm9yKVxyXG5cdH1cclxufSwgZmFsc2UpO1xyXG5cclxuZnVuY3Rpb24gZG9Db25uZWN0KCkge1xyXG5cdHdzLmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInO1xyXG5cdHdzLmFkZEV2ZW50TGlzdGVuZXIoJ29wZW4nLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdGNvbnNvbGUubG9nKFwi5Y+R6YCB6YWN572u5binXCIpO1xyXG5cdFx0ZG9WZXJpZnkoKTtcclxuXHRcdC8vIHNlbGYucG9zdE1lc3NhZ2UoZXZlbnQpO1xyXG5cdH0pO1xyXG5cdHNlbGYuYWRkRXZlbnRMaXN0ZW5lcignb3BlbicsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRjb25zb2xlLmxvZygnT1BFTioqKioqKioqKioqKioq5byA5omT5byA5byA5Y+R5byA5Y+R5pa95bel5pa56JCo5qC8JylcclxuXHRcdHdzLnNlbmQoZS5kYXRhKTtcclxuXHR9LCBmYWxzZSk7XHJcbiAgXHJcblx0aWYgKHdzKSB7XHJcblx0XHRzZXRJbnRlcnZhbCgoKSA9PiB7XHJcblx0XHRcdHdzLnNlbmQoJ3BpbmcnKVxyXG5cdFx0XHRzZWxmLnBvc3RNZXNzYWdlKHtcclxuXHRcdFx0XHRcInJlYWR5U3RhdGVcIjogd3MucmVhZHlTdGF0ZVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ1BpbmcuLi4nLCAgd3MucmVhZHlTdGF0ZSlcclxuXHRcdFx0Ly8gaWYgKHdzLnJlYWR5U3RhdGUgPT09IDEpIHtcclxuXHRcdFx0Ly8gXHR3cy5zZW5kKCdwaW5nJylcclxuXHRcdFx0Ly8gXHRzZWxmLnBvc3RNZXNzYWdlKHtcclxuXHRcdFx0Ly8gXHRcdFwicmVhZHlTdGF0ZVwiOiB3cy5yZWFkeVN0YXRlXHJcblx0XHRcdC8vIFx0fSk7XHJcblx0XHRcdC8vIH0gZWxzZSB7XHJcblx0XHRcdC8vIFx0c2VsZi5wb3N0TWVzc2FnZSh7XHJcblx0XHRcdC8vIFx0XHRcInJlYWR5U3RhdGVcIjogd3MucmVhZHlTdGF0ZVxyXG5cdFx0XHQvLyBcdH0pO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9LCAzMDAwKVxyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBkb0NvbmNmaWdDaGFubmVsKCkge1xyXG5cdFx0d3Muc2VuZChDb25maWdDaGFubmVsKHNuKSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBkb1ZlcmlmeSgpIHtcclxuXHRcdHZhciB2ZXJpZnlCdWZmZXIgPSBWZXJpZnlDb2RlKHNuLCBjYXJkVG9rZW4pO1xyXG5cdFx0d3Muc2VuZCh2ZXJpZnlCdWZmZXIpO1xyXG5cclxuXHRcdHZhciBjaGVja0J1ZmZlciA9IEdldFNjcmVlblN0YXRlKHNuKTtcclxuXHRcdHdzLnNlbmQoY2hlY2tCdWZmZXIpO1xyXG5cdH1cclxuXHJcblx0d3MuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ1N0YXRl54q25oCB5YC8enp6eno6ICcsIHdzLnJlYWR5U3RhdGUpXHJcblx0XHQvLyBpZiAod3MucmVhZHlTdGF0ZSAhPT0gMSkge1xyXG5cdFx0Ly8gXHRzZWxmLnBvc3RNZXNzYWdlKHtcclxuXHRcdC8vIFx0XHRcInJlYWR5U3RhdGVcIjogM1xyXG5cdFx0Ly8gXHR9KTtcclxuXHRcdC8vIH1cclxuXHRcdHZhciBpbnB1dCA9IG5ldyBVaW50OEFycmF5KGV2ZW50LmRhdGEpO1xyXG5cdFx0aWYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gY3VyVGltZSA+IDIwMDApIHtcclxuXHRcdFx0d3Muc2VuZChcInBpbmdcIik7XHJcblx0XHRcdGN1clRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaW5wdXRbMF0gPT0gMCAmJiBpbnB1dFsxXSA9PSAwICYmIGlucHV0WzJdID09IDAgJiYgaW5wdXRbM10gPT0gMSkge1x0XHJcblx0XHRcdHZhciBuYWxUeXBlID0gaW5wdXRbNF0gJiAweDFmO1xyXG5cdFx0XHRmcmFtZUNvdW50Kys7XHJcblx0XHRcdGlmIChuYWxUeXBlID09IDB4MDUgfHwgbmFsVHlwZSA9PSAweDA1IHx8IG5hbFR5cGUgPT0gMHgwNykge1xyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCLmlLbliLBJIOW4p1wiKTtcclxuXHRcdFx0XHRzZWxmLnBvc3RNZXNzYWdlKGlucHV0KTtcclxuXHRcdFx0XHRoYXNQUFMgPSB0cnVlO1xyXG5cdFx0XHRcdHdzLnNlbmQoXCJwaW5nXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIWhhc1BQUykvL+ivt+axgkkg5binXHJcblx0XHRcdHtcclxuXHRcdFx0XHR2aWRlb1BhY2tldE51bSsrO1xyXG5cdFx0XHRcdGlmICh2aWRlb1BhY2tldE51bSA+IDIgJiYgIWhhc1BQUykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJwYWNrZXRudW0g57yW5Y+3XCIgKyB2aWRlb1BhY2tldE51bSk7XHJcblx0XHRcdFx0XHR2aWRlb1BhY2tldE51bSA9IDA7XHJcblx0XHRcdFx0XHR3cy5zZW5kKFJlcXVlc3RJRnJhbWUoc24pKTtcclxuXHRcdFx0XHRcdGhhc1BQUyA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHNlbGYucG9zdE1lc3NhZ2UoaW5wdXQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChpbnB1dFswXSA9PSAweGZmKSB7XHJcblx0XHRcdHNlbGYucG9zdE1lc3NhZ2UoaW5wdXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpbnB1dFswXSA9PSAweDY4KSB7XHJcblx0XHRcdGlmIChpbnB1dFsyM10gPT0gMHg1Yykge1xyXG5cdFx0XHRcdGlmIChDaGVja1ZlcmlmeUNvZGUoaW5wdXQpKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIumJtOadg+mAmui/h++8jOmFjee9rumAmumBk1wiKTtcclxuXHRcdFx0XHRcdGRvQ29uY2ZpZ0NoYW5uZWwoKTtcclxuXHRcdFx0XHRcdHZhciBidWZmZXIgPSBtYWtlU2hhcnBuZXNzKDMpO1x0XHRcdFx0XHJcblx0XHRcdFx0XHR3cy5zZW5kKGJ1ZmZlcik7XHJcblx0XHRcdFx0XHR2YXIgYnVmZmVyRnBzID0gZnBzU2V0KDIwKVxyXG5cdFx0XHRcdFx0d3Muc2VuZChidWZmZXJGcHMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwi6Ym05p2D5aSx6LSlOlwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly/mqKrnq5blsY/moIfor4ZcclxuXHRcdFx0aWYgKGlucHV0WzIzXSA9PSAweDA1KSB7XHJcblx0XHRcdFx0Ly8wMTAxIOaoquerluWxj+ebuOWFs1xyXG5cdFx0XHRcdGlmIChpbnB1dFsyOF0gPT0gMHgwMSAmJiBpbnB1dFsyOV0gPT0gMHgwMSkge1xyXG5cdFx0XHRcdFx0dmFyIHN0YXRlID0gQ2hlY2tTY3JlZW5EaXJlY3Rpb24oaW5wdXQuc2xpY2UoMjQsIDI0ICsgOCkpO1xyXG5cdFx0XHRcdFx0aWYgKHN0YXRlID09IDEpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCLlronljZPljaHmraTml7bnq5blsY9cIik7XHJcblx0XHRcdFx0XHRcdHNlbGYucG9zdE1lc3NhZ2Uoe1xyXG5cdFx0XHRcdFx0XHRcdFwic2V0UmVzb2x2aW5nXCI6IDFcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIuWuieWNk+WNoeatpOaXtuaoquWxjyAxMTExXCIpO1xyXG5cdFx0XHRcdFx0XHRzZWxmLnBvc3RNZXNzYWdlKHtcclxuXHRcdFx0XHRcdFx0XHRcInNldFJlc29sdmluZ1wiOiAwXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHR3cy5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ01zZyBDbG9zZS4uLi4nKVxyXG5cdFx0c2VsZi5wb3N0TWVzc2FnZSgnY2xvc2UnKTtcclxuXHR9KTtcclxuXHJcbn1cclxuXHJcbiJdfQ==