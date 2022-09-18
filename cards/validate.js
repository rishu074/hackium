import inquirer from 'inquirer';
import logUpdate from 'log-update';
import fs from 'fs';
import fetch from 'node-fetch';
import Stripe from 'stripe'

export default function validateCards(args, options) {
    if (options && options.save) {
        inquirer.prompt([
            {
                name: "filesFromCardsToTake",
                type: 'input',
                default: 'generatedCards.txt',
                message: "Enter the filename with cards in Current Directory"
            },
            {
                name: 'filenameToSaveTheOutput',
                type: 'input',
                default: 'checkedCards.txt',
                message: "Enter the filename to save the output in Current Directory"
            },
            {
                name: 'skKey',
                type: 'input',
                default: 'sk_key_fake',
                message: "Enter the sk key",
                validate: validateSkKey
            },
            {
                name: 'currency',
                type: 'input',
                default: 'usd',
                message: "Enter the currency for amount"
            },
            {
                name: 'amount',
                type: 'number',
                default: 50,
                message: "Enter the amount to deduct from cards"
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
            if (!fs.existsSync(`${answers.filesFromCardsToTake.toString()}`)) {
                console.log('\nNo input file Found!')
                return process.exit(1);
            }

            //get the data from the input file
            logUpdate(`Progress [ ------- ] 35%\n\nReading Cards...`);

            let readedData;

            try {
                readedData = fs.readFileSync(`${answers.filesFromCardsToTake.toString()}`, { encoding: 'utf-8' })

                readedData = readedData.split('\n');

                if (readedData.length === 0) {
                    console.error('No data Found.');
                    return process.exit(1);
                }
            } catch (error) {
                console.error(error);
                return process.exit(1);
            }

            logUpdate(`Progress [ --------- ] 45%\n\nChecking Cards...`);

            const frames = ['-', '\\', '|', '/'];
            let index = 0;
            let startTime = Date.now()
            let chargedCount = 0;
            let declinedCount = 0;

            // let tokenObject = await createToken({
            //     card_number: readedData[0].split("|")[0],
            //     month: readedData[0].split("|")[1],
            //     year: readedData[0].split("|")[2],
            //     cvv: readedData[0].split("|")[3],
            //     sk_key: answers.skKey.toString()
            // })


            for (let i = 0; i < readedData.length; i++) {
                const frame = frames[index = ++index % frames.length];
                let data = readedData[i].trim()
                if (data.length != 0) {
                    let outputString = data;
                    data = data.split("|");
                    let [card_number, month, year, cvv] = data;

                    let tokenObject = await createToken({
                        card_number: card_number.toString(),
                        month: month,
                        year: year,
                        cvv: cvv,
                        sk_key: answers.skKey.toString()
                    });


                    if (typeof tokenObject === 'object') {
                        //here we successfully got the token
                        let charge = await checkCard(tokenObject, answers.amount, answers.currency.toString(), answers.skKey.toString());

                        if (typeof charge === 'object') {

                            logUpdate(`Progress [ ${frame} ] ${Math.floor((i / (readedData.length - 1)) * 100)}% \n${outputString}\nReceipt = ${charge.receipt_url.toString()}\nCaptured = ${charge.captured}`)
                            chargedCount++;

                            //updating the file
                            await updateFile(`./${answers.filenameToSaveTheOutput.toString()}`, `${outputString} Receipt = ${charge.receipt_url.toString()} captured = ${charge.captured}\n`)
                        } else {
                            logUpdate(`Progress [ ${frame} ] ${Math.floor((i / (readedData.length - 1)) * 100)}% \n${outputString}\n${charge.toString()}`)
                            declinedCount++;

                            //updating the file
                            await updateFile(`./${answers.filenameToSaveTheOutput.toString()}`, `${outputString} ${charge.toString()}\n`)
                        }
                    } else {
                        logUpdate(`Progress [ ${frame} ] ${Math.floor((i / (readedData.length - 1)) * 100)}% \n${outputString}\n${tokenObject.toString()}`)
                        declinedCount++;

                        //updating the file
                        await updateFile(`./${answers.filenameToSaveTheOutput.toString()}`, `${outputString} ${tokenObject.toString()}\n`)
                    }
                }
            }

            //done
            let endTime = Date.now();
            logUpdate(`Progress [ ! ] 100% \nDone, Checked ${chargedCount + declinedCount} Cards in ${(endTime - startTime) / 100}s, charged ${chargedCount} declined ${declinedCount}`)
        }).catch((error) => {
            if (error.isTtyError) {
                process.exit(1);
            } else {
                process.exit(1);
            }
        });
    } else {
        console.log("Please use --save flag.")
        process.exit(1);
    }
}


const validateSkKey = async (key) => {
    // console.log(key === "sk_key_fakes");
    let sk_key = key.toString();
    let stripe = Stripe(sk_key)

    let log;
    let logTwo;

    try {
        log = await stripe.charges.create({
            amount: 2000,
            currency: 'usd',
            source: 'tok_amex',
            description: 'My First Test Charge (created for API docs at https://www.stripe.com/docs/api)',
        })
    } catch (error) {
        log = error
    }

    try {
        var tokenObject = await stripe.tokens.create({
            card: {
                number: '4100287689104978',
                exp_month: 9,
                exp_year: 23,
                cvc: 456,
            }
        })
    } catch (error) {
        logTwo = error;
    }


    // console.log(await logTwo)
    if (await logTwo && await logTwo.code && await logTwo.code.toString().includes("test")) {
        return "This sk only supports test mode charges."
    }

    if (await log.toString().includes('Invalid API Key provided')) {
        return "Please Enter a Valid API KEY"
    } else if (await log.toString().includes('Invalid token id')) {
        return true;
    }

    return "Something error occurred";
}

const createToken = async ({ card_number, month, year, cvv, sk_key }) => {
    let stripe = Stripe(sk_key.toString())
    let rateLimitCount = 0;
    while (true) {
        try {
            var tokenObject = await stripe.tokens.create({
                card: {
                    number: card_number.toString(),
                    exp_month: parseInt(month),
                    exp_year: parseInt(year),
                    cvc: cvv.toString(),
                }
            })
            // console.log(tokenObject);

            return tokenObject;


        } catch (error) {
            if (rateLimitCount > 150) {
                return "rate_limit";
            }
            // await console.log('error: ' + error.code);
            // return false;
            // console.log(error);
            if (error && error.code && error.code.toString().includes('rate')) {
                rateLimitCount++;
            }
            if (error && error.code != "rate_limit") {
                return error.code.toString()
            }
        }

    }
}

const checkCard = async (tokenObject, amount, currency, skKey) => {
    let stripe = Stripe(skKey.toString());
    let rateLimitCount = 0;
    while (true) {
        try {
            const charge = await stripe.charges.create({
                amount: parseInt(amount),
                currency: currency.toString(),
                source: tokenObject.id,
                description: 'Buiscit',
            });

            return charge;
        } catch (error) {
            if (rateLimitCount > 150) {
                return "rate_limit";
            }
            // await console.log('error: ' + error.code);
            // return false;
            // console.log(error);
            if (error && error.code && error.code.toString().includes('rate')) {
                rateLimitCount++;
            }
            if (error && error.code != "rate_limit") {
                return error.code.toString()
            }
        }

    }
}

const updateFile = async (path, data) => {
    //appeanding into file
    try {
        fs.appendFileSync(path.toString(), data.toString(), { encoding: 'utf-8' })

    } catch (error) {
        console.error(error);
        return process.exit(1);

    }
}