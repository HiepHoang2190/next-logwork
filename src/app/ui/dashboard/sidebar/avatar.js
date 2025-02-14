'use client';
import styles from "./sidebar.module.css";
 
const Avatar = (src) => {
    const url = src?.src;
    return (
        <div>
            <img className={styles.userImage} src={url} alt="avatar" />
        </div>
    );
}

export default Avatar;