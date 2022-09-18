import inquirer from 'inquirer';
import logUpdate from 'log-update';
import fs from 'fs';

export default function generateCards(args, options) {
    if (options && options.save) {
        inquirer.prompt([
            {
                name: "numberOfCardsToGenerate",
                type: 'number',
                default: 50,
                message: "Enter the amount of Cards to Generate"
            },
            {
                name: 'filenameToSaveTheOutput',
                type: 'input',
                default: 'generatedCards.txt',
                message: "Enter the filename to save the output in Current Directory"
            },
            {
                name: 'rand',
                type: 'list',
                choices: ['Randomly Select bin from file', 'manually enter a bin number'],
                default: 'manually enter a bin number',
                message: 'Choose options'
            },
            {
                name: "bin",
                type: 'number',
                default: 581686,
                message: "Enter the six digit bin",
                when: (answers) => answers.rand === 'manually enter a bin number'
            },
            {
                name: "binFile",
                type: 'input',
                default: 'checkedBinsForCards.txt',
                message: "Enter the filename from which to take bins in Current Directory",
                when: (answers) => answers.rand === 'Randomly Select bin from file'
            },
            {
                message: "Are you ready?",
                type: 'confirm',
                name: "areYouReady",
                default: 'n'
            }
        ]).then(async (answers) => {
            //loading inside the console
            if (answers.rand === 'manually enter a bin number') {

                console.clear();
                console.log(answers.rand)

                logUpdate(`Progress [ --- ] 15%\n\nReading the Data...`);

                //checking the files
                logUpdate(`Progress [ ----- ] 25%\n\nChecking the files...`);

                if (fs.existsSync(`./${answers.filenameToSaveTheOutput.toString()}`)) {
                    fs.unlinkSync(`./${answers.filenameToSaveTheOutput.toString()}`)
                }

                logUpdate(`Progress [ ---------- ] 50%\n\nGenerating the Cards...`);

                //cards array
                let cardsArray = [];
                let startTime = Date.now();
                const frames = ['-', '\\', '|', '/'];
                let index = 0;


                for (let i = 0; i < parseInt(answers.numberOfCardsToGenerate); i++) {
                    let card = await generate(parseInt(answers.bin));
                    if (card) {
                        //appeanding into file
                        let outputString;
                        try {
                            fs.appendFileSync(`./${answers.filenameToSaveTheOutput.toString()}`, `${card.card_number}|${card.month}|${card.year}|${card.cvv}\n`, { encoding: 'utf-8' })

                            outputString = `\n${card.card_number}|${card.month}|${card.year}|${card.cvv}`;
                        } catch (error) {
                            console.error(error);
                            return process.exit(1);

                        }

                        cardsArray.push(card);

                        //logoutput
                        const frame = frames[index = ++index % frames.length];


                        logUpdate(`Progress [ ${frame} ] ${Math.floor((i / (parseInt(answers.numberOfCardsToGenerate))) * 100)}% \n${outputString}`)
                    }
                }

                //done
                let endTime = Date.now()

                logUpdate(`Progress [ ! ] 100% \n\nDone, Generated ${cardsArray.length} Cards in ${(endTime - startTime) / 100}s`)
            } else if (answers.rand === 'Randomly Select bin from file') {
                console.clear();
                console.log(answers.rand)

                logUpdate(`Progress [ --- ] 15%\n\nReading the Data...`);

                //checking the files
                logUpdate(`Progress [ ----- ] 25%\n\nChecking the files...`);

                if (fs.existsSync(`./${answers.filenameToSaveTheOutput.toString()}`)) {
                    fs.unlinkSync(`./${answers.filenameToSaveTheOutput.toString()}`)
                }

                if (!fs.existsSync(`./${answers.binFile.toString()}`)) {
                    console.log('\nNo input file Found!')
                    return process.exit(1);
                }
                let readedData;

                try {
                    readedData = fs.readFileSync(`${answers.binFile.toString()}`, { encoding: 'utf-8' })

                    readedData = readedData.split('\n');

                    if (readedData.length === 0) {
                        console.error('No data Found.');
                        return process.exit(1);
                    }
                } catch (error) {
                    console.error(error);
                    return process.exit(1);
                }

                logUpdate(`Progress [ ---------- ] 50%\n\nGenerating the Cards...`);

                //cards array
                let cardsArray = [];
                let startTime = Date.now();
                const frames = ['-', '\\', '|', '/'];
                let index = 0;

                for (let i = 0; i < parseInt(answers.numberOfCardsToGenerate); i++) {
                    let bin = readedData[Math.floor(Math.random() * (0 + (readedData.length - 1)))].trim()
                    if (bin) {
                        let card = await generate(parseInt(bin));
                        if (card) {
                            //appeanding into file
                            let outputString;
                            try {
                                fs.appendFileSync(`./${answers.filenameToSaveTheOutput.toString()}`, `${card.card_number}|${card.month}|${card.year}|${card.cvv}\n`, { encoding: 'utf-8' })

                                outputString = `\n${card.card_number}|${card.month}|${card.year}|${card.cvv}`;
                            } catch (error) {
                                console.error(error);
                                return process.exit(1);

                            }

                            cardsArray.push(card);

                            //logoutput
                            const frame = frames[index = ++index % frames.length];


                            logUpdate(`Progress [ ${frame} ] ${Math.floor((i / (parseInt(answers.numberOfCardsToGenerate))) * 100)}% \n${outputString}`)
                        }
                    }
                }

                //done
                let endTime = Date.now()

                logUpdate(`Progress [ ! ] 100% \n\nDone, Generated ${cardsArray.length} Cards in ${(endTime - startTime) / 100}s`)
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


class Luhn {
    /**
    * @description Validatator of Credit Card Numbers
    * @param cc Credit Card Numbers
    * @returns Validation result of Credit Card Nunbers that are valid or not
    */
    static validate(cc) {
        // Change to number object
        cc = Array.from(String(cc), Number);
        // Luhn Alogorithom
        let sum = 0;
        for (let i = 0; i <= cc.length - 1; i++) {
            let digit = cc[i];
            if (i % 2 === 0) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
        }
        return sum % 10 === 0;
    }
}


function generate(bin) {
    while (true) {
        const generatedCard = bin + '' + randomCard()

        if (Luhn.validate(parseInt(generatedCard))) {
            const cardObject = {
                card_number: parseInt(generatedCard),
                month: randDate().month,
                year: randDate().year,
                cvv: cvv()
            }

            return cardObject;
        }
    }
}

const randDate = () => {
    const now = new Date();
    const month = Math.floor(Math.random() * 12) + 1;
    let year = now.getFullYear() + Math.floor(Math.random() * 5);
    if (year === now.getFullYear()) {
        year = now.getFullYear() + 5
    }
    return {
        month,
        year
    }
}

const cvv = () => {
    var theRandomNumber = Math.floor(Math.random() * 900) + 100;
    var toReturn;
    if (parseInt(theRandomNumber.toString().length) === 3) {

    }
    (parseInt(theRandomNumber.toString().length) === 3) ? toReturn = theRandomNumber : toReturn = 253

    return toReturn;
}

const randomCard = () => {
    return Math.floor(Math.random() * (0 + 9999999999));
};