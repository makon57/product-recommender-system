// import type { User } from "../types";

export const jwtToken = localStorage.getItem("jwtToken");
export const getUser = async () => {
  const response = await fetch("/auth/login", {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: unknown = await response.json();
  console.log(data);
  alert(data);
  return data;
};

// export const getUser = async (
//   email: string,
//   password: string
// ): Promise<User[]> => {
//   const response = await fetch("/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
//   if (!response.ok) {
//     // Get the Authorization header
//     const authHeader = response.headers.get("Authorization");
//     if (authHeader && authHeader.startsWith("Bearer ")) {
//       const jwt = authHeader.substring(7); // Remove "Bearer " prefix
//       // Store the JWT for future use
//       localStorage.setItem("jwt", jwt);
//     }
//   }
//   const data: unknown = await response.json();
//   console.log(data);
//   return data as User[];
// };
