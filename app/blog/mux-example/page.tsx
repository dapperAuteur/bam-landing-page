import React from 'react'
import MuxPlayer from "@mux/mux-player-react"; 

function page() {
  return (
    <div>
      <MuxPlayer
        playbackId="lu4XKszNivor43Jzuuyks2YoTlmFYesel9xKAd00VuKM"
        metadata={{
          video_id: "video-id-54321",
          video_title: "2024-03-01-Bubbles-BAM_3625",
          viewer_user_id: "user-id-007",
        }}
      />
    </div>
  )
}

export default page