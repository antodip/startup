module.exports = function (config) {
  config.set({

    frameworks: ["tap", "karma-typescript"],

    files: [

      // System.js for module loading
      'node_modules/systemjs/dist/system.src.js',

      // Polyfills
      'node_modules/core-js/client/shim.js',

      // zone.js
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',

      { pattern: "./client/app/icons/*.*", included: true },
            
      //{ pattern: "client/test/base/base.spec.ts" },
      { pattern: "client/test/*.ts" },

      { pattern: "client/app/**/*.+(ts|html)" }
    ],

    proxies: {
      "/app/": '/base/client/app/'
      //"/app/": "/base/src/app/" // use this without moduleId + templateUrl: "app/hello.html"
    },

    preprocessors: {
      "**/*.ts": ["karma-typescript"]
    },

    exclude: [ 'client/app/main.ts' ],

    reporters: ["progress", "karma-typescript"],

    browsers: ["Chrome"],

    //uncomment for building automation
    //singleRun: true
  });
};