module.exports = function(grunt) {
  var jsIncludes = ['jquery.js'];
  var jsFiles = ['index.js', 'background.js'];

  grunt.initConfig({
    clean: ['dist', 'tmp'],
    copy: {
      main: {
        files: [
          {src: "manifest.json", dest: "dist/"},
          {src: "style.css", dest: "dist/"},
          {src: "jquery.js", dest: "dist/"},
          {src: "index.js", dest: "dist/"},
          {src: "background.js", dest: "dist/"},
          {expand: true, src: "images/*", dest: "dist/"}
        ]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      main: jsFiles
    },
    watch: {
      js: {
        files: jsFiles,
        tasks: ['jshint', 'copy', 'zip']
      },
      style: {
        files: "style.css",
        tasks: ['copy', 'zip']
      },
      manifest: {
        files: ['manifest.json'],
        tasks: ['copy', 'zip']
      }
    },
    zip: {
      'using-cwd': {
        cwd: 'dist', 
        src: ['dist/*'],
        dest: 'be_more_original.zip'
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-zip');

  grunt.registerTask('default', [
    'clean',
    'jshint',
    'copy',
    'zip',
    'watch'
  ]);
};
