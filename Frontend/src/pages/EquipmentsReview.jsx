import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/Button";
import axios from "../interceptors/axios";
function EquipmentsReview() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    equipment: "",
    quantity: "",
    date: "",
    lab_incharge: "",
    not_working_quantity: "",
    remarks: "",
    dummyEq: [],
    dummyLabIncharge: [],
  });

  const {
    dummyLabIncharge,
    dummyEq,
    equipment,
    quantity,
    date,
    lab_incharge,
    not_working_quantity,
    remarks,
  } = data;

  useEffect(() => {
    async function getEq() {
      let response = await axios.get("api/user/equipment/");
      setData((prev) => ({
        ...prev,
        dummyEq: response?.data ?? [],
      }));
    }
    async function getLabIncharge() {
      let response = await axios.get("api/user/lab/");
      setData((prev) => ({
        ...prev,
        dummyLabIncharge: response?.data ?? [],
      }));
    }
    getEq();
    getLabIncharge();
  }, []);

  function onChange(e) {
    let boolean = null;
    if (e.target.value == "true") {
      boolean = true;
    }
    if (e.target.value == "false") {
      boolean = false;
    }
    if (e.target.files) {
      setData((prev) => ({
        ...prev,
        [e.target.id]: e.target.files,
      }));
    }
    setData((prev) => ({
      ...prev,
      [e.target.id]: boolean ?? e.target.value,
    }));
  }
  async function onSubmit(e) {
    console.log(data);
    delete data.dummyEq;
    delete data.dummyLabIncharge;
    e.preventDefault();
    try {
      let response = await axios.post(
        "api/user/equipment_review/",
        data,
        {
          headers: { "Content-type": "application/json" },
        },
        { withCredentials: true }
      );

      toast.success("Equipment Review Recorded");
      navigate("/");
    } catch (error) {
      toast.dismiss();
      toast.error("Enter the Correct Details");
    }
  }
  const [errors, setErrors] = useState({
    equipment: "",
    quantity: "",
    date: "",
    lab_incharge: "",
    not_working_quantity: "",
    remarks: "",
  });

  function onChange(e) {
    const { id, value } = e.target;
    let error = "";

    switch (id) {
      case "equipment":
        if (!value.trim()) {
          error = "Equipment is required";
        }
        break;

      case "quantity":
      case "not_working_quantity":
        if (!value.trim()) {
          error = "Quantity is required";
        } else if (isNaN(value) || parseInt(value) < 0) {
          error = "Quantity must be a non-negative number";
        }
        break;

      case "date":
        if (!value.trim()) {
          error = "Date is required";
        }
        break;

      case "lab_incharge":
        if (!value.trim()) {
          error = "Incharge is required";
        }
        break;

      case "remarks":
        if (!value.trim()) {
          error = "Remarks are required";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: error,
    }));

    setData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        method="POST"
        className="px-4 pb-5 "
        encType="multipart/form-data"
      >
        <p className="pt-4 pb-2 my-10 text-3xl font-bold text-center">
          Equipment Review
        </p>
        <main className="flex flex-col flex-wrap items-center justify-center w-full h-full max-w-6xl px-5 mx-auto mt-3 md:px-2">
          <div className="w-[90%] md:w-[68%]  lg:w-[50%]">
            <div className="flex items-center mb-10 space-x-3">
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="equipment" className="font-semibold">
                  Equipment Number
                </label>
                <select
                  className="w-full py-4 pl-2 border-gray-300 rounded-md "
                  required
                  id="equipment"
                  onChange={onChange}
                >
                  <option value="">Equipment no.</option>
                  {dummyEq?.map((item, index) => (
                    <option
                      key={index}
                      value={`${item.equipment_serial_number}`}
                    >
                      {item.equipment_serial_number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col w-full gap-2">
                <label htmlFor="quantity" className="font-semibold">
                  Equipment Quantity
                </label>
                <input
                  autoComplete="off"
                  type="number"
                  min={0}
                  required
                  id="quantity"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={onChange}
                  className="w-full py-3 pl-2 text-lg text-center border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex items-center mb-10 space-x-3">
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="date" className="font-semibold">
                  Date
                </label>
                <input
                  autoComplete="off"
                  type="date"
                  required
                  id="date"
                  value={date}
                  onChange={onChange}
                  className="w-full py-3 pl-2 text-lg border border-gray-300 rounded-md "
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="lab_incharge" className="font-semibold">
                  Lab Incharge
                </label>
                <select
                  className="w-full py-3 pl-2 border-gray-300 rounded-md"
                  required
                  id="lab_incharge"
                  onChange={onChange}
                >
                  <option value="">Lab Incharge</option>
                  {dummyLabIncharge?.map((item, index) => (
                    <option key={index} value={`${item.lab_number}`}>
                      {item.lab_incharge}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col w-full gap-2">
                <label htmlFor="not_working_quantity" className="font-semibold">
                  Defective Quantity
                </label>
                <input
                  autoComplete="off"
                  type="number"
                  min={0}
                  required
                  id="not_working_quantity"
                  placeholder="Defective"
                  value={not_working_quantity}
                  onChange={onChange}
                  className="w-full py-3 pl-2 text-lg text-center border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="remarks" className="font-semibold">
                Remarks
              </label>
              <textarea
                autoComplete="off"
                required
                placeholder="Enter Remark"
                id="remarks"
                value={remarks}
                onChange={onChange}
                className="w-full py-3 pl-2 mb-6 text-lg border-gray-300 rounded-md transition ease-in-out"
              >
                {" "}
              </textarea>
            </div>

            <Button />
          </div>
        </main>
      </form>
    </>
  );
}
export default EquipmentsReview;
