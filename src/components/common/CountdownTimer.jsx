import React, { useEffect, useState } from "react";

const CountdownTimer = () => {
  const targetDate = new Date("2025-05-01T00:00:00"); // Target date: 1st May 2025
  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({
          days,
          hours,
          minutes,
          seconds,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 text-white py-1 px-4 text-center flex justify-around">
      <p className="text-sm my-1 hidden md:flex">
        Our product will be live on <strong>1st May 2025</strong>.
      </p>
      <div className="text-sm my-1">
        <span>{timeRemaining.days} Days </span>
        <span>{timeRemaining.hours} Hours </span>
        <span>{timeRemaining.minutes} Minutes </span>
        <span>{timeRemaining.seconds} Seconds</span>
      </div>
      <p className="my-1 hidden md:flex text-sm text-gray-300">
        Stay tuned for the launch!
      </p>
    </div>
  );
};

export default CountdownTimer;
