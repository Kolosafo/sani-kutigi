import styles from "./course-community.module.css";

const courseGroupUrl =
  "https://chat.whatsapp.com/DDoi19rAqqbEGllwfjh0I8?s=cl&p=i&mlu=4&ilr=4";

export default function CourseCommunity() {
  return (
    <aside className={styles.community} aria-labelledby="course-community-title">
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
          <path strokeLinecap="round" d="M8.5 10h8M8.5 14h5" />
        </svg>
      </span>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Course discussion &amp; support</p>
        <h2 id="course-community-title">Questions about a tech course?</h2>
        <p>Join our WhatsApp group to discuss the courses, ask questions, share useful information, and get help from fellow learners.</p>
      </div>
      <a className={styles.joinLink} href={courseGroupUrl} target="_blank" rel="noopener noreferrer">
        Join the WhatsApp group <span aria-hidden="true">↗</span>
        <span className={styles.srOnly}> (opens in a new tab)</span>
      </a>
    </aside>
  );
}
