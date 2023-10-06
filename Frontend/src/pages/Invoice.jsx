import { useState } from "react";
import axios from "../interceptors/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Button from "../Components/Button";
function Invoice() {
    const navigate = useNavigate();
    const [state, setState] = useState({
        purchase_order_no: "",
        purchase_date: "",
        cost: "",
        quantity: "",
        item_name: "",
        invoice_number: "",
    });
    const { purchase_date, purchase_order_no, cost, quantity, item_name, invoice_number } = state;
    function onChange(e) {
        setState((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }
    async function onSubmit(e) {
        e.preventDefault();
        try {
            let response = await axios.post(
                "api/user/purchase_order/",
                state,
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

    return (
        <>
            <div>
                <form onSubmit={onSubmit} className="px-4 pb-5">
                    <p className="py-6 text-3xl font-bold text-center lg:py-6 ">Invoice Entry</p>
                    <main className="w-full flex h-full justify-center lg:space-x-[10%] items-center mt-3 flex-wrap mx-auto max-w-6xl md:px-2 px-5">
                        <div className="w-[90%] md:w-[68%]  lg:w-[40%]">
                            <input required type="number" id="purchase_order_no" autoComplete="off" placeholder="Purchase Order number" value={purchase_order_no} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />

                            <input type="date" required id="purchase_date" autoComplete="off " value={purchase_date} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 transition ease-in-out rounded-md" />

                            <input type="text" required id="item_name" autoComplete="off " value={item_name} placeholder="Item name" onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 rounded-md transition ease-in-out" />

                            <input type="text" required id="quantity" autoComplete="off " value={quantity} placeholder="Quantity" onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 rounded-md transition ease-in-out" />
                            <input required type="number" autoComplete="off" id="cost" placeholder="Cost" value={cost} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />

                            <Button />
                        </div>
                    </main>
                </form>
            </div>
        </>
    );
}

export default Invoice;
