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
                message: "Enter the filename with bins in Current Directory"
            },
            {
                name: 'filenameToSaveTheOutput',
                type: 'input',
                default: 'checkedBins.txt',
                message: "Enter the filename to save the output in Current Directory"
            },
            {
                name: 'filenameToSaveCheckedBinsForCards',
                type: 'input',
                default: 'checkedBinsForCards.json',
                message: "Enter the filename to save the output for cards in Current Directory"
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

            if (fs.existsSync(`./${answers.filenameToSaveCheckedBinsForCards.toString()}`)) {
                fs.unlinkSync(`./${answers.filenameToSaveCheckedBinsForCards.toString()}`)
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

            //initialize checked file
            try {
                fs.appendFileSync(`./${answers.filenameToSaveCheckedBinsForCards.toString()}`, "{\r\n    \"bins\": [\r\n\r\n    ]\r\n}", { encoding: 'utf-8' })

            } catch (error) {
                console.error(error);
                process.exit()
            }


            logUpdate(`Progress [ --------- ] 45%\n\nChecking Bins...`);

            const frames = ['-', '\\', '|', '/'];
            let index = 0;
            let startTime = Date.now()

            for (let i = 0; i < readedData.length; i++) {
                let data = readedData[i].trim()
                if (data.length != 0) {
                    //validation process

                    //start
                    const frame = frames[index = ++index % frames.length];

                    logUpdate(`Progress [ ${frame} ] ${Math.floor((i / (readedData.length - 1)) * 100)}% \n\nProccessing ${data}`)

                    let binObject = await validateBinz(parseInt(data));
                    // console.log(await binObject)
                    if (binObject) {

                        //writing into file
                        binObject.bank = {};

                        //text file
                        try {
                            fs.appendFileSync(`./${answers.filenameToSaveTheOutput.toString()}`, `\r\nBIN = ${data}\r\nLength = ${binObject.number.length}\r\nLuhn = ${binObject.number.luhn ? 'yes' : 'no'}\r\nSCHEME = ${binObject.scheme}\r\nTYPE = ${binObject.type}\r\nBRAND = ${binObject.brand}\r\nPREPAID = ${binObject.prepaid ? 'yes' : 'no'}\r\nCOUNTRY = ${binObject.country.name}\r\nCURRENCY = ${binObject.country.currency}\r\nBANK = ${binObject.bank.bank}\r\nPhone = ${binObject.bank.phone}\n`, { encoding: 'utf-8' })

                        } catch (error) {
                            console.error(error);
                            process.exit(1);
                        }

                        //json file
                        try {
                            let jsonData = fs.readFileSync(`./${answers.filenameToSaveCheckedBinsForCards.toString()}`)
                            jsonData = JSON.parse(jsonData);

                            binObject.bin = parseInt(data);

                            jsonData.bins.push(binObject);

                            fs.writeFileSync(`./${answers.filenameToSaveCheckedBinsForCards.toString()}`, JSON.stringify(jsonData));
                        } catch (error) {
                            console.error(error);
                            process.exit(1);
                        }

                        let outputString = `\r\nBIN = ${data}\r\nLength = ${binObject.number.length}\r\nLuhn = ${binObject.number.luhn ? 'yes' : 'no'}\r\nSCHEME = ${binObject.scheme}\r\nTYPE = ${binObject.type}\r\nBRAND = ${binObject.brand}\r\nPREPAID = ${binObject.prepaid ? 'yes' : 'no'}\r\nCOUNTRY = ${binObject.country.name}\r\nCURRENCY = ${binObject.country.currency}\r\nBANK = ${binObject.bank.bank}\r\nPhone = ${binObject.bank.phone}`

                        logUpdate(`Progress [ ${frame} ] ${Math.floor((i / (readedData.length - 1)) * 100)}% \n${outputString}`)

                    }

                }
            }
            let endTime = Date.now();
            logUpdate(`Progress [ ! ] 100% \nDone, Checked ${readedData.length} Bins in ${(endTime - startTime) / 1000}s`)

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

async function validateBinz(bin) {
    let erroCount = 0;
    let lastRequest = Date.now() + 3000;


    while (true) {
        if (erroCount > 5) {
            return false;
        }

        //check for now date
        let currentDate = Date.now();

        let interval = currentDate - lastRequest
        interval = Math.floor(interval / 1000);

        if (interval >= 0.5) {
            let response = await fetch(`https://lookup.binlist.net/${bin}`);
            lastRequest = Date.now();
            // console.log(await response)
            if (await response.status === 200) {
                let jsonResponse = await response.json();
                // console.log(jsonResponse)

                const binObject = jsonResponse;

                return binObject;

            } else if (await response.status === 404) {
                return false;
            } else {
                erroCount++;
            }
        }

    }

}