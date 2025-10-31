import Winner from "./winner";
import Normal from "./normal";

export default function Result(props: any) {
  return props.isWinner ? (
    <Winner onClose={props.onClose} />
  ) : (
    <Normal {...props} />
  );
}
