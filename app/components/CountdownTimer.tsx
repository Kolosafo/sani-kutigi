'use client'

import { useState, useEffect } from 'react'

const ELECTION_DATE = new Date('2027-01-16T08:00:00')

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number; elapsed: boolean }

function getTimeLeft(): TimeLeft {
  const now = new Date()
  const diff = ELECTION_DATE.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, elapsed: true }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    elapsed: false,
  }
}

function Pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) {
    return (
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {['Days', 'Hours', 'Minutes', 'Seconds'].map((label) => (
          <div key={label} className="flex flex-col items-center bg-white rounded-2xl shadow-lg px-6 py-4 min-w-20">
            <span className="text-4xl sm:text-5xl font-extrabold text-green-200 tabular-nums">--</span>
            <span className="mt-1 text-xs sm:text-sm font-semibold uppercase tracking-widest text-gray-300">{label}</span>
          </div>
        ))}
      </div>
    )
  }

  if (time.elapsed) {
    return (
      <p className="text-2xl font-bold text-green-800 text-center">
        Election Day is here! Go out and vote!
      </p>
    )
  }

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center bg-white rounded-2xl shadow-lg px-6 py-4 min-w-20"
        >
          <span className="text-4xl sm:text-5xl font-extrabold text-green-700 tabular-nums">
            {label === 'Days' ? value : Pad(value)}
          </span>
          <span className="mt-1 text-xs sm:text-sm font-semibold uppercase tracking-widest text-gray-500">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
