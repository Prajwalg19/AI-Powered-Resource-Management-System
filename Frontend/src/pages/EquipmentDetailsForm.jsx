import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/Button";
import axios from "../interceptors/axios";
function EquipmentsDetails() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        equipment_serial_number: "",
        description: "",
        invoice: "",
        lab: "",
        life: "",
    });

    const { invoice, equipment_serial_number, description, life, lab } = data;
    function onChange(e) {
        let boolean = null;
        if (e.target.value == "true") {
            boolean = true;
        }
        if (e.target.value == "false") {
            boolean = false;
        }
        if (e.target.files) {
            setData((prev) => ({
                ...prev,
                [e.target.id]: e.target.files,
            }));
        }
        setData((prev) => ({
            ...prev,
            [e.target.id]: boolean ?? e.target.value,
        }));
    }
    async function onSubmit(e) {
        console.log(data);
        e.preventDefault();
        try {
            let response = await axios.post(
                "api/user/equipment/",
                data,
                {
                    headers: { "Content-type": "application/json" },
                },
                { withCredentials: true }
            );
            toast.success("Equipment Details Recorded");
            navigate("/");
        } catch (error) {
            toast.dismiss();
            toast.error("Enter the Correct Details");
        }
    }
    const [errors, setErrors] = useState({
        equipment_serial_number: "",
        description: "",
        invoice: "",
        lab: "",
        life: "",
    });

    function onChange(e) {
        const { id, value } = e.target;
        let error = "";

        switch (id) {
            case "equipment_serial_number":
                if (!value.trim()) {
                    error = "Equipment Serial Number is required";
                } else if (isNaN(value)) {
                    error = "Value must be a valid number";
                }
                break;

            case "description":
                if (!value.trim()) {
                    error = "Description is required";
                }
                break;

            case "lab":
                if (!value.trim()) {
                    error = "Lab is required";
                }
                break;

            case "life":
                if (!value) {
                    error = "Life";
                }
                break;

            case "invoice":
                if (!value) {
                    error = "Life";
                }
                break;

            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [id]: error,
        }));

        setData((prev) => ({
            ...prev,
            [id]: value,
        }));
    }

    return (
        <>
            <form onSubmit={onSubmit} className="px-4 pb-5 " encType="multipart/form-data">
                <p className="pt-4 pb-2 text-3xl font-bold text-center ">Equipment Details</p>
                <main className="flex flex-col flex-wrap items-center justify-center w-full h-full max-w-6xl px-5 mx-auto mt-3 md:px-2">
                    <div className="w-[90%] md:w-[68%]  lg:w-[50%]">
                        <input autoComplete="off" type="text" required id="equipment_serial_number" placeholder="Equipment Serial Number" value={equipment_serial_number} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />
                        {errors.equipment_serial_number && <span className="text-red-600">{errors.equipment_serial_number}</span>}

                        <textarea autoComplete="off" required placeholder="Description" id="description" value={description} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 rounded-md transition ease-in-out"></textarea>
                        {errors.description && <span className="text-red-600">{errors.description}</span>}

                        <input autoComplete="off" type="text" required placeholder="Lab" id="lab" value={lab} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 rounded-md transition ease-in-out" />
                        {errors.lab && <span className="text-red-600">{errors.lab}</span>}
                        <input autoComplete="off" type="text" required placeholder="Invoice no" id="invoice" value={invoice} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 rounded-md transition ease-in-out" />
                        {errors.invoice && <span className="text-red-600">{errors.invoice}</span>}
                        <div className="flex items-center justify-between w-full">
                            <label htmlFor="life" className="block mb-2 text-lg font-normal whitespace-nowrap">
                                life
                            </label>

                            <select className="border border-gray-300 bg-white text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 " value={life} onChange={onChange} required id="life">
                                <option value="">Life</option>
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full px-8 py-2 mt-2 text-white bg-blue-600 hover:bg-blue-700 transition ease-in-out rounded-md" disabled={!!Object.values(errors).find((error) => error)}>
                            Submit
                        </button>
                    </div>
                </main>
            </form>
        </>
    );
}
export default EquipmentsDetails;
