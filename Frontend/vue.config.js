//const path = require('path')
module.exports = {
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/styles/imports.scss";`
            },
        },
    },
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: 'raw-loader',
                }
            ],
        }
    },
    chainWebpack: () => {
        /*const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))*/
        /*config.module.rule('images').use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, { limit: 10240 }));*/
    },
    pluginOptions: {},
    devServer: {
        host: '0.0.0.0',
        port: 8081,
    }
};

/*
function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, './src/styles/imports.scss'),
            ],
        })
}*/
