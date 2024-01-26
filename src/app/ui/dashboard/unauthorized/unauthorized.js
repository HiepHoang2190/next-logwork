import React from 'react';
import Image from 'next/image';
import { signOut } from '@/app/auth'
import { MdLogout } from 'react-icons/md'
import styles from './unauthorized.module.css'
import errorPic from '../../../../../public/error.png'

const Unauthorized = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '865px'
            }}
        >
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div className={styles.containerText}>
                        <h1 className={styles.h1}>
                            Woops!
                        </h1>
                        <h3 className={styles.h3} style={{ marginTop: "10px", marginBottom: "15px" }}>
                            Unauthorized!
                        </h3>
                        <span className={styles.text}>
                            Please Logout and try again
                        </span>
                        <form
                            action={async () => {
                                'use server'
                                await signOut()
                            }}
                        >
                            <button className={styles.logout}>
                                <MdLogout />
                                Logout
                            </button>
                        </form>
                    </div>
                    <div className={styles.containerImg}>
                        <Image
                            src={errorPic}
                            alt="Error Picture"
                            width={500}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Unauthorized