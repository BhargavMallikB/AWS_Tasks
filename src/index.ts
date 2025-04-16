import axios from "axios"; // axios imported for invoking URL's
import ora from "ora"; // ora imported to console Loading Spinner, Succeed and Error messages
import { USERS_URL, ADDRESSES_URL } from "./consts/URLS"; // These are URL's imported for fetching data in them
import type { User } from "./types/user"; // User imported to tell type of User data we get
import type { Address } from "./types/address"; // Address imported to tell type of data we get

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); // This stops the process for some time

// Reusable fetch utility
const fetchData = async <T>(url: string): Promise<T> => {
  // This function to fetch data from URL and returns the data
  const { data } = await axios.get<T>(url);
  return data;
};

// Fetch users
const getUsers = () => fetchData<User[]>(USERS_URL); // Fetching users data by passing URL to fetchData() method and stores it

// Fetch addresses
const getAddresses = () => fetchData<Address[]>(ADDRESSES_URL); // Fetching addresses data by passing URL to fetchData() method and stores it

// Match and display users with their addresses
const getUsersAndAddresses = async (): Promise<void> => {
  // This method will combine both users & addresses data then prints it
  const spinner = ora("⏳ Fetching Users and Addresses...").start(); // It just prints a loader until data comes

  try {
    // To handle any errors used try/catch blocks
    const [users, addresses] = await Promise.all([getUsers(), getAddresses()]); // Fetches data and stores in variables

    await delay(2000); // It delays 2 Seconds before printing data

    spinner.succeed("✅ Data fetched successfully!"); // After time delay completed the loader turns into succeed

    if (!users.length || !addresses.length) {
      // It users & addresses are not present Prints an warning
      console.warn("⚠️ Warning: Users or addresses list is empty.");
      return; // Just stops the program here
    }

    for (const user of users) {
      // Loop through each user and find its addresses then prints their deetails in table
      const userAddresses = addresses.filter((addr) => addr.id === user.id); // Filters & assign each User Addresses to them

      console.log(`\n👤 ${user.first_name} (${user.email})`); // Console the User name & email

      userAddresses.length
        ? console.table(userAddresses) // Console User Addresses data in table format if data present
        : console.log("⚠️ No address found."); // Console this message if a User doesn't have any Address
    }
  } catch (error) {
    spinner.fail("❌ Failed to fetch Users & Addresses"); // Any error occurs the spinner will turns into an error and prints message
    console.error(error);
  }
};

getUsersAndAddresses(); // Calls the above method functionality to print the data or error in console
