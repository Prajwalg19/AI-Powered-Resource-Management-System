import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Components/Button";
function Issue() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        experiment: "",
        lab: "",
        number_of_equipments: "",
        details: "",
    });

    const { experiment, lab, number_of_equipments, details } = data;
    function onChange(e) {
        e.preventDefault();
        setData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    }
    async function onSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/api/EquipmentIssues/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            console.log(response);
            toast.success("Details Recorded");
            navigate("/");
        } catch (error) {
            toast.dismiss();
            toast.error("Enter the Correct Details");
        }
    }

    const [errors, setErrors] = useState({
        experiment: "",
        lab: "",
        number_of_equipments: "",
        details: "",
      });

      function onChange(e) {
        const { id, value } = e.target;
        let error = "";
      
        switch (id) {
          case "experiment":
            if (!value.trim()) {
              error = "Experiment Name is required";
            }
            break;
      
          case "lab":
            if (!value.trim()) {
              error = "Lab Name is required";
            }
            break;
      
          case "number_of_equipments":
            if (!value.trim()) {
              error = "Number of Equipments is required";
            } else if (isNaN(value) || parseInt(value) <= 0) {
              error = "Number of Equipments must be a positive number";
            }
            break;
      
          case "details":
            if (!value.trim()) {
              error = "Details is required";
            }
            break;
      
          default:
            break;
        }
      
        // Update the state with the error for the current field
        setErrors((prevErrors) => ({
          ...prevErrors,
          [id]: error,
        }));
      
        // Update the data state as before
        setData((prev) => ({
          ...prev,
          [id]: value,
        }));
      }
      
    return (
        <div className="my-3 px-4 ">
            <h1 className="font-bold text-center  text-3xl py-10">Equipment Issues</h1>
            <form className="max-w-lg mx-auto flex flex-col  w-full justify-center items-center " onSubmit={onSubmit}>
                <input type="text" placeholder="Experiment Name" value={experiment} className=" border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" id="experiment" onChange={onChange} />{errors.experiment && <span className="text-red-600">{errors.experiment}</span>}

                <input type="text" onChange={onChange} value={lab} id="lab" placeholder="Lab Name" className="border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" />{errors.lab && <span className="text-red-600">{errors.lab}</span>}

                <input type="text" id="number_of_equipments" placeholder="Number of Equipments" onChange={onChange} value={number_of_equipments} className="border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" />{errors.number_of_equipmentsexperiment && <span className="text-red-600">{errors.number_of_equipments}</span>}

                <textarea minLength="10" rows="2" onChange={onChange} value={details} id="details" className="border border-gray-300 w-full rounded-md transition ease-in-out py-3 mb-4 px-2" placeholder="Details"></textarea>{errors.details && <span className="text-red-600">{errors.details}</span>}
                <button
  type="submit"
  className="px-8 py-2 text-white bg-blue-600 hover:bg-blue-700 transition ease-in-out rounded-md"
  disabled={
    !!Object.values(errors).find((error) => error) // Disable if any error is not an empty string
  }
>
  Submit
</button>

            </form>
        </div>
    );
}

export default Issue;
