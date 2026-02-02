import  { type AxiosInstance } from "axios";
import axiosInstance from "@/libs/axios";

class DollaService {
  private api: AxiosInstance
  constructor() {
    this.api = axiosInstance
  }

  /**
   * Check reward
   * @param username Twitter username
   */
  async checkReward(username: string) {
    return this.api.get('/api/v1/code/invite/gift/reward', {
      params: {
        twitter_username: username,
      },
    })
  }

  /**
   * Get meme fate
   * @param username Username
   */
  async memeFate(username: string) {
    return this.api.post('/api/v1/meme-fate', {
      profileUrl: `https://x.com/${username}`,
      refresh: false,
    })
  }

  /**
   * Check xkol
   * @param username Username
   */
  async checkUser(username: string) {
    return this.api.get('/api/v1/user/twitter/status', {
      params: {
        twitter_username: username,
      },
    })
  }

  /**
   * Report error
   * @param params Error report parameters
   */
  async reportError(params: {
    error_type: string
    error_message: string
    address?: string
    extra?: string
    interface_name?: string
  }) {
    return this.api.post('/api/v1/system/error/report', {
      error_type: params.error_type,
      error_message: params.error_message,
      address: params.address,
      extra: params.extra,
      interface_name: params.interface_name,
    })
  }
}

export default new DollaService();
