// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    'indent': [2, 4], // 使用4个空格缩进
    'no-tabs': 'off', // 不禁用制表符
    'space-before-function-paren': [0, 'always'], // 函数定义时括号前面要不要有空格
    'semi': [2, 'always'], // 强制语句分号结尾
    'eol-last': 0, // 不强制文件以换行符结束
    'no-new': 0, // 不禁止在使用new构造一个实例后不赋值
    'eqeqeq': 0, // 不强制使用全等
  }
}
