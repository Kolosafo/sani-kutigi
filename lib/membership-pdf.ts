import { jsPDF } from 'jspdf'
import {
  getMembershipDetails,
  MEMBERSHIP_REVIEW_NOTICE,
  type MembershipRegistration,
} from './membership'

export function createMembershipPdf(membership: MembershipRegistration, font: string) {
  const pdf = new jsPDF({ format: 'a4', unit: 'mm', compress: true })
  pdf.addFileToVFS('Geist-Regular.ttf', font)
  pdf.addFont('Geist-Regular.ttf', 'Geist', 'normal')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 16
  const width = pageWidth - margin * 2
  const columnWidth = (width - 16) / 2

  pdf.setProperties({
    title: 'SKV 2027 Membership Registration Card',
    subject: `Membership registration ${membership.id}`,
    author: 'The Sani Kutigi Vanguard',
  })

  function drawHeader() {
    pdf.setFillColor('#166534')
    pdf.rect(margin, margin, width, 40, 'F')
    const colours = ['#15803d', '#ffffff', '#1d4ed8', '#dc2626']
    colours.forEach((colour, index) => {
      pdf.setFillColor(colour)
      pdf.rect(margin + (width / 4) * index, margin, width / 4, 2, 'F')
    })
    pdf.setTextColor('#ffffff')
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.text('SKV 2027', margin + 8, margin + 11)
    pdf.setFontSize(19)
    pdf.text('Membership Registration Card', margin + 8, margin + 21)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    pdf.text('The Sani Kutigi Vanguard', margin + 8, margin + 29)
    pdf.setFontSize(9)
    pdf.text('Leading the Way for a Greater Niger South', margin + 8, margin + 35)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.setTextColor('#92400e')
    pdf.text('Pending review', margin + 8, margin + 50)
  }

  drawHeader()
  let y = margin + 63
  const details = getMembershipDetails(membership)

  for (let index = 0; index < details.length; index += 2) {
    pdf.setFont('Geist', 'normal')
    pdf.setFontSize(11)
    const row = details.slice(index, index + 2).map((detail) => ({
      ...detail,
      lines: pdf.splitTextToSize(detail.value, columnWidth) as string[],
    }))
    const lineCount = Math.max(...row.map((detail) => detail.lines.length))
    let offset = 0

    while (offset < lineCount) {
      let availableLines = Math.floor((pageHeight - margin - 30 - y - 11) / 5)
      if (availableLines < 1) {
        pdf.addPage()
        drawHeader()
        y = margin + 63
        availableLines = Math.floor((pageHeight - margin - 30 - y - 11) / 5)
      }
      const count = Math.min(availableLines, lineCount - offset)

      row.forEach(({ label, lines }, column) => {
        const visibleLines = lines.slice(offset, offset + count)
        if (visibleLines.length === 0) return
        const x = margin + 8 + column * (columnWidth + 8)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)
        pdf.setTextColor('#6b7280')
        pdf.text(label, x, y)
        pdf.setFont('Geist', 'normal')
        pdf.setFontSize(11)
        pdf.setTextColor('#111827')
        pdf.text(visibleLines, x, y + 6, { lineHeightFactor: 1.3 })
      })
      offset += count
      y += 11 + count * 5
    }
  }

  pdf.setDrawColor('#e5e7eb')
  pdf.line(margin + 8, y, pageWidth - margin - 8, y)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor('#6b7280')
  pdf.text(pdf.splitTextToSize(MEMBERSHIP_REVIEW_NOTICE, width - 16), margin + 8, y + 8)

  return pdf
}

export async function downloadMembershipPdf(membership: MembershipRegistration) {
  const response = await fetch('/fonts/Geist-Regular.ttf')
  if (!response.ok) throw new Error('Unable to load the membership PDF font')
  const bytes = new Uint8Array(await response.arrayBuffer())
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192))
  }

  const filename = `SKV-2027-membership-${membership.id.replace(/[^a-zA-Z0-9-]/g, '-')}.pdf`
  await createMembershipPdf(membership, btoa(binary)).save(filename, { returnPromise: true })
}
