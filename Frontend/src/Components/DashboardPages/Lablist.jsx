import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../interceptors/axios";
import Panel from "../Panel";
import jsPDFInvoiceTemplate, {
  OutputType,
  jsPDF,
} from "jspdf-invoice-template";
import { toast } from "react-toastify";
import SideBar from "../SideBar";
function Lablist() {
  const [departments, setDepartments] = useState([]);
  const token = useSelector((store) => {
    return store.user.accesstoken;
  });
  const [depName, setDepName] = useState();
  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.get("api/user/lab/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let response2 = await axios.get("api/user/department/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        response = response.data;
        response2 = response2.data;
        let ok = {};
        await response.forEach((obj) => {
          let depNum = obj.department_name;
          for (let i = 0; i < response2.length; i++) {
            if (depNum == response2[i].department_number) {
              ok[depNum] = response2[i].department_name;
              break;
            }
          }
        });
        console.log(ok);
        setDepName(ok);
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
            title: "Dep Name",
            style: {
              width: 40,
            },
          },
          {
            title: "Lab Number",
            style: {
              width: 40,
            },
          },
          {
            title: "Lab Name",
            style: {
              width: 40,
            },
          },
          {
            title: "Lab Incharge",
            style: {
              width: 40,
            },
          },
          {
            title: "Location",
            style: {
              width: 40,
            },
          },
        ],
        table: Array.from([...boom], (item, index) => [
          depName[item.department_name],
          item.lab_number,
          item.lab_name,
          item.lab_incharge,
          item.location,
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
          Lab List
        </h1>
        <div className="relative my-8 overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-5 py-3">Department name</th>
                <th className="px-5 py-3">Lab number</th>
                <th className="px-5 py-3">Lab name</th>
                <th className="px-5 py-3">Lab incharge</th>
                <th className="px-5 py-3">Location</th>
              </tr>
            </thead>
            <tbody>
              {departments &&
                departments.map((data, index) => (
                  <tr
                    key={index}
                    className="border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">
                      {depName[data.department_name]}
                    </td>
                    <td className="px-6 py-4">{data.lab_number}</td>
                    <td className="px-6 py-4">{data.lab_name}</td>
                    <td className="px-6 py-4">{data.lab_incharge}</td>
                    <td className="px-6 py-4">{data.location}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

export default Lablist;
