import { useState, useEffect } from "react";
import Modal from "@/components/modal";
import Button from "@/components/button";
import AvatarUpload from "./upload";
import clsx from "clsx";
import useUpdateUserInfo from "@/hooks/user/use-update-userinfo";
import { useAuth } from "@/contexts/auth";
import ModalClose from "@/components/button/modal-close";
import Avatar from "@/components/avatar";

interface ProfileSettingProps {
  open: boolean;
  onClose: () => void;
  defaultUsername?: string;
  defaultAvatar?: string;
}

export default function ProfileSetting({ open, onClose }: ProfileSettingProps) {
  const { userInfo, onQueryUserInfo } = useAuth();
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [file, setFile] = useState<Blob | null>(null);
  const { loading: isSaving, updateUserInfo } = useUpdateUserInfo(() => {
    onQueryUserInfo();
    onClose();
  });

  useEffect(() => {
    setUsername(userInfo?.name || userInfo?.show_email);
    setAvatarUrl(userInfo?.icon);
  }, [userInfo]);

  // Handle avatar save
  const handleAvatarSave = (croppedImage: Blob) => {
    // Convert blob to object URL for preview
    const url = URL.createObjectURL(croppedImage);
    setAvatarUrl(url);
    setFile(croppedImage);

    // Here you can upload to your server
    // const formData = new FormData();
    // formData.append('avatar', croppedImage);
    // await uploadAvatar(formData);
  };

  return (
    <>
      <Modal open={open}>
        <div className="w-[388px] rounded-[20px] bg-white p-[20px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-[20px]">
            <span className="text-[16px] font-[500]">Profile Setting</span>
            {userInfo?.name && <ModalClose onClose={onClose} />}
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-[20px]">
            <div className="relative w-[74px] h-[74px] group cursor-pointer">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full rounded-[12px] object-cover"
                />
              ) : (
                <Avatar
                  size={74}
                  className="shrink-0 rounded-[8px] border-[2px] border-[#FFFFFFCC] text-[26px]"
                  src={userInfo?.icon}
                  email={userInfo?.show_email}
                  address={userInfo?.user}
                />
              )}
              {/* Edit Button - Show on hover */}
              <button
                className="absolute bottom-0 right-0 w-full h-full bg-[#0000004D] rounded-[12px] flex items-center justify-center button transition-opacity opacity-0 group-hover:opacity-100"
                onClick={() => setShowAvatarUpload(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="17"
                  viewBox="0 0 20 17"
                  fill="none"
                >
                  <path
                    d="M12.7051 0C13.0436 0 13.4297 0.1425 13.7682 0.38C14.1067 0.6175 14.3477 0.902 14.4928 1.235L15.0241 2.6115H17.3431C18.0677 2.6115 18.6959 2.849 19.2272 3.3715C19.7585 3.894 20 4.5115 20 5.2235V14.3885C20 15.1005 19.7585 15.718 19.2272 16.24C18.6959 16.7625 18.0677 17 17.3431 17H2.65641C1.93179 17 1.30359 16.7625 0.772308 16.24C0.241538 15.718 0 15.1005 0 14.3885V5.2235C0 4.511 0.241538 3.8935 0.77282 3.3715C1.3041 2.849 1.93231 2.6115 2.65692 2.6115H5.0241L5.60359 1.2345C5.74872 0.902 5.99026 0.6175 6.32872 0.3795C6.66667 0.143 7.00462 0 7.39128 0H12.7051ZM10 5.276C7.50256 5.276 5.45436 7.2565 5.45436 9.6725C5.45436 12.088 7.50256 14.069 10 14.069C12.4974 14.069 14.5456 12.088 14.5456 9.6725C14.5456 7.2565 12.4974 5.276 10 5.276ZM10 7.0345C11.52 7.0345 12.7272 8.202 12.7272 9.6725C12.7272 11.1425 11.52 12.3105 10 12.3105C8.48 12.3105 7.27282 11.1425 7.27282 9.6725C7.27282 8.2025 8.48 7.0345 10 7.0345Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Username Input */}
          <div className="mb-[12px]">
            <div className="text-[#8A87AA] text-[12px] mb-[6px]">User Name</div>
            <input
              className="w-full h-[56px] rounded-[10px] border border-[#F2F2F233] bg-[#F0F0F0] text-[14px] text-black px-[20px] focus:outline-none focus:border-gray-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          {/* Save Button */}
          <Button
            className={clsx(
              "w-full h-[40px] mt-[12px] !bg-black !text-white",
              isSaving && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => {
              updateUserInfo({
                name: username?.trim(),
                file: file
              });
            }}
            disabled={isSaving || !username?.trim()}
            loading={isSaving}
          >
            Save
          </Button>
        </div>
      </Modal>

      {/* Avatar Upload Modal */}
      <AvatarUpload
        open={showAvatarUpload}
        onClose={() => setShowAvatarUpload(false)}
        onSave={handleAvatarSave}
        currentAvatar={avatarUrl}
      />
    </>
  );
}
