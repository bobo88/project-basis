# webRTC 

### 一、概念：
+ WebRTC 即网页即时通信（Web Real-Time Communication)，允许浏览器之间直接连接。 一对一通信/对等连接，可以绕过服务器，大大减少延迟。需要【信令服务器 Signaling server】，使用Nodejs下的socket.io库来实现WebRTC信令服务器。
+ STUN 服务器。
+ Turn 服务器。
+ NAT（Network Address Translation，网络地址转换) 。
+ WebSocket 全双工协议：需要通过服务器连接。
+ 多方通信架构方案： Mesh（4｜10），MCU（1｜5），SFU（5｜25）。
+ 怎么知道彼此的存在 / 进入同一个房间 / 2方都要登录服务器 / 由服务器通知 / 信令服务器
+ 音视频数据怎么传输 / 服务器转发或P2P / 商业方案基本走服务器转发
+ 音视频编码 / 音视频解码：媒体协商 H264/H265， SDP； 网络协商
+ 麦克风采集(声音：AD模数的转换 --44.1KHz -- 数字处理 -- 44.1KHz -- DA:数模转换 -- 喇叭) / 摄像头采集 / 8bit-16bit(能较好的记录现实生活中的声音)-24bit-32bit
+ 视频为什么会花屏 / 音频为什么容易有杂音
+ 视频： 像素 / 分辨率（逐行扫描/隔行扫描） / 位深（8bit/10bit) / 帧率 / 码率 / Stride跨距 / 
+ 视频为什么需要压缩
+ RGB / YUV 
+ 
+ 
+ 
+ 
+ 
+ 
+ 

### 二、云游戏与webRTC的结合：
+ todo