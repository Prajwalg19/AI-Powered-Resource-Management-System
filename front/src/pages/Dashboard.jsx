import { Link } from "react-router-dom";
import { AiOutlineIssuesClose, AiOutlineMenuUnfold } from "react-icons/ai";
import "../index.css";
import { useDispatch, useSelector } from "react-redux";
import { openPanel } from "../features/auth/sidePanelSlice";
import { MdSpaceDashboard } from "react-icons/md";
import { ImLab } from "react-icons/im";
import { FcDepartment } from "react-icons/fc";
import { BiSearchAlt, BiSolidPurchaseTag } from "react-icons/bi";
import { RiComputerFill } from "react-icons/ri";
import Modal from "../Components/Modal";
function Dashboard() {
    const dispatch = useDispatch();
    const store = useSelector((store) => {
        return store;
    });
    const isAdmin = store?.user?.role?.toLowerCase() === "admin";
    const isStaff = store?.user?.role?.toLowerCase() === "staff";
    const modalStatus = store?.modal?.isOpen;
    return (
        <div>
            <button type="button" className="fixed z-50 top-5 left-2" onClick={() => dispatch(openPanel())}>
                <AiOutlineMenuUnfold />
            </button>

            <aside className={`w-64 h-screen transition-transform ${store?.sidePanel.isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
                    {isAdmin ? (
                        <ul className="flex flex-col items-start justify-center pl-1 font-medium space-y-2">
                            <li>
                                <span className="flex items-center justify-start text-lg font-semibold space-x-2">
                                    <MdSpaceDashboard />
                                    <p> Dashboard </p>
                                </span>
                            </li>
                            <li>
                                <Link to="/departmentlist" className="flex items-center justify-center space-x-2">
                                    <FcDepartment />
                                    <span>Department List</span>{" "}
                                </Link>
                            </li>
                            <li>
                                <Link to="/lablist" className="flex items-center justify-center space-x-2">
                                    <ImLab /> <span>Labs List</span>{" "}
                                </Link>
                            </li>
                            <li>
                                <Link to="/purchaselist" className="flex items-center justify-center space-x-2">
                                    <BiSolidPurchaseTag />
                                    <span> Purchase order List</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/equipmentlist" className="flex items-center justify-center space-x-2">
                                    <RiComputerFill />
                                    <span>Equipment List</span>{" "}
                                </Link>
                            </li>
                        </ul>
                    ) : (
                        ""
                    )}
                    {isStaff ? (
                        <ul className="flex flex-col items-start justify-center pl-1 font-medium space-y-2">
                            <li>
                                <Link to="/equipmentreviewlist" className="flex items-center justify-center space-x-2">
                                    <BiSearchAlt />
                                    <span> Equipment Review List</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/issueslist" className="flex items-center justify-center space-x-2">
                                    <AiOutlineIssuesClose /> <span>Issues List</span>
                                </Link>
                            </li>
                        </ul>
                    ) : (
                        ""
                    )}
                </div>
            </aside>
            {modalStatus && <Modal />}
        </div>
    );
}

export default Dashboard;
