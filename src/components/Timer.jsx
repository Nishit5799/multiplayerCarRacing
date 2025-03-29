import React from "react";

const Timer = ({
  bestTime,
  currentTime,
  onReset,
  showPopup,
  popupMessage,
  showInfoPopup,
  setShowInfoPopup,
  onInfoClick,
}) => {
  const infoMessage = `
Compete against another player in real-time. The first one to cross the finish line wins the race. Follow the race track carefully.
 If you go off the track, your car will fall, and you’ll have to start over from the beginning. Precision is key!

 Tips:
1. Avoid sharp turns at high speeds to prevent losing control.
2. Stay focused and follow the track to avoid falling off.

    Controls:
    - Desktop: Use W, A, S, D for movement.
    - Mobile: Use the on-screen joystick for movement.
  `;

  return (
    <>
      <div className="fixed sm:top-5 sm:left-1/2 right-[80%] top-[2.2%] transform -translate-x-1/2">
        <button
          onClick={onInfoClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-full"
        >
          i
        </button>
      </div>

      {showInfoPopup && (
        <div className="fixed inset-0 flex items-center justify-center text-center bg-black bg-opacity-50 z-[100]">
          <div className="bg-white p-6 rounded-lg text-black max-w-md">
            <h2 className="text-xl font-bold mb-4">Game Information</h2>
            <p className="whitespace-pre-line">{infoMessage}</p>
            <button
              onClick={() => setShowInfoPopup(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Timer;
