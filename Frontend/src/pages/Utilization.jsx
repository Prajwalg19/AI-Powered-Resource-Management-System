import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/Button";
import axios from "../interceptors/axios";
function Utilization() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        experiment: "",
        batch: "",
        number_of_students: 0,
        number_of_equipments: 0,
        equipments_required: 0,
        equipments_available: "",
        dummyExperiment: [],
    });
    const onChange = (e) => {
        const { id, value } = e.target;
        const students = parseInt(data.number_of_students, 10);
        const equipments = parseInt(data.number_of_equipments, 10);
        if (id === "number_of_students") {
            setData({
                ...data,
                number_of_students: value,
                equipments_required: students * equipments,
            });
        } else if (id === "number_of_equipments") {
            setData({
                ...data,
                number_of_equipments: value,
                equipments_required: students * equipments,
            });
        }
    };

    console.log(data.equipments_available);
    const { experiment, batch, number_of_equipments, number_of_students, equipments_required, equipments_available, dummyExperiment } = data;
    function onChang(e) {
        e.preventDefault();
        setData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }
    useEffect(() => {
        async function getExperiment() {
            let response = await axios.get("api/user/Experiment/");
            setData((prev) => ({
                ...prev,
                dummyExperiment: response.data,
            }));
        }
        async function getQuantity() {
            let response = await axios.get("api/user/Apparatus/");
            setData((prev) => ({
                ...prev,
                equipments_available: response.data,
            }));
        }
        getExperiment();
        getQuantity();
    }, []);

    async function onSubmit(e) {
        e.preventDefault();
        delete data.dummyExperiment;
        try {
            let response = await axios.post(
                "api/user/utilization/",
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
            <h1 className="font-bold text-center  text-3xl py-6 my-10">Utilization Forms</h1>
            <form className="max-w-lg mx-auto flex flex-col  w-full justify-center items-center " onSubmit={onSubmit}>
                <input autoComplete="off" type="text" placeholder="Batch" value={batch} className=" border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" id="batch" onChange={onChang} />
                <select className="w-full border-gray-300 rounded-md py-3 mb-4 px-2" onChange={onChang} id="experiment" value={experiment}>
                    <option value="">Experiment</option>
                    {dummyExperiment?.map((item, index) => (
                        <option key={index} value={item.experiment_number}>
                            {item.experiment_name}
                        </option>
                    ))}
                </select>
                <input autoComplete="off" type="text" id="number_of_students" placeholder="Number of Students" onChange={onChang} value={number_of_students} className="border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" />
                <input autoComplete="off" type="text" id="number_of_equipments" placeholder="Number of Equipments" onChange={onChang} value={number_of_equipments} className="border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" />
                <input autoComplete="off" type="text" id="equipments_required" placeholder="Required" onChange={onChang} value={equipments_required} className="border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" />
                <input autoComplete="off" type="text" id="equipments_available" placeholder="Equipments Available" onChange={onChang} value={equipments_available} className="border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" />

                <Button />
            </form>
        </div>
    );
}

export default Utilization;
