const { db, queries } = require("./db");
const { newResponse, isValidUuid } = require("./utils");

const createService = async (name) => {
  if (!name) {
    return newResponse(400, {
      error_type: "invalid_parameter",
      detail: "'name' is required.",
    });
  }

  const text = queries.createService;
  const values = [name];

  try {
    const response = await db.query(text, values);
    let service = response.rows[0];
    return newResponse(201, service);
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not create service.",
    });
  }
};

const listServices = async () => {
  const queryString = queries.listServices;

  try {
    const response = await db.query(queryString);
    let services = response.rows;
    return newResponse(200, services);
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not get services.",
    });
  }
};

const getService = async (serviceUuid) => {
  if (!isValidUuid(serviceUuid)) {
    return newResponse(404, {
      error_Type: "data_not_found",
      detail: "No service matches given uuid.",
    });
  }

  const text = queries.getService;
  const values = [serviceUuid];

  try {
    const response = await db.query(text, values);
    const service = response.rows[0];

    if (!service) {
      return newResponse(404, {
        error_type: "data_not_found",
        detail: "No service matches given uuid.",
      });
    }

    return newResponse(200, service);
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not get service.",
    });
  }
};

// const deleteService = async (serviceUuid) => {
//   const text = queries.deleteService;
//   const values = [serviceUuid];

//   try {
//     // all need to delete related topics
//     const response = await db.query(text, values);
//     if (response.rows.length === 0) {
//       return newResponse(404, { Error: 'Service not found'});
//     } else {
//       return newResponse(204, { Success: 'Service was deleted'});
//     }
//   } catch (error) {
//     console.error(error);
//     return newResponse(500, { Error: 'Could not delete service' });
//   }
// };

module.exports = {
  // deleteService,
  getService,
  createService,
  listServices,
};
