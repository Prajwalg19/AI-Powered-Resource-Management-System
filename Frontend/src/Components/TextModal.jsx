import { useState } from "react";

const TextModal = ({ text, eq }) => {
  const [modalVis, setModalVis] = useState(false);
  const handleClick = () => {
    setModalVis(!modalVis);
    console.log("df");
  };
  return (
    <>
      <button
        className="block text-sm font-medium text-center text-blue-500"
        type="button"
        onClick={() => handleClick()}
      >
        Click here
      </button>

      {modalVis && (
        <>
          <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center px-4">
            <div className="relative w-full max-w-2xl max-h-full p-4">
              <div className="relative bg-white rounded-lg shadow-2xl">
                <div className="flex items-center justify-center p-4 border-b rounded-t md:p-5">
                  <h3 className="items-center text-xl font-semibold text-gray-900">
                    {eq}
                  </h3>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    {text}
                  </p>
                </div>
                <div className="flex items-center justify-center p-4 border-t border-gray-200 rounded-b md:p-5 dark:border-gray-600">
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={handleClick}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TextModal;
