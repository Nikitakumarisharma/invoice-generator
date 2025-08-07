// components/MidnightCountdown.tsx
import Countdown from "react-countdown";

const getMidnightTime = () => {
  //   const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0); // midnight today
  return midnight;
};

const MidnightCountdown = () => {
  const targetDate = getMidnightTime();

  return (
    <Countdown
      date={targetDate}
      zeroPadTime={2}
      renderer={({ hours, minutes, seconds, completed }) => {
        if (completed) {
          return (
            <span className="text-sm text-red-600 font-semibold">
              Offer expired
            </span>
          );
        }

        return (
          <span className="text-sm text-blue-900 font-semibold">
            {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")} left
          </span>
        );
      }}
    />
  );
};

export default MidnightCountdown;
