import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 menit dalam milidetik

const useIdleTimeout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const lastActivity = localStorage.getItem("lastActivity");
    if (
      lastActivity &&
      Date.now() - parseInt(lastActivity) > TIMEOUT_DURATION
    ) {
      localStorage.removeItem("lastActivity");
      navigate("/login");
    }

    const handleActivity = () => {
      localStorage.setItem("lastActivity", Date.now());
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [navigate]);
};

export default useIdleTimeout;
