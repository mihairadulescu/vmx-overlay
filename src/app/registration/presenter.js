import React from 'react';

const Presenter = React.forwardRef(({ data }, ref) => (
  <div
    ref={ref}
    className="border border-gray-300 rounded-lg p-4 flex flex-col items-center overflow-hidden bg-white"
    style={{ width: '4in', height: '3in', color: "black" }}
  >

    {/* QR Code and Details */}
    <div className="flex flex-row items-center w-full">
     

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
