/*
 * grunt-cortex-build
 * https://github.com/kaelzhang/grunt-cortex-build
 *
 * Copyright (c) 2013 Kael
 * Licensed under the MIT license.
 */

'use strict';


/**

design

.cortex/
    static_modules
    local_modules

    modules/

    built_modules/

        <module>/
            <exact-version>/
                // move build/ folder here

*/

var node_path = require('path');

var USER_HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

// TODO:
// mirgate to 'cortex-config' module
var CORTEX_ROOT = node_path.join(USER_HOME, '.cortex');
var CORTEX_BUILT_ROOT = node_path.join(CORTEX_ROOT, 'built_modules');


module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('cortex_build', 'Your task description goes here.', function() {
        
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            cwd: '.',
            build: 'build'
        });

        var cwd = node_path.resolve(options.cwd);
        var pkg = grunt.file.readJSON( node_path.join(cwd, 'package.json') );

        var name = pkg.name;
        var version = pkg.version;

        var stable_modules = grunt.file.readJSON( node_path.join(CORTEX_ROOT, 'stable_modules') );
        var stable_versions = stable_modules[name] || [];

        var local_built_folder = node_path.join(cwd, options.build);

        // TODO:
        // checking global .cortex folder
        var global_built_folder = node_path.join(CORTEX_BUILT_ROOT, name, version);

        var global_built_folder_exists;

        var file = grunt.file;

        if(file.exists(local_built_folder)){

            if( 
                // if already built
                !(global_built_folder_exists = file.exists( global_built_folder )) ||

                // never replace stable build folders
                stable_versions.indexOf(version) === -1

            ){
                global_built_folder_exists && file.delete(global_built_folder, {
                    force: true
                });

                grunt.log.write('Copying ' + local_built_folder);

                file.expand(local_built_folder + '/**').sort().forEach(function(path) {
                    var global_path = path.replace( new RegExp('^' + local_built_folder),  global_built_folder );

                    if(file.isFile(path)){
                        file.copy(path, global_path);

                    }else if (file.isDir(path)){
                        file.mkdir(global_path)
                    }
                });
                
            }else{
                grunt.log.warn('There\'s already stable built "' + name + '@' + version + '" found');
            }
        
        }else{
            grunt.log.warn('Build folder not found, skip building "' + name + '@' + version + '"');
        }

    });

};
