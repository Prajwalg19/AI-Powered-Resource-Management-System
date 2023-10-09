import axios from "../interceptors/axios";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
function Search() {
    const [didFind, setDidFind] = useState(true);
    const [searchStr, setStr] = useState("");
    const [result, setResult] = useState([]);
    async function SearchIt(e) {
        e.preventDefault();
        if (searchStr == "") return;
        setDidFind(true);
        const response = await axios.get(`api/search/?query=${searchStr}`);
        let res = Object.entries(response.data);
        let ans = res.filter((item) => {
            if (item[1].length !== 0) {
                return true;
            }
        });
        setResult(ans);
        if (ans.length === 0) {
            setDidFind(false);
        }
    }

    return (
        <>
            <main className="py-2 max-w-6xl w-full mx-auto flex px-3 flex-col items-center">
                <form className="flex space-x-3 my-8 w-full justify-center items-center ">
                    <input type="text" onChange={(e) => setStr(e.target.value)} placeholder="Search" className="w-[20%] border-gray-300 rounded-md" />
                    <button type="submit" className="" onClick={SearchIt}>
                        <AiOutlineSearch />
                    </button>
                </form>

                {didFind ? (
                    result?.map((bigArray, index) => (
                        <table key={index} className="justify-between flex flex-col items-center border-x-0 border-y-0 mt-3 mb-6 w-full ">
                            <caption className="py-2 font-bold text-lg capitalize flex w-full justify-center">{bigArray[0]}</caption>
                            <tbody className="">
                                <tr>
                                    {Object.keys(bigArray[1][0]).map((header, index) => (
                                        <th className="px-2 text-center" key={index}>
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                                {bigArray[1].map((miniArray, index) => (
                                    <tr key={index} className="">
                                        {Object.values(miniArray).map((obj, index) => (
                                            <td key={index} className="px-2 text-center">
                                                {obj}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ))
                ) : (
                    <div className="text-lg">No such entries found</div>
                )}
            </main>
        </>
    );
}

export default Search;
