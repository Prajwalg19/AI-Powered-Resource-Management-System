import axios from "axios";
function Util() {
    async function get() {
        let a = await axios.get("http://localhost:8000/api/user/Apparatus/");
        let b = await axios.get("http://localhost:8000/api/user/equipment/");
        a = a.data;
        b = b.data;
        let quantity = a;
        let residual = b;
    }
    get();
    return (
        <div>
            <input type="number" placeholder="Number of batches" />
            <input type="number" placeholder="Number of students" />
        </div>
    );
}

export default Util;
