import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../interceptors/axios";
import Panel from "../Panel";
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";
function IssuesList() {
    const [departments, setDepartments] = useState([]);
    const token = useSelector((store) => {
        return store.user.accesstoken;
    });
    useEffect(() => {
        async function fetchData() {
            try {
                let response = await axios.get("api/user/equipment_issue/", {
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
                        title: "SI",
                        style: {
                            width: 40,
                        },
                    },
                    {
                        title: "Lab Incharge",
                        style: {
                            width: 40,
                        },
                    },
                    {
                        title: "Experminet Name",
                        style: {
                            width: 40,
                        },
                    },
                    {
                        title: "Number of Equipments",
                        style: {
                            width: 40,
                        },
                    },
                    {
                        title: "Details",
                        style: {
                            width: 40,
                        },
                    },
                ],
                table: Array.from([...boom], (item, index) => [index + 1, item.lab_incharge, item.experiment, item.number_of_equipments, item.details]),
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
                <h1 className="mt-10 mb-5 text-2xl font-semibold text-center">Equipments Issues List</h1>
                <table className="bg-white border-collapse border border-slate-50 w-full max-w-6xl mx-auto text-center">
                    <thead>
                        <tr>
                            <th className=" border-collapse border border-slate-300">Lab Incharge</th>
                            <th className=" border-collapse border border-slate-300">Experminet Name</th>
                            <th className=" border-collapse border border-slate-300">Number of Equipments</th>
                            <th className=" border-collapse border border-slate-300">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments &&
                            departments.map((data, index) => (
                                <tr key={index}>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.lab_incharge}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.experiment}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.number_of_equipments}</td>
                                    <td className="bg-gray-100 border-collapse border border-slate-100">{data.details}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </Panel>
        </>
    );
}

export default IssuesList;
