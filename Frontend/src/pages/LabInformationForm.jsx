import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/Button";
import axios from "../interceptors/axios";
function LabInformation() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        lab_number: "",
        location: "",
        lab_incharge: "",
        lab_name: "",
        department_number: "",
        dpDummy: [],
    });

    const { department_number, dpDummy, lab_number, lab_incharge, lab_name, location } = data;
    function onChange(e) {
        console.log(e.target.value);
        setData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }

    useEffect(() => {
        async function getDepNo() {
            let depNo = await axios.get("api/user/department/");
            setData((prev) => ({
                ...prev,
                dpDummy: depNo.data,
            }));
        }
        getDepNo();
    }, []);
    async function onSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post(
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
        lab_name: "",
        lab_number: "",
        department_number: "",
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

            case "department_number":
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

            case "lab_name":
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
                <p className="py-6 my-10 text-3xl font-bold text-center">Lab Information</p>
                <main className="w-full flex h-full justify-center lg:space-x-[10%] items-center mt-3 flex-wrap mx-auto max-w-6xl md:px-2 px-5">
                    <div className="w-[90%] md:w-[68%]  lg:w-[40%]">
                        <div className="flex space-x-4 mb-10  w-full ">
                            <input required type="text" id="lab_number" placeholder="Lab Number" value={lab_number} onChange={onChange} className="w-full py-3 pl-2 text-lg border border-gray-300 rounded-md text-center" />

                            <input type="text" required id="lab_name" value={lab_name} placeholder="Lab Name" onChange={onChange} className="w-full py-3 pl-2  text-lg border-gray-300 transition ease-in-out rounded-md text-center" />
                        </div>

                        <div className="flex space-x-4 mb-10  w-full ">
                            <select className="w-1/2 rounded-md border-gray-300 text-center" required id="department_number" onChange={onChange}>
                                <option value="">Department</option>
                                {data?.dpDummy?.map((item, index) => (
                                    <option key={index} value={`${item.department_number}`}>
                                        {item.department_name}
                                    </option>
                                ))}
                            </select>

                            <input type="text" required id="location" value={location} placeholder="Location" onChange={onChange} className="w-1/2 py-3 pl-2  text-lg border-gray-300 rounded-md transition  ease-in-out text-center" />
                        </div>
                        <input required type="text" id="lab_incharge" placeholder="Lab Incharge" value={lab_incharge} onChange={onChange} className="w-full py-3 pl-2 mb-6 text-lg border border-gray-300 rounded-md text-center" />

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
