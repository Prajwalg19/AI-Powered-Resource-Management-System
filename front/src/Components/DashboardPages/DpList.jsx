import { useEffect, useState } from "react";
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";
import { useSelector } from "react-redux";
import axios from "../../interceptors/axios";
import Panel from "../Panel";
import { Modal } from "flowbite";
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
            <Panel>
                <h1 className="mt-10 mb-5 text-2xl font-semibold text-center ">Departments</h1>
                {departments != null && (
                    <table className="w-full max-w-6xl mx-auto text-center bg-gray-100">
                        <thead>
                            <tr>
                                <th>Department Number</th>
                                <th>Department Name</th>
                                <th>Head of Department</th>
                            </tr>
                        </thead>

                        <tbody>
                            {departments?.map((data, index) => (
                                <tr key={index} className="hover:text-white">
                                    <td>{data.department_number}</td>
                                    <td>{data.department_name}</td>
                                    <td>{data.hod_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {departments && departments.length != 0 ? (
                    <div className="flex justify-center">
                        <button className="px-2 py-1 my-3 text-white bg-blue-500 cursor-pointer hover:bg-blue-600 hover:shadow-md rounded-md " onClick={() => saveFile()}>
                            Print
                        </button>
                    </div>
                ) : (
                    ""
                )}
            </Panel>
        </>
    );
}

export default DepartmentList;
