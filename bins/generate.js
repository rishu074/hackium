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
                message: "Enter the filename to save the output in Current Directory"
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

            if (fs.existsSync(`./${answers.filenameToSaveTheOutput.toString()}`)) {
                fs.unlinkSync(`./${answers.filenameToSaveTheOutput.toString()}`)
            }

            //generating the bins
            logUpdate(`Progress [ ---------- ] 50%\n\nGenerating the Bins...`);

            //bins array
            let binsArray = [];
            let startDate = Date.now();

            const frames = ['-', '\\', '|', '/'];
            let index = 0;

            //real generator
            for (let i = 0; i < parseInt(answers.numberOfBinsToGenerate); i++) {
                //get the bin
                let bin = getRandomBin();
                if (bin) {

                    //appeanding into file
                    try {
                        fs.appendFileSync(`./${answers.filenameToSaveTheOutput.toString()}`, `${bin.toString()}\n`, { encoding: 'utf-8' })
                    } catch (error) {
                        console.error(error);
                        return process.exit(1);

                    }

                    //updating the log output
                    // if (i < parseInt(answers.numberOfBinsToGenerate) / 2) {
                    //     logUpdate(`Progress [ --------------- ] 75%\n\nGenerating the Bins...\n\n${bin}`);
                    // } else if (i === parseInt(answers.numberOfBinsToGenerate) - 1) {
                    //     logUpdate(`Progress [ ------------------- ] 95%\n\nGenerating the Bins...\n\n${bin}`);
                    // } else {
                    //     logUpdate(`Progress [ ------------ ] 60%\n\nGenerating the Bins...\n\n${bin}`);
                    // }
                    const frame = frames[index = ++index % frames.length];

                    logUpdate(`Progress [ ${frame} ] ${Math.floor((i / (parseInt(answers.numberOfBinsToGenerate))) * 100)}%\n\nGenerating the Bins...\n\n${bin}`);

                    binsArray.push(bin);
                }

            }

            let endDate = Date.now()

            logUpdate(`Progress [ ! ] 100%\n\nGenerated ${binsArray.length} in ${(endDate-startDate) / 100}s`);

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

const getRandomBin = () => {
    let number = Math.floor(Math.random() * (0 + 999999));
    if (number.toString().length === 6) {
        return parseInt(number);
    } else {
        return false;
    }
};