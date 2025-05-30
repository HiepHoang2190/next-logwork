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

  const isUnauthorized = status === "Unauthorized!";

  const isServerError =
    status === "fetch failed" || status === "An unexpected error occurred.";

  const title = isUnauthorized ? "401" : isServerError ? "502" : "";

  const heading = isUnauthorized
    ? "Unauthorized!"
    : isServerError
      ? "Something went wrong!"
      : "";

  const message = isUnauthorized
    ? "Please Logout and try again"
    : isServerError
      ? "Please try again later"
      : "";

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
            <h1 className={styles.h1}>{title}</h1>
            <h3
              className={styles.h3}
              style={{ marginTop: "10px", marginBottom: "15px" }}
            >
              {heading}
            </h3>
            <span className={styles.text}>
              {message}
            </span>
            {isUnauthorized && (
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
