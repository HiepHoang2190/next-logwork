'use client'

import React from "react";
import Image from "next/image";
import { MdLogout } from "react-icons/md";
import styles from "./unauthorized.module.css";
import errorPic from "../../../../../public/error.png";
import { useAuth } from "@/app/lib/AuthContext";

const Unauthorized = (props) => {
  const { status } = props;

  const { logout } = useAuth();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "865px",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className={styles.containerText}>
            <h1 className={styles.h1}>
              {status === "Unauthorized!" && "401"}
              {status === "fetch failed" || status === "An unexpected error occurred." && "502"}
            </h1>
            <h3
              className={styles.h3}
              style={{ marginTop: "10px", marginBottom: "15px" }}
            >
              {status === "Unauthorized!" && "Unauthorized!"}
              {status === "fetch failed" || status === "An unexpected error occurred." && "Something when wrong!"}
            </h3>
            <span className={styles.text}>
              {status === "Unauthorized!" && "Please Logout and try again"}
              {status === "fetch failed" || status === "An unexpected error occurred." && "Please try again later"}
            </span>
            {status === "Unauthorized!" && (
              <button className={styles.logout} onClick={() => logout()}>
                <MdLogout />
                Logout
              </button>
            )}
          </div>
          <div className={styles.containerImg}>
            <Image src={errorPic} alt="Error Picture" width={500} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
