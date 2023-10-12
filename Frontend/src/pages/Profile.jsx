import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logOut, profileFill } from "../features/auth/userSlice";
import axios from "../interceptors/axios";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector((store) => store.user);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    department: "",
    lab: "",
  });

  const { name, email, lab, department } = formData;

  function SignOut() {
    try {
      dispatch(logOut());
      toast.success("Signed Out", {
        position: "bottom-center",
        hideProgressBar: true,
        delay: 1200,
        theme: "dark",
      });
      navigate("/login");
    } catch (e) {
      toast.error("Something went wrong", {
        position: "bottom-center",
        hideProgressBar: true,
        delay: 1200,
        theme: "dark",
      });
    }
  }

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        let response = await axios.get("api/user/profile/", {
          headers: { Authorization: `Bearer ${state.accesstoken}` },
        });
        setFormData((prev) => ({
          ...prev,
          ...response.data,
        }));
        dispatch(profileFill(response.data));
        setLoading(false);
      } catch (_) {
        toast.error("Something went wrong");
      }
    }
    getProfile();
  }, [state.accesstoken, dispatch]);

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full text-center">
        <img
          alt="profile"
          src={require("../img/profile.jpeg")}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{state.role}'s Profile</h1>
        <div className="text-left space-y-2">
          <div>
            <span className="font-semibold">Name:</span> {name}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {email}
          </div>
          <div>
            <span className="font-semibold">Lab:</span> {lab}
          </div>
          <div>
            <span className="font-semibold">Department:</span> {department}
          </div>
          <div>
            <span className="font-semibold">College:</span> GLOBAL ACADEMY OF TECHNOLOGY
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            className="text-blue-600 cursor-pointer hover:text-blue-800 focus:outline-none"
            onClick={() => navigate("/changepassword")}
          >
            Change Password
          </button>
          <button
            className="text-red-600 cursor-pointer hover:text-red-800 focus:outline-none"
            onClick={SignOut}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
