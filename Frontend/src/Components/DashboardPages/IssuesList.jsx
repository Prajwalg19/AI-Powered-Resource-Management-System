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
function IssuesList() {
  const [departments, setDepartments] = useState([]);
  const token = useSelector((store) => {
    return store.user.accesstoken;
  });
  const [changed, setChanged] = useState();
  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.get("api/user/equipment_issue/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let response2 = await axios.get("api/user/lab/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        response = response.data;
        response2 = response2.data;
        let ok = {};
        await response.forEach((obj) => {
          let labNum = obj.lab_incharge;
          for (let i = 0; i < response2.length; i++) {
            if (labNum == response2[i].lab_number) {
              ok[labNum] = response2[i].lab_incharge;
              break;
            }
          }
        });
        setChanged(ok);
        setDepartments(response);
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
            title: "Lab Number",
            style: {
              width: 25,
            },
          },
          {
            title: "Lab Incharge",
            style: {
              width: 25,
            },
          },
          {
            title: "Experiment Name",
            style: {
              width: 50,
            },
          },
          {
            title: "No. of Equipments",
            style: {
              width: 30,
            },
          },
          {
            title: "Details",
            style: {
              width: 70,
            },
          },
        ],
        table: Array.from([...boom], (item, index) => [
          item.lab_incharge,
          changed[item.lab_incharge],
          item.experiment_name,
          item.number_of_equipments,
          item.details,
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
          Issues
        </h1>
        <div className="relative my-8 overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-5 py-3">Lab Number</th>
                <th className="px-5 py-3">Lab Incharge</th>
                <th className="px-5 py-3">Experminet Name</th>
                <th className="px-5 py-3">Number of Equipments</th>
                <th className="px-5 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {departments &&
                departments.map((data, index) => (
                  <tr
                    key={index}
                    className="border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{data.lab_incharge}</td>
                    <td className="px-6 py-4">{changed[data.lab_incharge]}</td>
                    <td className="px-6 py-4">{data.experiment_name}</td>

                    <td className="px-6 py-4">{data.number_of_equipments}</td>
                    <td className="px-6 py-4">
                      <TextModal
                        text={data.details}
                        eq={changed[data.lab_incharge]}
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

export default IssuesList;
