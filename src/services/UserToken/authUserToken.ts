import { Decryptor } from "../../security";

export const getUserToken = () => {
  const token = localStorage.getItem('token');
  return token ? Decryptor(token) : null;
};
