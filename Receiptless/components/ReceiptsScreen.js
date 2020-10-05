import React from 'react';
import { Text, View, StyleSheet, Platform, RefreshControl, ScrollView} from 'react-native';
import { API } from 'aws-amplify';
import ReceiptScreenData from './ReceiptsScreenData'
import { withAuthenticator } from 'aws-amplify-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// main class with main states
class ReceiptsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receipts: null,
      refreshing: false
    }
  }
  // call function when screen loads
  componentDidMount(){
    this.getreceipts()
  }

  // get receipt function, Get request to api to get reeipts from DB
  getreceipts = async() => {
    this.setState({
      refreshing:true
    })
    let apiName = 'ourAPI';
    let path = '/getReceipts';
    let myInit = { 
      headers: {},
      queryStringParameters: {
         sub: this.props.authData.attributes.sub
      }}
      API.get(apiName, path, myInit)
      .then(response => {   
        console.log(response)
        this.setState({
          receipts: response,
        })
      })
      .catch(error => {
        alert("Invalid Receipt, Please retake")
      });
      this.setState({
        refreshing: false
      })
      
    };
    // Pull down refresh control, call getReceipts after refresh
    render() {
      let {receipts} = this.state;
        return (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.getreceipts} />}>
        <View
        style={styles.container2}>
        <Text style={styles.writingText}>New receipts will take 30 seconds to upload</Text>
        <Text style={styles.writingText}>Pull down to refresh!</Text>
        </View> 
        {/* Render card component from ReceiptScreenData */}
          {receipts != null &&
            <ReceiptScreenData receipts = {this.state.receipts} />
          }
        </ScrollView>
        
        );
  }
}


const styles = StyleSheet.create({
  writingText:{
    ...Platform.select({
      ios:{
        fontSize: 14,
        color: 'white'
      },
      android:{
        fontSize: 12,
        color: 'white',
      }
    }) 
  },
  container:{
    flex: 1
  },
  container2: {
    ...Platform.select({
      ios:{
        flex: 0.1,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#4FB7F3',
        padding:7
      },
      android:{
        flex: 0.1,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#4FB7F3',
        padding:3
      }
    }) 
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    ...Platform.select({
      ios:{
        paddingBottom: hp(0.01),
        paddingTop: hp(0.1),
        marginTop: 2,
        marginBottom: 2,
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
    color: '#4FB7F3',
    ...Platform.select({
      ios:{
        fontSize: hp(6)
      },
      android:{
        fontSize: hp(3)
      }
    })
  }})

export default withAuthenticator(ReceiptsScreen);