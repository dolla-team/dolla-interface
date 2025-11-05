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
    setUsername(userInfo?.name || "");
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
            <span className="text-[16px] font-[500]">Profile</span>
            {userInfo?.name && <ModalClose onClose={onClose} />}
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-[20px]">
            <div className="relative w-[74px] h-[74px]">
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
            </div>
            <div className="text-[14px] text-[#8A87AA] text-center mt-[6px]">
              {userInfo?.show_email}
            </div>
            <div className="flex items-center gap-[10px] mt-[18px]">
              <Button
                onClick={() => {
                  const random = Math.floor(Math.random() * 45) + 1;
                  setAvatarUrl(
                    `https://assets.dolla.market/avatar/${random}.jpg`
                  );
                }}
                className="w-[160px] h-[46px] !bg-white border-black border !text-black text-[14px] gap-[8px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="18"
                  viewBox="0 0 23 18"
                  fill="none"
                >
                  <path
                    d="M2.84375 5.67188C3.25153 5.34713 3.84608 5.41452 4.1709 5.82227L6.1543 8.31055C6.47888 8.71822 6.41233 9.31188 6.00488 9.63672C5.5971 9.96156 5.00258 9.89509 4.67773 9.4873L3.96191 8.58984C3.95423 8.7252 3.94922 8.86171 3.94922 8.99902C3.94931 12.927 7.13351 16.1113 11.0615 16.1113C12.794 16.1113 14.3814 15.4908 15.6162 14.4609L15.6318 14.4805C15.7935 14.36 15.9903 14.293 16.1943 14.293C16.4441 14.293 16.6837 14.3928 16.8604 14.5693C17.037 14.746 17.1367 14.9855 17.1367 15.2354C17.1367 15.4853 17.0371 15.7256 16.8604 15.9023C16.7897 15.9729 16.7084 16.0298 16.6211 16.0742C15.0912 17.2783 13.1613 18 11.0615 18C6.09211 18 2.0625 13.9704 2.0625 9.00098C2.0625 8.90458 2.06533 8.80857 2.06836 8.71289L1.53027 9.1416C1.12255 9.46633 0.53091 9.39979 0.206055 8.99219C-0.118769 8.58443 -0.0522484 7.98989 0.355469 7.66504L2.76367 5.74512C2.78892 5.71981 2.81512 5.69468 2.84375 5.67188ZM11.0615 0C15.8486 1.09997e-05 19.7612 3.73938 20.042 8.45605L20.625 7.91406C21.0074 7.55927 21.6042 7.57983 21.959 7.95996C22.3137 8.34007 22.2931 8.93917 21.9131 9.29395L19.5859 11.4639C19.3994 11.638 19.1601 11.7207 18.9229 11.7158L18.9199 11.7168L18.917 11.7158C18.9108 11.7157 18.9046 11.7161 18.8984 11.7158C18.6565 11.7103 18.4255 11.6129 18.2539 11.4414C18.23 11.4175 18.2075 11.3923 18.1865 11.3662L16.0498 9.0752C15.6927 8.69278 15.7133 8.09601 16.0957 7.74121C16.4758 7.38642 17.0749 7.40697 17.4297 7.78711L18.1592 8.56934C17.9382 4.84025 14.8461 1.88478 11.0615 1.88477C9.43172 1.88477 7.93001 2.43555 6.73145 3.35742C6.72124 3.36867 6.71196 3.38081 6.70117 3.3916C6.52446 3.56831 6.28409 3.66797 6.03418 3.66797C5.78443 3.66785 5.54477 3.56821 5.36816 3.3916C5.19158 3.21492 5.09279 2.97538 5.09277 2.72559C5.09277 2.47579 5.19161 2.23626 5.36816 2.05957C5.4093 2.01844 5.45369 1.98071 5.50098 1.94824L5.48828 1.93262C7.02034 0.723108 8.95582 0 11.0615 0Z"
                    fill="#242424"
                  />
                </svg>
                <span>Randomly</span>
              </Button>
              <Button
                onClick={() => setShowAvatarUpload(true)}
                className="w-[160px] h-[46px] !bg-white border-black border !text-black text-[14px] gap-[8px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M16.875 12.3779C17.4961 12.3779 18 12.8818 18 13.5029V15.2764C18 16.7787 16.7227 18.0029 15.1523 18.0029H2.84766C1.27734 18.0029 0 16.7787 0 15.2764V13.5029C0 12.8818 0.503906 12.3779 1.125 12.3779C1.74609 12.3779 2.25 12.8818 2.25 13.5029V15.2764C2.25 15.5342 2.52422 15.7529 2.84766 15.7529H15.1523C15.4758 15.7529 15.75 15.5342 15.75 15.2764V13.5029C15.75 12.8818 16.2539 12.3779 16.875 12.3779ZM8.20508 0.330078C8.64555 -0.110167 9.35538 -0.110095 9.7959 0.330078L12.5215 3.05566C12.9621 3.49623 12.9621 4.20689 12.5215 4.64746C12.2989 4.86756 12.0104 4.97559 11.7246 4.97559C11.4365 4.97552 11.1485 4.86474 10.9307 4.64453L10.125 3.84082V11.96C10.125 12.5811 9.62109 13.085 9 13.085C8.37891 13.085 7.875 12.5811 7.875 11.96V3.84277L7.07031 4.64746C6.62977 5.08755 5.91993 5.08772 5.47949 4.64746C5.03892 4.20689 5.03892 3.49623 5.47949 3.05566L8.20508 0.330078Z"
                    fill="#231815"
                  />
                </svg>
                <span>Upload</span>
              </Button>
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
                file: file,
                icon: avatarUrl
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
