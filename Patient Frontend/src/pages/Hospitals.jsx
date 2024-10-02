import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Hospitals = () => {
  const navigate = useNavigate();
  const { hospitals, backendUrl } = useContext(AppContext);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-2">Our Hospitals</h1>
      <p className="text-gray-600 mb-6">
        Select a hospital to see available doctors.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hospital) => (
          <div
            key={hospital._id}
            onClick={() => {
              navigate(
                `/doctors/hospital/${encodeURIComponent(hospital.name)}`
              );
              scrollTo(0, 0);
            }}
            className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 bg-white shadow-sm hover:shadow-md"
          >
            <img
              className="h-48 w-full object-cover"
              src={`${hospital.image}`}
              alt={hospital.name}
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-[#262626] text-lg font-medium">
                  {hospital.name}
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {hospital.type}
                </span>
              </div>
              <p className="text-[#5C5C5C] text-sm mb-2">{hospital.address}</p>
              <div className="flex justify-between items-center">
                <p className="text-[#5C5C5C] text-sm">
                  {hospital.totalDoctors} Doctors Available
                </p>
                <button className="text-blue-600 text-sm hover:underline">
                  View Doctors
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hospitals;
