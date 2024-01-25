import axios from "../interceptors/axios";
import Button from "../Components/Button";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
const Apparatus = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    apparatus_name: "",
    experiment_number: "",
    quantity: "",
  });
  const { quantity, apparatus_name, experiment_name } = data;
  const [dropApp, setAppDrop] = useState();
  useEffect(() => {
    async function retrieve() {
      let response = await axios.get("api/user/Experiment/");
      setAppDrop(response.data);
    }
    retrieve();
  }, []);
  async function submit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("api/user/Apparatus/", data);
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
        Apparatus Details
      </p>
      <form
        onSubmit={submit}
        className="flex flex-col flex-wrap items-center justify-center w-full h-full max-w-2xl px-5 mx-auto mt-3 md:px-2"
      >
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="experiment_name" className="font-semibold">
            Experiment Name
          </label>
          <select
            id="experiment_name"
            value={experiment_name}
            onChange={onChange}
            className="w-full py-3 pl-2 mb-6 text-lg text-center border-gray-300 transition ease-in-out rounded-md"
          >
            <option value="">Experiment Name</option>
            {dropApp?.map((item, index) => (
              <option
                key={index}
                value={item.experiment_name}
              >{` ${item.experiment_name}`}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full gap-2">
          <label htmlFor="apparatus_name" className="font-semibold">
            Apparatus Name
          </label>
          <input
            type="text"
            id="apparatus_name"
            placeholder="Apparatus Name"
            onChange={onChange}
            className="w-full py-3 pl-2 mb-6 text-lg border border-gray-300 rounded-md"
            value={apparatus_name}
            required
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="quantity" className="font-semibold">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            placeholder="Quantity"
            onChange={onChange}
            className="w-full py-3 pl-2 mb-6 text-lg border border-gray-300 rounded-md"
            value={quantity}
            required
          />
        </div>
        <Button />
      </form>
    </div>
  );
};
export default Apparatus;
