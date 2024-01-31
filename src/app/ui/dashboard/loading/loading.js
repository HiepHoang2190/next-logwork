import { HalfMalf } from "react-spinner-animated";
import styles from "./loading.module.css";
import 'react-spinner-animated/dist/index.css'

const Loading = () => {

  return (
    <div className={styles.container}>
      <HalfMalf center={false} text={"Loading..."}/>
    </div>
  );
};

export default Loading;
