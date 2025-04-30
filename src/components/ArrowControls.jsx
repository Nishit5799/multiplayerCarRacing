import React from "react";

const ArrowControls = ({ onLeft, onRight, disabled, isPlayer1 }) => {
  return (
    <div className="fixed bottom-5 left-5 flex gap-4 z-[1000] sm:hidden no-select">
      <button
        className={`arrow-btn w-16 h-16 rounded-lg flex items-center justify-center text-3xl font-bold ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-white bg-opacity-50 active:bg-gray-600 active:text-white"
        }`}
        onPointerDown={!disabled ? onLeft : undefined}
        onPointerUp={!disabled ? () => onLeft(0) : undefined}
        onPointerLeave={!disabled ? () => onLeft(0) : undefined}
        onTouchStart={!disabled ? onLeft : undefined}
        onTouchEnd={!disabled ? () => onLeft(0) : undefined}
      >
        ←
      </button>
      <button
        className={`arrow-btn w-16 h-16 rounded-lg flex items-center justify-center text-3xl font-bold ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-white bg-opacity-50 active:bg-gray-600 active:text-white"
        }`}
        onPointerDown={!disabled ? onRight : undefined}
        onPointerUp={!disabled ? () => onRight(0) : undefined}
        onPointerLeave={!disabled ? () => onRight(0) : undefined}
        onTouchStart={!disabled ? onRight : undefined}
        onTouchEnd={!disabled ? () => onRight(0) : undefined}
      >
        →
      </button>
    </div>
  );
};

export default ArrowControls;
