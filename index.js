#!/usr/bin/env node

const destDir = 'test/lib'
  , nodeModules = 'node_modules';

let run = require( 'runjs' ).run
  , path = require( 'path' )
  , fs = require( 'fs' )
  , mkdirp = require( 'mkdirp' )
  , tmp = require( 'tmp' )
  , argv = require('yargs')
	.command('install', 'install developer dependencies', {}, (yargs) => {

		mkdirp( destDir, (err) => {
			
			const selfRef = path.join('test/lib/', path.basename( process.cwd() ) );
			fs.stat( selfRef, (err, stat) => {
				if (err) {
					run( 'ln -s ../.. ' + selfRef );
				}
			}); 
			
			highJackNodeModules();
		});

		function highJackNodeModules() {
			let tmpObj = tmp.dirSync();
			let nodeDir = path.join( tmpObj.name, nodeModules );

			run( 'cp package.json ' + tmpObj.name );
			run( 'npm install --only=dev', {cwd: tmpObj.name });
			fs.readdir( nodeDir, (err, paths) => {
				if (err) throw err;
				paths.forEach( (dir) => {
					const destSubDir = path.join( destDir, dir );
					
					fs.stat(destSubDir, (err, stat) => {
						if (err)
						{
							const sourceDir = path.join( nodeDir, dir ); 
							run( 'mv ' + sourceDir + ' ' + destSubDir ); 
						}
					});
				}); 
			}); 
		}
	})
	.demandCommand()
	.help()
	.argv;
