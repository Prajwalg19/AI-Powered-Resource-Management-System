import { useContext, useState } from "react";
import { DateContext } from "../pages/Search";
function Filter() {
    const [show, setShow] = useState(false);
    const { result, updateContext } = useContext(DateContext);
    console.log("result boom ", result);
    const [date, setDate] = useState({ from: "", to: "" });
    let dateData = result;
    function onClick(e) {
        e.preventDefault();
        const res = dateData.map((bigArray, index) => {
            let arrayWithDate;
            if (Array.isArray(bigArray[1])) {
                arrayWithDate = bigArray[1].find((item) => Object.keys(item).some((key) => key.includes("date")));
                if (arrayWithDate) return dateData[index];
            } else {
                if (Object.keys(bigArray).some((item) => item.includes("date"))) {
                    arrayWithDate = bigArray;
                    return arrayWithDate;
                }
            }
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
            <main className="relative justify-center  item-center  flex space-x-2 ">
                <div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShow(!show);
                        }}
                        className="px-2  font-semibold bg-slate-200 rounded-md"
                    >
                        Filter
                    </button>
                </div>

                {show && (
                    <div className="w-48 h-20 my-2 space-x-2 ">
                        <input type="date" className="border-gray-300 rounded-md w-1/2" id="from" onChange={onChange} />
                        <input type="date" id="to" onChange={onChange} className="mt-2 w-1/2 border-gray-300 rounded-md" />
                        <button onClick={onClick} className="flex justify-center  px-2 w-1/2 items-center py-2 mt-2 text-white bg-blue-500 rounded-md">
                            click
                        </button>
                    </div>
                )}
            </main>
        </>
    );
}

export default Filter;
