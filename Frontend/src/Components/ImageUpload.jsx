import { useEffect, useState } from "react";
import axios from "../interceptors/axios";
function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState({
    ori: [],
  });
  const { ori } = data;
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    async function getLabs() {
      let response = await axios.get("api/user/department/");
      setData((prev) => ({
        ...prev,
        ori: response?.data,
      }));
    }
    getLabs();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);
    console.log(formData);

    try {
      const response = await axios.post("api/user/upload_image/", formData);
      const response2 = await axios.post("api/user/ocr/", {
        path: "uploaded_images/",
        selection: data.originator,
      });

      setLoading(false);

      if (response.data) {
        console.log("Image uploaded successfully");
      } else {
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col w-full max-w-md p-2 border-2 border-slate-400 gap-3">
      <div className="flex p-2 gap-2">
        <input
          required
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="p-2"
        />
        <select
          required
          className="py-3 text-center bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          value={data.originator}
          onChange={(e) =>
            setData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
          }
          id="originator"
        >
          <option value="">Originator</option>
          {ori?.map((item, index) => (
            <option key={index} value={item.department_number}>
              {item.department_name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full p-2 text-white bg-blue-600 rounded-md "
        onClick={handleSubmit}
      >
        {loading ? "Processing..." : "Upload Image"}
      </button>
    </form>
  );
}

export default ImageUpload;
