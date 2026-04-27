export const logout = ({ setUser, setAccessToken }) => {
  setUser(null);
  setAccessToken(null);
};
