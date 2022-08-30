### H264Parser
+ `第一段：关键词  track mp4track`
```
    // 第一段：关键词  track mp4track
    function H264Parser(remuxer) {
      _classCallCheck(this, H264Parser);

      this.remuxer = remuxer;
      this.track = remuxer.mp4track;
    }
```
+ `第二段：关键词 config`
```
    // 第二段：关键词 config
    var config = H264Parser.readSPS(new Uint8Array(sps));
    this.track.width = config.width;
    this.track.height = config.height;
    console.log(11111158, this.track, config.width, config.height)
```
+ `第三段：关键词 mp4track`
```
    // 第三段：关键词 mp4track
    function H264Remuxer() {
        // ......
      _this.mp4track = {
        id: BaseRemuxer.getTrackID(),
        type: 'video',
        len: 0,
        fragmented: true,
        sps: '',
        pps: '',
        width: 0,
        height: 0,
        timescale: _this.timescale,
        duration: _this.timescale,
        samples: []
      };
      _this.samples = [];
      _this.h264 = new H264Parser(_assertThisInitialized(_this));
      return _this;
    }
```


