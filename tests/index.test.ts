import axios from "axios";
import { getUsers } from "../src/index";
import { BASE_URL } from "../src/consts/URL";
import { User } from "../src/types/Users";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getUsers', () => {
    it('should fetch a list of users', async () => {
        const mockUsers = [
            { id: 1, first_name: "Bhargav Mallik", last_name: "Ballani", email: "bhargavmallikb@gmail.com", gender: "Male", job_title: "Cloud Infrastructure as a Service" }
        ];

        mockedAxios.get.mockResolvedValueOnce({ data: mockUsers });

        const users = await getUsers();
        expect(users).toEqual(mockUsers);
        expect(mockedAxios.get).toHaveBeenCalledWith(BASE_URL);
    });
});