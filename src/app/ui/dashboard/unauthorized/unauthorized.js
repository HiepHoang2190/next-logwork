import React from 'react';
import Image from 'next/image';
import { signOut } from '@/app/auth'
import { MdLogout } from 'react-icons/md'
import styles from './unauthorized.module.css'
import errorPic from '../../../../../public/error.png'

const Unauthorized = (props) => {

    const { status } = props;

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
                            {status === 'Unauthorized!' && "401"}
                            {status === 'fetch failed' && "502"}
                        </h1>
                        <h3 className={styles.h3} style={{ marginTop: "10px", marginBottom: "15px" }}>
                            {status === 'Unauthorized!' && "Unauthorized!"}
                            {status === 'fetch failed' && "Something when wrong!"}
                        </h3>
                        <span className={styles.text}>
                            {status === 'Unauthorized!' && "Please Logout and try again"}
                            {status === 'fetch failed' && "Please try again later"}
                        </span>
                        {status === 'Unauthorized!' && <form
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
                        }
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