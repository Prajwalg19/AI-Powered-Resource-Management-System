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
                    ...response?.data  ,
                }));
                dispatch(profileFill(response?.data));
                setLoading(false);
            } catch (_) {
                toast.error("Something went wrong");
            }
        }
        getProfile();
    }, [state.accesstoken, dispatch]);

    // if (loading) {
    //     return (
    //         <>
    //             <Spinner />
    //         </>
    //     );
    // }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg p-8 text-center bg-white rounded-lg shadow-md">
                <img alt="profile" src={require("../img/profile.jpeg")} className="w-24 h-24 mx-auto mb-4 rounded-full" />
                <h1 className="mb-2 text-2xl font-bold">{state?.role}'s Profile</h1>
                <div className="text-left space-y-2">
                    <div>
                        <span className="font-semibold">Name:</span> {name}
                    </div>
                    <div>
                        <span className="font-semibold">Email:</span> {email}
                    </div>
                    {state?.role == "admin" && (
                        <>
                            <div>
                                <span className="font-semibold">Lab:</span> {lab}
                            </div>
                            <div>
                                <span className="font-semibold">Department:</span> {department}
                            </div>
                        </>
                    )}
                    <div>
                        <span className="font-semibold">College:</span> GLOBAL ACADEMY OF TECHNOLOGY
                    </div>
                </div>
                <div className="flex justify-between mt-4">
                    <button className="text-blue-600 cursor-pointer hover:text-blue-800 focus:outline-none" onClick={() => navigate("/changepassword")}>
                        Change Password
                    </button>
                    <button className="text-red-600 cursor-pointer hover:text-red-800 focus:outline-none" onClick={SignOut}>
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
