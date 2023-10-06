import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/Button";
import axios from "../interceptors/axios";
function DepartmentForm() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        department_number: "",
        department_name: "",
        hod_name: "",
    });

    const { department_name, department_number, hod_name } = data;
    function onChange(e) {
        setData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }
    async function onSubmit(e) {
        e.preventDefault();
        try {
            let response = await axios.post(
                "http://localhost:8000/api/user/department/",
                data,
                {
                    headers: { "Content-type": "application/json" },
                },
                { withCredentials: true }
            );
            if (response.status == 201) {
                toast.success("Department Details Recorded");
                navigate("/");
            } else {
                toast.error("Department Details were not recorded");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
    const [errors, setErrors] = useState({
        department_number: "",
        department_name: "",
        hod_name: "",
    });
    function onChange(e) {
        const { id, value } = e.target;
        let error = "";

        switch (id) {
            case "department_number":
                // Add validation logic for department number
                // For example, check if it's not empty and is a positive integer
                if (!value.trim()) {
                    error = "Department number is required";
                } else if (!/^\d+$/.test(value) || parseInt(value) <= 0) {
                    error = "Department number must be a positive integer";
                }
                break;

            case "department_name":
                // Add validation logic for department name
                // For example, check if a valid option is selected (not an empty string)
                if (!value) {
                    error = "Choose a department";
                }
                break;

            case "hod_name":
                // Add validation logic for HOD name
                // For example, check if it's not empty
                if (!value.trim()) {
                    error = "HOD Name is required";
                }
                break;

            default:
                break;
        }

        // Update the state with the error for the current field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [id]: error,
        }));

        // Update the data state as before
        setData((prev) => ({
            ...prev,
            [id]: value,
        }));
    }

    return (
        <>
            <form onSubmit={onSubmit} className="px-4 pb-5">
                <p className="text-3xl font-bold text-center mt-10 py-6 ">Department Details</p>
                <main className="w-full flex h-full justify-center lg:space-x-[10%] items-center mt-3 flex-wrap mx-auto max-w-6xl md:px-2 px-5">
                    <div className="w-[90%] md:w-[68%]  lg:w-[40%]">
                        <input autoComplete="off" required type="number" id="department_number" placeholder="Department number" value={department_number} min={0} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />
                        {errors.department_number && <span className="text-red-600">{errors.department_number}</span>}

                        <div className="flex items-center justify-between w-full">
                            <label htmlFor="department_name" className="block mb-2 text-lg font-normal whitespace-nowrap">
                                Choose Department :{" "}
                            </label>

                            <select required className="border border-gray-300 bg-white text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 " value={department_name} onChange={onChange} id="department_name">
                                <option value="">Choose</option>
                                <option value="CSE">CSE</option>
                                <option value="ISE">ISE</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                            </select>
                            {errors.department_name && <span className="text-red-600">{errors.department_name}</span>}
                        </div>
                        <div>
                            <input type="text" autoComplete="off" required placeholder="HOD Name" id="hod_name" value={hod_name} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg transition ease-in-out rounded-md border-gray-300" />
                            {errors.hod_name && <span className="text-red-600">{errors.hod_name}</span>}
                        </div>
                        <button
                            type="submit"
                            className="mt-2 w-full px-8 py-2 text-white bg-blue-600 hover:bg-blue-700 transition ease-in-out rounded-md"
                            disabled={
                                !!Object.values(errors).find((error) => error) // Disable if any error is not an empty string
                            }
                        >
                            Submit
                        </button>
                    </div>
                </main>
            </form>
        </>
    );
}
export default DepartmentForm;
