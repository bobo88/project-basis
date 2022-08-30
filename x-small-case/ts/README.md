# Learn TS  
*一系列学习「 TS 」的小demo*

--------------------------------------
### 项目运行：
> 1. 根目录下运行命令： `tsc -w`，生成`dist`目录  
> 2. 新开DOS窗口，进入`dist`目录，运行`node **_**.js`即可查看代码运行效果，或不进入`dist`目录，运行`node dist/**_**.js`    
> 3. 哔哩哔哩中的学习视频，如果觉得「2倍速」还是很慢， 又不想一直按「右箭头」，则可以在控制台运行`$('.bilibili-player-video').find('video')[0].playbackRate = 3`，其中 ‘3’表示速度。注意：find('video')中`video`不确定，需要查看具体元素才行，可能是`bwp-video`。  
>   + 设置播放缓存：sessionStorage.setItem('bilibili_player_settings',JSON.stringify({"block":{},"video_status":{"videospeed":2.5}})); 
>   + 先复制`bilibili_player_settings`的值，然后把`videospeed`的值改成自定义的即可
> 4. 注意： `find('video')`可能需要调整为`find('bwp-video')`，需要看具体页面的播放器包裹  











