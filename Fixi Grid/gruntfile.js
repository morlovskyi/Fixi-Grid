module.exports = function (grunt) {
    grunt.initConfig({
        ts: {
            options: {
                declaration: true
            },
            default: {
                src: ["scripts/fixi.grid/**/*.ts"],
                out: "scripts/build/fixi.grid.js",
                watch: ["scripts/fixi.grid/**/*.ts", "scripts/fixi.grid/**/*.html"],
                html: ["scripts/fixi.grid/templates/*.html"],
                tsconfig: false,
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
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'scripts/build/fixi.grid.min.css': ["scripts/fixi.grid/style/*.css"]
                }
            }
        }

    });
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('all', ['ts', 'uglify', 'cssmin']);
};
