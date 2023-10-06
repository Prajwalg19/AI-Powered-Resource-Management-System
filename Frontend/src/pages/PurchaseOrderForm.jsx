import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/Button";
import axios from "../interceptors/axios";
function PurchaseOrderForm() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        purchase_order_number: "",
        supplier: "",
        total_value: "",
        purchase_date: "",
        originator: "",
    });

    const { purchase_date, supplier, total_value, purchase_order_number, originator } = data;
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
                "api/user/purchase_order/",
                data,
                {
                    headers: { "Content-type": "application/json" },
                },
                { withCredentials: true }
            );

            toast.success("Purchase Order Details Recorded");
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error("Enter the correct details");
        }
    }
    const [errors, setErrors] = useState({
        purchase_order_number: "",
        supplier: "",
        total_value: "",
        purchase_date: "",
    });
    function onChange(e) {
        const { id, value } = e.target;
        let error = "";

        switch (id) {
            case "purchase_order_number":
                // Add validation logic for purchase order number
                // For example, check if it's not empty
                if (!value.trim()) {
                    error = "Purchase Order number is required";
                } else if (isNaN(value) || parseFloat(value) <= 0) {
                    error = "Purchase Order Value must be a positive number";
                }
                break;

            case "purchase_date":
                // Add validation logic for purchase date
                // For example, check if it's not empty
                if (!value.trim()) {
                    error = "Purchase Date is required";
                }
                break;

            case "originator":
                // Add validation logic for supplier
                // For example, check if it's not empty
                if (!value.trim()) {
                    error = "Originator is required";
                }
                break;

            case "supplier":
                // Add validation logic for supplier
                // For example, check if it's not empty
                if (!value.trim()) {
                    error = "Supplier is required";
                }
                break;

            case "total_value":
                // Add validation logic for purchase order value
                // For example, check if it's not empty and is a positive number
                if (!value.trim()) {
                    error = "Purchase Order Value is required";
                } else if (isNaN(value) || parseFloat(value) <= 0) {
                    error = "Purchase Order Value must be a positive number";
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
                <p className="text-3xl font-bold text-center lg:py-6 py-6 ">Purchase Order Details</p>
                <main className="w-full flex h-full justify-center lg:space-x-[10%] items-center mt-3 flex-wrap mx-auto max-w-6xl md:px-2 px-5">
                    <div className="w-[90%] md:w-[68%]  lg:w-[40%]">
                        <input required type="text" id="purchase_order_number" placeholder="Purchase Order number" value={purchase_order_number} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />
                        {errors.purchase_order_number && <span className="text-red-600">{errors.purchase_order_number}</span>}

                        <div className="flex space-x-2">
                            <input type="date" required id="purchase_date" value={purchase_date} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 transition ease-in-out rounded-md" />
                            {errors.purchase_date && <span className="text-red-600">{errors.purchase_date}</span>}

                            <select required className="border border-gray-300 bg-white text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 " value={originator} onChange={onChange} id="originator">
                                <option value="">Choose</option>
                                <option value="CSE">CSE</option>
                                <option value="ISE">ISE</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                            </select>
                            {errors.originator && <span className="text-red-600">{errors.originator}</span>}
                        </div>
                        <input type="text" required id="supplier" value={supplier} placeholder="Supplier" onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 rounded-md transition ease-in-out" />
                        {errors.supplier && <span className="text-red-600">{errors.supplier}</span>}

                        <input required type="text" id="total_value" placeholder="Purchase Order Value" value={total_value} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />
                        {errors.total_value && <span className="text-red-600">{errors.total_value}</span>}

                        <Button />
                    </div>
                </main>
            </form>
        </>
    );
}
export default PurchaseOrderForm;
