import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../interceptors/axios";
import Panel from "../Panel";
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";
import { toast } from "react-toastify";
function Lablist() {
    const [departments, setDepartments] = useState([]);
    const token = useSelector((store) => {
        return store.user.accesstoken;
    });
    useEffect(() => {
        async function fetchData() {
            try {
                let response = await axios.get("api/user/lab/", {
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
                        title: "SI",
                        style: {
                            width: 50,
                        },
                    },
                    {
                        title: "Lab Number",
                        style: {
                            width: 50,
                        },
                    },
                    {
                        title: "Department",
                        style: {
                            width: 50,
                        },
                    },
                    {
                        title: "Location",
                        style: {
                            width: 50,
                        },
                    },
                ],
                table: Array.from([...boom], (item, index) => [index + 1, item.lab_number, item.department, item.location]),
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
                <h1 className="mt-10 mb-5 text-2xl font-semibold text-center">Labs list</h1>
                <table className="w-full max-w-6xl mx-auto text-center bg-white border border-collapse border-slate-50">
                    <thead>
                        <tr>
                            <th className="border border-collapse  border-slate-300">Department number</th>
                            <th className="border border-collapse  border-slate-300">Lab number</th>
                            <th className="border border-collapse  border-slate-300">Lab name</th>
                            <th className="border border-collapse  border-slate-300">Lab incharge</th>
                            <th className="border border-collapse  border-slate-300">Location</th>
                            {
                                // <th>Lab incharge</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {departments &&
                            departments.map((data, index) => (
                                <tr key={index}>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.department_name}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.lab_number}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.lab_name}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.lab_incharge}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.location}</td>
                                    {
                                        // <td>{data.lab_incharge}</td>
                                    }
                                </tr>
                            ))}
                    </tbody>
                </table>
            </Panel>
        </>
    );
}

export default Lablist;
