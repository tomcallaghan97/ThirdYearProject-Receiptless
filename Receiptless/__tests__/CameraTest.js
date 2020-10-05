import React from 'react';
import react from 'react-native';
import CameraScreen from '../components/CameraScreen'

import renderer from 'react-test-renderer';

it('Check camera and image state',()=>{
    let ImageDATA = renderer.create(<CameraScreen/>).getInstance();
    console.log(ImageDATA)
    expect(ImageDATA.takePicture()).toEqual("Camera Passed")
    


})