import React from 'react';
import './App.css';
import * as bp from "@tensorflow-models/body-pix"

const MEDIA_DIMENSIONS = Object.freeze({
  WIDTH: 530,
  HEIGHT: 300,
});

class App extends React.Component {
  private videoRef = React.createRef<HTMLVideoElement>();
  private canvasRef = React.createRef<HTMLCanvasElement>();

  componentDidMount() {
    const canvas = this.canvasRef.current!;
    const video = this.videoRef.current!;

    navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: MEDIA_DIMENSIONS.WIDTH },
        height: { ideal: MEDIA_DIMENSIONS.HEIGHT },
      }, audio: false
    })
      .then(stream => {
        video.srcObject = stream;
        video.play();
      })
      .catch(window.alert);

    video.addEventListener("playing", () => {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
    });

    let inited = false;
    video.addEventListener("loadeddata", () => {
      if (!inited) {
        inited = true;
        window.setTimeout(() => {
          bp.load({
            architecture: "ResNet50",
            outputStride: 16,
            multiplier: 1,
            quantBytes: 2,
          })
            .then(async net => {
              console.log(net)
              while (true) {
                const segmentation = await net.segmentPerson(video, {
                  flipHorizontal: false,
                  internalResolution: "low",
                  segmentationThreshold: 0.7,
                  maxDetections: 5,
                  scoreThreshold: 0.3,
                  nmsRadius: 20,
                });
                bp.drawMask(canvas, video, bp.toMask(segmentation), 0.9, 0, true);
              }
            })
            .catch(console.warn);
        }, 2000)
      }
    });
  }

  render() {
    return (
      <div className="App">
        <div>
          <video style={{ transform: 'rotateY(180deg)' }} ref={this.videoRef} width={MEDIA_DIMENSIONS.WIDTH} height={MEDIA_DIMENSIONS.HEIGHT} autoPlay={true} playsInline={true}></video>
          <canvas ref={this.canvasRef} width={MEDIA_DIMENSIONS.WIDTH} height={MEDIA_DIMENSIONS.HEIGHT} />
        </div>
      </div>
    );
  }
}

export default App;
