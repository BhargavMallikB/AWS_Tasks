import { BASE_URL } from "./consts/URL"; // BASE_URL used to fetch data
import { User } from "./types/Users"; // User is a type of data that we retreive
import axios, { AxiosResponse } from "axios"; // axios for invoking BASE_URL with different methods GET, PORT ..

export async function getUsers(): Promise<void> { // returns Promise of User array
     
    try{ // Handling Errors using try & catch blocks
        const response: AxiosResponse<User[]> = await axios.get<User[]>(BASE_URL); // Invoking BASE_URL to retreive and store the response
        console.table(response.data); // prints the data that gets from the response in a tabular format
    } catch (err) { 
        console.error(`Error occured while Fetching Users ${err}`); // any error occurs prints in the console
    }
}

getUsers(); // Invokes above function to retreive the data
