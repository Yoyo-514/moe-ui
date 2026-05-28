import postcssColorMix from 'postcss-color-mix'
import postcssEach from 'postcss-each'
import postcssEachVariables from 'postcss-each-variables'
import postcssFor from 'postcss-for'

export default {
  plugins: [
    // 为 each 循环提供变量支持
    postcssEachVariables,

    // 支持 each 循环
    postcssEach({
      plugins: {
        beforeEach: [
          // 在 each 循环前先执行 for 循环
          postcssFor,
          // 在 each 循环前处理 color-mix
          postcssColorMix,
        ],
      },
    }),
  ],
}
