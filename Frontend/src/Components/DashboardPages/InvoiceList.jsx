import { useEffect, useState } from "react";
import jsPDFInvoiceTemplate, {
  OutputType,
  jsPDF,
} from "jspdf-invoice-template";
import { useSelector } from "react-redux";
import axios from "../../interceptors/axios";
import Panel from "../Panel";
import { toast } from "react-toastify";
import SideBar from "../SideBar";
function InvoiceList() {
  const [departments, setDepartments] = useState([]);
  const store = useSelector((store) => {
    return store;
  });
  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.get("/api/user/invoice/", {
          headers: {
            Authorization: `Bearer ${store.user.accesstoken}`,
          },
        });
        setDepartments(response.data);
      } catch (error) {}
    }
    fetchData();
  }, [store.user]);
  async function saveFile() {
    const [...boom] = departments;
    let props = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: true,
      fileName: "Invoice",
      orientationLandscape: false,
      compress: true,
      business: {
        name: "Global Academy of Technology",
        address:
          "Rajarajeshwarinagar, Ideal Homes Township, Bangalore-560098, Karnataka, India",
        phone: "+919243190105",
        email: "info@gat.ac.in",
        website: "https://gat.ac.in",
      },
      invoice: {
        invGenDate: Date(),
        headerBorder: false,
        tableBodyBorder: false,
        header: [
          {
            title: "Invoice Serial No.",
            style: {
              width: 33.333,
            },
          },
          {
            title: "Purchase Order no.",
            style: {
              width: 33.333,
            },
          },
          {
            title: "Item Name",
            style: {
              width: 33.333,
            },
          },
          {
            title: "Purchase Date",
            style: {
              width: 33.333,
            },
          },
          {
            title: "Quantity",
            style: {
              width: 33.333,
            },
          },
          {
            title: "Item Cost",
            style: {
              width: 33.333,
            },
          },
        ],
        table: Array.from([...boom], (item, index) => [
          item.invoice_number,
          item.purchase_order_no,
          item.item_name,
          item.purchase_date,
          item.quantity,
          item.item_cost,
        ]),
      },
      footer: {
        text: "The invoice is created on a computer and is valid without the signature and stamp.",
      },
      pageEnable: true,
      pageLabel: "Page ",
    };
    try {
      const pdfObject = jsPDFInvoiceTemplate(props);
    } catch (error) {
      toast.error("Something went wrong");
    }
  }
  return (
    <div className="flex">
      <SideBar />
      <Panel departments={departments} saveFile={saveFile}>
        <h1 className="w-full pt-4 my-4 text-3xl font-bold text-center">
          Invoice List
        </h1>
        <div className="relative my-8 overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-5 py-3">Invoice Number</th>
                <th className="px-5 py-3">Purhcase Order Number</th>
                <th className="px-5 py-3">Item Name</th>
                <th className="px-5 py-3">Purhcase Date</th>
                <th className="px-5 py-3">Quantity</th>
                <th className="px-5 py-3">&#8377; Item Cost</th>
              </tr>
            </thead>
            <tbody>
              {departments &&
                departments.map((data, index) => (
                  <tr
                    key={index}
                    className="border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{data.invoice_number}</td>
                    <td className="px-6 py-4">{data.purchase_order_no}</td>
                    <td className="px-6 py-4">{data.item_name}</td>
                    <td className="px-6 py-4">{data.purchase_date}</td>
                    <td className="px-6 py-4">{data.quantity}</td>
                    <td className="px-6 py-4">{data.item_cost}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

export default InvoiceList;
