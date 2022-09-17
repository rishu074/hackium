import inquirer from 'inquirer';

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
            return console.log(answers)
        }).catch((error) => {
            if (error.isTtyError) {
                process.exit(1);
            } else {
                process.exit(1);
            }
        })
    }
}