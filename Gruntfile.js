module.exports = function(grunt) {

  //Creates a reference to the package obj
  var pkg = require('./package.json');

  //Checks the dependencies associated with Grunt and autoloads
  //& requires ALL of them in this Gruntfile
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);


  // Project configuration.
  grunt.initConfig({

    //connect settings. used in grunt serve and livereload
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
        }
      },
      dist: {
        options: {
          base: '~/<%= pkg.name %>'
        }
      }
    },






    //Sass configuration
    sass: {
      dev: {
        options: {
          style: 'expanded',
          compass: true
        },
        files: {
          'css/main.css': 'scss/main.scss'
        }
      }
    },






    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 8', 'ie 9'],
        diff: true
      },
      single_file: {
          expand: true,
          cwd: 'css/',
          src: 'main.scss',
          dest: 'css/'
      }
    },//autoprefixer






    //compass -required for autoprefixer
    compass: {
      options: {
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },






    //Watches files and folders for us
    watch: {

      //watch to see if we change this gruntfile
      gruntfile: {
        files: ['Gruntfile.js']
      },

      //compass
      compass: {
        files: ['scss/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
        //tasks: ['compass:server', 'autoprefixer'] removed to hack error. Reenable before build
      },

      //livereload
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '{,*/}*.html',
          '{,*/}*.php',
          'js/{,*/}*.js',
          'scss/{,*/}*.scss',
          'images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },

      //sass
      sass: {
        files: 'scss/{,*/}*.{scss,sass}',
        tasks: ['sass:dev']
      },
    },// watch







    //Require js r.js optimizer
    requirejs : {
      compile : {
        options : {

          appDir: "./",
          baseUrl: "./js",
          optimize: "uglify",
          fileExclusionRegExp: /^node_modules|Gruntfile.js|package.json|working_files|scss|.sass-cache|.git$/,
          paths:{
                  'jquery'          : 'jquery',
                  'Handlebars'      : 'libs/handlebars',
                  'lightbox'        : 'libs/lightbox-2.6.min',
                  'User'            : 'controllers/user',
                  'Init'            : 'controllers/init',
                  'Auth'            : 'controllers/auth',
                  'Content'         : 'controllers/content',
                  'Ui'              : 'controllers/ui',
                  'Library'         : 'controllers/library',
                  'Player'          : 'controllers/player',
                  'socketService'   : 'services/socketService',
                  'getCookies'      : 'services/getCookiesService',
                  'determineDevice' : 'services/determineDevice',
                  'getUserDevices'  : 'services/getUserDevices',
                  'toggleUi'        : 'services/toggleUi',
                  'videoSizer'      : 'services/videoSizer',
                  'renderSongInfo'  : 'services/renderSongInfo',
                  'sortContent'     : 'services/sortContent',
                  'dragAndDrop'     : 'services/dragAndDropPlaylists',
                  'slider'          : 'services/slider',
                  'tips'            : 'services/toolTips',
                  'validation'      : 'services/validation',
                  'logging'         : 'services/logging',
                  'activeItem'      : 'services/activeItem'
                },

                dir: "../build",
                    modules: [
                              {name : 'User'},
                              {name : 'Init'},
                              {name : 'Auth'},
                              {name : 'Content'},
                              {name : 'Ui'},
                              {name : 'Library'},
                              {name : 'Player'},
                              {name : 'socketService'},
                              {name : 'getCookies'},
                              {name : 'determineDevice'},
                              {name : 'getUserDevices'},
                              {name : 'toggleUi'},
                              {name : 'videoSizer'},
                              {name : 'renderSongInfo'},
                              {name : 'sortContent'},
                              {name : 'dragAndDrop'},
                              {name : 'slider'},
                              {name : 'tips'},
                              {name : 'validation'},
                              {name : 'logging'},
                              {name : 'activeItem'}
                              ]
        }//options
      }//compile
    }//requirejs

  });//grunt.initConfig




  //grunt serve
  grunt.registerTask('serve', function (target) {

    grunt.task.run([
      'connect:livereload',
      'watch',
      'sass:dev'
    ]);
  });


  //Build
  grunt.registerTask('build', 'requirejs');






};//module.exports
