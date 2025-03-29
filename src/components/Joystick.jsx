import React, { useRef, useState, useEffect } from "react";

const Joystick = ({ onMove, disabled }) => {
  const joystickRef = useRef(null);
  const thumbstickRef = useRef(null);
  const touchIdRef = useRef(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const [thumbstickPosition, setThumbstickPosition] = useState({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    if (disabled) return;
    e.preventDefault();
    if (touchIdRef.current === null) {
      const touch = e.touches[0];
      touchIdRef.current = touch.identifier;
      const rect = joystickRef.current.getBoundingClientRect();
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (disabled) return;
    e.preventDefault();
    if (touchIdRef.current !== null) {
      const touch = Array.from(e.touches).find(
        (t) => t.identifier === touchIdRef.current
      );
      if (touch) {
        const deltaX = touch.clientX - centerRef.current.x;
        const deltaY = touch.clientY - centerRef.current.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = joystickRef.current.offsetWidth / 3; // Reduced max distance for better control

        const angle = Math.atan2(deltaY, deltaX);
        const force = Math.min(distance / maxDistance, 1);

        // Calculate normalized values (-1 to 1) for both axes
        const normalizedX = deltaX / maxDistance;
        const normalizedY = deltaY / maxDistance;

        // Clamp the values between -1 and 1
        const clampedX = Math.max(-1, Math.min(1, normalizedX));
        const clampedY = Math.max(-1, Math.min(1, normalizedY));

        // Update thumbstick position (limited to maxDistance)
        const limitedDistance = Math.min(distance, maxDistance);
        const thumbstickX = (deltaX / distance) * limitedDistance;
        const thumbstickY = (deltaY / distance) * limitedDistance;

        setThumbstickPosition({
          x: isNaN(thumbstickX) ? 0 : thumbstickX,
          y: isNaN(thumbstickY) ? 0 : thumbstickY,
        });

        // Send normalized values to parent
        onMove({
          x: clampedX,
          y: -clampedY, // Invert Y axis for more intuitive control (up = forward)
        });
      }
    }
  };

  const handleTouchEnd = () => {
    if (disabled) return;
    touchIdRef.current = null;
    setThumbstickPosition({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  useEffect(() => {
    const joystickElement = joystickRef.current;
    if (!joystickElement) return;

    const options = { passive: false };

    joystickElement.addEventListener("touchstart", handleTouchStart, options);
    joystickElement.addEventListener("touchmove", handleTouchMove, options);
    joystickElement.addEventListener("touchend", handleTouchEnd, options);
    joystickElement.addEventListener("touchcancel", handleTouchEnd, options);

    return () => {
      joystickElement.removeEventListener("touchstart", handleTouchStart);
      joystickElement.removeEventListener("touchmove", handleTouchMove);
      joystickElement.removeEventListener("touchend", handleTouchEnd);
      joystickElement.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [disabled]);

  return (
    <div
      ref={joystickRef}
      className="fixed bottom-5 left-5 w-24 h-24 rounded-full bg-white bg-opacity-20 touch-none flex items-center justify-center select-none"
      style={{
        display: disabled ? "none" : "flex",
        border: "2px solid rgba(255, 255, 255, 0.5)",
      }}
    >
      <div
        ref={thumbstickRef}
        className="w-12 h-12 rounded-full bg-white bg-opacity-70 select-none transform transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${thumbstickPosition.x}px, ${thumbstickPosition.y}px)`,
        }}
      ></div>
    </div>
  );
};

export default Joystick;
