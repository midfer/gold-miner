module.exports = {
    extends: [
        'eslint-config-alloy/typescript',
    ],
    globals: {
        // 这里填入你的项目需要的全局变量
        // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
        cc: false,
        jest: false,
        beforeEach: false,
        afterEach: false,
        describe: false,
        expect: false,
        test: false,
    },
    rules: {
        // 这里填入你的项目需要的个性化配置，比如：
    }
};