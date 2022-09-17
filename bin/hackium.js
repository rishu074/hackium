#!/usr/bin/env node

//initial imports
import caporal from 'caporal';
import fs from 'fs';
import binsHandler from '../handlers/binsHandler.js';


//read the versions from package.json
let version = JSON.parse(fs.readFileSync('./package.json')).version;
caporal.version(version);
caporal.name('hackium');

//bins command
caporal
    .command('bins', 'Used to Generate and Validate BINS')
    .argument('<type>', 'Enter the type ', /^generate|validate$/, 'generate')
    .option('--save', 'Save the output to a seperate file?', caporal.BOOLEAN)
    .action((args, options, logger) => {
        return binsHandler(args, options, logger);
    });

caporal.parse(process.argv);