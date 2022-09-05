module.exports = {
  dev: {
    MODE: "development",
    ENV_API: "http://dev/" //测试服务器地址
  },
  test: {
    MODE: "test",
    ENV_API: "http://test/" //测试服务器地址
  },
  pro: {
    MODE: "production",
    ENV_API: "https://pro/" // 正式服务器地址
  }
}
