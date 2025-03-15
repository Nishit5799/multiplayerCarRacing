import localFont from "next/font/local";
import "./globals.css";
import { SocketProvider } from "@/context/SocketContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "NISHKART | COUNTDOWN BEGINS",
  description: "Complete the race with your best time",
  icons: {
    icon: "/fav.png", // Path to your favicon in the public folder
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SocketProvider>{children}</SocketProvider>
        <ToastContainer
          position="top-center"
          autoClose={2000} // Toast will close after 2 seconds
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          style={{ zIndex: 9999 }} // Ensure the toast is above all other elements
        />
      </body>
    </html>
  );
}
