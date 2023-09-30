import { useEffect, useState } from "react";
import Panel from "../Panel";
import axios from "../../interceptors/axios";
import { useSelector } from "react-redux";
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";
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
                response.data.map((data) => {
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
        console.log("ok");
        const [...boom] = departments;

        let props = {
            outputType: OutputType.Save,
            returnJsPDFDocObject: true,
            fileName: "Invoice",
            orientationLandscape: false,
            compress: true,

            business: {
                name: "Global Academy of Technology",
            },
            invoice: {
                headerBorder: false,
                tableBodyBorder: false,
                header: [
                    {
                        title: "SI",
                        style: {
                            width: 50,
                        },
                    },
                    {
                        title: "Department Number",
                        style: {
                            width: 50,
                        },
                    },
                    {
                        title: "Department Name",
                        style: {
                            width: 50,
                        },
                    },
                    {
                        title: "HOD Name",
                        style: {
                            width: 50,
                        },
                    },
                ],
                table: Array.from([...boom], (item, index) => [index + 1, item.department_number, item.department_name, item.hod_name]),
            },
            footer: {
                text: "The invoice is created on a computer and is valid without the signature and stamp.",
            },
            pageEnable: true,
            pageLabel: "Page ",
        };
        const pdfObject = jsPDFInvoiceTemplate(props);
    }

    return (
        <>
            <Panel departments={departments} saveFile={saveFile}>
                <h1 className="mt-10 mb-5 text-2xl font-semibold text-center">Equipment List</h1>
                <table className="bg-white border-collapse border border-slate-50 w-full max-w-6xl mx-auto text-center">
                    <thead>
                        <tr>
                            <th className=" border-collapse border border-slate-300">SI</th>
                            <th className=" border-collapse border border-slate-300">Serial number</th>
                            <th className=" border-collapse border border-slate-300">Purchase Date</th>
                            <th className=" border-collapse border border-slate-300">Equipment Value</th>
                            <th className=" border-collapse border border-slate-300">Lab</th>
                            <th className=" border-collapse border border-slate-300">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments &&
                            departments.map((data, index) => (
                                <tr key={index}>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{index}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.equipment_serial_number}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.purchase_date}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.equipment_value}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.lab}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.status}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </Panel>
        </>
    );
}

export default EquipmentList;
