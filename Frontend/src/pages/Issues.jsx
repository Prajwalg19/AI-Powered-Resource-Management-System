import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/Button";
import axios from "../interceptors/axios";
function Issue() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        experiment_name: "",
        lab_incharge: "",
        number_of_equipments: "",
        details: "",
        dummyIncharge: [],
        dummyExp: [],
    });

    const { lab_incharge, number_of_equipments, details, dummyIncharge, dummyExp } = data;
    function onChange(e) {
        e.preventDefault();
        setData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }
    useEffect(() => {
        async function getIncharge() {
            let response = await axios.get("api/user/lab/");
            let response2 = await axios.get("api/user/Experiment/");
            setData((prev) => ({
                ...prev,
                dummyIncharge: response?.data,
            }));
            setData((prev) => ({
                ...prev,
                dummyExp: response2?.data,
            }));
        }
        getIncharge();
    }, []);

    async function onSubmit(e) {
        e.preventDefault();
        delete data.dummyIncharge;
        try {
            let response = await axios.post(
                "api/user/equipment_issue/",
                data,
                {
                    headers: { "Content-type": "application/json" },
                },
                { withCredentials: true }
            );

            if (response.status == 201) {
                toast.success("Issues Recorded");
                navigate("/");
            } else {
                toast.error("Enter the Correct Details");
                return;
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="my-3 px-4 ">
            <h1 className="font-bold text-center  text-3xl py-6 my-10">Issues Forms</h1>
            <form className="max-w-lg mx-auto flex flex-col  w-full justify-center items-center " onSubmit={onSubmit}>
                <select required onChange={onChange} id="experiment_name" className=" border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2">
                    <option value="">Experiment Name</option>
                    {dummyExp.map((item) => (
                        <option value={item.experiment_name}>{item.experiment_name}</option>
                    ))}
                </select>
                <select required className="w-full border-gray-300 rounded-md py-3 mb-4 px-2" onChange={onChange} id="lab_incharge" value={lab_incharge}>
                    <option value="">Lab Incharge</option>
                    {dummyIncharge?.map((item, index) => (
                        <option key={index} value={item.lab_number}>
                            {item.lab_incharge}
                        </option>
                    ))}
                </select>
                <input autoComplete="off" type="text" id="number_of_equipments" placeholder="Number of Equipments" onChange={onChange} value={number_of_equipments} className="border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" />
                <textarea autoComplete="off" minLength="10" rows="2" onChange={onChange} value={details} id="details" className="border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" placeholder="Details"></textarea>
                <Button />
            </form>
        </div>
    );
}

export default Issue;
