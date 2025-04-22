import {
  deleteUserByIdSynchronously,
  getAllUsersSynchronously,
  getUserByIdSynchronously,
  insertUserSynchronously,
  updateUserByIdSynchronously,
} from "../src/Synchronus/synchronus";
import { cleanUp } from "../src/cleanups/cleanUp";
import { User } from "../src/types/User";

describe("getAllUsersSynchronously", () => {
  cleanUp();

  it("should return list of users synchronously", async () => {
    const result = await getAllUsersSynchronously();

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

describe("getUserByIdSynchronously", () => {
  cleanUp();

  it("should return user data based on id", async () => {
    const mockData = {
      id: 1,
      first_name: "Bhargav Mallik",
      last_name: "Ballani",
      email: "bbm@hds.com",
      gender: "Male",
      job_title: "Cloud IAAS",
    };

    const result = await getUserByIdSynchronously(1);

    expect(result).toEqual(mockData);
  });
});

describe("updateUserByIdSynchronously", () => {
  cleanUp();

  it("should return updated user data", async () => {
    const updatedData = {
      first_name: "Mallikarjun Rao",
      last_name: "Ballani",
      email: "mrb@hds.com",
      gender: "Male",
      job_title: "DevOps Engineer",
    };
    const result = await updateUserByIdSynchronously(1, updatedData);

    expect(result).toEqual({ id: 1, ...updatedData });
  });
});

describe("deleteUserByIdSynchronously", () => {
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

    const result = await deleteUserByIdSynchronously(1);

    expect(result).toEqual(deletedUser);
  });
});

describe("insertUserSynchronously", () => {
  cleanUp();

  it("should return successfull message", async () => {
    const data = {
      first_name: "Mallikarjun Rao",
      last_name: "Ballani",
      email: "mrb@hds.com",
      gender: "Male",
      job_title: "DevOps Engineer",
    };
    const result = await insertUserSynchronously(data);

    expect(result).toEqual("User data successfully inserted");
  });
});
