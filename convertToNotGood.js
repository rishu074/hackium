import fs from 'fs';

let startTime = Date.now()
let readedData = fs.readFileSync('./checkedCards.txt', {encoding: 'utf-8'});
readedData = readedData.split("\n");
readedData = Array.from(new Set(readedData));

// console.log(readedData.length);



for (let i = 0; i < readedData.length; i++) {
    var element = readedData[i];
    element = element.split('|')
    console.log(element[0].trim())

    fs.appendFileSync('./invalidCards.txt', `${element[0].trim()}\n`, {encoding: 'utf-8'})
}
 

let endTime = Date.now()

console.log('\n')
// console.log(readedData.indexOf('4155903562577965|1|2026|422 incorrect_number'))
console.log(`LOOPED Throught ${readedData.length} cards in ${Math.floor((endTime - startTime) / 1000)}s`);