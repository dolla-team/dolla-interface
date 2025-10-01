import axiosInstance from "@/libs/axios";
import useUserInfoStore from "@/stores/use-user-info";

export default function useUserPrize() {
  const { set } = useUserInfoStore();

  const getUserPrize = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/user/prize/balance");

      set({
        prize: {
          points:
            response.data.data.point.reward -
            response.data.data.point.freeze_reward -
            response.data.data.point.withdrawal_reward,
          tickets:
            response.data.data.ticket.number -
            response.data.data.ticket.use_number
        }
      });
      // set({
      //   prize: {
      //     points: 100
      //   }
      // });
    } catch (err) {}
  };

  return {
    getUserPrize
  };
}
