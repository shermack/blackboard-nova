export const authStorage = {
  getToken: () => localStorage.getItem("amp_token"),
  setSession: ({ token, user }) => {
    localStorage.setItem("amp_token", token);
    localStorage.setItem("amp_user", JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem("amp_token");
    localStorage.removeItem("amp_user");
  },
  getUser: () => {
    const raw = localStorage.getItem("amp_user");
    return raw ? JSON.parse(raw) : null;
  }
};
