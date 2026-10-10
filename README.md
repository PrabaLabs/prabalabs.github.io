# PrabaLabs website

The site at https://prabalabs.github.io.

## Pages

- `index.html` home, with two front doors: Festival Experiences and the Unity/XR studio.
- `festivals.html` the sales page for virtual Golu and other festival experiences, with the quote form.
- `services.html` studio services and process.
- `work.html` the Golu case study plus the tutorial grid from YouTube.
- `about.html` founder and values.
- `contact.html` general contact form.

Shared files: `style.css` (colours and layout), `site.js` (mobile menu, video players, form submission), `videos.js` (built automatically).

## Two things to set after deploying

1. **Form access key.** Go to https://web3forms.com, enter prabalabs@gmail.com, and copy the access key from the email. Replace `YOUR_WEB3FORMS_ACCESS_KEY` in `festivals.html` and `contact.html`. Until then the forms show a message asking people to email instead.
2. **Golu demo video.** Upload the demo to YouTube, then replace `YOUTUBE_ID` in `index.html`, `festivals.html` and `work.html` with the video ID. Until then a still image is shown.

## Videos

- New YouTube videos appear on the site by themselves within about six hours.
- To give a video a custom title, text or tags, or to hide it, add its video ID to `video-notes.json`.
