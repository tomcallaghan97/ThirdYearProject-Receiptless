import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { withAuthenticator } from 'aws-amplify-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// main home screen class
class HomeScreen extends React.Component {
  // initial states
  constructor(props){
    super(props);
    this.state = { isLoading: true }
  }

    render() {  
    return (
      // quick link buttons to navigate
      <View style={styles.container1}> 
       <Image style={styles.logo} source={require('./images/RECEIPTLESS-Logo-Updated.png')} />
       <View
          style={styles.container2}>
          <Text style={styles.welcomeText}>Get Started!</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Camera')}>
            <Text style={styles.buttonText}>Scan Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Receipts')}>
            <Text style={styles.buttonText}>View Receipts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Expenses')}>
            <Text style={styles.buttonText}>Track Expenses</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container1: {
    paddingTop: 20,
    flex:3,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'white'
  },
  container2: {
    flex:5,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'white'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#4FB7F3',
    borderRadius: 12,
    ...Platform.select({
      ios:{
        paddingBottom: hp(0.1),
        paddingTop: hp(1.1),
        marginTop: 20,
        width: wp(52),
        height: hp(5),
      },
      android:{
        padding: 10,
        width: wp('50%'),
        marginTop: hp(2)
      }
    }) 
  },
  buttonText: {
    color: 'white',
    ...Platform.select({
      ios:{
        fontSize: hp(2)
      },
      android:{
        fontSize: hp(2)
      }
    })
  },
  welcomeText:{
    fontSize: 30,
    color: '#4FB7F3'
  },
  logo: {
    resizeMode: 'contain',
    flex: 4,
    width: '70%',
    height: '70%'
  }
});

// export with cognito information
export default withAuthenticator(HomeScreen);