import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const RollingDigit = ({ value, char }: any) => {
  const [currentValue, setCurrentValue] = useState(value || "0");

  useEffect(() => {
    if (value !== currentValue) {
      setCurrentValue(value);
    }
  }, [value]);

  if (char) {
    return (
      <span className="inline-block align-bottom overflow-hidden">
        <span className="inline-block text-[20px] font-[400] leading-[100%] text-white">
          {char}
        </span>
      </span>
    );
  }

  return (
    <span className="inline-block align-bottom overflow-hidden relative">
      <span className="invisible text-[20px] font-[400] leading-[100%] text-white">
        {currentValue}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={currentValue}
          className="absolute top-0 left-0 text-[20px] font-[400] leading-[100%] text-white"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {currentValue}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const RollingDigitDisplay = ({ value, prefixSymbol }: any) => {
  const valueParts = value.split(".");
  const integer = valueParts[0] || "0";
  const decimals = valueParts[1] || "";

  const intGroups = integer.split(",");
  const intElements: any = [];
  intGroups.forEach((group: any, gi: any) => {
    for (let i = 0; i < group.length; i++) {
      intElements.push(
        <RollingDigit key={`${gi}${group.length - i}`} value={group[i]} />
      );
    }
    if (gi < intGroups.length - 1) {
      intElements.push(<RollingDigit key={`${gi},`} char="," />);
    }
  });

  const decimalElements = decimals
    ? [
        <RollingDigit key="." char="." />,
        ...decimals
          .split("")
          .map((digit: any, i: any) => (
            <RollingDigit key={decimals.length - i} value={digit} />
          ))
      ]
    : [];

  return (
    <span
      className={clsx(
        "flex items-baseline text-[20px] font-[400] leading-[100%] text-white"
      )}
    >
      {prefixSymbol && <span className="">{prefixSymbol}</span>}
      <span className="">{intElements}</span>
      {decimalElements}
    </span>
  );
};

export default RollingDigitDisplay;
