import React from 'react';
import { Content, Card, CardItem, Body, Left, Thumbnail, Right, Button, Icon} from 'native-base';
import { Text, StyleSheet, Platform,TouchableOpacity,View,Image,Alert} from 'react-native';
import { withAuthenticator } from 'aws-amplify-react-native';
import { API } from 'aws-amplify';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// Component class for receipts page
class ReceiptsScreenData extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            imgpreview : null
      }}

    render() {
        // Get request to API to get Receipt image
        getimage = async(id,c) => {
            let apiName = 'ourAPI';
            let path = '/getImage';
            let myInit = { 
              headers: {},
              queryStringParameters: {
                 sub: this.props.authData.attributes.sub,
                 receiptID: id,
                 category: c
              }}
              API.get(apiName, path, myInit)
              .then(response => {   
                this.setState({
                    imgpreview : response
                })
              })
              .catch(error => {
                console.log(error.response)
              });
            };
            // prompt user to confirm deletion process
            const AsyncAlert = () => {
                return new Promise((resolve, reject) => {
                    Alert.alert(
                        'Attention',
                        'Are you sure you wish to delete?',
                        [
                            {text: 'NO', onPress: () => resolve('NO') },
                            {text: 'YES', onPress: () => resolve('YES') }
                        ],
                        { cancelable: false }
                    )
                })
            }    


        // delete receipt function, delete request to API
        deletereceipts = async(id,c) => {
            const userResponse = await AsyncAlert()
            
            if (userResponse == "YES") {
                let apiName = 'ourAPI';
                let path = '/deleteReceipts';
                let myInit = { 
                headers: {},
                body: {"ReceiptID": id,
                        "Sub": this.props.authData.attributes.sub,
                        "Category": c
                    }
                }
                
                API.del(apiName, path, myInit)
                .then(response => {   
                console.log(response)
                alert("Receipt Deleted. Please refresh your page.")
                })
                .catch(error => {
                console.log(error.response)
                alert("Receipt not deleted. Please try again.")
                });
                
            }
 
            };

            
        
        let {receipts} = this.props;
        let {imgpreview} = this.state;

        // function to go through receipts and format them onto card, depending on category
        let receiptsList = receipts.map(function(receipt) {
            let {StoreName, ReceiptTotal, ReceiptDate, receiptID, Category} = receipt
            if (Category == "clothes"){
            return (
                <Card>
                <CardItem>
                    <Left style={styles.container1}>
                        <Thumbnail source={require('./images/clothes.png')}/>
                    </Left>
                    <Body style={styles.container2}>
                    <TouchableOpacity
                    onPress={this.getimage.bind(this,receiptID, Category)}>
                        <Text style={styles.Itemtext}>
                            STORE: {StoreName}
                        </Text>
                        <Text style={styles.Itemtext}>
                            DATE: {ReceiptDate}
                        </Text>
                        <Text style={styles.Itemtext}>
                            TOTAL: €{ReceiptTotal}
                        </Text>
                        </TouchableOpacity>
                    </Body>
                    
                    <Right style={styles.container3}>
                    <Button 
                    style={{ backgroundColor: '#ff0000'}}
                    onPress={this.deletereceipts.bind(this,receiptID, Category)}>
                        <Icon name='trash' />
                    </Button>
                    </Right>
                </CardItem>
                </Card>
            )}
            else if (Category == "travel"){
                return (
                    <Card>
                    <CardItem>
                        <Left style={styles.container1}>
                            <Thumbnail source={require('./images/travel.png')}/>
                        </Left>
                        <Body style={styles.container2}>
                    <TouchableOpacity
                    onPress={this.getimage.bind(this,receiptID, Category)}>
                        <Text style={styles.Itemtext}>
                            STORE: {StoreName}
                        </Text>
                        <Text style={styles.Itemtext}>
                            DATE: {ReceiptDate}
                        </Text>
                        <Text style={styles.Itemtext}>
                            TOTAL: €{ReceiptTotal}
                        </Text>
                        </TouchableOpacity>
                    </Body>
                        <Right style={styles.container3}>
                        <Button
                        style={{ backgroundColor: '#ff0000' }}
                        onPress={this.deletereceipts.bind(this,receiptID, Category)}>
                            <Icon name='trash' />
                        </Button>
                        </Right>
                    </CardItem>
                    </Card>
                )}
            else if (Category == "groceries"){
                return (
                    <Card>
                    <CardItem>
                        <Left style={styles.container1}>
                            <Thumbnail source={require('./images/groceries.png')}/>
                        </Left>
                        <Body style={styles.container2}>
                    <TouchableOpacity
                    onPress={this.getimage.bind(this,receiptID, Category)}>
                        <Text style={styles.Itemtext}>
                            STORE: {StoreName}
                        </Text>
                        <Text style={styles.Itemtext}>
                            DATE: {ReceiptDate}
                        </Text>
                        <Text style={styles.Itemtext}>
                            TOTAL: €{ReceiptTotal}
                        </Text>
                        </TouchableOpacity>
                    </Body>
                        <Right style={styles.container3}>
                        <Button 
                        style={{ backgroundColor: '#ff0000' }}
                        onPress={this.deletereceipts.bind(this,receiptID, Category)}>
                            <Icon name='trash' />
                        </Button>
                        </Right>
                    </CardItem>
                    </Card>
                )}
            else if (Category == "entertainment"){
                return (
                    <Card>
                    <CardItem>
                        <Left style={styles.container1}>
                            <Thumbnail source={require('./images/entertainment.png')}/>
                        </Left>
                        <Body style={styles.container2}>
                    <TouchableOpacity
                    onPress={this.getimage.bind(this,receiptID, Category)}>
                        <Text style={styles.Itemtext}>
                            STORE: {StoreName}
                        </Text>
                        <Text style={styles.Itemtext}>
                            DATE: {ReceiptDate}
                        </Text>
                        <Text style={styles.Itemtext}>
                            TOTAL: €{ReceiptTotal}
                        </Text>
                        </TouchableOpacity>
                    </Body>
                        <Right style={styles.container3}>
                        <Button 
                        style={{ backgroundColor: '#ff0000'}}
                        onPress={this.deletereceipts.bind(this,receiptID, Category)}>
                            <Icon name='trash' />
                        </Button>
                        </Right>
                    </CardItem>
                    </Card>
                )}
           
            
        })  
        // display receipt image if get Image function called
        if (imgpreview){
            return <View style={styles.container}>
                <Image style={{
                    width: wp('180%'),
                    height: hp('69%'),
                    resizeMode: 'contain',
                    alignContent: 'center',
                    paddingTop: 10
                }}
                source={{uri: `data:image/jpg;base64,${imgpreview}`}} />
                <TouchableOpacity
                    style={styles.buttonCancel}
                    onPress={() => this.setState({
                    imgpreview: null})
                     }>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
                </View>
        }
        return (
            <Content>
                {receiptsList}
            </ Content>
        );
    }
}
    


