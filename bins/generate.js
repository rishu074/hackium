import inquirer from 'inquirer';
import logUpdate from 'log-update';
import fs from 'fs';

export default function generateBins(args, options) {
    // console.log(options)
    //ask questions
    if (options && options.save) {
        inquirer.prompt([
            {
                name: "numberOfBinsToGenerate",
                type: 'number',
                default: 20,
                message: "Enter the amount of Bins to Generate"
            },
            {
                name: 'filenameToSaveTheOutput',
                type: 'input',
                default: 'generatedBins.txt',
                message: "Enter the filename to save the output"
            },
            {
                message: "Are you ready?",
                type: 'confirm',
                name: "areYouReady",
                default: 'n'
            }
        ]).then((answers) => {
            // return console.log(answers)

            //loading inside the console
            console.clear();

            logUpdate(`Progress [ --- ] 15%\n\nReading the Data...`);

            //checking the files
            logUpdate(`Progress [ ----- ] 25%\n\nChecking the files...`);

            if(fs.existsSync(`./${answers.filenameToSaveTheOutput.toString()}`)) {
                fs.unlinkSync(`./${answers.filenameToSaveTheOutput.toString()}`)
            }

            //generating the bins
            logUpdate(`Progress [ ---------- ] 50%\n\nGenerating the Bins...`);

            //real generator


        }).catch((error) => {
            if (error.isTtyError) {
                process.exit(1);
            } else {
                process.exit(1);
            }
        })
    } else {
        console.log("Please use --save flag.")
        process.exit(1);
    }
}