import generateBins from '../bins/generate.js';
import validateBins from '../bins/validate.js';

export default function binsHandler(args, options, logger) {
    if(args.type === "generate") {
        return generateBins(args, options);
    } else if (args.type === "validate") {
        return validateBins(args, options);
    } else {
        process.exit(1);
    }

}