const styles = StyleSheet.create({
    container:{
        alignContent: 'center',
        alignItems: 'center',
        width:"100%"
    },
    container1: {
      ...Platform.select({
        ios:{
            flex: 0.7, 
            justifyContent: 'flex-start'
        },
        android:{
            flex: 1, 
            justifyContent: 'flex-start'
        }
      }) 
    },
    container2: {
        ...Platform.select({
            ios:{
                flex: 3,
                justifyContent: 'flex-start'

            },
            android:{
                flex: 3,
                justifyContent: 'flex-start'
            }
        })
       
    },
    container3:{
        ...Platform.select({
            ios:{
                flex: 0.5, 
                justifyContent: 'flex-end'

            },
            android:{
                flex: 1.1,
                justifyContent: 'flex-end'
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
              fontSize: hp(3)
            }
          })
    },
    Itemtext:{
        ...Platform.select({
            ios:{
                fontSize:14, 
                fontWeight: 'bold'

            },
            android:{
                fontSize:10, 
                fontWeight: 'bold'
            }
        })
    },
    buttonCancel: {
        alignItems: 'center',
        backgroundColor: '#4FB7F3',
        width: '45%',
        padding:5,
        borderRadius: 100,
        marginBottom: 10,
        marginTop: 5
      }
  });

  export default withAuthenticator(ReceiptsScreenData);