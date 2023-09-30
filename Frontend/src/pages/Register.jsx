import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import validator from "validator";
import axios from "axios";
function Register() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        name: "",
        password: "",
        password2: "",
        role: "Staff",
    });
    const { email, password, name, password2, role } = data;
    function onChange(e) {
        setData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }
    console.log(data);
    async function onSubmit(e) {
        console.log(data);
        e.preventDefault();
        try {
            let response = await axios.post("http://localhost:8000/api/user/register/", data, {
                headers: {
                    "Content-type": "application/json",
                },
            });

            console.log(response);
            if (response.status === 201) {
                toast.success("User Created");
                navigate("/login");
            } else if (response.response.status === 400) {
                toast.error("Something went wrong");
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
            return;
        }
    }

    const [errors, setErrors] = useState({
        email: "",
        name: "",
        password: "",
        password2: "",
    });
    function onChange(e) {
        const { id, value } = e.target;
        let newErrors = { ...errors };

        switch (id) {
            case "email":
                // Add email validation logic here, e.g., checking for a valid email format
                // You can use regular expressions or a library like 'validator'
                if (!validator.isEmail(value)) {
                    newErrors.email = "Invalid email address";
                } else {
                    newErrors.email = "";
                }
                break;

            case "name":
                // Add validation logic for the name field
                // For example, check if the name is not empty
                if (value.trim() === "") {
                    newErrors.name = "Name is required";
                } else {
                    newErrors.name = "";
                }
                break;

            case "password":
                // Add validation logic for the password field
                // You can check the password length or other criteria
                if (value.length < 8) {
                    newErrors.password = "Password must be at least 8 characters long";
                } else {
                    newErrors.password = "";
                }
                break;

            case "password2":
                // Add validation logic for password confirmation
                if (value !== data.password) {
                    newErrors.password2 = "Passwords do not match";
                } else {
                    newErrors.password2 = "";
                }
                break;

            default:
                break;
        }

        // Update the state with the new error messages
        setErrors(newErrors);

        // Update the data state as before
        setData((prev) => ({
            ...prev,
            [id]: value,
        }));
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center top-4 ">
                    <p className="text-3xl font-semibold text-center my-9">Registration Form</p>
                    <div className="flex flex-col w-full max-w-md  gap-8">
                        <input autoComplete="off" onChange={onChange} required id="name" type="text" value={name} placeholder="name" className="px-4 py-3 rounded-md" />
                        {errors.name && <span className="text-red-600">{errors.name}</span>}
                        <div className="flex items-center justify-between w-full ">
                            <input autoComplete="off" onChange={onChange} required id="email" type="email" value={email} placeholder="Email" className=" px-4 py-3 rounded-md" />
                            {errors.email && <span className="text-red-600">{errors.email}</span>}
                            Role:
                            <select required defaultValue={role} id="role" onChange={onChange}>
                                <option value="Staff">Incharge</option>
                                <option value="HOD">HOD</option>
                            </select>
                        </div>
                        <input autoComplete="off" onChange={onChange} required id="password" type="password" value={password} placeholder="password" className="px-4 py-3 rounded-md" />
                        {errors.password && <span className="text-red-600">{errors.password}</span>}
                        <input autoComplete="off" onChange={onChange} required id="password2" type="password" value={password2} placeholder="Confirm Password" className="px-4 py-3 rounded-md" />
                        {errors.password2 && <span className="text-red-600">{errors.password2}</span>}
                        <button className="px-8 py-2 text-white bg-blue-600 hover:bg-blue-700 transition ease-in-out rounded-md ">Register</button>
                        <div className="items-center justify-center w-full text-sm ">
                            Already have an account?{" "}
                            <span className="text-red-600 cursor-pointer">
                                <Link to="/login">Log In</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Register;
