import axios from "axios";

export async function report(params: any) {
  try {
    await axios.post("http://api.stableflow.ai/v1/trade/add", params);
  } catch (error) {
    console.log("report failed: %o", error);
  }
}
