import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

const MedicareXCard = ({ userData }) => {
  const downloadCard = () => {
    const card = document.getElementById("medicareX-card");
    html2canvas(card, { scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "MedicareX-Card.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <div
        id="medicareX-card"
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg overflow-hidden shadow-lg p-6"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">MedicareX</h2>
            <p className="text-sm">Health Insurance Card</p>
          </div>
          <img
            src="/medicareX-logo.png"
            alt="MedicareX Logo"
            className="h-12"
          />
        </div>
        <div className="flex mb-4">
          <img
            src={userData.image}
            alt="Profile"
            className="w-24 h-24 rounded-lg mr-4 border-2 border-white"
          />
          <div>
            <h3 className="text-xl font-semibold">{userData.name}</h3>
            <p className="text-sm">ID: {userData.id}</p>
            <p className="text-sm">DOB: {userData.dob}</p>
            <p className="text-sm">Gender: {userData.gender}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div>
            <p className="font-medium">Phone:</p>
            <p>{userData.phone}</p>
          </div>
          <div>
            <p className="font-medium">Email:</p>
            <p className="truncate">{userData.email}</p>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div className="text-xs">
            <p>Valid from: {new Date().toLocaleDateString()}</p>
            <p>
              Valid until:{" "}
              {new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
              ).toLocaleDateString()}
            </p>
          </div>
          <QRCodeCanvas
            value={`https://medicareX.com/patient/${userData.id}`}
            size={64}
            bgColor="transparent"
            fgColor="white"
          />
        </div>
      </div>
      <button
        onClick={downloadCard}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
      >
        Download Card
      </button>
    </div>
  );
};

export default MedicareXCard;
