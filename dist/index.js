"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
const URL_1 = require("./consts/URL"); // BASE_URL used to fetch data
const axios_1 = __importDefault(require("axios")); // axios for invoking BASE_URL with different methods GET, PORT ..
async function getUsers() {
    try { // Handling Errors using try & catch blocks
        const response = await axios_1.default.get(URL_1.BASE_URL); // Invoking BASE_URL to retreive and store the response
        console.table(response.data); // prints the data that gets from the response in a tabular format
    }
    catch (err) {
        console.error(`Error occured while Fetching Users ${err}`); // any error occurs prints in the console
    }
}
getUsers(); // Invokes above function to retreive the data
//# sourceMappingURL=index.js.map