#!/usr/bin/env node

const destDir = 'test/lib'
  , nodeModules = 'node_modules';

let run = require( 'runjs' ).run
  , path = require( 'path' )
  , fs = require( 'fs' )
  , mkdirp = require( 'mkdirp' )
  , argv = require('yargs')
	.command('install', 'install developer dependencies', {}, (yargs) => {
		run( 'npm install --only=dev' );

		fs.readdir( nodeModules, (err, paths) => {

			mkdirp( destDir, (err) => {

				run( 'ln -s . ' + path.join('test/lib/', path.basename(__dirname) ) );

				paths.forEach( (dir) => {
					const destSubDir = path.join( destDir, dir );
					
					fs.stat(destSubDir, (err, stat) => {
						if (err)
						{
							const sourceDir = path.join( nodeModules, dir ); 
							run( 'mv ' + sourceDir + ' ' + destSubDir ); 
						}
					});
				}); 
			});
		}); 
	})
	.demandCommand()
	.help()
	.argv;

/*


install --dev
cd test
npm install
mv node_modules lib
ln -s ../../ lib/context
*/ 