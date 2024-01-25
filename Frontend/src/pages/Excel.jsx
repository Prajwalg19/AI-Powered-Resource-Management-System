import { useState } from "react";
import axios from "../interceptors/axios";
import { toast } from "react-toastify";

function ExcelUploadComponent({ fileName }) {
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
      const response = await axios.post(`/api/user/${fileName}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response?.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.error(response.response.data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex justify-between my-4">
      <input
        type="file"
        className="rounded-md"
        accept=".xls,.xlsx"
        onChange={handleFileChange}
      />
      <button
        onClick={handleFileUpload}
        className="px-2 border-2 border-black hover:bg-black hover:text-white duration-100 rounded-md"
      >
        Upload Excel
      </button>
    </div>
  );
}

export default ExcelUploadComponent;
