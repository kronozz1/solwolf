import * as opsService from "./Ops";

import { signupApi,registerApi } from "../Constent/Api";

const signupUser = async (data) => {
  let result = await opsService.postdata(signupApi, data);
  return result;
};
const registerUser = async (data) => {
  let result = await opsService.postdata(registerApi, data);
  return result;
};

export { signupUser,registerUser };
