import axios from "../interceptors/axios";
import { createContext, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Filter from "../Components/Filter";
export const DateContext = createContext();
function Search() {
    const [didFind, setDidFind] = useState(true);
    const [searchStr, setStr] = useState("");
    const [result, setResult] = useState([]);
    const [descPanel, setDescPanel] = useState(false);
    async function SearchIt(e) {
        setDescPanel(false);
        e.preventDefault();
        if (searchStr == "") return;
        setDidFind(true);
        const response = await axios.get(`api/search/?query=${searchStr}`);
        if (response.data.length === 0) {
            setResult([]);
            setDidFind(false);
        } else {
            setResult(Object.entries(response?.data[0]));
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
                            <div key={index}>
                                {Array.isArray(smallArray[1]) ? (
                                    <table className="flex flex-col items-center justify-between w-full mt-3 mb-6 border-x-0 border-y-0 ">
                                        <caption className="flex justify-center w-full py-2 text-lg font-bold capitalize">{smallArray[0]}</caption>
                                        <thead>
                                            <tr>
                                                {Object.keys(smallArray[1][0]).map((key, index) => (
                                                    <th className="capitalize" key={index}>
                                                        {key}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {smallArray[1].map((obj, index) => (
                                                <tr key={index}>
                                                    {Object.keys(obj).map((key, index) => (
                                                        <td key={index}>{obj[key]}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="flex flex-col items-center justify-between w-full mt-3 mb-6 border-x-0 border-y-0 ">
                                        <caption className="flex justify-center w-full py-2 text-lg font-bold capitalize">{smallArray[0]}</caption>
                                        <thead>
                                            <tr>
                                                {Object.keys(smallArray[1]).map((key, index) => (
                                                    <th className="capitalize" key={index}>
                                                        {key}
                                                    </th>
                                                ))}
                                            </tr>

                                            <tr>
                                                {Object.keys(smallArray[1]).map((key, index) => (
                                                    <td key={index}>{smallArray[1][key]}</td>
                                                ))}
                                            </tr>
                                        </thead>
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
