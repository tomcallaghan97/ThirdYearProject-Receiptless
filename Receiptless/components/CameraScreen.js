import React,{Component} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, TouchableHighlight, Platform } from 'react-native';
import { API } from 'aws-amplify';
import {RNCamera} from 'react-native-camera';
import { withNavigationFocus } from 'react-navigation';
import RNFS from 'react-native-fs';
import { withAuthenticator } from 'aws-amplify-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Thumbnail} from 'native-base';

// main class
class CameraScreen extends Component {
  // img state used to choose what screen to render
  // newimg = captured image
  constructor(props) {
    super(props);
    this.state = {
      img : null,
      newimg:null
  }
}
  render() {
    const{img} = this.state;
    const{isFocused} = this.props;
    const{category} = this.state

    // if img is not null render Accept/ Reject
    if (img){
      return <View style={styles.container}>
                <Image source={{uri:img}} style={styles.preview}></Image>
                 <View style={styles.container2}>
                    <TouchableOpacity
                    style={styles.buttonNo}
                    onPress={() => this.setState({
                    img: null})
                     }>
                    <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={styles.buttonYes}
                    onPress={() => this.setState({
                      category:  "no",
                      img:null
                       })
                      }>    
                    <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>;      
    }
    // if Accept pressed, render categories
    if (category == "no" && img==null){
      return <View style={styles.container3}>
                    <View style={styles.containerTitle}><Text style={styles.categoryText}>Pick a Receipt Category</Text></View>
                    <Thumbnail style={styles.thumbnail} source={require('./images/entertainment.png')}/>
                    <TouchableOpacity
                    style={styles.button}
                    onPress={this.postData.bind(this,"entertainment")}>
                    <Text style={styles.categoryButtonText}>Entertainment</Text>
                    </TouchableOpacity>
                    <Thumbnail style={styles.thumbnail}  source={require('./images/travel.png')}/>
                    <TouchableOpacity
                    style={styles.button}
                    onPress={this.postData.bind(this,"travel")}>
                    <Text style={styles.categoryButtonText}>Travel</Text>
                    </TouchableOpacity>
                    <Thumbnail  style={styles.thumbnail}  source={require('./images/groceries.png')}/>
                    <TouchableOpacity
                    style={styles.button}
                    onPress={this.postData.bind(this,"groceries")}>
                      <Text style={styles.categoryButtonText}>Groceries</Text>
                    </TouchableOpacity>
                    <Thumbnail style={styles.thumbnail}  source={require('./images/clothes.png')}/>
                    <TouchableOpacity
                    style={styles.button}
                    onPress={this.postData.bind(this,"clothes")}>
                    <Text style={styles.categoryButtonText}>Clothes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => this.setState({
                      category:  null,
                      img: null
                    })}>
                    <Thumbnail source={require("./images/cancel.png")} style={styles.thumbnail}></Thumbnail>
                    </TouchableOpacity>
                </View>;      
    }
    // render the camera if img is null
    return(
      <View style={styles.container}>
        {/* reset camera when user navigates to different screen */}
        {isFocused &&
        <View  style={{ flex: 1, justifyContent: 'center' }}>
          <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          captureAudio = {false}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          >
        <TouchableHighlight
          style={styles.capture}
          onPress={this.takePicture.bind(this)}
          underlayColor="rgba(255, 255, 255, 0.5)"
        >
          <View />
          </TouchableHighlight>
          </RNCamera>
          </View>   
        }
         </View>
    );
  }
  // Post request sent to API with img in base64 + category +  users id (cognito)
  postData = async(c) => {
    console.log(c)
    console.log(this.state.newimg)
    let apiName = 'ourAPI';
    let path = '/postReceipts';
    
    RNFS.readFile(this.state.newimg, 'base64')
    .then(res =>{
      let myInit = { 
        headers: {
          'Content-Type': 'application/json'
        },
        body: {"Image": res,
                "Category": c,
                "Sub": this.props.authData.attributes.sub}
      }
      
      API.post(apiName, path, myInit).then(response => {
        console.log(response)
      })
      .catch(error => {
        alert("Invalid Receipt, Please retake")
      });
    });
    this.setState({
      img: null,
      newimg:null,
      category: null
       })
}

// take picture function, set states
  takePicture = async() => {
    if (this.camera) {
      const options = { quality: 0.8, base64: true, orientation: "portrait" };
      const data = await this.camera.takePictureAsync(options);
      
      this.setState({
        img: data.uri,
        newimg: data.uri
      })
      console.log(data.uri)
    }
  };
}

// styling
const styles = StyleSheet.create({
  containerTitle:{
    flex: 0.5,
    justifyContent: 'center',
    alignContent: 'center', 
    alignItems: 'center',
    marginBottom: 10
  },
  cancelButton:{
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop:18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail:{
    marginTop:10
  },
  categoryButtonText:{
    ...Platform.select({
      ios:{
        fontWeight: 'bold',
        color: 'white',
        fontSize: 25,
      },
      android:{
        fontWeight: 'bold',
        color: 'white',
        fontSize: hp(2.5)
      }
    }) 
  },
  categoryText:{
    ...Platform.select({
      ios:{
        fontWeight: 'bold',
        color: '#4FB7F3',
        fontSize: 32
      },
      android:{
        fontWeight: 'bold',
        color: '#4FB7F3',
        fontSize: 24
      }
    }) 
  },
  container3:{
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center', 
    alignItems: 'center'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#4FB7F3',
    borderRadius: 12,
    ...Platform.select({
      ios:{
        paddingBottom: hp(0.1),
        paddingTop: hp(1.1),
        marginTop: 10,
        marginBottom: 10,
        width: wp(52),
        height: hp(5),
      },
      android:{
        marginTop: 10,
        padding: 5,
        width: wp('50%'),
        marginTop: hp(1)
      }
    }) 
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  container2:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#FFF',
    marginBottom: 15,
  },
  buttonNo: {
    alignItems: 'center',
    backgroundColor: 'red',
    width: '45%',
    padding:5,
    borderRadius: 100,
    margin: 5
  },
  buttonYes: {
    alignItems: 'center',
    backgroundColor: 'green',
    width: '45%',
    padding: 5,
    borderRadius: 100,
    margin: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
  }
});

export default withAuthenticator(withNavigationFocus(CameraScreen));