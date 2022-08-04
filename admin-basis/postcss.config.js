module.exports = {
    plugins:[
        require("autoprefixer")({
            overrideBrowserslist:[
                "Chrom 65",
                "last 10 versions",
            ]
        }),
        require("postcss-import"),
        {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
                charset: (atRule) => {
                    if (atRule.name === 'charset') {
                        atRule.remove();
                    }
                }
            }
        }
    ]
}