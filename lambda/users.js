const { getUsers, addUsers } = require("../lib/google");
const { fetchUsers } = require("../lib/cognito");
const { success, failure } = require("../lib/response");

export async function handler(event, context) {
  const {identity, user} = context.clientContext;
  console.log(user)
  try {
    const users = await fetchUsers();
    const emails = await getUsers();

    if (users.length && emails.length && emails.length < users.length) {
      const diff = users.filter(
        user => !emails.includes(user.email.toLowerCase())
      );

      const data = diff.map(userdata => Object.values(userdata));
      await addUsers(data);

      const response_data = diff.reduce((acc, curr, i) => {
        acc[i] = {
          created: curr.created,
          name: curr.name,
          verified: curr.email_verified
        };
        return acc;
      }, {});

      return success({ msg: "success", body: response_data });
    }

    return success({ msg: "no new users" });
  } catch (err) {
    return failure({ msg: "failure", err });
  }
}
