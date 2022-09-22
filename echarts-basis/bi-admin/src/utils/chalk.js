(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports', 'echarts'], factory)
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    // CommonJS
    factory(exports, require('echarts'))
  } else {
    // Browser globals
    factory({}, root.echarts)
  }
}(this, function(exports, echarts) {
  var log = function(msg) {
    if (typeof console !== 'undefined') {
      console && console.error && console.error(msg)
    }
  }
  if (!echarts) {
    log('ECharts is not Loaded')
    return
  }
  echarts.registerTheme('chalk', {
    'color': [
      '#0bdbdd',
      '#206bff',
      '#7386ff',
      '#cf9eff',
      '#eec374',
      '#fa6cab',
      '#19a3ff',
      '#bfbfbf'
    ],
    'backgroundColor': 'rgba(9,24,64,1)',
    'textStyle': {},
    'title': {
      'textStyle': {
        'color': '#ffffff'
      },
      'subtextStyle': {
        'color': '#dddddd'
      }
    },
    'line': {
      'itemStyle': {
        'borderWidth': '2'
      },
      'lineStyle': {
        'width': '2'
      },
      'symbolSize': '0',
      'symbol': 'circle',
      'smooth': true
    },
    'radar': {
      'itemStyle': {
        'borderWidth': '2'
      },
      'lineStyle': {
        'width': '2'
      },
      'symbolSize': '0',
      'symbol': 'circle',
      'smooth': true
    },
    'bar': {
      'itemStyle': {
        'barBorderWidth': '0',
        'barBorderColor': '#cccccc'
      }
    },
    'pie': {
      'itemStyle': {
        'borderWidth': '0',
        'borderColor': '#cccccc'
      }
    },
    'scatter': {
      'itemStyle': {
        'borderWidth': '0',
        'borderColor': '#cccccc'
      }
    },
    'boxplot': {
      'itemStyle': {
        'borderWidth': '0',
        'borderColor': '#cccccc'
      }
    },
    'parallel': {
      'itemStyle': {
        'borderWidth': '0',
        'borderColor': '#cccccc'
      }
    },
    'sankey': {
      'itemStyle': {
        'borderWidth': '0',
        'borderColor': '#cccccc'
      }
    },
    'funnel': {
      'itemStyle': {
        'borderWidth': '0',
        'borderColor': '#cccccc'
      }
    },
    'gauge': {
      'itemStyle': {
        'borderWidth': '0',
        'borderColor': '#cccccc'
      }
    },
    'candlestick': {
      'itemStyle': {
        'color': '#fa6cab',
        'color0': 'transparent',
        'borderColor': '#e04262',
        'borderColor0': '#0bdbdd',
        'borderWidth': '2'
      }
    },
    'graph': {
      'itemStyle': {
        'borderWidth': '0',
        'borderColor': '#cccccc'
      },
      'lineStyle': {
        'width': '1',
        'color': '#ffffff'
      },
      'symbolSize': '0',
      'symbol': 'circle',
      'smooth': true,
      'color': [
        '#0bdbdd',
        '#206bff',
        '#7386ff',
        '#cf9eff',
        '#eec374',
        '#fa6cab',
        '#19a3ff',
        '#bfbfbf'
      ],
      'label': {
        'color': '#ffffff'
      }
    },
    'map': {
      'itemStyle': {
        'normal': {
          'areaColor': '#f3f3f3',
          'borderColor': '#999999',
          'borderWidth': 0.5
        },
        'emphasis': {
          'areaColor': 'rgba(255,178,72,1)',
          'borderColor': '#eb8146',
          'borderWidth': 1
        }
      },
      'label': {
        'normal': {
          'textStyle': {
            'color': '#893448'
          }
        },
        'emphasis': {
          'textStyle': {
            'color': 'rgb(137,52,72)'
          }
        }
      }
    },
    'geo': {
      'itemStyle': {
        'normal': {
          'areaColor': '#f3f3f3',
          'borderColor': '#999999',
          'borderWidth': 0.5
        },
        'emphasis': {
          'areaColor': 'rgba(255,178,72,1)',
          'borderColor': '#eb8146',
          'borderWidth': 1
        }
      },
      'label': {
        'normal': {
          'textStyle': {
            'color': '#893448'
          }
        },
        'emphasis': {
          'textStyle': {
            'color': 'rgb(137,52,72)'
          }
        }
      }
    },
    'categoryAxis': {
      'axisLine': {
        'show': true,
        'lineStyle': {
          'color': '#666666'
        }
      },
      'axisTick': {
        'show': false,
        'lineStyle': {
          'color': '#333'
        }
      },
      'axisLabel': {
        'show': true,
        'textStyle': {
          'color': '#999999'
        }
      },
      'splitLine': {
        'show': false,
        'lineStyle': {
          'color': [
            '#e6e6e6'
          ]
        }
      },
      'splitArea': {
        'show': false,
        'areaStyle': {
          'color': [
            'rgba(250,250,250,0.05)',
            'rgba(200,200,200,0.02)'
          ]
        }
      }
    },
    'valueAxis': {
      'axisLine': {
        'show': true,
        'lineStyle': {
          'color': '#666666'
        }
      },
      'axisTick': {
        'show': false,
        'lineStyle': {
          'color': '#333'
        }
      },
      'axisLabel': {
        'show': true,
        'textStyle': {
          'color': '#999999'
        }
      },
      'splitLine': {
        'show': false,
        'lineStyle': {
          'color': [
            '#e6e6e6'
          ]
        }
      },
      'splitArea': {
        'show': false,
        'areaStyle': {
          'color': [
            'rgba(250,250,250,0.05)',
            'rgba(200,200,200,0.02)'
          ]
        }
      }
    },
    'logAxis': {
      'axisLine': {
        'show': true,
        'lineStyle': {
          'color': '#666666'
        }
      },
      'axisTick': {
        'show': false,
        'lineStyle': {
          'color': '#333'
        }
      },
      'axisLabel': {
        'show': true,
        'textStyle': {
          'color': '#999999'
        }
      },
      'splitLine': {
        'show': false,
        'lineStyle': {
          'color': [
            '#e6e6e6'
          ]
        }
      },
      'splitArea': {
        'show': false,
        'areaStyle': {
          'color': [
            'rgba(250,250,250,0.05)',
            'rgba(200,200,200,0.02)'
          ]
        }
      }
    },
    'timeAxis': {
      'axisLine': {
        'show': true,
        'lineStyle': {
          'color': '#666666'
        }
      },
      'axisTick': {
        'show': false,
        'lineStyle': {
          'color': '#333'
        }
      },
      'axisLabel': {
        'show': true,
        'textStyle': {
          'color': '#999999'
        }
      },
      'splitLine': {
        'show': false,
        'lineStyle': {
          'color': [
            '#e6e6e6'
          ]
        }
      },
      'splitArea': {
        'show': false,
        'areaStyle': {
          'color': [
            'rgba(250,250,250,0.05)',
            'rgba(200,200,200,0.02)'
          ]
        }
      }
    },
    'toolbox': {
      'iconStyle': {
        'normal': {
          'borderColor': '#999999'
        },
        'emphasis': {
          'borderColor': '#b0b0b0'
        }
      }
    },
    'legend': {
      'textStyle': {
        'color': '#ffffff'
      }
    },
    'tooltip': {
      'axisPointer': {
        'lineStyle': {
          'color': '#cccccc',
          'width': 1
        },
        'crossStyle': {
          'color': '#cccccc',
          'width': 1
        }
      }
    },
    'timeline': {
      'lineStyle': {
        'color': '#0bdbdd',
        'width': '2'
      },
      'itemStyle': {
        'normal': {
          'color': '#0bdbdd',
          'borderWidth': 1
        },
        'emphasis': {
          'color': '#eec374'
        }
      },
      'controlStyle': {
        'normal': {
          'color': '#0bdbdd',
          'borderColor': '#0bdbdd',
          'borderWidth': 0.5
        },
        'emphasis': {
          'color': '#0bdbdd',
          'borderColor': '#0bdbdd',
          'borderWidth': 0.5
        }
      },
      'checkpointStyle': {
        'color': '#fa6cab',
        'borderColor': 'rgba(255,255,255,1)'
      },
      'label': {
        'normal': {
          'textStyle': {
            'color': '#999999'
          }
        },
        'emphasis': {
          'textStyle': {
            'color': '#999999'
          }
        }
      }
    },
    'visualMap': {
      'color': [
        '#0bdbdd',
        '#206bff'
      ]
    },
    'dataZoom': {
      'backgroundColor': 'rgba(255,255,255,0)',
      'dataBackgroundColor': 'rgba(209,191,191,1)',
      'fillerColor': 'rgba(114,204,255,0.2)',
      'handleColor': '#206bff',
      'handleSize': '100%',
      'textStyle': {
        'color': '#333333'
      }
    },
    'markPoint': {
      'label': {
        'color': '#ffffff'
      },
      'emphasis': {
        'label': {
          'color': '#ffffff'
        }
      }
    }
  })
}))
