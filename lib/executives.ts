export type Executive = {
  name: string
  portfolio: string
  // Congratulatory poster in /public/executives; omitted when none has been released yet
  poster?: string
}

// Official order from the SKV executives list (Reg. No. NS/0196/2026, dated 30-08-2026)
export const executives: Executive[] = [
  { name: 'Hon. Kutigi Idris Dawuda Abdullahi', portfolio: 'Chairman', poster: '/executives/chairman.jpeg' },
  { name: 'Hon. Gloria Gogo Kolo', portfolio: 'Deputy Chairlady', poster: '/executives/deputy-chairlady.jpeg' },
  { name: 'Hon. Ahmed Haruna Tswata', portfolio: 'Secretary', poster: '/executives/secretary.jpeg' },
  { name: 'Engr. Ishaq Aliyu Umar', portfolio: 'Deputy Secretary', poster: '/executives/deputy-secretary.jpeg' },
  { name: 'Umar Bashir', portfolio: 'Treasurer', poster: '/executives/treasurer.jpeg' },
  { name: 'Mas’ud Muhammad', portfolio: 'Deputy Treasurer', poster: '/executives/deputy-treasurer.jpeg' },
  { name: 'Hauwa Mamma Jiya', portfolio: 'Treasury Secretary', poster: '/executives/treasury-secretary.jpeg' },
  { name: 'Malam Abdullahi Usman', portfolio: 'Organizing Secretary', poster: '/executives/organizing-secretary.jpeg' },
  { name: 'Muhammad Panti Ibrahim', portfolio: 'Publicist', poster: '/executives/publicist.jpeg' },
  { name: 'Barrister Hauwa Yahaya Sayuti, Esq.', portfolio: 'Legal Adviser', poster: '/executives/legal-adviser.jpeg' },
  { name: 'Sani Abdulmaliq', portfolio: 'Welfare Officer' },
  { name: 'Hon. Abdullahi Musa', portfolio: 'Auditor' },
  { name: 'Muhammad Ibrahim Takuti', portfolio: 'Youth Development Coordinator' },
  { name: 'Joyce Nnadzwa Jiya', portfolio: 'Women Development Coordinator', poster: '/executives/women-development-coordinator.jpeg' },
  { name: 'Mohammed Yusuf', portfolio: 'Research and Strategy Coordinator', poster: '/executives/research-strategy-coordinator.jpeg' },
  { name: 'Ahmed Aliyu', portfolio: 'Mobilization Coordinator' },
]

// Appointees outside the executive council list
export const directors: Executive[] = [
  {
    name: 'Hon. Adamu Ndanusa Etswan',
    portfolio: 'Director-General, Digital Strategy, Media & Public Engagement',
    poster: '/executives/dg-digital-strategy.jpeg',
  },
  {
    name: 'Abdullahi Mohammed Santali',
    portfolio: 'Coordinator-General, Digital Media & Social Media Engagement',
    poster: '/executives/cg-digital-media.jpeg',
  },
]

export const registration = {
  number: 'NS/0196/2026',
  date: '24 August 2026',
  authority: 'Niger State Ministry of Youth and Sports Development, Minna',
}
