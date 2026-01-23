import  { type AxiosInstance } from "axios";
import axiosInstance from "@/libs/axios";

class DollaService {
  private api: AxiosInstance;
  constructor() {
    this.api = axiosInstance;
  }

  /**
   * Check reward
   * @param username Twitter username
   */
  async checkReward(username: string) {
    return this.api.get("/api/v1/code/invite/gift/reward", {
      params: {
        twitter_username: username
      }
    });
  }

  /**
   * Get meme fate
   * @param username Username
   */
  async memeFate(username: string) {
    return this.api.post("/api/v1/meme-fate", {
      profileUrl: `https://x.com/${username}`,
      refresh: false
    });
  }
}

export default new DollaService();
