import { useSelector } from "react-redux";

function Panel({ children, departments, saveFile }) {
  const store = useSelector((store) => {
    return store.modal;
  });
  return (
    <div className="w-full px-14">
      {children}
      {departments && departments.length != 0 ? (
        <div className="z-40 flex justify-center">
          <button
            className="px-2 py-1 mt-2 mb-3 font-semibold text-white bg-blue-500 cursor-pointer hover:bg-blue-600 hover:shadow-md rounded-md"
            onClick={() => saveFile()}
          >
            Print
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Panel;
