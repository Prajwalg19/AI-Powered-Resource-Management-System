import { useEffect, useState } from "react";
import Panel from "../Panel";
import axios from "../../interceptors/axios";
import { useSelector } from "react-redux";
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
    return (
        <>
            <Panel>
                <h1 className="mt-10 mb-5 text-2xl font-semibold text-center">Equipment List</h1>
                <table className="bg-gray-100 w-full max-w-6xl mx-auto text-center">
                    <thead>
                        <tr>
                            <th>SI</th>
                            <th>Serial number</th>
                            <th>Purchase Order</th>
                            <th>Purchase Date</th>
                            <th>Equipment Value</th>
                            <th>Lab</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments &&
                            departments.map((data, index) => (
                                <tr key={index} className="hover:text-white">
                                    <td>{index}</td>
                                    <td>{data.equipment_serial_number}</td>
                                    <td>{data.purchase_order}</td>
                                    <td>{data.purchase_date}</td>
                                    <td>{data.equipment_value}</td>
                                    <td>{data.lab}</td>
                                    <td>{data.status}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </Panel>
        </>
    );
}

export default EquipmentList;
