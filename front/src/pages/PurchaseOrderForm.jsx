import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/Button";
function PurchaseOrderForm() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        purchase_order_number: "",
        supplier: "",
        purchase_order_value: "",
        purchase_date: "",
    });

    const { purchase_date, supplier, purchase_order_value, purchase_order_number } = data;
    function onChange(e) {
        setData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }
    async function onSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/api/PurchaseOrders/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
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
        purchase_order_value: "",
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
            }
            else if (isNaN(value) || parseFloat(value) <= 0) {
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
      
          case "supplier":
            // Add validation logic for supplier
            // For example, check if it's not empty
            if (!value.trim()) {
              error = "Supplier is required";
            }
            break;
      
          case "purchase_order_value":
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
                <p className="text-3xl font-bold text-center lg:py-20 py-14 ">Purchase Order Details</p>
                <main className="w-full flex h-full justify-center lg:space-x-[10%] items-center mt-3 flex-wrap mx-auto max-w-6xl md:px-2 px-5">
                    <img src={require("../img/animatedImage.jpg")} alt="Lab" className=" rounded-xl w-[90%] md:w-[68%] lg:w-[50%] mb-6 lg:mb-0" />
                    <div className="w-[90%] md:w-[68%]  lg:w-[40%]">
                        <input required type="text" id="purchase_order_number" placeholder="Purchase Order number" value={purchase_order_number} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />{errors.purchase_order_number && (<span className="text-red-600">{errors.purchase_order_number}</span>)}

                        <input type="date" required id="purchase_date" value={purchase_date} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 transition ease-in-out rounded-md" />{errors.purchase_date && (<span className="text-red-600">{errors.purchase_date}</span>)}

                        <input type="text" required id="supplier" value={supplier} placeholder="Supplier" onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 rounded-md transition ease-in-out" />{errors.supplier && (<span className="text-red-600">{errors.supplier}</span>)}

                        <input required type="text" id="purchase_order_value" placeholder="Purchase Order Value" value={purchase_order_value} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />{errors.purchase_order_value && (<span className="text-red-600">{errors.purchase_order_value}</span>)}

                        <Button />
                    </div>
                </main>
            </form>
        </>
    );
}
export default PurchaseOrderForm;
