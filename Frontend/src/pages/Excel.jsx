import { useState } from "react";
import axios from "../interceptors/axios";
import { toast } from "react-toastify";

function ExcelUploadComponent() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("/api/user/upload-excel/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="flex justify-between ">
            <input type="file" className="rounded-md" accept=".xls,.xlsx" onChange={handleFileChange} />
            <button onClick={handleFileUpload} className="bg-green-300 rounded-md px-2">
                Upload Excel
            </button>
        </div>
    );
}

export default ExcelUploadComponent;
