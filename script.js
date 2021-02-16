const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

const threshold = 30;

canvas.width = video.width;
canvas.height = video.height;

function startVideo() {
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: 'user',
      width: 720,
      height: 560
    }
  })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error(err));
}

startVideo();

function drawImage() {
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const pixelData = context.getImageData(0, 0, canvas.width, canvas.height);

  function plotPoint(x, y) {
    context.beginPath();
    context.arc(x, y, 0.5, 0, 2 * Math.PI, false);
    context.fillStyle = 'red';
    context.fill();
    context.beginPath();
  }

  function coreLoop() {
    for (let y = 0; y < pixelData.height; y++) {
      for (let x = 0; x < pixelData.width; x++) {
        let index = (x + y * canvas.width) * 4;
        let pixel = pixelData.data[index+2];

        const left = pixelData.data[index - 4];
        const right = pixelData.data[index + 2];
        const top = pixelData.data[index - (canvas.width * 4)];
        const bottom = pixelData.data[index + (canvas.width * 4)];

        if (pixel > left + threshold) {
          plotPoint(x, y);
        } else if (pixel < left - threshold) {
          plotPoint(x, y);
        } else if (pixel > right + threshold) {
          plotPoint(x, y);
        } else if (pixel < right - threshold) {
          plotPoint(x, y);
        } else if (pixel > top + threshold) {
          plotPoint(x, y);
        } else if (pixel < top - threshold) {
          plotPoint(x, y);
        } else if (pixel > bottom + threshold) {
          plotPoint(x, y);
        } else if (pixel < bottom - threshold) {
          plotPoint(x, y);
        }
      }
    }
  }

  coreLoop();

  setTimeout(drawImage, 200);
}

drawImage();
