import MidnightCountdown from "@/components/conter";

const OfferBanner = () => {
  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="text-center">
        <p className="text-blue-700 font-medium text-sm mb-1">
          <span className="font-bold">
            Grab <span className="text-red-500 text-base">₹2,000</span> OFF
            instantly!
          </span>{" "}
          Pick Trademark, ISO, Startup India & IEC together
        </p>
        <p className="text-gray-700 text-xs">
          Offer expires in <MidnightCountdown />
        </p>
      </div>
    </div>
  );
};

export default OfferBanner;
