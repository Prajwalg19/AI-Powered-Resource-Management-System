import { useEffect, useState } from "react";
import Panel from "../Panel";
import axios from "../../interceptors/axios";
import { useSelector } from "react-redux";
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";
import { toast } from "react-toastify";
function EquipmentList() {
    const [departments, setDepartments] = useState([]);
    const token = useSelector((store) => {
        return store.user.accesstoken;
    });
    useEffect(() => {
        async function fetchData() {
            try {
                let response = await axios.get("api/user/equipment/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                response?.data.map((data) => {
                    if (data.status === true) {
                        data.status = "true";
                    } else {
                        data.status = "false";
                    }
                });
                console.log(response.data);
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
                        title: "Equipment SI No.",
                        style: {
                            width: 30,
                        },
                    },
                    {
                        title: "Invoice No.",
                        style: {
                            width: 25,
                        },
                    },
                    {
                        title: "Lab No.",
                        style: {
                            width: 20,
                        },
                    },
                    {
                        title: "Status",
                        style: {
                            width: 25,
                        },
                    },

                    {
                        title: "Description",
                        style: {
                            width: 75,
                        },
                    },
                ],
                table: Array.from([...boom], (item, index) => [item.equipment_serial_number, item.invoice_number, item.lab_number, item.status, item.description]),
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
            console.log(error);
        }
    }

    return (
        <>
            <Panel departments={departments} saveFile={saveFile}>
                <h1 className="mt-10 mb-5 text-2xl font-semibold text-center">Equipment List</h1>
                <table className="bg-white border-collapse border border-slate-50 w-full max-w-6xl mx-auto text-center">
                    <thead>
                        <tr>
                            <th className=" border-collapse border border-slate-300">Serial number</th>
                            <th className=" border-collapse border border-slate-300">Lab no.</th>
                            <th className=" border-collapse border border-slate-300">Invoice no.</th>
                            <th className=" border-collapse border border-slate-300">Life</th>
                            <th className=" border-collapse border border-slate-300">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments &&
                            departments.map((data, index) => (
                                <tr key={index}>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.equipment_serial_number}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.lab_number}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.invoice_number}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.life}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.description}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </Panel>
        </>
    );
}

export default EquipmentList;
