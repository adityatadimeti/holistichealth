import { action } from "./_generated/server";
import { v } from "convex/values";

export const myAPICall = action({
  args: { foodName: v.string() },
  handler: async (_, args) => {
    try {
      const response = await fetch(
        "https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=" +
          args.foodName +
          "&format=json",
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ4NDUzNUJFOUI2REY5QzM3M0VDNUNBRTRGMEJFNUE2QTk3REQ3QkMiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJTRVUxdnB0dC1jTno3Rnl1VHd2bHBxbDkxN3cifQ.eyJuYmYiOjE3MDgyMDE5NTUsImV4cCI6MTcwODI4ODM1NSwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiJkZTIyMjg3N2EzY2M0MDllOGRjMDU3ZDIyMjY2ZmYxZSIsInNjb3BlIjpbImJhc2ljIl19.NDo0lkRmcoXKTgIJG1DbM_iVzdeleeFntX6YIgaZZM6XQvNzLX8z20Duz5VgzeYbguwATXK-iUVeIyFg02SEe-EGwluV2sPgN2V4fcJGaG0f17at74yr5V0AZfa28E8pIfSwfdMaLSBtLgPZ8p-m6ss1wof0FmcX5PaPReaI5SxcKbPXz8L98oreV_HqCs5fZjLYuFzFXouE75FDAZUQdWsDUxlGv8MJtrYEN87AWoXWpek0Zfd8KszKXacuaKuVozMyV3-_u8nh3mqUBP3msZzR8uWRaA0MR2yQ480gdCH5jeFAcLcq_2LTPZrqTtR7O8wQev6XbZ36UzTIYYKB_A",
          },
        }
      );
      const json = await response.json();
      console.log(JSON.stringify(json)); // Logging the JSON response
      return JSON.stringify(json); // Returning the JSON response
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
});
