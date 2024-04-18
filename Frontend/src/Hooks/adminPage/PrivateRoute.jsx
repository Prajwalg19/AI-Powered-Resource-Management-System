import { Outlet, Navigate } from "react-router-dom";
import useAuth from "./useAuth.jsx";
import Spinner from "../../Components/Spinner";
export default function PrivateRoute() {
  const { isAdmin, checking } = useAuth();
  if (checking) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to={"/verify"} />;
}
