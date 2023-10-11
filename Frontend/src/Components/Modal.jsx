import { closeModal } from "../features/modalSlice.js";
import { logOut } from "../features/auth/userSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

function Modal() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    function LOGOUT() {
        dispatch(closeModal());
        dispatch(logOut());
        navigate("/login");
    }
    return (
        <div className="z-50">
            <div className=" fixed top-0   right-0 left-0 bottom-0 bg-black opacity-25 "></div>
            <div className="flex z-50 justify-center fixed items-center top-0 right-0 left-0 bottom-0  px-4">
                <div className="relative w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow ">
                        <div className="p-6 text-center">
                            <h3 className=" mb-5 text-lg  text-gray-500 font-semibold ">Your session has expired</h3>
                            <button
                                type="button"
                                className=" hover:text-white text-red-700 bg-white border-red-600 border-2 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg text-sm inline-flex items-center font-semibold px-5 py-2.5 text-center mr-2 uppercase tracking-widest transition ease-in-out"
                                onClick={() => {
                                    LOGOUT();
                                }}
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
