import { useEffect, useState } from "react";
import axios from "../interceptors/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Button from "../Components/Button";
import Excel from "../pages/Excel";
function Invoice() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    purchase_order_no: "",
    purchase_date: "",
    item_cost: "",
    quantity: "",
    item_name: "",
    invoice_number: "",
    dummyPurchaseOrderNo: [],
  });
  const {
    dummyPurchaseOrderNo,
    purchase_date,
    purchase_order_no,
    item_cost,
    quantity,
    item_name,
    invoice_number,
  } = state;
  function onChange(e) {
    setState((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  useEffect(() => {
    async function getPurchaseOrderNo() {
      let response = await axios.get("api/user/purchase_order/");
      setState((prev) => ({
        ...prev,
        dummyPurchaseOrderNo: response?.data ?? [],
      }));
    }
    getPurchaseOrderNo();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    delete state.dummyPurchaseOrderNo;
    try {
      let response = await axios.post(
        "api/user/invoice/",
        state,
        {
          headers: { "Content-type": "application/json" },
        },
        { withCredentials: true }
      );

      if (response.status == 201) {
        toast.success("Invoice Recorded");
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

  return (
    <>
      <div>
        <form onSubmit={onSubmit} className="px-4 pb-5">
          <p className="py-6 my-10 text-3xl font-bold text-center lg:py-6">
            Invoice Entry
          </p>
          <main className="w-full flex h-full justify-center lg:space-x-[10%] items-center mt-3 flex-wrap mx-auto max-w-6xl md:px-2 px-5">
            <div className="w-[90%] md:w-[68%]  lg:w-[40%]">
              <div className="flex flex-col gap-2">
                <label className="font-semibold" htmlFor="invoice_number">
                  Invoice Number{" "}
                </label>
                <input
                  required
                  type="text"
                  id="invoice_number"
                  autoComplete="off"
                  placeholder="Invoice number"
                  value={invoice_number}
                  onChange={onChange}
                  className="w-full py-3 pl-2 mb-6 text-lg text-center border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col items-center w-full mb-6 gap-2">
                <span className="w-full font-semibold whitespace-nowrap">
                  Purchase Order Number
                </span>
                <select
                  id="purchase_order_no"
                  value={purchase_order_no}
                  onChange={onChange}
                  className="w-full py-3 pl-2 text-lg text-center border-gray-300 transition ease-in-out rounded-md"
                >
                  <option value="">Purchase Order Number</option>
                  {dummyPurchaseOrderNo.map((item, index) => (
                    <option
                      key={index}
                      value={item.purchase_order_number}
                    >{`No: ${item.purchase_order_number} , Date: ${item.purchase_order_date}`}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col items-center w-full mb-6 font-medium gap-2 whitespace-nowrap">
                <span className="w-full font-semibold">Purchase Date</span>
                <input
                  required
                  type="date"
                  id="purchase_date"
                  autoComplete="off"
                  value={purchase_date}
                  onChange={onChange}
                  className="w-full py-3 pl-2 text-lg text-center border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center w-full mb-6 space-x-1">
                <div className="flex flex-col w-full gap-2">
                  <label htmlFor="item_name" className="font-semibold">
                    Item name
                  </label>
                  <input
                    type="text"
                    required
                    id="item_name"
                    autoComplete="off"
                    value={item_name}
                    placeholder="Item name"
                    onChange={onChange}
                    className="w-full py-3 pl-2 text-lg text-center border-gray-300 rounded-md transition ease-in-out"
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label htmlFor="quantity" className="font-semibold">
                    Quantity
                  </label>
                  <input
                    type="text"
                    required
                    id="quantity"
                    autoComplete="off"
                    value={quantity}
                    placeholder="Quantity"
                    onChange={onChange}
                    className="w-full py-3 pl-2 text-lg text-center border-gray-300 rounded-md transition ease-in-out"
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label htmlFor="item_cost" className="font-semibold">
                    Cost
                  </label>
                  <input
                    required
                    type="number"
                    autoComplete="off"
                    id="item_cost"
                    placeholder="Cost"
                    value={item_cost}
                    onChange={onChange}
                    className="w-full py-3 pl-2 text-lg text-center border border-gray-300 rounded-md "
                  />
                </div>
              </div>

              <Excel fileName="invoice-excel" />
              <Button />
            </div>
          </main>
        </form>
      </div>
    </>
  );
}

export default Invoice;
