// src/components/Experience.jsx
"use client";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  KeyboardControls,
  OrthographicCamera,
} from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Racetrack from "./Racetrack";
import CarController from "./CarController";
import Joystick from "./Joystick";
import Background from "./Background";

import gsap from "gsap";
import { useSocket } from "../context/SocketContext";

const keyboardMap = [
  {
    name: "forward",
    keys: ["ArrowUp", "KeyW"],
  },
  {
    name: "backward",
    keys: ["ArrowDown", "KeyS"],
  },
  {
    name: "left",
    keys: ["ArrowLeft", "KeyA"],
  },
  {
    name: "right",
    keys: ["ArrowRight", "KeyD"],
  },
  {
    name: "run",
    keys: ["Shift"],
  },
];

const Experience = () => {
  const socket = useSocket(); // This will use the URL from SocketContext
  const shadowCameraRef = useRef();
  const [joystickInput, setJoystickInput] = useState({ x: 0, y: 0 });
  const [bestTime, setBestTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const [showUsernamePopup, setShowUsernamePopup] = useState(false);
  const [winner, setWinner] = useState(null);
  const [loser, setLoser] = useState(null);
  const timerRef = useRef(null);
  const carControllerRef1 = useRef();
  const carControllerRef2 = useRef();
  const blockRef = useRef();
  const hasStarted = useRef(false);
  const welcomeTextRef = useRef();

  useEffect(() => {
    if (showWelcomeScreen) {
      const letters = Array.from(welcomeTextRef.current.children);
      gsap.fromTo(
        letters,
        { y: -10 },
        {
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "ease.in",
          repeat: -1,
          repeatDelay: 0.5,
          yoyo: true,
        }
      );
    }
  }, [showWelcomeScreen]);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 0.1);
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const handleRaceEnd = useCallback(
    (isPlayer1) => {
      setIsTimerRunning(false);
      clearInterval(timerRef.current);

      if (!players || players.length < 2) return;

      const winnerPlayer = isPlayer1 ? players[0] : players[1];
      const loserPlayer = isPlayer1 ? players[1] : players[0];

      setWinner(winnerPlayer);
      setLoser(loserPlayer);

      if (winnerPlayer.id === socket?.id) {
        setPopupMessage(`You won, ${winnerPlayer.name}! Well played!`);
        carControllerRef1.current?.playVictorySound(); // Play victory sound for the winner
        carControllerRef2.current?.playLostSound(); // Play lost sound for the loser
      } else {
        setPopupMessage(
          `You lost, ${loserPlayer.name}. ${winnerPlayer.name} won the race. Let's try again!`
        );
        carControllerRef2.current?.playVictorySound(); // Play victory sound for the winner
        carControllerRef1.current?.playLostSound(); // Play lost sound for the loser
      }

      setShowPopup(true);
      hasStarted.current = false;
    },
    [players, socket]
  );

  const handleStart = useCallback(() => {
    if (!hasStarted.current) {
      setCurrentTime(0);
      setIsTimerRunning(true);
      hasStarted.current = true;
    }
  }, []);

  const handleReset = useCallback(() => {
    setCurrentTime(0);
    setIsTimerRunning(false);
    setShowPopup(false);
    setWinner(null);
    setLoser(null);
    hasStarted.current = false;
    if (carControllerRef1.current) {
      carControllerRef1.current.respawn();
    }
    if (carControllerRef2.current) {
      carControllerRef2.current.respawn();
    }
    if (blockRef.current) {
      blockRef.current.setEnabled(true);
    }
    setShowWelcomeScreen(true);
    setPlayers([]);
    setIsReady(false);
    setHasJoinedRoom(false);
    setPlayerName("");
    socket.emit("restartGame");
    window.location.reload();
  }, [socket]);

  const handleInfoClick = useCallback(() => {
    setShowInfoPopup(true);
  }, []);

  const handlePlayGame = useCallback(() => {
    setShowWelcomeScreen(false);
    setIsGameStarted(true);
  }, []);

  const handleJoinRoom = () => {
    if (playerName.trim() !== "" && !hasJoinedRoom) {
      socket.emit("joinRoom", playerName);
      setHasJoinedRoom(true);
    }
  };

  const handleReady = () => {
    socket.emit("playerReady", playerName);
    setIsReady(true);
  };

  useEffect(() => {
    if (socket) {
      socket.on("updatePlayers", (players) => {
        console.log("Received updatePlayers event:", players);
        setPlayers(players);

        if (players.length === 2 && players[0].name === players[1].name) {
          setShowUsernamePopup(true);
        } else {
          setShowUsernamePopup(false);
        }
      });

      socket.on("startGame", () => {
        let count = 3;
        setCountdown(count);
        const interval = setInterval(() => {
          count -= 1;
          setCountdown(count);
          if (count === 0) {
            clearInterval(interval);
            setShowWelcomeScreen(false);
            setIsGameStarted(true);
          }
        }, 1000);
      });

      socket.on("resetGame", () => {
        window.location.reload();
      });
    }
  }, [socket]);

  const memoizedKeyboardMap = useMemo(() => keyboardMap, []);

  return (
    <>
      <KeyboardControls map={memoizedKeyboardMap}>
        <Canvas camera={{ position: [0, 5, 10], fov: 60 }} shadows>
          <directionalLight
            intensity={0.5}
            castShadow
            position={[-15, 20, 0]}
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-bias={-0.0005}
            shadow-camera-left={-500}
            shadow-camera-right={500}
            shadow-camera-top={500}
            shadow-camera-bottom={-500}
            shadow-camera-near={1}
            shadow-camera-far={2000}
          >
            <OrthographicCamera
              left={-500}
              right={500}
              top={500}
              bottom={-500}
              near={1}
              far={2000}
              ref={shadowCameraRef}
              attach={"shadow-camera"}
            />
          </directionalLight>
          <Background />
          <Physics>
            <Racetrack />
            <RigidBody
              type="fixed"
              colliders={false}
              sensor
              name="space"
              position-y={-21}
            >
              <CuboidCollider args={[500, 0.5, 500]} />
            </RigidBody>
            <RigidBody
              type="fixed"
              colliders={false}
              sensor
              name="raceEnd"
              position={[-0.5, -2, 11]}
            >
              <CuboidCollider args={[15, 5, 0.1]} />
            </RigidBody>
            <RigidBody
              type="fixed"
              colliders={false}
              name="block"
              position={[-0.5, -2, 7]}
              ref={blockRef}
            >
              <CuboidCollider args={[15, 5, 0.1]} />
            </RigidBody>
            {isGameStarted && (
              <>
                <CarController
                  ref={carControllerRef1}
                  joystickInput={joystickInput}
                  onRaceEnd={handleRaceEnd}
                  onStart={handleStart}
                  disabled={!isGameStarted}
                  position={[5, 0, 0]}
                  isPlayer1={players[0]?.id === socket.id}
                />
                <CarController
                  ref={carControllerRef2}
                  joystickInput={joystickInput}
                  onRaceEnd={handleRaceEnd}
                  onStart={handleStart}
                  disabled={!isGameStarted}
                  position={[-5, 0, 0]}
                  isPlayer1={players[1]?.id === socket.id}
                />
              </>
            )}
          </Physics>
        </Canvas>
      </KeyboardControls>

      {showWelcomeScreen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 start">
          <div className="text-center">
            <div
              ref={welcomeTextRef}
              className="font-choco tracking-wider text-5xl font-bold text-yellow-400 mb-8 flex"
            >
              {"Welcome to Nishkart".split("").map((letter, index) => (
                <span key={index} className="inline-block">
                  {letter === " " ? "\u00A0" : letter}
                </span>
              ))}
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="px-4 py-2 mb-4 rounded-lg"
              />
            </div>
            <div>
              <button
                onClick={handleJoinRoom}
                disabled={hasJoinedRoom}
                className={`px-8 py-2 font-choco tracking-widest bg-orange-500 text-white sm:text-2xl text-3xl font-bold rounded-lg ${
                  hasJoinedRoom
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-orange-600"
                } transition-colors`}
              >
                JOIN ROOM
              </button>
            </div>
            <div
              onClick={handleInfoClick}
              className="mt-4 py-2 font-choco text-white sm:text-2xl text-3xl tracking-widest cursor-pointer bg-blue-500 hover:bg-blue-600 sm:w-[50%] w-[57%] h-[30%] mx-auto rounded-lg transition-colors"
            >
              HOW TO PLAY?
            </div>
          </div>
        </div>
      )}

      {!isGameStarted && (
        <div className="fixed bottom-5 right-5 bg-black bg-opacity-50 text-white p-4 rounded-lg z-[100]">
          <h3>Lobby</h3>
          {players.map((player, index) => (
            <div key={index}>
              {player.name} {player.isReady ? "✅" : "❌"}
            </div>
          ))}
          {players.length === 2 && !isReady && (
            <button
              onClick={handleReady}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              READY
            </button>
          )}
        </div>
      )}

      {countdown !== null && !isGameStarted && (
        <div className="fixed inset-0 flex items-center justify-center z-[101]">
          <div className="w-[80vw] h-[80vw] rounded-full bg-black text-white text-9xl flex items-center justify-center">
            {countdown}
          </div>
        </div>
      )}

      {showUsernamePopup && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-[102]">
          Username already exists! Please choose a different name.
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-[103]">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Race Over!</h2>
            <p className="mb-4">{popupMessage}</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Restart
            </button>
          </div>
        </div>
      )}

      <Joystick
        onMove={setJoystickInput}
        onStart={handleStart}
        disabled={!isGameStarted}
      />
    </>
  );
};

export default Experience;
