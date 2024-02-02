import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/Button";
import axios from "../interceptors/axios";
import Excel from "../pages/Excel";
import ImageUpload from "../Components/ImageUpload";
function PurchaseOrderForm() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    purchase_order_number: "",
    supplier: "",
    total_value: "",
    purchase_order_date: "",
    originator: "",
    dummyOri: [],
  });

  const {
    dummyOri,
    purchase_order_date,
    supplier,
    total_value,
    purchase_order_number,
    originator,
  } = data;
  function onChange(e) {
    setData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  useEffect(() => {
    async function getLabs() {
      let response = await axios.get("api/user/department/");
      setData((prev) => ({
        ...prev,
        dummyOri: response?.data,
      }));
    }
    getLabs();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    delete data.dummyOri;
    try {
      let response = await axios.post(
        "api/user/purchase_order/",
        data,
        {
          headers: { "Content-type": "application/json" },
        },
        { withCredentials: true }
      );

      if (response.status == 201) {
        toast.success("Purchase Order Details Recorded");
        navigate("/");
      } else {
        toast.error("Enter the correct details");
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }
  const [errors, setErrors] = useState({
    purchase_order_number: "",
    supplier: "",
    total_value: "",
    purchase_date: "",
    originator: "",
  });
  function onChange(e) {
    const { id, value } = e.target;
    let error = "";

    switch (id) {
      case "purchase_order_number":
        if (!value.trim()) {
          error = "Purchase Order number is required";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          error = "Purchase Order Value must be a positive number";
        }
        break;

      case "purchase_date":
        if (!value.trim()) {
          error = "Purchase Date is required";
        }
        break;

      case "originator":
        if (!value.trim()) {
          error = "Originator is required";
        }
        break;

      case "supplier":
        if (!value.trim()) {
          error = "Supplier is required";
        }
        break;

      case "total_value":
        if (!value.trim()) {
          error = "Purchase Order Value is required";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          error = "Purchase Order Value must be a positive number";
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
      <form onSubmit={onSubmit} className="px-4 pb-5">
        <p className="py-6 my-10 text-3xl font-bold text-center lg:py-6">
          Purchase Order Details
        </p>
        <main className="w-full flex h-full justify-center lg:space-x-[10%] items-center mt-3 flex-wrap mx-auto max-w-6xl md:px-2 px-5">
          <div className="w-[90%] md:w-[68%]  lg:w-[40%]">
            <div className="flex flex-col gap-2">
              <label htmlFor="purchase_order_number" className="font-semibold">
                Order Number
              </label>
              <input
                required
                type="text"
                id="purchase_order_number"
                placeholder="Purchase Order number"
                value={purchase_order_number}
                onChange={onChange}
                className="w-full py-3 pl-2 mb-6 text-lg text-center border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col mb-6 gap-2">
              <label htmlFor="purchase_order_number" className="font-semibold ">
                Purchase Date
              </label>
              <input
                type="date"
                required
                id="purchase_order_date"
                value={purchase_order_date}
                onChange={onChange}
                className="w-full py-3 pl-2 text-lg text-center border-gray-300 transition ease-in-out rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="originator" className="font-semibold">
                Purchased for{" "}
              </label>
              <select
                required
                className="py-3 mb-6 text-center bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={originator}
                onChange={onChange}
                id="originator"
              >
                <option value="">Originator</option>
                {dummyOri?.map((item, index) => (
                  <option key={index} value={item.department_number}>
                    {item.department_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center w-full mb-6 space-x-3">
              <span className="flex flex-col w-full gap-2">
                <label htmlFor="supplier" className="font-semibold">
                  Supplier
                </label>
                <input
                  type="text"
                  required
                  id="supplier"
                  value={supplier}
                  placeholder="Supplier"
                  onChange={onChange}
                  className="w-full py-3 pl-2 text-lg text-center border-gray-300 rounded-md transition ease-in-out"
                />
              </span>
              <span className="flex flex-col w-full gap-2">
                <label htmlFor="total_value" className="font-semibold">
                  Total Cost
                </label>
                <input
                  required
                  type="text"
                  id="total_value"
                  placeholder="Purchase Order Value"
                  value={total_value}
                  onChange={onChange}
                  className="w-full py-3 pl-2 text-lg text-center border-gray-300 rounded-md transition ease-in-out"
                />
              </span>
            </div>
            {
              // <Excel fileName="purchase-excel" />
            }
            <ImageUpload />
            <Button />
          </div>
        </main>
      </form>
    </>
  );
}
export default PurchaseOrderForm;
