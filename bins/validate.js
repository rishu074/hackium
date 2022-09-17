import inquirer from 'inquirer';
import logUpdate from 'log-update';
import fs from 'fs';
import fetch from 'node-fetch';

export default async function validateBins(args, options) {
    if (options && options.save) {
        inquirer.prompt([
            {
                name: "fileFromBinsToTake",
                type: 'input',
                default: 'generatedBins.txt',
                message: "Enter the filename with bins"
            },
            {
                name: 'filenameToSaveTheOutput',
                type: 'input',
                default: 'checkedBins.txt',
                message: "Enter the filename to save the output"
            },
            {
                message: "Are you ready?",
                type: 'confirm',
                name: "areYouReady",
                default: 'n'
            }
        ]).then(async (answers) => {
            //loading inside the console
            console.clear();

            logUpdate(`Progress [ --- ] 15%\n\nReading the Data...`);

            //checking the files
            logUpdate(`Progress [ ----- ] 25%\n\nChecking the files...`);

            //check for output file
            if (fs.existsSync(`./${answers.filenameToSaveTheOutput.toString()}`)) {
                fs.unlinkSync(`./${answers.filenameToSaveTheOutput.toString()}`)
            }

            //check for input file
            if (!fs.existsSync(`${answers.fileFromBinsToTake.toString()}`)) {
                console.log('\nNo input file Found!')
                return process.exit(1);
            }

            //get the data from the input file
            logUpdate(`Progress [ ------- ] 35%\n\nReading Bins...`);

            let readedData;
            try {
                readedData = fs.readFileSync(`${answers.fileFromBinsToTake.toString()}`, { encoding: 'utf-8' })

                readedData = readedData.split('\n');

                if (readedData.length === 0) {
                    console.error('No data Found.');
                    return process.exit(1);
                }
            } catch (error) {
                console.error(error);
                return process.exit(1);
            }

            logUpdate(`Progress [ --------- ] 45%\n\nChecking Bins...`);

            const frames = ['-', '\\', '|', '/'];

            for (let i = 0; i < readedData.length; i++) {
                let data = readedData[i].trim()
                if (data.length != 0) {
                    //validation process

                    let api_uri = 'https://bin-check-dr4g.herokuapp.com/api/';

                    //fetching the data
                    let response = await fetch(api_uri + data.toString());
                    response = await response.json();

                    //here we get the response

                    let outputString;
                    //write to the file
                    if(response && response.result) {
                        try {
                            fs.appendFileSync(`./${answers.filenameToSaveTheOutput.toString()}`, `\nBIN = ${response.data.bin}\nVENDOR = ${response.data.vendor}\nTYPE = ${response.data.type}\nLEVEL = ${response.data.level}\nBANK = ${response.data.bank}\nCOUNTRY = ${response.data.country}`);
                            
                        } catch (error) {
                            console.error(error);
                            return process.exit(1);
                        }
                        //log output
                        outputString = `\nBIN = ${response.data.bin}\nVENDOR = ${response.data.vendor}\nTYPE = ${response.data.type}\nLEVEL = ${response.data.level}\nBANK = ${response.data.bank}\nCOUNTRY = ${response.data.country}`;

                    } else {
                        outputString = `\n${data} Failed.`;
                    }

                    const frame = frames[index = ++index % frames.length];


                    logUpdate(`Progress [ ${frame} ] ${Math.floor((i/readedData.length) * 100)}% \n${outputString}`)

                }
            }

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