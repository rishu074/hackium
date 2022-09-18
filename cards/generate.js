export default function generateCards(args, options) {
    if (options && options.save) {
        console.log("works fine");
    } else {
        console.log("Please use --save flag.")
        process.exit(1);
    }
}