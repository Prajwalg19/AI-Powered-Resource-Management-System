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
    const state = useSelector((store) => {
        return store.user;
    });
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
    });
    const { name, email } = formData;
    function SignOut() {
        try {
            dispatch(logOut());
            toast.success("Signed Out", { position: "bottom-center", hideProgressBar: true, delay: 1200, theme: "dark" });
            navigate("/login");
        } catch (e) {
            toast.error("Something went wrong", { position: "bottom-center", hideProgressBar: true, delay: 1200, theme: "dark" });
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
        <div>
            <div className="flex flex-col flex-wrap items-center justify-center max-w-6xl mx-auto ">
                <div className="my-10 text-3xl font-bold text-center ">{state.role}'s Profile</div>
                <img alt="profile" src={require("../img/profile.jpeg")} className="w-24  h-24 rounded-full mb-5" />
                <form className="w-[95%] m-auto  md:w-[50%]">
                    <input type="text" disabled placeholder="Name" id="name" value={name} className={` w-full p-3 my-4 text-xl rounded transition ease-in-out border border-gray-400 bg-white text-gray-700`} />
                    <input type="text" value={email} id="email" placeholder="Email" className={`w-full p-3 my-4 text-xl rounded transition ease-in-out border-gray-400 bg-white `} disabled />
                    <div className="w-full flex justify-between items-center">
                        <p className="text-lg text-red-600 cursor-pointer hover:text-red-800 transition ease-in-out duration-100" onClick={() => SignOut()}>
                            Log out
                        </p>
                        <p className="text-lg text-blue-600 cursor-pointer hover:text-blue-800 transition ease-in-out duration-100" onClick={() => navigate("/changepassword")}>
                            Change password
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
// flex justify-between w-[95%] md:w-[50%]  m-auto
