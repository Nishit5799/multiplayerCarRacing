import React from "react";

const Timer = ({ showInfoPopup, setShowInfoPopup, onInfoClick }) => {
  const infoMessage = `**ENTER NAME**, then

**FOR JOIN ROOM:** Lobby needs to have 2 players before the game can be started (It's for 2 players). You can share this link with your friend so he can join the lobby.

Compete in real-time. The first one to cross the finish line wins the race. Follow the race track carefully.
If you go off the track, your car will fall, and you'll have to start over from the beginning. 

**FOR PRACTICE MODE:** You can play solo, beating your own time in the same track.

**Controls**:
- Desktop: Use W, A, S, D for movement.
- Mobile: Use the Right joystick for acceleration & brake AND left, right buttons to turn.

**Tips**:
1. Avoid sharp turns at high speeds to prevent losing control.
2. Stay focused and follow the track to avoid falling off.
`;

  // Function to convert markdown bold to HTML strong tags
  const formatMessage = (text) => {
    return text
      .split("**")
      .map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
  };

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
        <div className="fixed inset-0 flex items-center justify-center text-center bg-black bg-opacity-50 leading-[4.8vw] sm:leading-none z-[100]">
          <div className="bg-white p-6 rounded-lg text-black max-w-md">
            <h2 className="text-xl font-bold mb-2">Game Information</h2>
            <p className="whitespace-pre-line">{formatMessage(infoMessage)}</p>
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
