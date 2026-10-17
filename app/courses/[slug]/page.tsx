import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSkill,
  resourceStages,
  skills,
  trackLabel,
  type ResourceStage,
} from "../../../lib/skills";
import CourseCommunity from "../course-community";
import styles from "./course-detail.module.css";

type PageProps = { params: Promise<{ slug: string }> };

const stageDescriptions: Record<ResourceStage, string> = {
  "Start here": "Get comfortable with the foundations, one lesson at a time.",
  "Build depth": "Explore the subject further and connect what you have learned.",
  "Practice & prove it": "Put your learning to work with exercises and projects.",
};

export function generateStaticParams() {
  return skills.map((skill) => ({ slug: skill.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkill(slug);

  if (!skill) return { title: "Learning Path Not Found | SKV 2027" };

  return {
    title: `Learn ${skill.name} | Free Tech Courses | SKV 2027`,
    description: `${skill.summary} Explore a learning path with ${skill.resources.length} free courses and resources, shared by SKV 2027.`,
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;
  const skill = getSkill(slug);

  if (!skill) notFound();

  const related = skill.pairsWith
    .map((relatedSlug) => getSkill(relatedSlug))
    .filter((relatedSkill) => relatedSkill !== undefined);

  const stages = resourceStages
    .map((stage) => ({
      stage,
      resources: skill.resources.filter((resource) => resource.stage === stage),
    }))
    .filter(({ resources }) => resources.length > 0);

  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.shell}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/courses">Free Tech Courses</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{skill.name}</span>
          </nav>

          <div className={styles.heroGrid}>
            <div>
              <div className={styles.headerMeta}>
                <span className={styles.track}>{trackLabel(skill.track)}</span>
                <span>{skill.category}</span>
              </div>
              <h1>{skill.name}</h1>
              <p className={styles.summary}>{skill.summary}</p>
            </div>
            <div className={styles.startCard}>
              <span className={styles.eyebrowLight}>Your learning path</span>
              <p>Start with the basics. Build your confidence. Practise as you go.</p>
              <a className={styles.startButton} href="#learning-path">
                Start learning <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.shell}>
        <dl className={styles.facts} aria-label="Learning path at a glance">
          <div>
            <dt>Why it is useful</dt>
            <dd>{skill.demand}</dd>
          </div>
          <div>
            <dt>Suggested learning pace</dt>
            <dd>{skill.effort}</dd>
          </div>
          <div>
            <dt>Free learning resources</dt>
            <dd>{skill.resources.length} curated links</dd>
          </div>
        </dl>

        <div className="mt-6">
          <CourseCommunity />
        </div>

        <section className={styles.brief} aria-labelledby="about-path">
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Get to know the skill</p>
            <h2 id="about-path">What you will learn</h2>
            {skill.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <aside className={styles.outcomes} aria-labelledby="outcomes-title">
            <span className={styles.outcomeIcon} aria-hidden="true">✓</span>
            <h3 id="outcomes-title">Skills to work towards</h3>
            <ul>
              {skill.outcomes.map((outcome) => (
                <li key={outcome}>
                  <span aria-hidden="true">✓</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className={styles.learningPath} aria-labelledby="learning-path">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>One step at a time</p>
              <h2 id="learning-path">Your learning path</h2>
            </div>
            <p>Follow the stages at your own pace. Resource links open in a new tab.</p>
          </div>

          <p className={styles.resourceNote}>
            Resources linked here are free to access. Provider accounts may be required;
            certificates and exams may cost extra.
          </p>

          <div className={styles.stages}>
            {stages.map(({ stage, resources }, index) => (
              <section className={styles.stage} key={stage} aria-labelledby={`stage-${index}`}>
                <div className={styles.stageHeading}>
                  <span className={styles.stageNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 id={`stage-${index}`}>{stage}</h3>
                    <p>{stageDescriptions[stage]}</p>
                  </div>
                </div>
                <ul className={styles.resourceList}>
                  {resources.map((resource) => (
                    <li key={resource.href + resource.title}>
                      <a
                        className={styles.resource}
                        href={resource.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className={styles.resourceProvider}>
                          <span>{resource.provider}</span>
                          <span className={styles.resourceFormat}>{resource.format}</span>
                        </div>
                        <div className={styles.resourceBody}>
                          <h4>{resource.title}</h4>
                          <p>{resource.note}</p>
                        </div>
                        <span className={styles.resourceArrow} aria-hidden="true">↗</span>
                        <span className={styles.visuallyHidden}> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        {related.length > 0 ? (
          <section className={styles.related} aria-labelledby="related-paths">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>Keep building</p>
                <h2 id="related-paths">Skills that go well together</h2>
              </div>
              <Link className={styles.backLink} href="/courses">
                All courses <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((item) => (
                <Link className={styles.relatedCard} href={`/courses/${item.slug}`} key={item.slug}>
                  <span className={styles.relatedCategory}>{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>{item.summary}</p>
                  <span className={styles.relatedAction}>
                    Explore learning path <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <Link className={styles.backLink} href="/courses">
            <span aria-hidden="true">←</span> Browse all courses
          </Link>
        )}
      </div>
    </article>
  );
}
