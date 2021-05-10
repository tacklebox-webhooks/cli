const { db, queries } = require("./db");
const { newResponse, uuidToId } = require("./utils");

const createUser = async (name, serviceUuid) => {
  if (!name) {
    return newResponse(400, {
      error_type: "missing_parameter",
      detail: "'name' is required.",
    });
  }

  const text = queries.createUser;

  try {
    const serviceId = await uuidToId("services", serviceUuid);
    const values = [name, serviceId];
    const response = await db.query(text, values);
    const user = response.rows[0];
    return newResponse(201, user);
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not create user.",
    });
  }
};

const listUsers = async (serviceUuid) => {
  const text = queries.listUsers;
  const values = [serviceUuid];

  try {
    const response = await db.query(text, values);
    const users = response.rows;
    return newResponse(200, users);
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not get users.",
    });
  }
};

const getUser = async (userUuid) => {
  const text = queries.getUser;
  const values = [userUuid];

  try {
    const response = await db.query(text, values);
    const user = response.rows[0];

    if (!user) {
      return newResponse(404, {
        error_type: "data_not_found",
        detail: "No user matches given uuid.",
      });
    }

    return newResponse(200, user);
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not get user.",
    });
  }
};

// const deleteUser = async (userUuid) => {
//   const text = queries.deleteUser;
//   const values = [userUuid];

//   try {
//     // all need to delete related subscriptions
//     const response = await db.query(text, values);
//     if (response.rows.length === 0) {
//       return newResponse(404, { Error: "User not found" });
//     } else {
//       return newResponse(204, { Success: "User was deleted" });
//     }
//   } catch (error) {
//     console.error(error);
//     return newResponse(500, { Error: "Could not delete user" });
//   }
// };

module.exports = {
  // deleteUser,
  getUser,
  createUser,
  listUsers,
};
