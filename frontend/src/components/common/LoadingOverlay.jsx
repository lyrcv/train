import React from "react";
import { ClipLoader } from "react-spinners";

const LoadingOverlay = ({ loading, children, message = "Đang tải dữ liệu..." }) => {
  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex flex-col justify-center items-center z-50">
          <ClipLoader color="#2563eb" size={50} />
          <p className="mt-4 text-blue-600 text-lg font-semibold">{message}</p>
        </div>
      )}
      <div className={loading ? "opacity-40 pointer-events-none select-none" : ""}>
        {children}
      </div>
    </div>
  );
};

export default LoadingOverlay;
