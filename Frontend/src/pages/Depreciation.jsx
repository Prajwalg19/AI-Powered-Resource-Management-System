import { useEffect, useState } from "react";
import axios from "../interceptors/axios";
function Depriciation() {
    const [target, setTarget] = useState([]);
    const [keys, setKeys] = useState([]);
    useEffect(() => {
        async function getData() {
            let invRes = await axios.get("http://localhost:8000/api/user/invoice/");
            invRes = invRes.data;
            let eqRes = await axios.get("http://localhost:8000/api/user/equipment/");
            eqRes = eqRes.data;
            invRes = invRes.map((inv) => {
                return { cost: inv.item_cost, "Equipment Name": inv.item_name };
            });
            eqRes = eqRes.map((equipment) => {
                return { si: equipment.equipment_serial_number, life: equipment.life, residual: equipment.residual_value };
            });

            let target = [];
            target = invRes.map((item, index) => {
                let temp = (item.cost + eqRes[index].residual) / eqRes[index].life;
                temp = Math.ceil(temp);
                return { Name: item["Equipment Name"], Cost: item.cost, "Product Id": eqRes[index].si, "Depreciation Value": temp, Life: eqRes[index].life };
            });

            setTarget(target);
            setKeys(["Equipment Name", "Cost", "Product ID", "Depreciation Value", "Life"]);
        }
        getData();
    }, []);

    console.log(target);
    return (
        <>
            <div className="max-w-4xl w-full relative mb-5 overflow-x-auto shadow-md sm:rounded-lg flex mx-auto mt-10">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <caption className="w-full py-2 text-lg font-bold capitalize bg-gray-100 border-b-2 border-gray-400">Depreciation</caption>
                    <thead className="w-full text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className="w-full">
                            {keys.map((key, index) => (
                                <th className="capitalize text-center" key={index}>
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {target.map((obj, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                {Object.values(obj).map((fields, index) => (
                                    <td key={index} className="text-center">
                                        {fields}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Depriciation;
