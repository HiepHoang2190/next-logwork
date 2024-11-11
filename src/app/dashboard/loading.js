import { HalfMalf } from "react-spinner-animated";
import 'react-spinner-animated/dist/index.css'

const Loading = () => {

  return (
    <div style={{ "position": "absolute", "top": "45%", "left": "55%", "marginTop": 0, "marginLeft": 0, "borderRadius": 0.5 + "rem;" }}>
      <HalfMalf center={false} text={"Loading..."} />
    </div>
  );
};

export default Loading;