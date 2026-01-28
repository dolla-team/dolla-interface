import Modal from "@/components/modal";
import { motion } from "framer-motion";
import useDocsStore from "@/stores/use-docs";

export default function HowItWorkModal() {
  const { showModal, set } = useDocsStore();
  return (
    <Modal
      isForceNormal={false}
      className="items-end"
      open={showModal}
      onClose={() => set({ showModal: false })}
    >
      <div
        style={{ perspective: "1000px", perspectiveOrigin: "center bottom" }}
      >
        <motion.div
          className="w-[1137px] h-[693px] relative"
          initial={{
            rotateX: 90,
            opacity: 0
          }}
          animate={{
            rotateX: 0,
            opacity: 1
          }}
          exit={{
            rotateX: 90,
            opacity: 0
          }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
            opacity: { duration: 0.5 }
          }}
          style={{
            transformOrigin: "bottom center",
            transformStyle: "preserve-3d"
          }}
        >
          <button
            onClick={() => {
              window.open("https://docs.dolla.market/", "_blank");
            }}
            className="button absolute z-[3] bottom-[70px] right-[510px] text-[14px] text-black font-[Courier] underline"
          >
            Read more
          </button>
          <img
            src="/how-it-works.png"
            alt="how-it-work"
            className="w-full h-full object-cover relative z-[1]"
          />
          <button
            onClick={() => set({ showModal: false })}
            className="button absolute z-[2] top-[50px] right-[44px] bg-[url('/how-it-works/close.png')] bg-no-repeat bg-center bg-cover w-[14px] h-[14px]"
          />
          <motion.img
            src="/how-it-works/woman-1.png"
            alt="woman-1"
            className="absolute z-[3] bottom-[-10px] right-[-96px] w-[307px] h-[318px] object-cover cursor-pointer"
            whileHover={{
              rotate: [-2, 2],
              transition: {
                duration: 0.3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            style={{
              transformOrigin: "center bottom"
            }}
          />
          <motion.img
            src="/how-it-works/woman-2.png"
            alt="woman-2"
            className="absolute z-[2] top-[20px] left-[34px] w-[305px] h-[266px] object-cover cursor-pointer"
            whileHover={{
              rotate: [-2, 2],
              transition: {
                duration: 0.3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            style={{
              transformOrigin: "center bottom"
            }}
          />
          <motion.img
            src="/how-it-works/tips-1.png"
            alt="tips-1"
            className="absolute z-[2] top-[-2px] left-[330px] w-[360px] h-[175px] object-cover cursor-pointer"
            whileHover={{
              rotate: [-2, 2],
              transition: {
                duration: 0.3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            style={{
              transformOrigin: "center bottom"
            }}
          />
          <motion.img
            src="/how-it-works/tips-2.png"
            alt="tips-2"
            className="absolute z-[2] top-[176px] left-[206px] w-[309px] h-[175px] object-cover cursor-pointer"
            whileHover={{
              rotate: [-2, 2],
              transition: {
                duration: 0.3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            style={{
              transformOrigin: "center bottom"
            }}
          />
          <motion.img
            src="/how-it-works/tips-3.png"
            alt="tips-3"
            className="absolute z-[2] top-[418px] left-[684px] w-[328px] h-[267px] object-cover cursor-pointer"
            whileHover={{
              rotate: [-2, 2],
              transition: {
                duration: 0.3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            style={{
              transformOrigin: "center bottom"
            }}
          />
        </motion.div>
      </div>
    </Modal>
  );
}
