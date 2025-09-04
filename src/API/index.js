import axios from "axios";

const BASE_URL = "http://localhost:5001/api";

// generic wrapper
async function apiRequest(promise, errorMessage) {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    console.error(errorMessage, error);
    throw error; // rethrow so the caller can handle it if needed
  }
}
function fetchDepartments() {
  return apiRequest(
    axios.get(`${BASE_URL}/departments/all`),
    "Error fetching departments:"
  );
}

function dashboardStats(year) {
  const params = new URLSearchParams({
    ...(year && { year: year.toString() }),
  });

  return apiRequest(
    axios.get(`${BASE_URL}/dashboard?${params}`),
    "Error fetching dashboard stats:"
  );
}

function getAllStaff(q, page, limit) {
  const params = new URLSearchParams({
    ...(q && { q }),
    ...(page && { page: page.toString() }),
    ...(limit && { limit: limit.toString() }),
  });

  return apiRequest(
    axios.get(`${BASE_URL}/staff?${params}`),
    "Error fetching staff:"
  );
}

function getAllPatents(q, page, limit) {
  const params = new URLSearchParams({
    ...(q && { q }),
    ...(page && { page: page.toString() }),
    ...(limit && { limit: limit.toString() }),
  });

  return apiRequest(
    axios.get(`${BASE_URL}/patent?${params}`),
    "Error fetching patents:"
  );
}

function getPatentsStats(schoolId) {
  const params = new URLSearchParams({
    ...(schoolId && { schoolId }),
  });
  return apiRequest(
    axios.get(`${BASE_URL}/patent/stats?${params}`),
    "Error fetching patent stats:"
  );
}

export {
  fetchDepartments,
  dashboardStats,
  getAllStaff,
  getAllPatents,
  getPatentsStats,
};

// import axios from "axios";

// const BASE_URL = "http://localhost:5001/api";

// async function fetchDepartments() {
//   try {
//     const response = await axios.get(`${BASE_URL}/departments/all`);
//     return response.data; // axios already parses JSON
//   } catch (error) {
//     console.error("Error fetching departments:", error);
//     throw error;
//   }
// }
// async function dashboardStats(year) {
//   try {
//     const params = new URLSearchParams({
//       ...(year && { year: year.toString() }),
//     });
//     const response = await axios.get(`${BASE_URL}/dashboard?${params}`);
//     return response.data; // axios already parses JSON
//   } catch (error) {
//     console.error("Error fetching departments:", error);
//     throw error;
//   }
// }
// async function getAllStaff(q, page, limit) {
//   try {
//     const params = new URLSearchParams({
//       ...(q && { q }),
//       ...(page && { page: page.toString() }),
//       ...(limit && { limit: limit.toString() }),
//     });

//     const response = await axios.get(`${BASE_URL}/staff?${params}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching staff:", error);
//     throw error;
//   }
// }
// async function getAllPatents(q, page, limit) {
//   try {
//     const params = new URLSearchParams({
//       ...(q && { q }),
//       ...(page && { page: page.toString() }),
//       ...(limit && { limit: limit.toString() }),
//     });

//     const response = await axios.get(`${BASE_URL}/patent?${params}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching staff:", error);
//     throw error;
//   }
// }

// async function getPatentsStats() {
//   try {
//     const response = await axios.get(`${BASE_URL}/patent/stats`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching staff:", error);
//     throw error;
//   }
// }

// export {
//   fetchDepartments,
//   dashboardStats,
//   getAllStaff,
//   getAllPatents,
//   getPatentsStats,
// };
