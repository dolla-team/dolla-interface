import axios from "axios";

export async function report(params: any) {
  try {
    await axios.post("https://api.db3.app/api/stableflow/trade", params);
  } catch (error) {
    console.log("report failed: %o", error);
  }
}
