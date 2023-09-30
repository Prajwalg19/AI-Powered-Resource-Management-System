import { Modal } from "flowbite";
import { useSelector } from "react-redux";
import Dashboard from "../pages/Dashboard";

function Panel({ children, departments, saveFile }) {
    const store = useSelector((store) => {
        return store.modal;
    });
    const { isOpen } = useSelector((store) => {
        return store.sidePanel;
    });
    return (
        <>
            <div className="flex">
                <Dashboard />

                <div className={` w-full pr-4  ${!isOpen ? " -translate-x-28  transition-transform ease-in-out  " : "-z-10 -translate-x-28  ease-in-out"} `}>
                    {children}
                    {departments && departments.length != 0 ? (
                        <div className=" flex justify-center z-50">
                            <button className="font-semibold mt-2 px-2 py-1 mb-3 text-white bg-blue-500 cursor-pointer hover:bg-blue-600 hover:shadow-md rounded-md " onClick={() => saveFile()}>
                                Print
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </>
    );
}

export default Panel;
