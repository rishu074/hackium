import generateCards from '../cards/generate.js';
import validateCards from '../cards/validate.js';

export default function cardsHandler(args, options, logger) {
    if(args.type === "generate") {
        return generateCards(args, options);
    } else if (args.type === "validate") {
        return validateCards(args, options);
    } else {
        process.exit(1);
    }

}