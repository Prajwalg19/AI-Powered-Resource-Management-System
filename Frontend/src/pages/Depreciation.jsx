import { useEffect, useState } from "react";
import axios from "../interceptors/axios";
import { toast } from "react-toastify";
function Depriciation() {
    const [target, setTarget] = useState([]);
    const [keys, setKeys] = useState([]);
    useEffect(() => {
        async function getData() {
            try {
                let invRes = await axios.get("http://localhost:8000/api/user/invoice/");
                invRes = invRes?.data;
                let eqRes = await axios.get("http://localhost:8000/api/user/equipment/");
                eqRes = eqRes?.data;

                let v = [];
                eqRes.forEach((obj) => {
                    invRes.forEach((element) => {
                        if (element.invoice_number === obj.invoice_number) {
                            let x = [obj.equipment_serial_number, element.item_name, element.item_cost, obj.life, obj.residual_value];
                            v.push(x);
                        }
                    });
                });
                v.forEach((item) => {
                    let depre = (parseFloat(item[2]) + parseFloat(item[item.length - 1])) / parseFloat(item[3]);
                    item[4] = depre.toFixed(2);
                });
                setTarget(v);
                setKeys(["Equipment serial no.", "Equipment Name", "Cost", "Life(in years)", "Depreciation Value"]);
            } catch (error) {
                toast.dismiss();
                toast.error("Something went wrong");
            }
        }
        getData();
    }, []);

    return (
        <>
            <div className="relative flex w-full max-w-4xl mx-auto mt-10 mb-5 overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <caption className="w-full py-2 text-lg font-bold capitalize bg-gray-100 border-b-2 border-gray-400">Depreciation</caption>
                    <thead className="w-full text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className="w-full">
                            {keys.map((key) => (
                                <th className="capitalize text-center">{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {target.map((obj, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                {Object.values(obj).map((fields, index) => (
                                    <td className="text-center">{index === 4 ? <span key={index}>&#8377;{fields}</span> : fields}</td>
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
