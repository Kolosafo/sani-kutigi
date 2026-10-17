import type { Metadata } from "next";
import Link from "next/link";
import SkillBrowser from "./skill-browser";
import CourseCommunity from "./course-community";
import { countResources, getCategories, skills } from "@/lib/skills";
import styles from "./courses.module.css";

export const metadata: Metadata = {
  title: "Free Tech Courses | SKV 2027",
  description:
    "Explore free online courses in coding, data, design and digital skills. Choose a learning path and build practical skills with the Sani Kutigi Vanguard community.",
};

export default function CoursesPage() {
  const providerCount = new Set(
    skills.flatMap((skill) => skill.resources.map((resource) => resource.provider)),
  ).size;

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="courses-title">
        <div className={styles.shell}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Courses</span>
          </nav>

          <div className={styles.heroGrid}>
            <div>
              <p className={styles.heroEyebrow}>Skills for a greater Niger South</p>
              <h1 id="courses-title">Learn a tech skill.<br /><span>Build your future.</span></h1>
              <p className={styles.heroCopy}>
                Take your next step with free online learning. Explore coding,
                design, data and digital skills, with a clear path from your
                first lesson to practical projects.
              </p>
              <a className={styles.primaryLink} href="#browse">
                Find your course <span aria-hidden="true">↓</span>
              </a>
              <p className={styles.openNote}>Open to everyone. No SKV membership required.</p>
            </div>

            <aside className={styles.pathPreview} aria-label="How each learning path works">
              <p className={styles.previewLabel}>A little direction goes a long way</p>
              <h2>Your path to a new skill</h2>
              <ol>
                <li><span>01</span><div><h3>Start with the basics</h3><p>Get comfortable, one lesson at a time.</p></div></li>
                <li><span>02</span><div><h3>Build your knowledge</h3><p>Go deeper with focused courses.</p></div></li>
                <li><span>03</span><div><h3>Put it into practice</h3><p>Make something you can show.</p></div></li>
              </ol>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.statsBand} aria-label="Explore the course library">
        <dl className={`${styles.shell} ${styles.stats}`}>
          <div><dt>Skills to explore</dt><dd>{skills.length}</dd></div>
          <div><dt>Learning resources</dt><dd>{countResources()}</dd></div>
          <div><dt>Learning providers</dt><dd>{providerCount}</dd></div>
          <div><dt>Cost to start learning</dt><dd>₦0</dd></div>
        </dl>
      </section>

      <div className={`${styles.shell} ${styles.communityWrap}`}>
        <CourseCommunity />
      </div>

      <section className={`${styles.shell} ${styles.browse}`} id="browse" aria-labelledby="browse-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Choose your path</p>
          <h2 id="browse-title">What would you like to learn?</h2>
          <p>Start with an interest. You don&apos;t need to know how to code to find your place in tech.</p>
        </div>
        <SkillBrowser skills={skills} categories={getCategories()} />
      </section>

      <section className={`${styles.shell} ${styles.learningNote}`} aria-labelledby="learning-note-title">
        <div className={styles.noteHeading}>
          <p className={styles.eyebrow}>Make it count</p>
          <h2 id="learning-note-title">Small steps.<br />Real progress.</h2>
        </div>
        <div className={styles.noteCopy}>
          <p>Choose one skill, set aside time each week, and practise as you learn. A small finished project is a great place to start building your confidence and portfolio.</p>
          <p className={styles.feeNote}>The linked learning materials are free to access. Some providers require an account; certificates, exams or optional services may cost extra. Check the provider&apos;s terms before enrolling.</p>
          <Link className={styles.textLink} href="/suggestions">Suggest a learning resource <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  );
}
