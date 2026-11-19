import type { Metadata } from 'next'
import Link from 'next/link'
import { DIGITAL_LITERACY_COURSES, DIGITAL_LITERACY_LGAS } from '@/lib/digital-literacy'
import RegistrationForm from './registration-form'
import styles from './digital-literacy.module.css'

const title = 'Digital Literacy Programme | Edati & Lavun'
const description = 'Register for the digital literacy programme in Edati and Lavun. Enter your name, select your LGA and choose the course you want to study.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: 'website' },
  twitter: { card: 'summary', title, description },
}

export default function DigitalLiteracyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Digital literacy</span>
        </nav>

        <div className={styles.layout}>
          <section className={styles.introduction} aria-labelledby="programme-title">
            <div className={styles.location}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Edati &amp; Lavun, Niger State
            </div>
            <p className={styles.eyebrow}>Digital literacy programme</p>
            <h1 id="programme-title">New skills.<br /><span>New possibilities.</span></h1>
            <p className={styles.introCopy}>
              Take the next step in your digital journey. Register for our
              programme in Edati and Lavun and tell us what you would like to learn.
            </p>

            <div className={styles.learningCard}>
              <div className={styles.laptopIcon} aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="8" width="30" height="24" rx="3" />
                  <path d="M9 32 4 39h40l-5-7M18 20l4 4 8-8M19 39h10" />
                </svg>
              </div>
              <div>
                <h2>Choose your learning path</h2>
                <p>Explore {DIGITAL_LITERACY_COURSES.length} courses in coding, design, data, digital tools and more.</p>
                <Link href="/courses">Explore the courses</Link>
              </div>
            </div>

            <div className={styles.howItWorks}>
              <h2>A simple start</h2>
              <ul>
                <li><CheckIcon />Enter your full name.</li>
                <li><CheckIcon />Select Edati or Lavun as your LGA.</li>
                <li><CheckIcon />Choose the course you want to study.</li>
              </ul>
            </div>
            <p className={styles.organiser}>A community learning initiative by Sani Kutigi Vanguard.</p>
          </section>

          <section className={styles.formPanel} aria-label="Programme registration">
            <RegistrationForm courses={DIGITAL_LITERACY_COURSES} lgas={DIGITAL_LITERACY_LGAS} />
          </section>
        </div>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="m6.5 10 2.3 2.3 4.7-4.6" />
    </svg>
  )
}
