import { BiLogOut } from "react-icons/bi";
// import useLogout from "../../hooks/useLogout";
import axios from "../../axios";
import { useAuthContext } from "../../context/AuthContext";

const LogoutButton = () => {
  //   const { loading, logout } = useLogout();
  const { setAuthUser } = useAuthContext();
  const userLogout = async () => {
    try {
      const res = await axios.post("api/user/logout");
      const data = res.data;
      localStorage.removeItem("chat-user");
      localStorage.removeItem("accessToken");
      setAuthUser(null);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  return (
    <div className="mt-auto">
      <BiLogOut
        className="w-6 h-6 text-white cursor-pointer"
        onClick={userLogout}
      />
    </div>
  );
};
export default LogoutButton;
