import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "../interceptors/axios";

function ChangePassword() {
    const userId = useSelector((store) => {
        return store.user.profileFill.id;
    });
    const accesstoken = useSelector((store) => {
        return store.user.accesstoken;
    });
    const [data, setData] = useState({
        password: "",
        password2: "",
    });

    const { password, password2 } = data;
    const navigate = useNavigate();
    function onChange(e) {
        setData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }
    async function onSubmit(e) {
        e.preventDefault();
        if (data.password != data.password2) {
            toast.error("Password doesn't match");
            return;
        }
        let dummy = { ...data, uid: userId };
        try {
            let response = await axios.post("api/user/changepassword/", dummy, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accesstoken}`,
                },
            });
            let statusCode = response.status;
            if (statusCode == 200) {
                toast.success(`Password changed Successfully`);
                navigate("/profile");
            } else if (statusCode == 401) {
                toast.error("Try again");
            } else if (statusCode == 404) {
                toast.dismiss();
                toast.error("Something went wrong");
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center -top-4">
                    <p className="text-3xl font-semibold text-center my-9">Change Password</p>
                    <div className="flex flex-col w-full max-w-md gap-8 ">
                        <input autoComplete="off" onChange={onChange} required id="password" type="password" value={password} placeholder="Password" className="px-4 py-3 rounded-md" />
                        <input autoComplete="off" onChange={onChange} required id="password2" type="password" value={password2} placeholder="Confirm password" className="px-4 py-3 rounded-md" />
                        <button className="px-8 py-2 text-white bg-blue-600 hover:bg-blue-700 transition ease-in-out rounded-md ">Login </button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default ChangePassword;
