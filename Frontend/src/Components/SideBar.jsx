import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { HiOfficeBuilding } from "react-icons/hi";
import { FaComputer } from "react-icons/fa6";
import { MdFeedback } from "react-icons/md";
import { MdReportProblem } from "react-icons/md";
import { ImLab } from "react-icons/im";
import { Link } from "react-router-dom";
import { LiaWarehouseSolid } from "react-icons/lia";
import { RiMiniProgramFill } from "react-icons/ri";
import { FaFileInvoice } from "react-icons/fa";

import Panel from "./Panel";
const SideBar = () => {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const store = useSelector((store) => {
    return store;
  });
  const isAdmin = store?.user?.role?.toLowerCase() === "admin";
  const isHOD = store?.user?.role?.toLowerCase() === "hod";
  const isLabIncharge = store?.user?.role?.toLowerCase() === "incharge";
  const isStaff = store?.user?.role?.toLowerCase() === "staff";
  const isForeman = store?.user?.role?.toLowerCase() === "foreman";

  let listArr = [];
  let paths = [];
  if (isAdmin) {
    listArr = [
      { Departments: "HiOfficeBuilding" },
      { Labs: "ImLab" },
      { "Purchase Orders": "FaFileInvoiceDollar" },
      { Equipments: "FaComputer" },
      { "Equipment Reviews": "MdFeedback" },
      { "Registered Issues": "MdReportProblem" },
      { "Experiment Details": "RiMiniProgramFill" },
      { "Apparatus Details": "LiaWarehouseSolid" },
    ];
    paths = [
      "/departmentlist",
      "/lablist",
      "/purchaselist",
      "/equipmentlist",
      "/equipmentreviewlist",
      "/issueslist",
      "/experimentlist",
      "/apparatuslist",
    ];
  } else if (isHOD) {
    listArr = [
      { Departments: "HiOfficeBuilding" },
      { Labs: "ImLab" },
      { Equipments: "FaComputer" },
      { "Equipment Reviews": "MdFeedback" },
      { "Registered Issues": "MdReportProblem" },
      { "Experiment Details": "RiMiniProgramFill" },
      { "Apparatus Details": "LiaWarehouseSolid" },
    ];
    paths = [
      "/departmentlist",
      "/lablist",
      "/equipmentlist",
      "/equipmentreviewlist",
      "/issueslist",
      "/experimentlist",
      "/apparatuslist",
    ];
  } else if (isLabIncharge) {
    listArr = [
      { "Equipment Reviews": "MdFeedback" },
      { "Registered Issues": "MdReportProblem" },
    ];
    paths = ["/equipmentreviewlist", "/issueslist"];
  } else if (isStaff) {
    listArr = [
      { "Experiment Details": "RiMiniProgramFill" },
      { "Apparatus Details": "LiaWarehouseSolid" },
    ];
    paths = ["/experimentlist", "/apparatuslist"];
  } else if (isForeman) {
    listArr = [
      { "Purchase Orders": "FaFileInvoiceDollar" },
      { "Equipment Reviews": "MdFeedback" },
      { "Registered Issues": "MdReportProblem" },
      { "Invoice List": "FaFileInvoice" },
    ];
    paths = [
      "/purchaselist",
      "/equipmentreviewlist",
      "/issueslist",
      "/invoicelist",
    ];
  }
  const renderIcon = (iconName) => {
    const componentsMap = {
      hiofficebuilding: HiOfficeBuilding,
      imlab: ImLab,
      fafileinvoicedollar: FaFileInvoiceDollar,
      facomputer: FaComputer,
      mdfeedback: MdFeedback,
      mdreportproblem: MdReportProblem,
      liawarehousesolid: LiaWarehouseSolid,
      riminiprogramfill: RiMiniProgramFill,
      fafileinvoice: FaFileInvoice,
    };

    const IconComponent = componentsMap[iconName.toLowerCase()];

    if (IconComponent) {
      return <IconComponent className="text-2xl" />;
    } else {
      return null;
    }
  };

  return (
    <div className="flex">
      <main
        className={` ${
          open ? "w-60" : "w-16"
        } duration-300 relative h-[100vh] bg-[#010b4b] `}
      >
        <div
          className="absolute cursor-pointer z-[1] w-7 -right-3 top-3"
          onClick={() => setOpen(!open)}
        >
          <FaChevronRight
            className={` duration-300 p-2 text-3xl bg-white rounded-full ${
              open && "rotate-180"
            }`}
          />
        </div>
        <div className={`flex items-center px-3 py-6 gap-4`}>
          <MdSpaceDashboard
            className={`text-4xl text-slate-200 duration-500 cursor-pointer ${
              open && "rotate-[360deg]"
            }`}
            onClick={() => setOpen(!open)}
          />
          <div
            className={`ease-in-out text-slate-200 duration-300 text-lg font-semibold  ${
              !open && "hidden"
            }`}
          >
            Dashboard
          </div>
        </div>

        <ul className="flex flex-col justify-center pl-2 pr-2">
          {listArr.map((obj, index) => (
            <li className="" key={index}>
              <Link
                to={paths[index]}
                className="flex px-2 py-3 my-6 rounded-md hover:bg-slate-600 gap-4 duration-100"
              >
                <span className="text-white">
                  {renderIcon(Object.values(obj)[0])}
                </span>
                <span
                  className={`font-medium text-white text-sm duration-300 ${
                    !open && "scale-0"
                  }`}
                >
                  {Object.keys(obj)[0]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default SideBar;
