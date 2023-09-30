import { LiaSaveSolid } from "react-icons/lia";

function btn() {
    return (
        <>
            <button className="w-full py-2 mt-3 text-sm font-semibold text-white uppercase bg-blue-600 rounded-sm shadow box-border hover:bg-blue-700 duration-150 hover:shadow-lg active:bg-blue-800 ">
                <p className="flex items-center justify-center ">
                    Save <LiaSaveSolid className="w-8 text-xl " />
                </p>
            </button>
        </>
    );
}
export default btn;
