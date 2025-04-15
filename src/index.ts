// import axios from 'axios';
// import { USERS_URL, ADDRESSES_URL } from './consts/URLS';
// import type { User } from './types/user';
// import type { Address } from './types/address';

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


import axios from 'axios';
import ora from 'ora';
import { USERS_URL, ADDRESSES_URL } from './consts/URLS';
import type { User } from './types/user';
import type { Address } from './types/address';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Reusable fetch utility
const fetchData = async <T>(url: string): Promise<T> => {
  const { data } = await axios.get<T>(url);
  return data;
};

// Fetch users
const getUsers = () => fetchData<User[]>(USERS_URL);

// Fetch addresses
const getAddresses = () => fetchData<Address[]>(ADDRESSES_URL);

// Match and display users with their addresses
const getUsersAndAddresses = async (): Promise<void> => {
  const spinner = ora('⏳ Fetching Users and Addresses...').start();

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
  } catch (error) {
    spinner.fail('❌ Failed to fetch Users & Addresses');
    console.error(error);
  }
};

getUsersAndAddresses();
