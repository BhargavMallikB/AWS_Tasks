import { promisify } from "util";
import fs from "fs";
import path from "path";

const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);
const unlink = promisify(fs.unlink);
const TEST_DB_PATH = path.join(__dirname, "../data/TEST_USER_DATA.json");
const REAL_DATA = path.join(__dirname, "../data/USER_DATA.json");

export function cleanUp() {
  beforeEach(async () => {
    const TEST_USER_DATA = [
      {
        id: 1,
        first_name: "Bhargav Mallik",
        last_name: "Ballani",
        email: "bbm@hds.com",
        gender: "Male",
        job_title: "Cloud IAAS",
      },
    ];

    await writeFile(TEST_DB_PATH, JSON.stringify(TEST_USER_DATA, null, 2));
    await copyFile(TEST_DB_PATH, REAL_DATA);
  });

  afterEach(async () => {
    await unlink(TEST_DB_PATH);
  });
}
