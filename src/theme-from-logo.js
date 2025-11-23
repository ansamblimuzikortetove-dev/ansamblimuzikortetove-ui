// Dynamically derive theme colors from logo.png if present (dominant color as --accent)
export async function applyLogoTheme() {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = "/logo.png";
  await new Promise((res) => { img.onload = res; img.onerror = res; });

  if (!img.width) return; // no logo

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  // Simple histogram for dominant color
  const buckets = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i+1] / 32) * 32;
    const b = Math.round(data[i+2] / 32) * 32;
    const key = `${r},${g},${b}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }
  let best = [234,179,8], count = 0;
  buckets.forEach((c, k) => {
    if (c > count) { count = c; best = k.split(",").map(Number); }
  });
  const [r,g,b] = best;
  const accent = `rgb(${r}, ${g}, ${b})`;
  document.documentElement.style.setProperty("--accent", accent);
}
