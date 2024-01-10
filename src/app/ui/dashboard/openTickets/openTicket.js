"use client"
import styles from './card.module.css'

const OpenTickets = (props) => {

    const { dataIssue } = props;

    const formatDateString = (dateString) => {
        if (dateString) {
            const date = new Date(dateString);
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            };

            const formatter = new Intl.DateTimeFormat('en-GB', options);
            return formatter.format(date);
        }
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.texts}>
                <table style={{ width: "100%" }}>
                    <thead>
                        <tr style={{ width: "100%" }}>
                            <th className={styles.issues} style={{ width: "8%" }}>Issues No </th>
                            <th className={styles.issues} style={{ width: '25%' }}>Summary </th>
                            <th className={styles.issues} style={{ width: "20%" }}>Project</th>
                            <th className={styles.issues} style={{ width: '10%' }}>Reporter </th>
                            <th className={styles.issues} style={{ width: '13%' }}>Status </th>
                            <th className={styles.issues} style={{ width: '15%' }}>Created </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataIssue && dataIssue.map((data, key) => (
                            <tr key={key}>
                                <td className={styles.issueInfo}>{data.key}</td>
                                <td className={styles.issueInfo}>
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href={`https://pm.lotustest.net/browse/${data.key}`}
                                        className={styles.title}>
                                        {data.summary}
                                    </a>
                                </td>
                                <td className={styles.issueInfo}>{data.pname}</td>

                                <td className={styles.issueInfo}>{data.reporter}</td>
                                <td className={styles.issueInfo}>{data.issuestatus === "1" ? "Open" :
                                    data.issuestatus === "3" ? "In Progress" :
                                        data.issuestatus === "4" ? "Reopened" :
                                            data.issuestatus === "10103" ? "Request Created" :
                                                ""}</td>
                                <td className={styles.issueInfo}>{formatDateString(data.created)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OpenTickets
