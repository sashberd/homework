module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: '\r\n'
            },
            local: {
                src: ['../local/app.js', '../local/utils.js', '../local/filters/*.js', '../local/modules/*.js', '../local/services/*.js', '../local/factories/**/*.js', '../local/providers/*.js',
                     '../local/configurations/*.js', '../local/controllers/**/*.js', '../local/directives/*.js', '../semi/*.js',
                    '../local/run.js', '../../templates/templates.js'
                ],
                dest: '../dist/app.js'
            },
            'remote-test': {
                src: ['build/angular.js', 'build/spin.js', 'build/*.js'],
                dest: '../dist/remotes.js'
            },
            'remote-prod': {
                src: ['build/angular.min.js', 'build/spin.min.js', 'build/*.js'],
                dest: '../dist/remotes.js'
            },
            special: {
                src: ['../dist/app.js', '../special/*.js'],
                dest: '../dist/app.js'
            },
            //css: {
            //    src: ['../../css/*.css', 'build/*.css'],
            //    dest: '../dist/style.css'
            //},
            alreadyMinified: {
                src: ['../dist/app.js', '../minified/*.js'],
                dest: '../dist/app.js'

            }
        },
        shell: {
            test: {
                command: [
                    'cd build',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.9/angular.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.2/angular-ui-router.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.9/angular-animate.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.9/angular-sanitize.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-spinner/0.8.1/angular-spinner.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.9/angular-touch.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.3.0/ui-bootstrap-tpls.js', /*was 2.3.1 has many opened issues https://github.com/angular-ui/bootstrap/issues/6364*/
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/4.0.1/ui-grid.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.js',
                    'wget64 https://raw.githubusercontent.com/TekVanDo/Angular-Tek-Progress-bar/master/dist/tek.progress-bar.js', /*Have to be changed to angular ui progress bar*/
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-simple-logger/0.1.7/angular-simple-logger.js', 
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/leaflet-src.js',
                    'wget64 https://raw.githubusercontent.com/Leaflet/Leaflet.label/master/dist/leaflet.label-src.js', /*waiting for cdnjs */
                    'wget64 https://unpkg.com/leaflet.markercluster@1.0.0/dist/leaflet.markercluster-src.js', /*waiting for cdnjs */
                    'wget64 https://raw.githubusercontent.com/angular-ui/ui-leaflet/v2.0.0/dist/ui-leaflet.js', /*waiting for cdnjs */
                    'wget64 https://rawgit.com/elesdoar/ui-leaflet-layers/master/dist/ui-leaflet-layers.js', /*waiting for cdnjs */
                    'wget64 https://unpkg.com/leaflet.gridlayer.googlemutant@latest/Leaflet.GoogleMutant.js', /*waiting for cdnjs */
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-local-storage/0.5.0/angular-local-storage.js',
                    'mv  ui-leaflet-layers.js zui-leaflet-layers.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-timer/1.3.4/angular-timer.js',
                    //'wget64 https://raw.githubusercontent.com/iVantage/angular-ivh-treeview/v2.0.0-alpha.3/dist/ivh-treeview.js',  was done custom changes moved to semi
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.js',
                    //'wget64 https://cdnjs.cloudflare.com/ajax/libs/myforce-angularjs-dropdown-multiselect/1.10.2/angularjs-dropdown-multiselect.js', was done custom changes moved to semi
                    //'wget64 https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.3/lodash.js',
                    'wget64 https://raw.githubusercontent.com/outbrain/pure-angular-date-range-picker/master/dist/scripts/ob-daterangepicker.js', /*waiting for cdnjs*/
                    //'wget64 https://raw.githubusercontent.com/ManifestWebDesign/angular-gridster/master/src/angular-gridster.js',   /*waiting for cdnjs*/
                    'wget64 https://raw.githubusercontent.com/arkabide/angular-gridster/dynamic-colums/src/angular-gridster.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.5/nv.d3.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-nvd3/1.0.9/angular-nvd3.js',
                    'mv  angular-nvd3.js zangular-nvd3.js',
                    //'wget64 https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.js',
                    //'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-chart.js/1.1.1/angular-chart.js',
                    //'mv  angular-chart.js zangular-chart.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-translate/2.13.1/angular-translate.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-translate/2.13.1/angular-translate-storage-local/angular-translate-storage-local.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-translate/2.13.1/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-translate/2.13.1/angular-translate-handler-log/angular-translate-handler-log.js',
                    'mv  angular-translate-storage-local.js zangular-translate-storage-local.js',
                    'mv  angular-translate-loader-static-files.js zangular-translate-loader-static-files.js',
                    'mv  angular-translate-handler-log.js zangular-translate-handler-log.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.20.0/select.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-css/1.0.8/angular-css.js',
                    //'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-validation/1.4.2/angular-validation.js',
                    //'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-validation/1.4.2/angular-validation-rule.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.24/pdfmake.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.24/vfs_fonts.js', /*NOT TO MINIFYING !!!!! ONLY FONTS DEFINITIONS*/



                    'wget64 http://netdna.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/3.2.9/ui-grid.min.css',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/leaflet.css',
                    'wget64 https://raw.githubusercontent.com/Leaflet/Leaflet.label/master/dist/leaflet.label.css', /*waiting for cdnjs */
                    'wget64 https://unpkg.com/leaflet.markercluster@1.0.0/dist/MarkerCluster.Default.css', /*waiting for cdnjs */
                    'wget64 https://unpkg.com/leaflet.markercluster@1.0.0/dist/MarkerCluster.css', /*waiting for cdnjs */
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/hover.css/2.1.0/css/hover-min.css',
                    'wget64 https://raw.githubusercontent.com/outbrain/pure-angular-date-range-picker/0.10.1/dist/styles/ob-daterangepicker.css', /*waiting for cdnjs*/
                    'wget64 https://raw.githubusercontent.com/ManifestWebDesign/angular-gridster/master/dist/angular-gridster.min.css', /*waiting for cdnjs*/
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.5/nv.d3.min.css',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.20.0/select.min.css',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.2.0-rc2/css/bootstrap-rtl.min.css',


                    'cd ../../',
                    'cd dist',
                    'mkdir fonts',
                    'cd fonts',
                    'wget64 http://netdna.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.eot',
                    'wget64 http://netdna.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.svg',
                    'wget64 http://netdna.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.ttf',
                    'wget64 http://netdna.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.woff',
                    'wget64 http://netdna.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.woff2',

                    'cd ../',
                    'mkdir css',
                    'cd css',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/4.0.1/ui-grid.eot',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/4.0.1/ui-grid.svg',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/4.0.1/ui-grid.ttf',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/4.0.1/ui-grid.woff',

                    
                    'mkdir images',
                    'cd images',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/images/layers-2x.png',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/images/layers.png',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/images/marker-icon-2x.png',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/images/marker-icon.png',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/images/marker-shadow.png'

                ].join('&&')
            },
            prod: {
                command: [
                    'cd build',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.9/angular.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.2/angular-ui-router.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.9/angular-animate.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.9/angular-sanitize.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-spinner/0.8.1/angular-spinner.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.9/angular-touch.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.3.0/ui-bootstrap-tpls.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/4.0.1/ui-grid.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.min.js',
                    'wget64 https://raw.githubusercontent.com/TekVanDo/Angular-Tek-Progress-bar/master/dist/tek.progress-bar.min.js', /*!!!was opened ticket !10034 in cdnjs to add library. need to be check!!!*/
                     'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-simple-logger/0.1.7/angular-simple-logger.min.js', , /*!!!was opened ticket !10035 in cdnjs to add library. need to be check!!!*/
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/leaflet.js',
                    'wget64 https://raw.githubusercontent.com/Leaflet/Leaflet.label/master/dist/leaflet.label.js', /*waiting for cdnjs */
                    'wget64 https://unpkg.com/leaflet.markercluster@1.0.0/dist/leaflet.markercluster.js', /*waiting for cdnjs */
                    'wget64 https://raw.githubusercontent.com/angular-ui/ui-leaflet/master/dist/ui-leaflet.min.js',
                    'wget64 https://rawgit.com/elesdoar/ui-leaflet-layers/master/dist/ui-leaflet-layers.min.js ', /*waiting for cdnjs */
                    'wget64 https://unpkg.com/leaflet.gridlayer.googlemutant@latest/Leaflet.GoogleMutant.js', /*waiting for cdnjs */
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-local-storage/0.5.0/angular-local-storage.min.js',
                    'mv  ui-leaflet-layers.min.js zui-leaflet-layers.min.js',
                    'mv  Leaflet.GoogleMutant.js zLeaflet.GoogleMutant.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-timer/1.3.4/angular-timer.min.js',
                    //'wget64 https://raw.githubusercontent.com/iVantage/angular-ivh-treeview/v2.0.0-alpha.3/dist/ivh-treeview.min.js', was done custom changes moved to semi
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js',
                    //'wget64 https://cdnjs.cloudflare.com/ajax/libs/myforce-angularjs-dropdown-multiselect/1.10.2/angularjs-dropdown-multiselect.min.js',  was done custom changes moved to semi
                    //'wget64 https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.3/lodash.min.js',
                    'wget64 https://raw.githubusercontent.com/outbrain/pure-angular-date-range-picker/master/dist/scripts/min/ob-daterangepicker.js', /*waiting for cdnjs */
                    //'wget64 https://raw.githubusercontent.com/ManifestWebDesign/angular-gridster/master/dist/angular-gridster.min.js',
                    'wget64 https://raw.githubusercontent.com/arkabide/angular-gridster/dynamic-colums/dist/angular-gridster.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.5/nv.d3.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-nvd3/1.0.9/angular-nvd3.min.js',
                    'mv  angular-nvd3.min.js zangular-nvd3.min.js',
                    //'wget64 https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js',
                    //'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-chart.js/1.1.1/angular-chart.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-translate/2.13.1/angular-translate.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-translate/2.13.1/angular-translate-storage-local/angular-translate-storage-local.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-translate/2.13.1/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-translate/2.13.1/angular-translate-handler-log/angular-translate-handler-log.min.js',
                    'mv  angular-translate-storage-local.js zangular-translate-storage-local.min.js',
                    'mv  angular-translate-loader-static-files.js zangular-translate-loader-static-files.min.js',
                    'mv  angular-translate-handler-log.js zangular-translate-handler-log.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.20.0/select.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-css/1.0.8/angular-css.min.js',
                    //'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-validation/1.4.2/angular-validation.min.js',
                    //'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-validation/1.4.2/angular-validation-rule.min.js',
                     'wget64 https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.24/pdfmake.min.js',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.24/vfs_fonts.js', /*NOT TO MINIFYING !!!!! ONLY FONTS DEFINITIONS*/
                    


                    'wget64 http://netdna.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/3.2.9/ui-grid.min.css',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/leaflet.css',
                    'wget64 https://raw.githubusercontent.com/Leaflet/Leaflet.label/master/dist/leaflet.label.css', /*waiting for cdnjs */
                    'wget64 https://unpkg.com/leaflet.markercluster@1.0.0/dist/MarkerCluster.Default.css', /*waiting for cdnjs */
                    'wget64 https://unpkg.com/leaflet.markercluster@1.0.0/dist/MarkerCluster.css', /*waiting for cdnjs */
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/hover.css/2.1.0/css/hover-min.css',
                    'wget64 https://raw.githubusercontent.com/outbrain/pure-angular-date-range-picker/0.10.1/dist/styles/ob-daterangepicker.css', /*waiting for cdnjs */
                    'wget64 https://raw.githubusercontent.com/ManifestWebDesign/angular-gridster/master/dist/angular-gridster.min.css', /*waiting for cdnjs */
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.5/nv.d3.min.css',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.20.0/select.min.css',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.2.0-rc2/css/bootstrap-rtl.min.css',


                    'cd ../../',
                    'cd dist',
                    'mkdir css',
                    'cd css',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/4.0.1/ui-grid.eot',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/4.0.1/ui-grid.svg',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/4.0.1/ui-grid.ttf',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/4.0.1/ui-grid.woff',

                   
                    'mkdir images',
                    'cd images',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/images/layers-2x.png',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/images/layers.png',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/images/marker-icon-2x.png',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/images/marker-icon.png',
                    'wget64 https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/images/marker-shadow.png'
                ].join('&&')
            }

        },
        clean: {
            options: {
                force: true
            },
            common: {
                src: ['build/*', '../dist/*']
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true,
            },
            prod: {
                files: {
                    '../dist/app.js': ['../dist/app.js']

                },
            }
        },

        uglify: {
            prod: {
                files: [{
                    expand: true,
                    cwd: '../dist',
                    src: ['app.js'],
                    dest: '../dist/'
                }],
                maxLineLen: 1,
                preserveComments: false
            },
            special: {
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: ['zLeaflet.GoogleMutant.js'],
                    dest: 'build/'
                }],
                maxLineLen: 1,
                preserveComments: false
            }

        },
        //cssmin: {
        //    prod: {
        //        files: [{
        //            expand: true,
        //            cwd: '../dist',
        //            src: ['style.css'],
        //            dest: '../dist/'
        //        }]
        //    }
        //},

        cssmin: {
            common: {
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: ['*.css', '!*.min.css'],
                    dest: '../dist/css',
                    ext: '.min.css'
                }, {
                    expand: true,
                    cwd: '../../css',
                    src: ['*.css', '!*.min.css'],
                    dest: '../dist/css',
                    ext: '.min.css'
                }]
            }
        },
        watch: {
            local: {
                files: ['../local/**/*.js', '../../css/*.css', '../run.js', '../app.js', '../semi/**/*.js', '../../templates/**/*.html'],
                tasks: ['local']
            },
            build: {
                files: ['../local/**/*.js', '../../css/*.css', '../run.js', '../app.js', '../semi/**/*.js', '../../templates/**/*.html'],
                tasks: ['build']
            },
            'build-prod': {
                files: ['../local/**/*.js', '../../css/*.css', '../run.js', '../app.js', '../semi/**/*.js', '../../templates/**/*.html'],
                tasks: ['build']
            },
        },
        copy: {
            data: {
                files: [{
                    expand: true,
                    cwd: '../static_images/',
                    src: ['*.*'],
                    dest: '../dist/css/images'
                }, {
                    expand: true,
                    cwd: 'fonts/',
                    src: ['*.*'],
                    dest: '../dist/fonts'
                }, {
                    expand: true,
                    cwd: '../i18n/',
                    src: ['*.*'],
                    dest: '../dist/languages'
                }, {
                    expand: true,
                    cwd: 'build',
                    src: ['*.min.css'],
                    dest: '../dist/css'
                }]
            }

        },
        comments: {
            prod: {
                // Target-specific file lists and/or options go here. 
                options: {
                    singleline: true,
                    multiline: true
                },
                src: ['../dist/app.js', 'build/*.js'] // files to remove comments from 
            }
        },
        ngtemplates: {
            app: {
                cwd: '../../templates',
                src: ['*.html', "**/*.html"],
                dest: '../../templates/templates.js',
                options: {
                    htmlmin: {
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true
                    }
                }
            }
        },
        i18nextract: {
            translate: {
                src: ['../../templates/*.html', "../../templates/**/*.html"],
                lang: ['en', 'he', 'ru'],
                dest: '../i18n',
                suffix: '.json',
                safeMode:true
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-stripcomments');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-angular-translate');

    grunt.registerTask('local', ['ngtemplates:app', 'concat:local', /*'concat:css',*/ 'concat:alreadyMinified', 'copy:data', 'i18nextract:translate', 'cssmin:common']);
    grunt.registerTask('build', ['clean:common', 'ngtemplates:app', 'concat:local', /*'concat:special',*/ 'shell:test', 'concat:remote-test', /*'concat:css',*/
        'concat:alreadyMinified', 'copy:data', 'i18nextract:translate', 'cssmin:common'
    ]);
    grunt.registerTask('build-prod', ['clean:common', 'ngtemplates:app', 'concat:local', 'ngAnnotate:prod', 'uglify:prod', 'concat:alreadyMinified', /*'concat:special',*/ 'shell:prod',
        'comments:prod', 'uglify:special', 'concat:remote-prod', /*'concat:css',*/ /*'cssmin:prod'*/, 'copy:data', 'i18nextract:translate'
    ]);
};