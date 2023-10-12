import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Panel from "../Panel";
import axios from "../../interceptors/axios";
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";
import { toast } from "react-toastify";
function PurchaseList() {
    const [departments, setDepartments] = useState([]);
    const token = useSelector((store) => {
        return store.user.accesstoken;
    });
    useEffect(() => {
        async function fetchData() {
            try {
                let response = await axios.get("api/user/purchase_order/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDepartments(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);
    async function saveFile() {
        const [...boom] = departments;

        let props = {
            outputType: OutputType.Save,
            returnJsPDFDocObject: true,
            fileName: "Invoice",
            orientationLandscape: false,
            compress: true,
            business: {
                name: "Global Academy of Technology",
                address: "Rajarajeshwarinagar, Ideal Homes Township, Bangalore-560098, Karnataka, India",
                phone: "+919243190105",
                email: "info@gat.ac.in",
                website: "https://gat.ac.in",
            },
            invoice: {
                invGenDate: Date(),
                headerBorder: false,
                tableBodyBorder: false,
                header: [
                    {
                        title: "SI",
                        style: {
                            width: 40,
                        },
                    },
                    {
                        title: "Purchase Order Number",
                        style: {
                            width: 40,
                        },
                    },
                    {
                        title: "Purchase Date",
                        style: {
                            width: 40,
                        },
                    },
                    {
                        title: "Supplier",
                        style: {
                            width: 40,
                        },
                    },
                    {
                        title: "Total Value(in Rupees)",
                        style: {
                            width: 40,
                        },
                    },
                ],
                table: Array.from([...boom], (item, index) => [index + 1, item.purchase_order_number, item.purchase_date, item.supplier, item.total_value]),
            },
            footer: {
                text: "The invoice is created on a computer and is valid without the signature and stamp.",
            },
            pageEnable: true,
            pageLabel: "Page ",
        };
        try {
            const pdfObject = jsPDFInvoiceTemplate(props);
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <>
            <Panel departments={departments} saveFile={saveFile}>
                <h1 className="mt-10 mb-5 text-2xl font-semibold text-center">Purchase List</h1>
                <table className="bg-white border-collapse border border-slate-50 w-full max-w-6xl mx-auto text-center">
                    <thead>
                        <tr>
                            <th className=" border-collapse border border-slate-300">Purchase order number</th>
                            <th className=" border-collapse border border-slate-300">Purchase date</th>
                            <th className=" border-collapse border border-slate-300">Supplier</th>
                            <th className=" border-collapse border border-slate-300">Total value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments &&
                            departments.map((data, index) => (
                                <tr key={index}>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.purchase_order_number}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.purchase_order_date}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.supplier}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">&#8377;{data.total_value}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </Panel>
        </>
    );
}

export default PurchaseList;
