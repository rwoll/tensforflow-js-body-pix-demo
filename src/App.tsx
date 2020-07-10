import React from 'react';
import './App.css';
import * as bp from "@tensorflow-models/body-pix"

class App extends React.Component {
  private videoRef = React.createRef<HTMLVideoElement>();
  private canvasRef = React.createRef<HTMLCanvasElement>();

  componentDidMount() {
    const canvas = this.canvasRef.current!;
    const video = this.videoRef.current!;

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
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
          <video ref={this.videoRef} width="530" height="300" autoPlay={true} playsInline={true}></video>
          <canvas ref={this.canvasRef} />
        </div>
      </div>
    );
  }
}

export default App;
