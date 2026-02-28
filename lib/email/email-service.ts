import nodemailer from 'nodemailer'
import {
  getProposalSharedTemplate,
  getProposalUpdatedTemplate,
  getApprovalNotificationTemplate,
  getCommentNotificationTemplate
} from './templates'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'bam@awews.com'
const FROM_NAME = 'BAM Consulting'
const FROM_EMAIL = process.env.SMTP_USER || ADMIN_EMAIL

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  // Skip if SMTP not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP not configured, skipping email to:', to)
    return false
  }

  try {
    const transporter = createTransporter()
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html
    })
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

/**
 * Send proposal shared notification to client
 */
export async function sendProposalSharedEmail(
  clientEmail: string,
  clientName: string,
  projectName: string,
  portalUrl: string,
  accessCode?: string
): Promise<boolean> {
  const subject = `New proposal: ${projectName}`
  const html = getProposalSharedTemplate({ clientName, projectName, portalUrl, accessCode })
  return sendEmail(clientEmail, subject, html)
}

/**
 * Send proposal updated notification to client
 */
export async function sendProposalUpdatedEmail(
  clientEmail: string,
  clientName: string,
  projectName: string,
  portalUrl: string,
  changes: string[]
): Promise<boolean> {
  const subject = `Updated: ${projectName}`
  const html = getProposalUpdatedTemplate({ clientName, projectName, portalUrl, changes })
  return sendEmail(clientEmail, subject, html)
}

/**
 * Send approval/rejection notification to admin
 */
export async function sendApprovalNotificationEmail(
  projectName: string,
  clientName: string,
  status: string,
  note?: string
): Promise<boolean> {
  const statusLabel = status === 'approved' ? 'Approved' : status === 'rejected' ? 'Declined' : 'Revision Requested'
  const subject = `Proposal ${statusLabel}: ${projectName}`
  const html = getApprovalNotificationTemplate({ projectName, clientName, status: statusLabel, note })
  return sendEmail(ADMIN_EMAIL, subject, html)
}

/**
 * Send new comment notification to admin
 */
export async function sendCommentNotificationEmail(
  projectName: string,
  clientName: string,
  comment: string
): Promise<boolean> {
  const subject = `New comment on: ${projectName}`
  const html = getCommentNotificationTemplate({ projectName, clientName, comment })
  return sendEmail(ADMIN_EMAIL, subject, html)
}
