#!/usr/bin/env node

//initial imports
import caporal from 'caporal';
import fs from 'fs';
import binsHandler from '../handlers/binsHandler.js';
import cardsHandler from '../handlers/cardsHandler.js';
// import dotenv from 'dotenv';
import path from 'path'
// dotenv.config();


//read the versions from package.json
if(process.env.HACKIUM_APP_PATH === undefined) {
    console.error("Please set the Envirnment Variables as the instructions or try running the app with admnistrator or sudo rights.");
    process.exit(1);
}
let version = JSON.parse(fs.readFileSync(path.join(process.env.HACKIUM_APP_PATH + '/package.json'))).version;
caporal.version(version);
caporal.name('hackium');

//bins command
caporal
    .command('bins', 'Used to Generate and Validate BINS')
    .argument('<type>', 'Enter the type (generate/validate)', /^generate|validate$/, 'generate')
    .option('--save', 'Save the output to a seperate file?', caporal.BOOLEAN, false, true)
    .action((args, options, logger) => {
        return binsHandler(args, options, logger);
    });

//cards command
caporal
    .command('cards', 'Used to generate and check cards')
    .argument('<type>', 'Enter the type (generate/validate)', /^generate|validate$/, 'generate')
    .option('--save', 'Save the output to a seperate file?', caporal.BOOLEAN, false, true)
    .action((args, options, logger) => {
        return cardsHandler(args, options, logger);
    });

caporal.parse(process.argv);