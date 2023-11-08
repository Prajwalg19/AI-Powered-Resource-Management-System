import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/Button";
import axios from "../interceptors/axios";
import Excel from "./Excel";
function EquipmentsDetails() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        equipment_serial_number: "",
        description: "",
        invoice_number: "",
        lab_number: "",
        life: "",
        dummyInvoice: [],
        dummyDp: [],
    });

    const { dummyDp, invoice_number, equipment_serial_number, description, life, lab_number, dummyInvoice } = data;
    function onChange(e) {
        // if (e.target.files) {
        //     setData((prev) => ({
        //         ...prev,
        //         [e.target.id]: e.target.files,
        //     }));
        // }
        setData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }

    useEffect(() => {
        async function getInvoiceNo() {
            let response = await axios.get("api/user/invoice/");
            setData((prev) => ({
                ...prev,
                dummyInvoice: response?.data,
            }));
        }
        async function getDepNo() {
            let response = await axios.get("api/user/lab/");
            setData((prev) => ({
                ...prev,
                dummyDp: response?.data,
            }));
        }
        getInvoiceNo();
        getDepNo();
    }, []);
    async function onSubmit(e) {
        e.preventDefault();
        delete data.dummyInvoice;
        delete data.dummyDp;
        try {
            let response = await axios.post(
                "api/user/equipment/",
                data,
                {
                    headers: { "Content-type": "application/json" },
                },
                { withCredentials: true }
            );
            if (response.status == 201) {
                toast.success("Equipment Details Recorded");
                navigate("/");
            } else {
                toast.error("Enter the Correct Details");

                return;
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Something went wrong");
        }
    }

    return (
        <>
            <form onSubmit={onSubmit} className="px-4 pb-5 " encType="multipart/form-data">
                <p className=" text-3xl font-bold text-center py-6 my-10 ">Equipment Details</p>
                <main className="flex flex-col flex-wrap items-center justify-center w-full h-full max-w-6xl px-5 mx-auto mt-3 md:px-2">
                    <div className="w-[90%] md:w-[68%]  lg:w-[50%]">
                        <input autoComplete="off" type="text" required id="equipment_serial_number" placeholder="Equipment Serial Number" value={equipment_serial_number} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border border-gray-300 rounded-md " />

                        <div className="flex items-center w-full space-x-2">
                            <select className="w-1/2 rounded-md border-gray-300" required id="lab_number" onChange={onChange}>
                                <option value="">Lab</option>
                                {dummyDp?.map((item, index) => (
                                    <option key={index} value={`${item.lab_number}`}>
                                        {item.lab_name} - {item.lab_incharge}
                                    </option>
                                ))}
                            </select>
                            <input type="number" placeholder="Life" id="life" onChange={onChange} value={life} min="0" className="w-1/2 py-2 pl-2 border border-gray-300 rounded-md " />

                            <select value={invoice_number} onChange={onChange} id="invoice_number" className="border-gray-300 rounded-md">
                                <option value="">Invoice Number</option>
                                {dummyInvoice?.map((item, index) => (
                                    <option key={index} value={item.invoice_number}>
                                        {item.invoice_number}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <textarea autoComplete="off" rows="5" required placeholder="Description" id="description" value={description} onChange={onChange} className="w-full py-3 pl-2 my-6 text-lg border-gray-300 rounded-md transition ease-in-out"></textarea>
                        <Excel fileName="upload-excel" />
                        <Button />
                    </div>
                </main>
            </form>
        </>
    );
}
export default EquipmentsDetails;
