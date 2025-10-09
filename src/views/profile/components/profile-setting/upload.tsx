import { useState, useCallback, useRef } from "react";
import Cropper, { Area } from "react-easy-crop";
import Modal from "@/components/modal";
import Button from "@/components/button";
import clsx from "clsx";
import ModalClose from "@/components/button/modal-close";

interface AvatarUploadProps {
  open: boolean;
  onClose: () => void;
  onSave: (croppedImage: Blob) => void;
  currentAvatar?: string;
}

// Helper function to create image from URL
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

// Helper function to get cropped image
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Set canvas size to match the crop area
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    }, "image/jpeg");
  });
}

export default function AvatarUpload({
  open,
  onClose,
  onSave,
  currentAvatar
}: AvatarUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  }, []);

  // Handle crop complete
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // Handle save
  const handleSave = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onSave(croppedImage);
      onClose();
    } catch (e) {
      console.error("Error cropping image:", e);
    } finally {
      setIsProcessing(false);
    }
  }, [imageSrc, croppedAreaPixels, onSave, onClose]);

  // Handle close
  const handleClose = useCallback(() => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    onClose();
  }, [onClose]);

  // Trigger file input click
  const handleSelectFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="w-[480px] rounded-[20px] bg-white p-[24px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-[20px]">
          <span className="text-[18px] font-[600]">Upload Avatar</span>

          <ModalClose onClose={handleClose} />
        </div>

        {/* Crop Area */}
        {imageSrc ? (
          <div>
            <div className="relative w-full h-[320px] bg-gray-100 rounded-[12px] overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Zoom Slider */}
            <div className="mt-[20px]">
              <label className="text-[14px] text-gray-600 block mb-[8px]">
                Zoom
              </label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-[6px] bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #000 0%, #000 ${
                    ((zoom - 1) / 2) * 100
                  }%, #E5E5E5 ${((zoom - 1) / 2) * 100}%, #E5E5E5 100%)`
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-[12px] mt-[24px]">
              <Button
                className="flex-1 h-[44px] !bg-gray-100 !text-gray-700"
                onClick={handleSelectFile}
              >
                Choose Another
              </Button>
              <Button
                className={clsx(
                  "flex-1 h-[44px] !bg-black !text-white",
                  isProcessing && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleSave}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          // Upload Area
          <div>
            <div
              className="w-full h-[320px] border-2 border-dashed border-gray-300 rounded-[12px] flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={handleSelectFile}
            >
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt="Current avatar"
                  className="w-[120px] h-[120px] rounded-full object-cover mb-[16px]"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-gray-200 mb-[16px] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
              <p className="text-[16px] font-[500] text-gray-700 mb-[8px]">
                Click to upload
              </p>
              <p className="text-[14px] text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>

            <Button
              className="w-full h-[44px] mt-[24px] !bg-gray-200 !text-gray-400 cursor-not-allowed"
              disabled
            >
              Save
            </Button>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </div>
    </Modal>
  );
}
