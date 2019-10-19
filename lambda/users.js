const { getUsers, addUsers } = require("../lib/google");
const { fetchUsers } = require("../lib/cognito");
const { success, failure } = require("../lib/response");

export async function handler(event, context) {
  try {
    const users = await fetchUsers();
    const emails = await getUsers();

    if (users.length && emails.length && emails.length < users.length) {
      const diff = users.filter(
        user => !emails.includes(user.email.toLowerCase())
      );
      const data = diff.map(userdata => Object.values(userdata));
      await addUsers(data);

      const dataJson = diff.map(user => JSON.stringify(user));
      const dataString = dataJson.join(",");

      return success({ msg: "success", body: dataString });
    }

    return success({ msg: "no new users" });
  } catch (err) {
    console.error(JSON.stringify(err));
    return failure({ msg: "failure", error: err });
  }
}
