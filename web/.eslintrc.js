module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,
  env: {
    browser: true,
    node: true,
  },

  parser: 'vue-eslint-parser',
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  globals: {
    ga: false, // Google Analytics
    cordova: true,
    __statics: true,
    process: true,
    Capacitor: true,
    chrome: true
  },

  // add your custom rules here
  rules: {
    'no-prototype-builtins': 'off',
    'prefer-const': 'warn',
    // 'no-console': 'off',
    // 'no-debugger': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/no-unused-components': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/no-unused-vars': 'warn',
    'vue/no-multi-spaces': 'error', // 空格不允许有多个
    'vue/html-self-closing': 'off', // html 自闭合标签
    'vue/mustache-interpolation-spacing': 'warn', // 双花括号和内容之间需要有空格
    // 属性换行配置
    'vue/max-attributes-per-line': ['error', {
      'singleline': {
        'max': 1
      },
      'multiline': {
        'max': 1
      }
    }],
    // 闭合标签的空格数(>和属性之间的空格)
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'always'
      }
    ],
    'no-unused-vars': 'warn', //规定不要定义未使用的变量
    'no-trailing-spaces': 'warn', //规定行末不留空格
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-this-alias': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/member-delimiter-style': ['error', {
      'multiline': {
        'delimiter': 'none',
        'requireLast': true
      },
      'singleline': {
        'delimiter': 'semi',
        'requireLast': false
      },
    }],
    'semi': ['error', 'never'], // 语句结尾不要使用分号
    'array-bracket-spacing': ['warn', 'never'], //是否允许非空数组里面有多余的空格
    'arrow-parens': ['warn', 'always'], //箭头函数用小括号括起来
    'arrow-spacing': 'warn', // =>的前/后空格
    'use-isnan': 'error', //禁止比较时使用NaN，只能用isNaN()
    'no-irregular-whitespace': 'error', //不能有不规则的空格
    'no-iterator': 'error', //禁止使用__iterator__ 属性
    'no-label-var': 'error', //label名不能与var声明的变量名相同
    'indent': ['error', 2, {
      'SwitchCase': 1 //让 swatch-case 语句 case 子句缩进2个空格
    }], //规定使用几个空格进行缩进。第二个参数表示空格的个数
    'quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }], //规定除需要转义的情况外，字符串统一使用单引号
    'keyword-spacing': 'error',
    'no-undef': 'error', //不能有未定义的变量
    'no-underscore-dangle': 'off', //标识符不能以_开头或结尾
    'camelcase': ['error', { 'properties': 'never' }], //规定变量和函数使用驼峰命名法。第二个参数配置对象属性是否也要遵循驼峰命名法
    'no-multi-spaces': 'warn', //规定除了缩进，不要使用多个空格
    'no-multiple-empty-lines': ['warn', { 'max': 2 }], //空行最多不能超过2行
    'space-before-function-paren': ['off', 'always'], //函数定义时括号前面要不要有空格
    'block-spacing': ['error', 'always'], //规定单行代码两边加空格
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }], //规定 “else” 关键字要与花括号保持在同一行
    'comma-spacing': ['error', { 'before': false, 'after': true }], //规定逗号后面必须添加空格
    'comma-dangle': 'off',
    'curly': ['error', 'multi-line'], //规定多行 if 语句的的括号不能省略
    'dot-location': ['error', 'property'], //规定点号操作符须与属性需在同一行
    'eol-last': 'error', //规定文件末尾空一行，以防文件解析错误。
    'func-call-spacing': ['error', 'never'], //规定函数调用时标识符与括号间不留间隔
    'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }], //规定键值对中冒号与值之间要留空白
    'no-mixed-spaces-and-tabs': 'error', //规定不能混合使用空格与制表符作为缩进
    'no-whitespace-before-property': 'error', // 规定属性前面不能加空格。
    'semi-spacing': ['error', { 'before': false, 'after': true }], //规定分号前不留空格，后面留一个空格
    'space-before-blocks': ['error', 'always'], //规定代码块收尾需留空格。第二个参数配置是否需要空格
    'space-in-parens': ['error', 'never'], //规定圆括号间不留空格。第二个参数配置是否需要空格
    'space-infix-ops': 'error', //规定字符串拼接操作符 (Infix operators) 之间要留空格
    'new-parens': 'error', //规定无参的构造函数调用时要带上括号
    'no-class-assign': 'error', //规定避免对类名重新赋值
    'no-constant-condition': ['warn', { 'checkLoops': false }], //规定避免使用常量作为条件表达式的条件（循环语句除外）
    'no-delete-var': 'error', //规定不要对变量使用 delete 操作
    'no-dupe-args': 'error', //规定不要定义重复的函数参数
    'no-dupe-class-members': 'error', //规定类中不要定义重复的属性
    'no-dupe-keys': 'error', //规定对象字面量中不要定义重复的属性
    'no-duplicate-case': 'error', //规定switch 语句中不要定义重复的 case 分支
    'no-empty': 'warn', // 规定语句块不能为空
    'no-empty-character-class': 'error', //规定正则中不要使用空字符
    'no-empty-pattern': 'error', //规定不要解构空值
    'no-ex-assign': 'error', //定义catch 中不要对错误重新赋值
    'no-fallthrough': 'error', //规定switch一定要使用 break 来将条件分支正常中断
    'no-global-assign': 'error', //规定不要对全局只读对象重新赋值
    'no-invalid-regexp': 'error', //规定不要向 RegExp 构造器传入非法的正则表达式
    'no-self-assign': 'error', //规定避免将变量赋值给自己
    'no-shadow-restricted-names': 'error', //规定禁止随意更改关键字的值
    'no-template-curly-in-string': 'error', //规定正确使用 ES6 中的字符串模板
    'no-unreachable': 'warn', //规定return，throw，continue 和 break 后不要再跟代码
    'no-control-regex': 'error', //规定禁止在正则表达式中使用控制字符
    'no-use-before-define': ['error', { 'functions': false, 'classes': false, 'variables': false }], //规定未定义前不能使用
    'no-redeclare': 'error', //规定不要重复声明变量
    'no-useless-escape': 'warn', //规定禁止不必要的转义
    'no-useless-rename': 'error', //规定import, export 和解构操作中，禁止赋值到同名变量
    'one-var': ['error', { 'initialized': 'never' }], //规定每个 var 关键字单独声明一个变量
    'new-cap': ['error', { 'newIsCap': true, 'capIsNew': false }], //规定构造函数要以大写字母开头
  }
}
