import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../interceptors/axios";
import Panel from "../Panel";
import jsPDFInvoiceTemplate, {
  OutputType,
  jsPDF,
} from "jspdf-invoice-template";
import { toast } from "react-toastify";
import TextModal from "../TextModal";
import SideBar from "../SideBar";
function EquipmentsReviewList() {
  const [departments, setDepartments] = useState([]);
  const token = useSelector((store) => {
    return store.user.accesstoken;
  });

  const [changedData, setChangedData] = useState({});
  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.get("api/user/equipment_review/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let response2 = await axios.get("api/user/invoice/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let response1 = await axios.get("api/user/equipment/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        response = response?.data;
        response1 = response1?.data;
        response2 = response2?.data;
        let a = [];
        let b = {};
        let c = {};
        response.forEach((obj) => {
          for (let i = 0; i < response1.length; i++) {
            if (response1[i].equipment_serial_number == obj.equipment) {
              a.push({ [obj.equipment]: response1[i].invoice_number });
              break;
            }
          }
        });
        a.forEach((_, index) => {
          for (let i = 0; i < response2.length; i++) {
            if (response2[i].invoice_number == Object.values(a[index])[0]) {
              c[Object.keys(a[index])[0]] = response2[i].item_name;
            }
          }
        });

        let response3 = await axios.get("api/user/lab/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        response3 = response3?.data;
        response.forEach((obj) => {
          let labNum = obj.lab_incharge;
          for (let i = 0; i < response3.length; i++) {
            if (labNum == response3[i].lab_number) {
              b[labNum] = response3[i].lab_incharge;
              break;
            }
          }
        });
        setChangedData({ eqName: c, inChargeName: b });
        setDepartments(response ?? []);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [token]);

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
            title: "Equipment",
            style: {
              width: 30,
            },
          },
          {
            title: "Quantity",
            style: {
              width: 25,
            },
          },
          {
            title: "Date",
            style: {
              width: 30,
            },
          },
          {
            title: "Lab Incharge",
            style: {
              width: 30,
            },
          },
          {
            title: "Not Working Quantity",
            style: {
              width: 35,
            },
          },
          {
            title: "Remarks",
            style: {
              width: 45,
            },
          },
        ],
        table: Array.from([...boom], (item, index) => [
          changedData.eqName[item.equipment],
          item.quantity,
          item.date,
          changedData.inChargeName[item.lab_incharge],
          item.not_working_quantity,
          item.remarks,
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
  console.log(changedData);

  return (
    <div className="flex">
      <SideBar />
      <Panel departments={departments} saveFile={saveFile}>
        <h1 className="w-full pt-4 my-4 text-3xl font-bold text-center">
          Equipment Review List
        </h1>
        <div className="relative my-8 overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-5 py-3">Equipment</th>
                <th className="px-5 py-3">Quantity</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Lab Incharge</th>
                <th className="px-5 py-3">Not Working Quantity</th>
                <th className="px-5 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {departments &&
                departments.map((data, index) => (
                  <tr
                    className="border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700"
                    key={index}
                  >
                    <td className="px-6 py-4">
                      {changedData.eqName[data.equipment]}
                    </td>
                    <td className="px-6 py-4">{data.quantity}</td>
                    <td className="px-6 py-4">{data.date}</td>
                    <td className="px-6 py-4">
                      {changedData.inChargeName[data.lab_incharge]}
                    </td>
                    <td className="px-6 py-4">{data.not_working_quantity}</td>
                    <td className="px-6 py-4">
                      <TextModal
                        text={data.remarks}
                        eq={changedData.inChargeName[data.lab_incharge]}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

export default EquipmentsReviewList;
