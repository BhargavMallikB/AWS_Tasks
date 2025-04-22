import {
  deleteUserById,
  getAllUsers,
  getUserById,
  insertUser,
  updateUserById,
} from "../src/Asynchronus/asynchronus";
import { User } from "../src/types/User";
import { cleanUp } from "../src/cleanups/cleanUp";

describe("getAllUsers", () => {
  cleanUp();

  it("should return list of users", async () => {
    const result = await getAllUsers();

    expect(result.length).toBeGreaterThan(0);

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toHaveProperty("id");
      expect(result[i]).toHaveProperty("first_name");
      expect(result[i]).toHaveProperty("last_name");
      expect(result[i]).toHaveProperty("email");
      expect(result[i]).toHaveProperty("gender");
      expect(result[i]).toHaveProperty("job_title");
    }
  });
});

describe("getUserById", () => {
  cleanUp();

  it("should return the user details", async () => {
    const result = await getUserById(1);

    const mockData = {
      id: 1,
      first_name: "Bhargav Mallik",
      last_name: "Ballani",
      email: "bbm@hds.com",
      gender: "Male",
      job_title: "Cloud IAAS",
    };

    expect(result).toEqual(mockData);
  });
});

describe("updateUserById", () => {
  cleanUp();

  it("should reuturn updated data", async () => {
    const updatedData = {
      first_name: "Mallikarjun Rao",
      last_name: "Ballani",
      email: "mrb@hds.com",
      gender: "Male",
      job_title: "DevOps Engineer",
    };
    const result = await updateUserById(1, updatedData);

    expect(result).toEqual({ id: 1, ...updatedData });
  });
});

describe("deleteUserById", () => {
  cleanUp();

  it("should return deleted user data", async () => {
    const deletedUser: User = {
      id: 1,
      first_name: "Bhargav Mallik",
      last_name: "Ballani",
      email: "bbm@hds.com",
      gender: "Male",
      job_title: "Cloud IAAS",
    };

    const result = await deleteUserById(1);

    expect(result).toEqual([deletedUser]);
  });
});

describe("insertUser", () => {
  cleanUp();

  it("should return successfull message", async () => {
    const data = {
      first_name: "Mallikarjun Rao",
      last_name: "Ballani",
      email: "mrb@hds.com",
      gender: "Male",
      job_title: "DevOps Engineer",
    };
    const result = await insertUser(data);

    expect(result).toEqual("Successfully data inserted");
  });
});
