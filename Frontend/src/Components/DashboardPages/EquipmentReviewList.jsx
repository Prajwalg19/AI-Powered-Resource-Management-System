import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../interceptors/axios";
import Panel from "../Panel";
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
    return (
        <>
            <Panel>
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
