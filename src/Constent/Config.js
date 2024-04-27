export const configs = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  },
};

export const config = localStorage.getItem("jwtToken");
