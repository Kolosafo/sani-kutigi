import Link from "next/link";
import styles from "./course-detail.module.css";

export default function CourseNotFound() {
  return (
    <div className={styles.notFound}>
      <div className={styles.notFoundInner}>
        <p className={styles.eyebrow}>SKV 2027 · Free Tech Courses</p>
        <h1>Learning path not found</h1>
        <p>
          This course link may have changed. Browse the available skills to find
          your next learning path.
        </p>
        <Link className={styles.notFoundButton} href="/courses">
          Browse all courses
        </Link>
      </div>
    </div>
  );
}
