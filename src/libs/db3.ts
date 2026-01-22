import axios from "axios";

export async function report(params: any) {
  try {
    await axios.post("https://api.stableflow.ai/v1/trade/add", {...params, "project": "nearintents"});
  } catch (error) {
    console.log("report failed: %o", error);
  }
}
