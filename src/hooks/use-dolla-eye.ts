import { useState } from "react";

export enum EEyeStatus {
  // just normal pupil
  Normal,
  // Bidding1, Bidding5, Bidding10, Bidding50, PrizeLowPTS(PTS <100), PrizeBoth(PTS > 100 / PTS&ticket)
  Mood,
  // PrizeTicket (Only ticket), Bidding100
  IconAnimate,
  // PrizeBTC
  Money,
}

export enum EEyeType {
  Normal,
  Bidding1,
  Bidding5,
  Bidding10,
  Bidding50,
  Bidding100,
  PrizeTicket,
  PrizeLowPTS,
  PrizeBoth,
  PrizeBTC,
}

export interface IEyeTypeConfig {
  pupilSize: number;
  type: EEyeType;
  status: EEyeStatus;
  icon?: string;
  iconSize?: [number, number];
  animation?: any;
}

export const EyeTypeMap: Record<EEyeType, IEyeTypeConfig> = {
  [EEyeType.Normal]: {
    pupilSize: 20,
    status: EEyeStatus.Normal,
    type: EEyeType.Normal,
  },
  [EEyeType.Bidding1]: {
    pupilSize: 40,
    status: EEyeStatus.Mood,
    icon: "/logo-eye/bidding1.svg",
    iconSize: [6, 30],
    type: EEyeType.Bidding1,
    animation: {
      initial: {
        scaleX: 1,
        scaleY: 1,
      },
      animate: {
        scaleX: [1, 0.1, 1],
        scaleY: [1, 0.5, 1],
      },
      transition: {
        times: [0, 0.3, 1],
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  [EEyeType.Bidding5]: {
    pupilSize: 40,
    status: EEyeStatus.Mood,
    icon: "/logo-eye/bidding5.svg",
    iconSize: [20, 29],
    type: EEyeType.Bidding5,
    animation: {
      initial: {
        scale: 1,
        rotate: 0,
      },
      animate: {
        scale: [0, 1, 0.3, 1, 0],
        rotate: [0, 0, 180, 360, 360],
      },
      transition: {
        times: [0, 0.2, 0.4, 0.8, 1],
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  [EEyeType.Bidding10]: {
    pupilSize: 40,
    status: EEyeStatus.Mood,
    icon: "sparkling",
    type: EEyeType.Bidding10,
  },
  [EEyeType.Bidding50]: {
    pupilSize: 40,
    status: EEyeStatus.Mood,
    icon: "/logo-eye/bidding50.svg",
    iconSize: [25, 22],
    type: EEyeType.Bidding50,
    animation: {
      initial: {
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
      },
      animate: {
        scaleX: [0, 1, 0.5, 1, 0],
        scaleY: [0, 1, 0.6, 1, 0],
        rotate: [0, -5, 0, 5, 0],
      },
      transition: {
        times: [0, 0.2, 0.4, 0.6, 1],
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  [EEyeType.Bidding100]: {
    pupilSize: 0,
    status: EEyeStatus.IconAnimate,
    type: EEyeType.Bidding100,
    icon: "/logo-eye/eye-panic.svg",
    iconSize: [72, 72],
    animation: {
      initial: {
        scale: 1,
        rotate: 0,
        translateX: 0,
        translateY: 0,
      },
      animate: {
        rotate: [0, 5, -5, 3, -3, 0],
        translateX: [0, 4, -2, 3, -1, 0],
        translateY: [0, -3, 1, -2, 0, 0],
      },
      transition: {
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  [EEyeType.PrizeTicket]: {
    pupilSize: 0,
    status: EEyeStatus.IconAnimate,
    icon: "/logo-eye/prize-none.svg",
    iconSize: [62, 62],
    type: EEyeType.PrizeTicket,
    animation: {
      initial: {
        rotate: 0,
      },
      animate: {
        rotate: [0, 360],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
  [EEyeType.PrizeLowPTS]: {
    pupilSize: 40,
    status: EEyeStatus.Mood,
    icon: "sparkling",
    type: EEyeType.PrizeLowPTS,
    animation: {
      initial: {
        translateY: 0,
      },
      animate: {
        translateY: [0, -10, 0],
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  [EEyeType.PrizeBoth]: {
    pupilSize: 40,
    status: EEyeStatus.Mood,
    icon: "sparkling",
    type: EEyeType.PrizeBoth,
    animation: {
      style: {
        rotate: 180,
      },
      initial: {
        translateY: 0,
      },
      animate: {
        translateY: [0, 10, 0],
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  [EEyeType.PrizeBTC]: {
    pupilSize: 0,
    status: EEyeStatus.Money,
    icon: "/logo-eye/prize-btc.svg",
    iconSize: [34, 40],
    type: EEyeType.PrizeBTC,
    animation: {
      initial: {
        backgroundColor: "#FFF3D4",
      },
      animate: {
        backgroundColor: ["#FFF3D4", "#D8FFd4", "#D4FBFF", "#DED4FF", "#FFD4E9", "#FFF3D4"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
};

export function useDollaEye() {
  const [currentEye, setCurrentEye] = useState<IEyeTypeConfig>(EyeTypeMap[EEyeType.Normal]);

  return {
    currentEye,
    setCurrentEye,
  };
}
