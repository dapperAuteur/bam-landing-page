function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background: white; border-radius: 8px; padding: 32px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { text-align: center; padding: 20px 0; }
    .header h1 { color: #1a1a1a; font-size: 24px; margin: 0; }
    .btn { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 16px 0; }
    .btn:hover { background-color: #1d4ed8; }
    .footer { text-align: center; color: #888; font-size: 12px; padding: 20px 0; }
    .status-approved { color: #16a34a; font-weight: bold; }
    .status-rejected { color: #dc2626; font-weight: bold; }
    .status-revised { color: #ca8a04; font-weight: bold; }
    .note { background: #f9fafb; border-left: 4px solid #2563eb; padding: 12px 16px; margin: 16px 0; }
    ul { padding-left: 20px; }
    li { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p>BAM Consulting &bull; Brand Anthony McDonald</p>
    </div>
  </div>
</body>
</html>`
}

export function getProposalSharedTemplate({
  clientName,
  projectName,
  portalUrl,
  accessCode
}: {
  clientName: string
  projectName: string
  portalUrl: string
  accessCode?: string
}): string {
  return baseTemplate(`
    <div class="header">
      <h1>New Proposal</h1>
    </div>
    <div class="card">
      <p>Hi ${clientName},</p>
      <p>A new proposal has been prepared for you:</p>
      <h2 style="color: #1a1a1a;">${projectName}</h2>
      <p>You can review the full proposal, including scope of work, pricing, timeline, and any attached media using the link below.</p>
      <div style="text-align: center;">
        <a href="${portalUrl}" class="btn">View Proposal</a>
      </div>
      ${accessCode ? `
        <div class="note">
          <strong>Access Code:</strong> ${accessCode}<br>
          <small>You'll need this code to access the proposal.</small>
        </div>
      ` : ''}
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br>Brand Anthony McDonald</p>
    </div>
  `)
}

export function getProposalUpdatedTemplate({
  clientName,
  projectName,
  portalUrl,
  changes
}: {
  clientName: string
  projectName: string
  portalUrl: string
  changes: string[]
}): string {
  return baseTemplate(`
    <div class="header">
      <h1>Proposal Updated</h1>
    </div>
    <div class="card">
      <p>Hi ${clientName},</p>
      <p>The proposal <strong>${projectName}</strong> has been updated:</p>
      ${changes.length > 0 ? `
        <ul>
          ${changes.map(c => `<li>${c}</li>`).join('')}
        </ul>
      ` : ''}
      <div style="text-align: center;">
        <a href="${portalUrl}" class="btn">View Updated Proposal</a>
      </div>
      <p>Best regards,<br>Brand Anthony McDonald</p>
    </div>
  `)
}

export function getApprovalNotificationTemplate({
  projectName,
  clientName,
  status,
  note
}: {
  projectName: string
  clientName: string
  status: string
  note?: string
}): string {
  const statusClass = status === 'Approved' ? 'status-approved' : status === 'Declined' ? 'status-rejected' : 'status-revised'

  return baseTemplate(`
    <div class="header">
      <h1>Proposal Response</h1>
    </div>
    <div class="card">
      <p><strong>${clientName}</strong> has responded to the proposal:</p>
      <h2 style="color: #1a1a1a;">${projectName}</h2>
      <p>Status: <span class="${statusClass}">${status}</span></p>
      ${note ? `
        <div class="note">
          <strong>Client's note:</strong><br>
          ${note}
        </div>
      ` : ''}
      <p>Check the admin dashboard for full details.</p>
    </div>
  `)
}

export function getCommentNotificationTemplate({
  projectName,
  clientName,
  comment
}: {
  projectName: string
  clientName: string
  comment: string
}): string {
  return baseTemplate(`
    <div class="header">
      <h1>New Comment</h1>
    </div>
    <div class="card">
      <p><strong>${clientName}</strong> commented on:</p>
      <h2 style="color: #1a1a1a;">${projectName}</h2>
      <div class="note">
        ${comment}
      </div>
      <p>Check the admin dashboard to respond.</p>
    </div>
  `)
}
