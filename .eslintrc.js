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
        /**
         * 函数返回值必须与声明的类型一致
         * @category TypeScript
         */
        '@typescript-eslint/explicit-function-return-type': 'error',
        /**
         * 禁止给一个初始化时直接赋值为 number, string 的变量显式的指定类型
         * @category TypeScript
         * @reason 可以简化代码
         * @fixable
         */
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/typedef': [
            'error',
            {
                'variableDeclaration': true,    // 变量需要声明类型
            }
        ],
        '@typescript-eslint/ban-types': [
            'error',
        ]
    }
};