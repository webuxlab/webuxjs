//  ██████╗ ██████╗ ██╗   ██╗███╗   ██╗████████╗
// ██╔════╝ ██╔══██╗██║   ██║████╗  ██║╚══██╔══╝
// ██║  ███╗██████╔╝██║   ██║██╔██╗ ██║   ██║
// ██║   ██║██╔══██╗██║   ██║██║╚██╗██║   ██║
// ╚██████╔╝██║  ██║╚██████╔╝██║ ╚████║   ██║
//  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝

/**
 * File: Gruntfile.js
 * Author: Tommy Gingras
 * Date: 2018-07-08
 * License: All rights reserved Studio Webux 2015-Present
 */

"use strict";

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("./package.json"),

    jslint: {
      server: {
        src: [
          "Gruntfile.js",
          "api/**/*.js",
          "tests/**/*.js",
          "app/*.js",
          "models/*.js",
          "config/*.js",
          "defaults/*.js"
        ],
        directives: {
          node: true,
          todo: true
        },
        options: {
          edition: "latest", // specify an edition of jslint or use 'dir/mycustom-jslint.js' for own path
          junit: "out/server-junit.xml", // write the output to a JUnit XML
          log: "out/server-lint.log",
          jslintXml: "out/server-jslint.xml",
          errorsOnly: true, // only display errors
          failOnError: false, // defaults to true
          checkstyle: "out/server-checkstyle.xml" // write a checkstyle-XML
        }
      }
    },

    compress: {
      dist: {
        options: {
          archive: "dist/<%= pkg.name %>-<%= pkg.version %>.zip"
        },
        files: [
          {
            src: [
              "api/**",
              "app/index.js",
              "config/**",
              "defaults/**",
              "locales/**",
              "models/**",
              "public/**",
              "apidoc/**",
              "uploads/**",
              "package.json",
              "package-lock.json",
              "index.js",
              "license.txt",
              ".ebextensions/**",
              ".elasticbeanstalk/**"
            ],
            dest: "/"
          }
        ]
      },
      test: {
        options: {
          archive: "dist/<%= pkg.name %>-<%= pkg.version %>.zip"
        },
        files: [
          {
            src: [
              "api/**",
              "app/index.js",
              "config/**",
              "defaults/**",
              "locales/**",
              "models/**",
              "public/**",
              "apidoc/**",
              "uploads/**",
              "package.json",
              "package-lock.json",
              "index.js",
              "license.txt",
              ".ebextensions/**",
              ".elasticbeanstalk/**",
              "tests/**"
            ],
            dest: "/"
          }
        ]
      }
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            src: [
              "api/**",
              "app/index.js",
              "config/**",
              "defaults/**",
              "locales/**",
              "models/**",
              "public/**",
              "apidoc/**",
              "uploads/**",
              "package.json",
              "package-lock.json",
              "index.js",
              "license.txt",
              ".ebextensions/**",
              ".elasticbeanstalk/**"
            ],
            dest: "dist/"
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks("grunt-jslint");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-compress");

  grunt.registerTask("package", ["compress:dist"]);
  grunt.registerTask("package-4-test", ["compress:test"]);
  grunt.registerTask("package-4-prod", ["copy:main"]);
  grunt.registerTask("check", ["jslint:server"]);
  grunt.registerTask("security", ["jslint:all"]);
};
