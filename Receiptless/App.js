import React from 'react';
import Amplify from 'aws-amplify';
import awsConfig from './aws-exports';
import { Platform } from 'react-native';
import {AmplifyTheme} from 'aws-amplify-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SplashScreen from './components/SplashScreen';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createSwitchNavigator} from 'react-navigation'
import HomeScreen from './components/HomeScreen';
import ReceiptsScreen from './components/ReceiptsScreen';
import ExpensesScreen from './components/ExpensesScreen';
import CameraScreen from './components/CameraScreen';
import {withAuthenticator} from 'aws-amplify-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

//disabloe developer warnings for demonstartion
console.disableYellowBox = true;
// create bottom navbar
const App = createBottomTabNavigator(
  {
    Home: { screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name='ios-home' color={tintColor} size={23}/>
      )
    }
  },
  Camera: { screen: CameraScreen,
    navigationOptions: {
      tabBarLabel: 'Camera',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name='ios-camera' color={tintColor} size={28}/>
      )
    } 
  },
    Receipts: { screen: ReceiptsScreen,
    navigationOptions: {
      tabBarLabel: 'Receipts',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name='ios-paper' color={tintColor} size={23}/>
      )
    }
  },
    Expenses: { screen: ExpensesScreen,
      navigationOptions: {
        tabBarLabel: 'Expenses',
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name='ios-calculator' color={tintColor} size={23}/>
        )
      }
    } 
  }, {
    initialRouteName: 'Home',
    tabBarOptions: {
    activeTintColor: '#4FB7F3',
    inactiveTintColor: 'gray'
    },
  }
);
// add loading screen
const InitialNavigator = createSwitchNavigator({
  Splash: SplashScreen,
  App: App
});
// navigator for entire app
const NewContainer = createAppContainer(InitialNavigator);

// main render class, contains cognito sign in information
class RealApp extends React.Component { 
  constructor(props) {
    super(props);  
  }
  render() { 
    return( 
        <NewContainer />
    );
  }
}

// configuring our Cognito user pool
Amplify.configure(awsConfig);

// adjust sign in / sign up
let MyButton = null
let sectionLink = null
let buttondisable = null
let myNavBary = null
let signoutBut = null

// screen adjustments for different platforms
if ( Platform.OS === 'ios') {
  MyButton = Object.assign({}, AmplifyTheme.button, { backgroundColor: '#4FB7F3', borderRadius:25 });
  sectionLink = Object.assign({}, AmplifyTheme.sectionFooterLink, { color: '#4FB7F3' });
  buttonText = Object.assign({}, AmplifyTheme.buttonText, { color: 'white', fontWeight:'bold' });
  buttondisable = Object.assign({}, AmplifyTheme.buttonDisabled, { backgroundColor: '#cccccc' });
  myNavBary = Object.assign({}, AmplifyTheme.navBar, { marginTop:hp('4.3%')});
  signoutBut = Object.assign({}, AmplifyTheme.navButton, { paddingTop:5,paddingBottom:5,marginLeft:wp('46%'),borderRadius:50});
}else{
  MyButton = Object.assign({}, AmplifyTheme.button, { backgroundColor: '#4FB7F3', borderRadius:25 });
  sectionLink = Object.assign({}, AmplifyTheme.sectionFooterLink, { color: '#4FB7F3'});
  buttonText = Object.assign({}, AmplifyTheme.buttonText, { color: 'white', fontWeight:'bold' });
  buttondisable = Object.assign({}, AmplifyTheme.buttonDisabled, { backgroundColor: '#cccccc' });
  myNavBary = Object.assign({}, AmplifyTheme.navBar, { marginTop:hp('0%')});
  signoutBut = Object.assign({}, AmplifyTheme.navButton, { paddingTop:5,paddingBottom:5,marginLeft:wp('44%'),borderRadius:50 });
}

const MyTheme = Object.assign({}, AmplifyTheme, { button: MyButton },{buttonText:buttonText}, {sectionFooterLink:sectionLink},{buttonDisabled:buttondisable},{navButton:signoutBut},{navBar:myNavBary});

// export main class with customised sign in / sign up 
export default withAuthenticator(RealApp,true, [], null, MyTheme, {header: 'Sign up to Receiptless',
hideAllDefaults: true,
signUpFields: [
  {
    label: 'Username',
    key: 'username',
    required: true,
    displayOrder: 1,
    type: 'string'
  },
  {
    label: 'Password',
    key: 'password',
    required: true,
    displayOrder: 2,
    type: 'password'
  },
  {
    label: 'Email',
    key: 'email',
    required: true,
    displayOrder: 3,
    type: 'string'
  }
]
}
);
