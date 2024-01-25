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

  const {
    lab_incharge,
    number_of_equipments,
    details,
    dummyIncharge,
    dummyExp,
  } = data;
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
    <div className="px-4 my-3 ">
      <h1 className="py-6 my-10 text-3xl font-bold text-center">
        Issues Forms
      </h1>
      <form
        className="flex flex-col items-center justify-center w-full max-w-lg mx-auto "
        onSubmit={onSubmit}
      >
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="experiment_name" className="font-semibold">
            Experiment Name
          </label>
          <select
            required
            onChange={onChange}
            id="experiment_name"
            className="w-full px-2 py-3 mb-4 border border-gray-300 rounded-md transition ease-in-out"
          >
            <option value="">Experiment Name</option>
            {dummyExp.map((item) => (
              <option value={item.experiment_name}>
                {item.experiment_name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="experiment_name" className="font-semibold">
            Lab Incharge
          </label>
          <select
            required
            className="w-full px-2 py-3 mb-4 border-gray-300 rounded-md"
            onChange={onChange}
            id="lab_incharge"
            value={lab_incharge}
          >
            <option value="">Lab Incharge</option>
            {dummyIncharge?.map((item, index) => (
              <option key={index} value={item.lab_number}>
                {item.lab_incharge}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="experiment_name" className="font-semibold">
            Number of Equipment
          </label>
          <input
            autoComplete="off"
            type="text"
            id="number_of_equipments"
            placeholder="Number of Equipments"
            onChange={onChange}
            value={number_of_equipments}
            className="w-full px-2 py-3 mb-4 border border-gray-300 rounded-md transition ease-in-out"
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="experiment_name" className="font-semibold">
            Details about the issue{" "}
          </label>
          <textarea
            autoComplete="off"
            minLength="10"
            rows="2"
            onChange={onChange}
            value={details}
            id="details"
            className="w-full px-2 py-3 mb-4 border border-gray-300 rounded-md transition ease-in-out"
            placeholder="Details"
          ></textarea>
        </div>
        <Button />
      </form>
    </div>
  );
}

export default Issue;
