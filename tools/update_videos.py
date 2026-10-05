# Reads the PrabaLabs YouTube channel feed and writes videos.js for the website.
# Run by GitHub Actions on a schedule, or by hand: python tools/update_videos.py
import json
import pathlib
import sys
import urllib.request
import xml.etree.ElementTree as ET

CHANNEL_ID = "UC_FrqJvwagEx7t-I5-u32aQ"
# The "UULF" playlist holds the channel's long videos only (no Shorts).
FEED_URL = "https://www.youtube.com/feeds/videos.xml?playlist_id=UULF" + CHANNEL_ID[2:]
SITE = pathlib.Path(__file__).resolve().parent.parent
NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
    "media": "http://search.yahoo.com/mrss/",
}


def first_paragraph(text, limit=220):
    paragraph = text.strip().split("\n\n")[0].replace("\n", " ").strip()
    if len(paragraph) <= limit:
        return paragraph
    return paragraph[:limit].rsplit(" ", 1)[0] + "…"


def main():
    request = urllib.request.Request(FEED_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        feed = ET.fromstring(response.read())

    notes = json.loads((SITE / "video-notes.json").read_text(encoding="utf-8"))
    videos = []
    for entry in feed.findall("atom:entry", NS):
        video_id = entry.findtext("yt:videoId", namespaces=NS)
        note = notes.get(video_id, {})
        if note.get("hide"):
            continue
        description = entry.findtext("media:group/media:description", default="", namespaces=NS)
        videos.append({
            "id": video_id,
            "published": entry.findtext("atom:published", namespaces=NS),
            "youtubeTitle": entry.findtext("atom:title", namespaces=NS),
            "title": note.get("title") or entry.findtext("atom:title", namespaces=NS),
            "text": note.get("text") or first_paragraph(description),
            "tags": note.get("tags", ""),
        })

    if not videos:
        sys.exit("The feed returned no videos, so videos.js was left unchanged.")

    videos.sort(key=lambda video: video["published"], reverse=True)
    output = "// Written by tools/update_videos.py. Do not edit by hand.\n"
    output += "window.PRABALABS_VIDEOS = " + json.dumps(videos, indent=2, ensure_ascii=False) + ";\n"
    (SITE / "videos.js").write_text(output, encoding="utf-8", newline="\n")
    print("Wrote", len(videos), "videos.")


if __name__ == "__main__":
    main()
