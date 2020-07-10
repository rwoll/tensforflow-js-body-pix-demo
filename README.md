Live Video Image Masks in the Browser
=====================================

Demo deployed @ https://tensorflow-body-pix-javascript-react-demo.netlify.app/.

A quick demo of using [TensforFlow.js's](https://github.com/tensorflow/tfjs)
[BodyPix Person Segmentation](https://github.com/tensorflow/tfjs-models/tree/master/body-pix)
with [React.js](https://reactjs.org/).

Please note: The code lacks error handling, proper component (and event listener)
teardown, and has an awful `while (true)`.

The interesting bits are in [`/src/App.tsx`](/src/App.tsx). (The rest of the code is
[create-react-app](https://github.com/facebook/create-react-app) boiler.)

If you're interested in learning more, take a look at the following resources:

* [Google's Blogpost About BodyPix Features](https://blog.tensorflow.org/2019/11/updated-bodypix-2.html)
* [BodyPix README](https://github.com/tensorflow/tfjs-models/blob/master/body-pix/README.md)
* [Google's Interactive/Live BodyPix Demo Playground](https://storage.googleapis.com/tfjs-models/demos/body-pix/index.html)
