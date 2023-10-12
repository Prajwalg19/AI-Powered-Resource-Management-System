import { useEffect, useState } from "react";
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";
import { useSelector } from "react-redux";
import axios from "../../interceptors/axios";
import Panel from "../Panel";
import Button from "../Button";
import { toast } from "react-toastify";
function DepartmentList() {
    const [departments, setDepartments] = useState([]);
    const store = useSelector((store) => {
        return store;
    });
    useEffect(() => {
        async function fetchData() {
            try {
                let response = await axios.get("api/user/department/", {
                    headers: {
                        Authorization: `Bearer ${store.user.accesstoken}`,
                    },
                });
                setDepartments(response.data);
            } catch (error) {}
        }
        fetchData();
    }, [store.user]);
    async function saveFile() {
        console.log("ok");
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
        try {
            const pdfObject = jsPDFInvoiceTemplate(props);
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
    return (
        <div className="flex flex-col ">
            <div>
                <Panel departments={departments} saveFile={saveFile}>
                    <h1 className="mt-10 mb-5 text-2xl font-semibold text-center ">Departments</h1>
                    {departments != null && (
                        <table className="bg-white border-collapse border border-slate-50 w-full max-w-6xl mx-auto text-center">
                            <thead>
                                <tr>
                                    <th className=" border-collapse border border-slate-300">Department Number</th>
                                    <th className=" border-collapse border border-slate-300">Lab number</th>
                                    <th className=" border-collapse border border-slate-300">Lab name</th>
                                    <th className=" border-collapse border border-slate-300">Lab incharge</th>
                                    <th className=" border-collapse border border-slate-300">Location</th>
                                </tr>
                            </thead>

                            <tbody>
                                {departments?.map((data, index) => (
                                    <tr key={index}>
                                        <td className="bg-gray-100 border-collapse border border-slate-100">{data.department_number}</td>
                                        <td className="bg-gray-100 border-collapse border border-slate-100">{data.lab_number}</td>
                                        <td className="bg-gray-100 border-collapse border border-slate-100">{data.lab_name}</td>
                                        <td className="bg-gray-100 border-collapse border border-slate-100">{data.lab_incharge}</td>
                                        <td className="bg-gray-100 border-collapse border border-slate-100">{data.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Panel>
            </div>
        </div>
    );
}

export default DepartmentList;
