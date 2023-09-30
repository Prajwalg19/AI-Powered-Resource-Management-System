import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../interceptors/axios";
import Panel from "../Panel";
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";
function EquipmentsReviewList() {
    const [departments, setDepartments] = useState([]);
    const token = useSelector((store) => {
        return store.user.accesstoken;
    });
    useEffect(() => {
        async function fetchData() {
            try {
                let response = await axios.get("api/user/equipment_review/", {
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
    }, [token]);

    async function saveFile() {
        const [...boom] = departments;

        let props = {
            outputType: OutputType.Save,
            returnJsPDFDocObject: true,
            fileName: "Invoice",
            orientationLandscape: false,
            compress: true,
            logo: {
                src: "https://raw.githubusercontent.com/Prajwalg19/photo/main/GAT-logo.png",
                type: "PNG",
                width: 30.33,
                height: 26.66,
                margin: {
                    top: 0,
                    left: 0,
                },
            },
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
                        title: "Equipment",
                        style: {
                            width: 30,
                        },
                    },
                    {
                        title: "Quantity",
                        style: {
                            width: 30,
                        },
                    },
                    {
                        title: "Date",
                        style: {
                            width: 30,
                        },
                    },
                    {
                        title: "Lab Incharge",
                        style: {
                            width: 30,
                        },
                    },
                    {
                        title: "Not Working Quantity",
                        style: {
                            width: 35,
                        },
                    },
                    {
                        title: "Remarks",
                        style: {
                            width: 45,
                        },
                    },
                ],
                table: Array.from([...boom], (item, index) => [item.equipment, item.quantity, item.date, item.lab_incharge, item.not_working_quantity, item.remarks]),
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
                <h1 className="mt-10 mb-5 text-2xl font-semibold text-center">Equipment Review List</h1>
                <table className="bg-white border-collapse border border-slate-50 w-full max-w-6xl mx-auto text-center">
                    <thead>
                        <tr>
                            <th className=" border-collapse border border-slate-300">Equipment</th>
                            <th className=" border-collapse border border-slate-300">Quantity</th>
                            <th className=" border-collapse border border-slate-300">Date</th>
                            <th className=" border-collapse border border-slate-300">Lab Incharge</th>
                            <th className=" border-collapse border border-slate-300">Not Working Quantity</th>
                            <th className=" border-collapse border border-slate-300">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments &&
                            departments.map((data, index) => (
                                <tr key={index}>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.equipment}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.quantity}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.date}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.lab_incharge}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.not_working_quantity}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.remarks}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </Panel>
        </>
    );
}

export default EquipmentsReviewList;
