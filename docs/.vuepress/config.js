module.exports = {
  title: 'Algorithms',
  description: 'Course on algorithms with Python',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Company', link: 'https://toledo.vives.be' },
      { text: 'License', link: '/LICENSE.md' },
    ],
    sidebar: [['/', 'Home'], ['/python/', 'Python']],
    repo: 'https://github.com/pcordemans/devbit-algorithms.git',
    docsDir: 'docs',
    docsBranch: 'master'
  },
  markdown: {
    lineNumbers: true,
  },
  serviceWorker: true,
  plugins: [
    ['vuepress-plugin-zooming', {
      // selector for images that you want to be zoomable
      // default: '.content img'
      selector: 'img',

      // make images zoomable with delay after entering a page
      // default: 500
      // delay: 1000,

      // options of zooming
      // default: {}
      options: {
        bgColor: 'black',
        zIndex: 10000,
      },
    }],
    ['container', {
      type: 'output',
      defaultTitle: 'Output',
    }]
  ],
}
