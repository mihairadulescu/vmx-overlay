import React from 'react';

const Presenter = React.forwardRef(({ data }, ref) => (
  <div
    ref={ref}
    className="border border-gray-300 rounded-lg p-4 flex flex-col items-center overflow-hidden bg-white"
    style={{ width: '4in', height: '3in', color: "black" }}
  >
    {/* Event Logo */}
    <div className="flex items-center justify-center mb-4">
      <img src="/event-logo.png" alt="Event Logo" style={{ width: 'auto', height: '1in' }} />
    </div>

    {/* QR Code and Details */}
    <div className="flex flex-row items-center w-full">
      {/* Name, Title, City, Country */}
      <div className="flex flex-col items-start text-left px-4 w-1/2">
        <div className="text-lg font-bold">
          <span>{data.name}</span>
        </div>
        <div className="text-md mt-1">
          {data.organisation}
        </div>
      </div>

      {/* QR Code */}
      {data.qrCode && (
        <div className="flex justify-end mt-2 px-4 w-1/2">
          <img src={data.qrCode} alt="QR Code" style={{ width: '80%' }} />
        </div>
      )}
    </div>
  </div>
));

Presenter.displayName = 'Presenter';

export default Presenter;
