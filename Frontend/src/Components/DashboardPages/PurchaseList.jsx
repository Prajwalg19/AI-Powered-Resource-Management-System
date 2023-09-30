import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Panel from "../Panel";
import axios from "../../interceptors/axios";
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
    return (
        <>
            <Panel>
                <h1 className="mt-10 mb-5 text-2xl font-semibold text-center">Purchase List</h1>
                <table className="w-full max-w-6xl mx-auto text-center bg-gray-100">
                    <thead>
                        <tr>
                            <th>Purchase order number</th>
                            <th>Purchase date</th>
                            <th>Supplier</th>
                            <th>Total value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments &&
                            departments.map((data, index) => (
                                <tr key={index} className="hover:text-white">
                                    <td>{data.purchase_order_number}</td>
                                    <td>{data.purchase_date}</td>
                                    <td>{data.supplier}</td>
                                    <td>&#8377;{data.total_value}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </Panel>
        </>
    );
}

export default PurchaseList;
