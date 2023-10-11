import { useContext, useState } from "react";
import { DateContext } from "../pages/Search";
function Filter() {
    const [show, setShow] = useState(false);
    const { result, updateContext } = useContext(DateContext);
    const [date, setDate] = useState({ from: "", to: "" });
    let dateData = result;
    function onClick(e) {
        e.preventDefault();
        const res = dateData.map((bigArray, index) => {
            const arrayWithDate = bigArray[1].find((item) => Object.keys(item).some((key) => key.includes("date")));
            if (arrayWithDate) return dateData[index];
        });

        let result = res.filter((item) => {
            if (item != undefined) return item;
        });
        const date1 = new Date(date.from);
        const date2 = new Date(date.to);
        // console.log(result);

        result = result.map((bigArray) => {
            let [key, innerArray] = bigArray;
            let out = innerArray.filter((item) => {
                for (const key in item) {
                    if (key.includes("date")) {
                        let formDate = new Date(item[key]);
                        if (formDate > date1 && formDate < date2) return true;
                    }
                }
            });
            return [key, out];
        });

        console.log(result);
        updateContext(result);
    }
    function onChange(e) {
        e.preventDefault();
        console.log(e.target.value);
        setDate((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }

    return (
        <>
            <main className="relative">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setShow(!show);
                    }}
                    className="px-2 font-semibold bg-slate-200 rounded-md"
                >
                    Filter
                </button>

                {show && (
                    <div className="w-20 h-20 my-2">
                        <input type="date" className="rounded-md border-gray-300" id="from" onChange={onChange} />
                        <input type="date" id="to" onChange={onChange} className="mt-2 rounded-md border-gray-300" />
                        <button onClick={onClick} className="mt-2 px-2 py-2 bg-blue-500 w-full flex justify-center rounded-md text-white">
                            click
                        </button>
                    </div>
                )}
            </main>
        </>
    );
}

export default Filter;
