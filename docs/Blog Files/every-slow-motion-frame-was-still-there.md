<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My Phone Filmed at 240 Frames a Second. The Browser Got 30, and Every Frame Was Still There.
Slug:    every-slow-motion-frame-was-still-there
Excerpt: Fit T. Cent Assessments will measure hurdle clearance from slow-motion phone video, in
         the browser, with the video never leaving the phone. One question decided whether that
         could work at all: does iPhone Safari hand a web page every frame of a 240 fps clip? A
         one-page test answered it, picked the stack, and caught the pose library posting usage
         logs to Google every 60 seconds.
Tags:    Fit T. Cent, MediaPipe, Web Video, Privacy, Next.js, WitUS
-->

# My Phone Filmed at 240 Frames a Second. The Browser Got 30, and Every Frame Was Still There.

Fit T. Cent Assessments is a portfolio app I am building in the WitUS ecosystem. The first release measures a hurdler's clearance from a slow-motion clip filmed side-on with a phone. Later releases add a hurdle step screen and movement assessments based on NASM's protocol: overhead squat, single-leg squat, push and pull.

The design promise is simple to say and hard to keep: **the pose analysis runs in the browser, and the video never leaves the phone.** Before any feature code, one question decided whether that was possible.

## The question that could kill the design

A hurdle clearance happens in a fraction of a second. At 30 frames a second you get a handful of frames across it. At 240 you get eight times as many, which is why the app needs slow motion.

But a web page does not get the file the camera wrote. A March 2024 WebKit commit about `<input type=file>` on iOS says that content picked from the photo library "has always been transcoded" to JPEG for images and H.264 for video (WebKit, 2024). The commit changed the rule for images. Nobody I could find had tested what that transcode does to a 240 fps slow-motion video. If it dropped frames, recorded hurdle analysis on an iPhone could not work in a browser, and the fallback was AirDrop to a laptop or a small native app.

So the stack research ended with a recommendation and a condition: build on the ecosystem stack, but run one phone test first.

## A one-page test

Claude built a throwaway page that does one job. Pick a slow-motion clip on the phone, and the page reads the file's own timing, decodes every frame in a background worker, fingerprints each frame with a tiny brightness grid, and counts how many are real, distinct captures. Nothing is uploaded; the results stay in the browser until cleared.

The first version asked the wrong question. Its pass rule was "about 1,150 frames at 239 fps." My first clip came back as 3,095 frames over 103 seconds, at 30 fps timestamps. That looks like a failure until you do the arithmetic: 3,095 frames divided by 240 is 12.9 seconds of real time, played back 8 times slower. Photos had handed the page a slow-motion **export**, retimed to 30 fps.

That first version also failed in more ordinary ways. It reported a decoder error badly, crashed twice during the pose step, could not run its playback check because Safari blocked autoplay, showed only the first result in full, and had a Clear button that did nothing. Version 2 fixed those and measured the real question: is every frame a distinct capture?

## The answer

On my iPhone 13, version 2 passed:

- **3,095 frames, 99.7% unique, a slow-motion factor of 8.00.** Every frame of the slow section was a separate captured frame, just stamped 1/30 of a second apart.
- **The normal-speed ramps at the start and end drop frames.** Those parts of the clip change about 8 times more per frame than the middle for a 240 fps clip, and about 4 times more for 120 fps.
- **Decoding cost about 1.4 ms per frame, and the full pose model about 45 ms per frame** on the phone's GPU in a worker, with no crash.

Three rules in the build plan came straight out of those numbers:

1. **The app asks what rate the clip was filmed at.** A Photos export does not carry it. The app then checks the answer: the ramp-to-middle ratio should be near the slow-motion factor, and if it is far off, the app shows the measured ratio beside the user's answer.
2. **Timing needs every event inside the slow section.** If a takeoff or touchdown lands in a ramp, that measurement says "can't tell" instead of guessing, while the angles at that frame still show as an estimate.
3. **Live camera mode uses the lite model.** At 45 ms a frame, the full model is over the 33 ms budget of a 30 fps camera feed.

## The stack, chosen from numbers

The old version of this app was a Vite and Firebase prototype. It is retired from `main` and kept under a git tag. The research compared four options: the WitUS ecosystem stack (Next.js on Vercel), keeping Vite and Firebase, a Vite single-page app with a thin API, and a native app.

The finding that settled it: **performance does not separate the three web options.** All three run the same MediaPipe WebAssembly and WebGL code in the same browser engine. Next.js shipped about 175 KB of gzipped JavaScript to Vite's 70 KB in the measurement, which is about 1% of the 7.4 MB the analysis page downloads anyway for the WebAssembly runtime and the model. Native would get the original 240 fps file, but the test just showed the browser gets every frame that matters.

So on November 1 I approved the ecosystem stack: Next.js on Vercel, Sign in with WitUS, a Neon database for saved results, pose in the browser in a Web Worker, and the video staying on the device. No video is stored.

## The library that phoned home

The first local test run of the page turned up something I did not expect. MediaPipe's `@mediapipe/tasks-vision` 1.2.0 creates a usage logger for every task. In the published package, that logger sends a `POST` to `https://odml.pa.googleapis.com/v1/log` on a 60-second timer, and again on close (Google, 2026). Claude found no setting to turn it off.

I did not try to work out what each log contains. A page that promises the video stays on the phone should not be posting anything to a third party on a timer, whatever the payload. So the page does two things:

- **The vendored copy of the library is patched** so the logger collects nothing and its flush does nothing. The patched file's checksum is recorded beside the original's.
- **The page sends a Content Security Policy of `connect-src 'self' blob: data:`.** That directive limits which URLs a page's scripts can load from, covering `fetch()`, `XMLHttpRequest`, WebSockets and `sendBeacon` (MDN contributors, 2026). If the patch misses a code path, the browser blocks the request anyway. The local test harness also counts every request that leaves localhost.

The patch is the fix. The policy is the guard that catches the fix being wrong.

## Where it stands

Nothing is in production yet. The app shell, with CI and the accessibility and 320-pixel layout checks, is merged. Sign-in, the database and the first release wait on my own dashboard steps and on adult test clips of a hurdler filmed at 240 fps. One question stays open: whether picking the clip from the Files app keeps the original 240 fps timing.

## What I would tell someone building on phone video in a browser

- **Test the file you will really get, on the phone you will really use.** The documentation question was "does Safari transcode?" The useful question was "is every frame still a distinct capture?"
- **Write the pass rule before the test, and be ready to find it was the wrong rule.** Mine was. The failure taught me what to measure.
- **Measure before you pick a stack.** My framework choice moved the download by about 1%.
- **Read what your libraries send.** If your promise is "nothing leaves the device," make the browser enforce it, not just your code.

## References

Google. (2026). *@mediapipe/tasks-vision* (Version 1.2.0) [Computer software]. npm. Retrieved November 1, 2026, from https://www.npmjs.com/package/@mediapipe/tasks-vision/v/1.2.0

MDN contributors. (2026, July 3). *Content-Security-Policy: connect-src directive*. MDN Web Docs. Retrieved November 1, 2026, from https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/connect-src

WebKit. (2024, March 12). *[iOS] Avoid transcoding images on file inputs unless the set of image types is explicitly restricted* (Bug 267277) [Source code commit]. GitHub. Retrieved November 1, 2026, from https://github.com/WebKit/WebKit/commit/02a5c284178e4c4c9184cf721954243d59678a03
