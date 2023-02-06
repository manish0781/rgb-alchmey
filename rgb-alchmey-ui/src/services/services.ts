import axios from "axios";
import { SERVICE_URL } from "./constant";
const serviceUrl = SERVICE_URL;

export const getInitDetails = () => {
  return axios.get(`${serviceUrl}/init`);
};

export const getcurrentUserInitDetails = (userId: string) => {
  return axios.get(`${serviceUrl}/init/user/${userId}`);
};
