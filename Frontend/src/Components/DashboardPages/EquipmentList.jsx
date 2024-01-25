import { useEffect, useState } from "react";
import Panel from "../Panel";
import axios from "../../interceptors/axios";
import { useSelector } from "react-redux";
import jsPDFInvoiceTemplate, {
  OutputType,
  jsPDF,
} from "jspdf-invoice-template";
import { toast } from "react-toastify";
import TextModal from "../TextModal";
import SideBar from "../SideBar";
function EquipmentList() {
  const [departments, setDepartments] = useState([]);
  const token = useSelector((store) => {
    return store.user.accesstoken;
  });
  const [changed, setChanged] = useState();
  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.get("api/user/equipment/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        response?.data.map((data) => {
          if (data.status === true) {
            data.status = "true";
          } else {
            data.status = "false";
          }
        });
        let response2 = await axios.get("api/user/invoice/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        response = response?.data;
        response2 = response2?.data;
        let a = {};
        response.forEach((obj) => {
          for (let i = 0; i < response2.length; i++) {
            if (obj.invoice_number == response2[i].invoice_number) {
              a[obj.equipment_serial_number] = response2[i].item_name;
            }
          }
        });
        setChanged(a);
        setDepartments(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

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
            title: "Lab Number",
            style: {
              width: 30,
            },
          },
          {
            title: "Serial No.",
            style: {
              width: 25,
            },
          },
          {
            title: "Equipment",
            style: {
              width: 20,
            },
          },
          {
            title: "Life (In Years)",
            style: {
              width: 30,
            },
          },

          {
            title: "Description",
            style: {
              width: 70,
            },
          },
        ],
        table: Array.from([...boom], (item, index) => [
          item.lab_number,
          item.equipment_serial_number,
          changed[item.equipment_serial_number],
          item.life,
          item.description,
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
      console.log(error);
    }
  }

  return (
    <div className="flex">
      <SideBar />
      <Panel departments={departments} saveFile={saveFile}>
        <h1 className="w-full my-4 text-3xl font-bold text-center">
          Equipment List
        </h1>
        <div className="relative my-8 overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-5 py-3">Lab no.</th>
                <th className="px-5 py-3">Serial number</th>
                <th className="px-5 py-3">Equipment Name</th>
                <th className="px-5 py-3">Life (In Years)</th>
                <th className="px-5 py-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {departments &&
                departments.map((data, index) => (
                  <tr
                    key={index}
                    className="border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{data.lab_number}</td>
                    <td className="px-6 py-4">
                      {data.equipment_serial_number}
                    </td>
                    <td className="px-6 py-4">
                      {changed[data.equipment_serial_number]}
                    </td>
                    <td className="px-6 py-4">{data.life}</td>
                    <td className="px-6 py-4">
                      <TextModal
                        text={data.description}
                        eq={changed[data.equipment_serial_number]}
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

export default EquipmentList;
