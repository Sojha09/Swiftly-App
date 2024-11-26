// import axios from "axios";
// import SummaryApi, { baseURL } from "../common/SummaryApi";

// const Axios = axios.create({
//   baseURL: baseURL,
//   withCredentials: true,
// });

// //sending access token in the header
// Axios.interceptors.request.use(
//   async (config) => {
//     const accessToken = localStorage.getItem("accesstoken");

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// //extend the life span of access token with
// // the help refresh
// Axios.interceptors.request.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     let originRequest = error.config;

//     if (error.response.status === 401 && !originRequest.retry) {
//       originRequest.retry = true;

//       const refreshToken = localStorage.getItem("refreshToken");

//       if (refreshToken) {
//         const newAccessToken = await refreshAccessToken(refreshToken);

//         if (newAccessToken) {
//           originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return Axios(originRequest);
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// const refreshAccessToken = async (refreshToken) => {
//   try {
//     const response = await Axios({
//       ...SummaryApi.refreshToken,
//       headers: {
//         Authorization: `Bearer ${refreshToken}`,
//       },
//     });

//     const accessToken = response.data.data.accessToken;
//     localStorage.setItem("accesstoken", accessToken);
//     return accessToken;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default Axios;
import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true, // To include cookies in requests
});

// Request Interceptor: Add Authorization header with access token
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accesstoken");

    if (accessToken) {
      // Add the Authorization header if access token is present
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 errors (Unauthorized) and refresh access token
Axios.interceptors.response.use(
  (response) => response, // If the response is successful, return it
  async (error) => {
    let originRequest = error.config;

    // If we get a 401 Unauthorized error and haven't already retried the request
    if (error.response?.status === 401 && !originRequest._retry) {
      originRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const newAccessToken = await refreshAccessToken(refreshToken);

          if (newAccessToken) {
            originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return Axios(originRequest); // Retry the original request with the new access token
          }
        } catch (refreshError) {
          console.log("Failed to refresh token:", refreshError);
          // Handle failure to refresh token (e.g., log out user or show error message)
        }
      }
    }

    return Promise.reject(error);
  }
);

// Function to refresh the access token using the refresh token
const refreshAccessToken = async (refreshToken) => {
  try {
    // Make a request to the refresh token API endpoint
    const response = await Axios({
      ...SummaryApi.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`, // Send the refresh token in the Authorization header
      },
    });

    const accessToken = response.data.data.accessToken;

    // Save the new access token in localStorage
    localStorage.setItem("accesstoken", accessToken);
    return accessToken;
  } catch (error) {
    console.log("Error refreshing access token:", error);
    // Optionally, handle refresh token failure (log out the user, etc.)
    return null;
  }
};

export default Axios;
