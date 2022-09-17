import logUpdate from 'log-update';

const frames = ['-', '\\', '|', '/'];
let index = 0;

setInterval(() => {
    const frame = frames[index = ++index % frames.length];

    logUpdate(`Progress [ --- ] 15%\n\nReading the Data...`);
}, 80);