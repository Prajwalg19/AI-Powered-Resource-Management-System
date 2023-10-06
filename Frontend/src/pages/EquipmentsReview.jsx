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
                <p className="my-10 text-3xl font-bold text-center  pt-4 pb-2">Equipment Review</p>
                <main className=" flex flex-col flex-wrap items-center justify-center w-full h-full max-w-6xl px-5 mx-auto mt-3 md:px-2">
                    <div className="w-[90%] md:w-[68%]  lg:w-[50%]">
                        <div className="flex items-center space-x-3 mb-10">
                            <input autoComplete="off" type="text" required id="equipment" placeholder="Equipment" value={equipment} onChange={onChange} className="w-1/2 py-3 pl-2  text-lg border border-gray-300 rounded-md text-center" />

                            <input autoComplete="off" type="number" min={0} required id="quantity" placeholder="Quantity" value={quantity} onChange={onChange} className="w-1/2 py-3 pl-2  text-lg border border-gray-300 rounded-md  text-center" />
                        </div>

                        <div className="flex items-center space-x-3 mb-10">
                            {" "}
                            <input autoComplete="off" type="date" required id="date" value={date} onChange={onChange} className="w-full py-3 pl-2  text-lg border border-gray-300 rounded-md " />
                            <input autoComplete="off" type="text" required placeholder="Incharge" id="lab_incharge" value={lab_incharge} onChange={onChange} className="w-full py-3 pl-2  text-lg border-gray-300 rounded-md transition ease-in-out text-center" />
                            <input autoComplete="off" type="number" min={0} required id="not_working_quantity" placeholder="Defective" value={not_working_quantity} onChange={onChange} className="w-full py-3 pl-2  text-lg border border-gray-300 rounded-md text-center" />
                        </div>
                        <textarea autoComplete="off" required placeholder="Enter Remark" id="remarks" value={remarks} onChange={onChange} className="w-full py-3 pl-2 mb-6 text-lg border-gray-300 rounded-md transition ease-in-out">
                            {" "}
                        </textarea>

                        <Button />
                    </div>
                </main>
            </form>
        </>
    );
}
export default EquipmentsReview;
