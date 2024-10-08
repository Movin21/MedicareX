import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const Doctors = () => {
  const { speciality, hospital } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors, backendUrl } = useContext(AppContext);

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  const applyFilter = () => {
    let filteredDoctors = [...doctors];

    if (speciality) {
      filteredDoctors = filteredDoctors.filter(
        (doc) => doc.speciality === speciality
      );
    }

    if (hospital) {
      filteredDoctors = filteredDoctors.filter(
        (doc) => doc.hospital === decodeURIComponent(hospital)
      );
    }

    setFilterDoc(filteredDoctors);
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality, hospital]);

  const handleSpecialityClick = (selectedSpeciality) => {
    if (hospital) {
      if (speciality === selectedSpeciality) {
        navigate(`/doctors/hospital/${encodeURIComponent(hospital)}`);
      } else {
        navigate(
          `/doctors/hospital/${encodeURIComponent(
            hospital
          )}/speciality/${selectedSpeciality}`
        );
      }
    } else {
      if (speciality === selectedSpeciality) {
        navigate("/doctors");
      } else {
        navigate(`/doctors/speciality/${selectedSpeciality}`);
      }
    }
    scrollTo(0, 0);
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">
          {hospital
            ? `Doctors at ${decodeURIComponent(hospital)}`
            : "All Doctors"}
        </h1>
        <p className="text-gray-600">
          {speciality
            ? `Showing ${speciality} specialists`
            : "Browse through our specialists"}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-5">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
        >
          Filters
        </button>

        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          {specialities.map((item) => (
            <p
              key={item}
              onClick={() => handleSpecialityClick(item)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === item ? "bg-[#E2E5FF] text-black" : ""
              }`}
            >
              {item}
            </p>
          ))}
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6">
          {filterDoc.map((doctor) => (
            <div
              key={doctor._id}
              onClick={() => {
                navigate(`/appointment/${doctor._id}`);
                scrollTo(0, 0);
              }}
              className="border border-[#ffc9c9] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 shadow-sm hover:shadow-md"
            >
              <img
                className="h-48 w-full object-cover bg-[#ffeaea]"
                src={`${doctor.image}`}
                alt={doctor.name}
              />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    doctor.available ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  <p
                    className={`w-2 h-2 rounded-full ${
                      doctor.available ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></p>
                  <p>{doctor.available ? "Available" : "Not Available"}</p>
                </div>
                <p className="text-[#262626] text-lg font-medium mt-2">
                  {doctor.name}
                </p>
                <p className="text-[#5C5C5C] text-sm">{doctor.speciality}</p>
                <p className="text-[#5C5C5C] text-sm mt-1">{doctor.hospital}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
