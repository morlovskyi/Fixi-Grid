module.exports = function (grunt) {
    grunt.initConfig({
        ts: {
            options: {
                declaration: false
            },
            default: {
                src: ["scripts/fixi.grid/**/*.ts"],
                out: "scripts/build/fixi.grid.js",
                watch: "scripts/fixi.grid/**/*.*",
                html: ["scripts/fixi.grid/templates/*.html"],
                options: {
                    htmlVarTemplate: 'markup',
                    htmlOutputTemplate: '/* tslint:disable:max-line-length */ \n\
                      namespace FixiGridUI.Markup {\n\
                          export var <%= modulename %> = \'<%= content %>\';\n\
                      }\n'
                }
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            my_target: {
                files: {
                    'scripts/build/fixi.grid.min.js': ['scripts/build/fixi.grid.js']
                }
            }
        }

    });
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask("default", ["ts", "uglify"]);
};