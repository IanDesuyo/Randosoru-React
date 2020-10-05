import axios from "axios";
import { useAuth } from "./Auth";

/**
 * @param {String} access_token
 */
export default function SeverLogin(access_token) {
  const { setToken } = useAuth();
  axios.post(`/api/oauth/line_liff?access_token=${access_token}`).then(res => {
    localStorage.removeItem("loginStatus");
    setToken(res.data.token);
  });
}
