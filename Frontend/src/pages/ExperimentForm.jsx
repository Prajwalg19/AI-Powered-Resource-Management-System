import axios from "../interceptors/axios";
import Button from "../Components/Button";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router";
const Experiment = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    experiment_name: "",
    experiment_number: "",
  });
  const { experiment_name, experiment_number } = data;
  async function submit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("api/user/Experiment/", data);
      navigate("/");
      toast.success("Data Record");
    } catch (e) {
      console.log(e);
    }
  }
  function onChange(e) {
    setData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }
  return (
    <div>
      <p className="py-6 my-10 text-3xl font-bold text-center ">
        Equipment Details
      </p>
      <form
        onSubmit={submit}
        className="flex flex-col flex-wrap items-center justify-center w-full h-full max-w-2xl px-5 mx-auto mt-3 md:px-2"
      >
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="experiment_name" className="font-semibold">
            Experiment Name
          </label>
          <input
            type="text"
            id="experiment_name"
            placeholder="Experiment Name"
            onChange={onChange}
            className="w-full py-3 pl-2 mb-6 text-lg border border-gray-300 rounded-md"
            value={experiment_name}
            required
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="experiment_number" className="font-semibold">
            Experiment Serial Number
          </label>
          <input
            type="text"
            id="experiment_number"
            placeholder="Experiment Number"
            onChange={onChange}
            className="w-full py-3 pl-2 mb-6 text-lg border border-gray-300 rounded-md"
            value={experiment_number}
            required
          />
        </div>
        <Button />
      </form>
    </div>
  );
};
export default Experiment;
