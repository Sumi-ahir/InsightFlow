import { useDispatch } from "react-redux";
import { register, login, getMe, logout } from "../service/auth.api.js";
import { setUser, setLoading, setError } from "../auth.slice.js";

export function useAuth() {
  const dispatch = useDispatch();
  // register
  async function handleRegister({ email, username, password }) {
    try {
      dispatch(setLoading(true));
      const data = await register({ email, username, password });
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "registration failed"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }
  // login
  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      await handleGetMe();
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "login failed"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
  // get me
  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "failed to fetch user data"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }
  // logout
  async function handleLogout() {
    try {
      await logout();
      localStorage.removeItem("token");
      dispatch(clearUser());
      dispatch(setError(null));
    } catch (error) {
      console.log(error);
    }
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
  };
}
