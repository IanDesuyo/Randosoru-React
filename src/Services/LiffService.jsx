import axios from "axios";
import AuthService from "./AuthService";
/**
 * @param {String} access_token 
 */
export default function SeverLogin(access_token) {
  axios
    .post(`/api/oauth/line_liff?access_token=${access_token}`)
    .then(res => {
      localStorage.removeItem("login_status");
      localStorage.setItem("token", res.data.token);
      AuthService.next(res.data.token);
    })
}