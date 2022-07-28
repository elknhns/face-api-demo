const video = document.getElementById("video");

const loadModels = () =>
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/src/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/src/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/src/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/src/models"),
  ]);

const startVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
  } catch (error) {
    console.error(error);
  }
};

const prepareFaceID = async () => {
  await loadModels();
  startVideo();

  video.addEventListener("playing", () => {
    const canvas = faceapi.createCanvas(video);
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    document.body.append(canvas);
    const displaySize = { width: video.clientWidth, height: video.clientHeight };
    console.log('displaySize', JSON.stringify(displaySize, null, 2))

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }, 100);
  });
};

prepareFaceID();
