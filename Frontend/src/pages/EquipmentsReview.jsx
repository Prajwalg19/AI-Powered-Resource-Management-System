import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/Button";
import axios from "../interceptors/axios";
function EquipmentsReview() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        equipment: "",
        quantity: "",
        date: "",
        lab_incharge: "",
        not_working_quantity: "",
        remarks: "",
    });

    const { equipment, quantity, date, lab_incharge, not_working_quantity, remarks } = data;
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
                "api/user/equipment_review/",
                data,
                {
                    headers: { "Content-type": "application/json" },
                },
                { withCredentials: true }
            );

            toast.success("Equipment Review Recorded");
            navigate("/");
        } catch (error) {
            toast.dismiss();
            toast.error("Enter the Correct Details");
        }
    }
    const [errors, setErrors] = useState({
        equipment: "",
        quantity: "",
        date: "",
        lab_incharge: "",
        not_working_quantity: "",
        remarks: "",
    });

    function onChange(e) {
        const { id, value } = e.target;
        let error = "";

        switch (id) {
            case "equipment":
                if (!value.trim()) {
                    error = "Equipment is required";
                }
                break;

            case "quantity":
            case "not_working_quantity":
                if (!value.trim()) {
                    error = "Quantity is required";
                } else if (isNaN(value) || parseInt(value) < 0) {
                    error = "Quantity must be a non-negative number";
                }
                break;

            case "date":
                if (!value.trim()) {
                    error = "Date is required";
                }
                break;

            case "lab_incharge":
                if (!value.trim()) {
                    error = "Incharge is required";
                }
                break;

            case "remarks":
                if (!value.trim()) {
                    error = "Remarks are required";
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
            <form onSubmit={onSubmit} method="POST" className="px-4 pb-5 " encType="multipart/form-data">
                <p className="text-3xl font-bold text-center lg:py-20 py-14 ">Equipment Review</p>
                <main className="flex flex-col flex-wrap items-center justify-center w-full h-full max-w-6xl px-5 mx-auto mt-3 md:px-2">
                    <img src={require("../img/animatedImage.jpg")} alt="Lab" className=" rounded-xl w-[90%] md:w-[68%] lg:w-[50%] mb-10 " />
                    <div className="w-[90%] md:w-[68%]  lg:w-[50%]">
                        <input type="text" required id="equipment" placeholder="Equipment" value={equipment} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />
                        {errors.equipment && <span className="text-red-600">{errors.equipment}</span>}

                        <input type="number" min={0} required id="quantity" placeholder="Number of Quantity" value={quantity} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />
                        {errors.quantity && <span className="text-red-600">{errors.quantity}</span>}

                        <input type="date" required id="date" value={date} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />

                        <input type="text" required placeholder="Incharge" id="lab_incharge" value={lab_incharge} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 rounded-md transition ease-in-out" />
                        {errors.lab_incharge && <span className="text-red-600">{errors.lab_incharge}</span>}

                        <input type="number" min={0} required id="not_working_quantity" placeholder="Number of not working Quantity" value={not_working_quantity} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />
                        {errors.not_working_quantity && <span className="text-red-600">{errors.not_working_quantity}</span>}

                        <textarea required placeholder="Enter Remark" id="remarks" value={remarks} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 rounded-md transition ease-in-out">
                            {" "}
                        </textarea>
                        {errors.remarks && <span className="text-red-600">{errors.remarks}</span>}
                        <button
                            type="submit"
                            className="w-full mt-2 px-8 py-2 text-white bg-blue-600 hover:bg-blue-700 transition ease-in-out rounded-md"
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
export default EquipmentsReview;
