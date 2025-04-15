"use strict";
// import axios from 'axios';
// import { USERS_URL, ADDRESSES_URL } from './consts/URLS';
// import type { User } from './types/user';
// import type { Address } from './types/address';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // Reusable fetch utility
// const fetchData = async <T>(url: string): Promise<T> => {
//   const { data } = await axios.get<T>(url);
//   return data;
// };
// // Fetch users
// const getUsers = () => fetchData<User[]>(USERS_URL);
// // Fetch addresses
// const getAddresses = () => fetchData<Address[]>(ADDRESSES_URL);
// // Match and display users with their addresses
// const getUsersAndAddresses = async (): Promise<void> => {
//   try {
//     const [users, addresses] = await Promise.all([getUsers(), getAddresses()]);
//     if (!users.length || !addresses.length) {
//       console.warn('⚠️ Warning: Users or addresses list is empty.');
//       return;
//     }
//     for (const user of users) {
//       const userAddresses = addresses.filter(addr => addr.id === user.id);
//       console.log(`\n👤 ${user.first_name} (${user.email})`);
//       userAddresses.length
//         ? console.table(userAddresses)
//         : console.log('⚠️ No address found.');
//     }
//   } catch (error) {
//     console.error('❌ Failed to fetch Users & Addresses:', error);
//   }
// };
// getUsersAndAddresses();
// import axios from 'axios';
// import { USERS_URL, ADDRESSES_URL } from './consts/URLS';
// import type { User } from './types/user';
// import type { Address } from './types/address';
// // Simulated delay
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// // Reusable fetch utility
// const fetchData = async <T>(url: string): Promise<T> => {
//   const { data } = await axios.get<T>(url);
//   return data;
// };
// // Fetch users
// const getUsers = () => fetchData<User[]>(USERS_URL);
// // Fetch addresses
// const getAddresses = () => fetchData<Address[]>(ADDRESSES_URL);
// // Match and display users with their addresses
// const getUsersAndAddresses = async (): Promise<void> => {
//   try {
//     console.log("⏳ Loading user and address data...");
//     const [users, addresses] = await Promise.all([getUsers(), getAddresses()]);
//     // Simulate UI processing delay before showing output
//     await delay(1500); // 1.5 seconds
//     if (!users.length || !addresses.length) {
//       console.warn('⚠️ Warning: Users or addresses list is empty.');
//       return;
//     }
//     for (const user of users) {
//       const userAddresses = addresses.filter(addr => addr.id === user.id);
//       console.log(`\n👤 ${user.first_name} (${user.email})`);
//       userAddresses.length
//         ? console.table(userAddresses)
//         : console.log('⚠️ No address found.');
//     }
//   } catch (error) {
//     console.error('❌ Failed to fetch Users & Addresses:', error);
//   }
// };
// getUsersAndAddresses();
const axios_1 = __importDefault(require("axios"));
const ora_1 = __importDefault(require("ora"));
const URLS_1 = require("./consts/URLS");
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Reusable fetch utility
const fetchData = async (url) => {
    const { data } = await axios_1.default.get(url);
    return data;
};
// Fetch users
const getUsers = () => fetchData(URLS_1.USERS_URL);
// Fetch addresses
const getAddresses = () => fetchData(URLS_1.ADDRESSES_URL);
// Match and display users with their addresses
const getUsersAndAddresses = async () => {
    const spinner = (0, ora_1.default)('⏳ Fetching Users and Addresses...').start();
    try {
        const [users, addresses] = await Promise.all([getUsers(), getAddresses()]);
        await delay(2000);
        spinner.succeed('✅ Data fetched successfully!');
        if (!users.length || !addresses.length) {
            console.warn('⚠️ Warning: Users or addresses list is empty.');
            return;
        }
        for (const user of users) {
            const userAddresses = addresses.filter(addr => addr.id === user.id);
            console.log(`\n👤 ${user.first_name} (${user.email})`);
            userAddresses.length
                ? console.table(userAddresses)
                : console.log('⚠️ No address found.');
        }
    }
    catch (error) {
        spinner.fail('❌ Failed to fetch Users & Addresses');
        console.error(error);
    }
};
getUsersAndAddresses();
//# sourceMappingURL=index.js.map