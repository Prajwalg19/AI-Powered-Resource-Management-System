import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/Button";
import axios from "../interceptors/axios";
function Issue() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        experiment: "",
        lab_incharge: "",
        number_of_equipments: "",
        details: "",
    });

    const { experiment, lab_incharge, number_of_equipments, details } = data;
    function onChange(e) {
        e.preventDefault();
        setData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }
    async function onSubmit(e) {
        e.preventDefault();
        try {
            let response = await axios.post(
                "api/user/equipment_issue/",
                data,
                {
                    headers: { "Content-type": "application/json" },
                },
                { withCredentials: true }
            );

            toast.success("Issues Recorded");
            navigate("/");
        } catch (error) {
            toast.dismiss();
            toast.error("Enter the Correct Details");
        }
    }

    return (
        <div className="my-3 px-4 ">
            <h1 className="font-bold text-center  text-3xl py-10">Issues Forms</h1>
            <form className="max-w-lg mx-auto flex flex-col  w-full justify-center items-center " onSubmit={onSubmit}>
                <input autoComplete="off" type="text" placeholder="Experiment Name" value={experiment} className=" border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" id="experiment" onChange={onChange} />
                <input autoComplete="off" type="text" onChange={onChange} value={lab_incharge} id="lab_incharge" placeholder="Lab Incharge ID" className="border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" />
                <input autoComplete="off" type="text" id="number_of_equipments" placeholder="Number of Equipments" onChange={onChange} value={number_of_equipments} className="border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" />
                <textarea autoComplete="off" minLength="10" rows="2" onChange={onChange} value={details} id="details" className="border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" placeholder="Details"></textarea>
                <Button />
            </form>
        </div>
    );
}

export default Issue;
