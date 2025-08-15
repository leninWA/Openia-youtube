const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");

// Carpeta de descargas
const downloadFolder = "./downloads";
if (!fs.existsSync(downloadFolder)) fs.mkdirSync(downloadFolder);

// Función para descargar YouTube
async function downloadYouTube(url, mp3 = false) {
  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, "_");
    const path = mp3 ? `${downloadFolder}/${title}.mp3` : `${downloadFolder}/${title}.mp4`;

    if (mp3) {
      const stream = ytdl(url, { filter: "audioonly" });
      ffmpeg(stream)
        .save(path)
        .on("end", () => console.log("✅ MP3 descargado:", path))
        .on("error", err => console.error("❌ Error al convertir a MP3:", err));
    } else {
      ytdl(url).pipe(fs.createWriteStream(path))
        .on("finish", () => console.log("✅ MP4 descargado:", path))
        .on("error", err => console.error("❌ Error al descargar MP4:", err));
    }
  } catch (err) {
    console.error("❌ Error al descargar:", err.message);
  }
}

// ----------------- EJEMPLO DE USO -----------------
const url = "https://youtu.be/-ojVehoKckI?si=A1nxEWJKjJn_73o1";

// Descargar MP3
downloadYouTube(url, true);

// Descargar MP4
// downloadYouTube(url, false);
