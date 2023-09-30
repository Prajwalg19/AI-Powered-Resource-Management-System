import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/Button";
import axios from "../interceptors/axios";
function LabInformation() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        lab_id: "",
        lab_number: "",
        department: "",
        location: "",
        lab_incharge: "",
    });

    const { lab_number, lab_incharge, department, location } = data;
    function onChange(e) {
        setData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }
    async function onSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios(
                "/api/user/lab/",
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                { withCredentials: true }
            );

            toast.success("Lab Information Recorded");
            navigate("/");
        } catch (error) {
            toast.dismiss();
            toast.error("Enter the Correct Details");
        }
    }
    const [errors, setErrors] = useState({
        lab_number: "",
        department: "",
        location: "",
        lab_incharge: "",
    });

    function onChange(e) {
        const { id, value } = e.target;
        let error = "";

        switch (id) {
            case "lab_number":
                // Add validation logic for lab number
                // For example, check if it's not empty
                if (!value.trim()) {
                    error = "Lab Number is required";
                } else if (isNaN(value)) {
                    error = "Value must be a valid number";
                }
                break;

            case "department":
                // Add validation logic for department
                // For example, check if it's not empty
                if (!value.trim()) {
                    error = "Department is required";
                } else if (isNaN(value)) {
                    error = "Value must be a valid number";
                }
                break;

            case "location":
                // Add validation logic for location
                // For example, check if it's not empty
                if (!value.trim()) {
                    error = "Location is required";
                }
                break;

            case "lab_incharge":
                // Add validation logic for lab incharge
                // For example, check if it's not empty
                if (!value.trim()) {
                    error = "Lab Incharge is required";
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
                <p className="text-3xl font-bold text-center lg:py-20 py-14">Lab Information</p>
                <main className="w-full flex h-full justify-center lg:space-x-[10%] items-center mt-3 flex-wrap mx-auto max-w-6xl md:px-2 px-5">
                    <img src={require("../img/animatedImage.jpg")} alt="Lab" className=" rounded-xl w-[90%] md:w-[68%] lg:w-[50%] mb-6 lg:mb-0" />
                    <div className="w-[90%] md:w-[68%]  lg:w-[40%]">
                        <input required type="text" id="lab_number" placeholder="Lab Room Number" value={lab_number} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />
                        {errors.lab_number && <span className="text-red-600">{errors.lab_number}</span>}

                        <input type="text" required id="department" value={department} placeholder="Department Number" onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 transition ease-in-out rounded-md" />
                        {errors.department && <span className="text-red-600">{errors.department}</span>}

                        <input type="text" required id="location" value={location} placeholder="Location" onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 rounded-md transition ease-in-out" />
                        {errors.location && <span className="text-red-600">{errors.location}</span>}

                        <input required type="text" id="lab_incharge" placeholder="Lab Incharge" value={lab_incharge} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />
                        {errors.lab_incharge && <span className="text-red-600">{errors.lab_incharge}</span>}

                        <button
                            type="submit"
                            className="w-full px-8 py-2 mt-2 text-white bg-blue-600 hover:bg-blue-700 transition ease-in-out rounded-md"
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
export default LabInformation;
