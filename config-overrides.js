module.exports = {
    webpack: function (config, env) {
        config.externals = {
            ...(config.externals ?? {}),
            jquery: "$",
            three: "THREE",
        }
        
        return config
    },
}