import axios from "../interceptors/axios";
import { createContext, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
// import Filter from "../Components/Filter";
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
        let res = Object.entries(response.data);
        let ans = res.filter((item) => {
            if (item[1].length !== 0) {
                return true;
            }
        });

        console.log(ans);
        setResult(ans);

        if (ans.length === 0) {
            setDidFind(false);
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

                    {
                        // <DateContext.Provider value={{ result, updateContext }}>
                        // <Filter />
                        // </DateContext.Provider>
                    }
                </form>
            </main>
        </>
    );
}

export default Search;
