"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Skill, SkillTrack } from "@/lib/skills";
import styles from "./courses.module.css";

type TrackFilter = "all" | SkillTrack;

const trackFilters: Array<{ value: TrackFilter; label: string }> = [
  { value: "all", label: "All skills" },
  { value: "code", label: "Coding" },
  { value: "no-code", label: "No-code" },
];

export default function SkillBrowser({ skills, categories }: { skills: Skill[]; categories: string[] }) {
  const [track, setTrack] = useState<TrackFilter>("all");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return skills.filter((skill) => {
      if (track !== "all" && skill.track !== track) return false;
      if (category !== "all" && skill.category !== category) return false;
      return !needle || [skill.name, skill.summary, skill.category,
        ...skill.resources.map((resource) => `${resource.title} ${resource.provider}`),
      ].some((value) => value.toLowerCase().includes(needle));
    });
  }, [skills, track, category, query]);

  const hasFilters = track !== "all" || category !== "all" || query.length > 0;
  function resetFilters() {
    setTrack("all");
    setCategory("all");
    setQuery("");
  }

  return (
    <div>
      <div className={styles.controls}>
        <div className={styles.controlTop}>
          <div className={styles.trackFilters} role="group" aria-label="Filter by track">
            {trackFilters.map((filter) => (
              <button className={styles.trackButton} key={filter.value} type="button"
                aria-pressed={track === filter.value} aria-controls="course-results"
                onClick={() => setTrack(filter.value)}>{filter.label}</button>
            ))}
          </div>
          <div className={styles.searchField}>
            <label className={styles.srOnly} htmlFor="course-search">Search skills and providers</label>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10.8" cy="10.8" r="7" /><path strokeLinecap="round" d="m16 16 4.5 4.5" /></svg>
            <input id="course-search" type="search" value={query} placeholder="Search a skill or provider…"
              aria-controls="course-results" onChange={(event) => setQuery(event.target.value)} />
          </div>
        </div>
        <div className={styles.controlBottom}>
          <label className={styles.categoryLabel} htmlFor="course-category">Field
            <select id="course-category" value={category} aria-controls="course-results"
              onChange={(event) => setCategory(event.target.value)}>
              <option value="all">Every field</option>
              {categories.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          {hasFilters && <button className={styles.resetButton} type="button" onClick={resetFilters}>Clear filters <span aria-hidden="true">×</span></button>}
        </div>
      </div>

      <p className={styles.resultCount} role="status" aria-live="polite" aria-atomic="true">
        Showing <strong>{visible.length}</strong> of {skills.length} skills
      </p>

      <div id="course-results">
        {visible.length > 0 ? (
          <ul className={styles.skillGrid}>
            {visible.map((skill) => (
              <li key={skill.slug}>
                <Link className={styles.skillCard} href={`/courses/${skill.slug}`}>
                  <div className={styles.cardTop}>
                    <span className={styles.category}>{skill.category}</span>
                    <span className={`${styles.trackBadge} ${skill.track === "code" ? styles.code : styles.noCode}`}>
                      {skill.track === "code" ? "Coding" : "No-code"}
                    </span>
                  </div>
                  <h3>{skill.name}</h3>
                  <p>{skill.summary}</p>
                  <div className={styles.cardFoot}><span>{skill.resources.length} free resources</span><span className={styles.cardArrow} aria-hidden="true">→</span></div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.emptyState}>
            <h3>No matching skills yet</h3>
            <p>Try a different search or clear your filters to explore all learning paths.</p>
            <button className={styles.primaryLink} type="button" onClick={resetFilters}>Show all skills <span aria-hidden="true">→</span></button>
            <Link className={styles.textLink} href="/suggestions">Suggest a skill to add</Link>
          </div>
        )}
      </div>
    </div>
  );
}
