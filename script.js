// script.js

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let image = new Image();
let textAdded = false;
let rotationAngle = 0;

// Load image onto canvas
document.getElementById("upload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    image.src = event.target.result;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    };
  };
  reader.readAsDataURL(file);
});

// Add text to canvas
function addText() {
  if (!textAdded) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Sample Text", canvas.width / 2 - 70, canvas.height / 2);
    textAdded = true;
  }
}

// Apply grayscale filter
function applyGrayscale() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    imageData.data[i] = avg;
    imageData.data[i + 1] = avg;
    imageData.data[i + 2] = avg;
  }
  ctx.putImageData(imageData, 0, 0);
}

// Apply sepia filter
function applySepia() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const red = imageData.data[i];
    const green = imageData.data[i + 1];
    const blue = imageData.data[i + 2];
    imageData.data[i] = red * 0.393 + green * 0.769 + blue * 0.189;
    imageData.data[i + 1] = red * 0.349 + green * 0.686 + blue * 0.168;
    imageData.data[i + 2] = red * 0.272 + green * 0.534 + blue * 0.131;
  }
  ctx.putImageData(imageData, 0, 0);
}

// Remove background (simple version)
function removeBackground() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const threshold = 200;
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    if (r > threshold && g > threshold && b > threshold) {
      imageData.data[i + 3] = 0;  // Set alpha to 0
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

// Rotate image
function rotate() {
  rotationAngle += 90;
  if (rotationAngle >= 360) rotationAngle = 0;

  canvas.width = image.height;
  canvas.height = image.width;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotationAngle * Math.PI) / 180);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  ctx.restore();
}

// Crop image to center 50% area
function crop() {
  const croppedWidth = canvas.width / 2;
  const croppedHeight = canvas.height / 2;
  const imageData = ctx.getImageData(
    canvas.width / 4,
    canvas.height / 4,
    croppedWidth,
    croppedHeight
  );
  canvas.width = croppedWidth;
  canvas.height = croppedHeight;
  ctx.putImageData(imageData, 0, 0);
}

// Download the edited image
function downloadImage() {
  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = canvas.toDataURL();
  link.click();
}
