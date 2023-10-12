import axios from "../interceptors/axios";
import { createContext, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Filter from "../Components/Filter";
import { toast } from "react-toastify";
export const DateContext = createContext();
function Search() {
    const [didFind, setDidFind] = useState(true);
    const [searchStr, setStr] = useState("");
    const [result, setResult] = useState([]);
    const [descPanel, setDescPanel] = useState(false);
    async function SearchIt(e) {
        try {
            setDescPanel(false);
            e.preventDefault();
            if (searchStr == "") return;
            setDidFind(true);
            const response = await axios.get(`api/search/?query=${searchStr}`);
            if (response?.data.length === 0) {
                setResult([]);
                setDidFind(false);
            } else {
                setResult(Object.entries(response?.data[0]));
                console.log(Object.entries(response?.data[0]));
            }
        } catch (e) {
            toast.error("Server didn't respond");
        }
    }
    function updateContext(result) {
        setResult(result);
    }
    function descDisplay(desc) {
        setDescPanel({ panel: true, value: desc });
    }
    return (
        <>
            <main className="flex flex-col items-center w-full max-w-6xl px-3 py-2 mx-auto">
                <form className="flex items-center justify-center w-full my-8 space-x-3 ">
                    <input type="text" onChange={(e) => setStr(e.target.value)} placeholder="Search" className="w-[20%] border-gray-300 rounded-md" />
                    <button type="submit" className="" onClick={SearchIt}>
                        <AiOutlineSearch />
                    </button>
                    <DateContext.Provider value={{ result, updateContext }}>
                        <Filter />
                    </DateContext.Provider>
                </form>

                {didFind ? (
                    <>
                        {result.map((smallArray, index) => (
                            <div key={index} className="max-w-4xl w-full relative mb-5 overflow-x-auto shadow-md sm:rounded-lg">
                                {Array.isArray(smallArray[1]) && smallArray[1].length != 0 ? (
                                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <caption className="w-full py-2 text-lg font-bold capitalize bg-gray-100 border-b-2 border-gray-400">{smallArray[0]}</caption>
                                        <thead className="w-full text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr className="w-full">
                                                {Object.keys(smallArray[1][0]).map((key, index) => (
                                                    <th scope="row" className=" px-6 py-2  text-center capitalize" key={index}>
                                                        {key}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="w-full">
                                            {smallArray[1].map((obj, index) => (
                                                <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700" key={index}>
                                                    {Object.keys(obj).map((key, index) => (
                                                        <td
                                                            key={index}
                                                            className={`px-6 py-2  text-center  font-medium ${(key.toLowerCase() === "details" || key.toLowerCase() === "description") && "cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline"}`}
                                                            onClick={() => {
                                                                (key.toLowerCase() === "description" || key.toLowerCase() === "details") && descDisplay(obj[key]);
                                                            }}
                                                        >
                                                            {key.toLowerCase() === "details" || key.toLowerCase() === "description" ? "Click here" : obj[key]}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <caption className="w-full py-2 text-lg font-bold capitalize bg-gray-100 border-b-2 border-gray-400">{smallArray[0]}</caption>
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr className="w-full">
                                                {Object.keys(smallArray[1]).map((key, index) => (
                                                    <th className="px-6 py-3 text-center capitalize" key={index}>
                                                        {key}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="w-full">
                                            <tr className="w-full bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                                {Object.keys(smallArray[1]).map((key, index) => (
                                                    <td key={index} className="px-6 py-2 font-medium text-center ">
                                                        {smallArray[1][key]}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="text-lg">No such entries found</div>
                )}
                {descPanel?.panel ? <div>{descPanel.value}</div> : ""}
            </main>
        </>
    );
}

export default Search;
