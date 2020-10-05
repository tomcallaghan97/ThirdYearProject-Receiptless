import React from 'react';
import { Text,Alert, View, StyleSheet, TouchableOpacity, Dimensions, RefreshControl, ScrollView,Platform} from 'react-native';
import { withAuthenticator } from 'aws-amplify-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CalendarPicker from 'react-native-calendar-picker';
import { API } from 'aws-amplify';
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Thumbnail } from 'native-base';
 
//main class for rendering and setting state
class ExpensesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receipts: null,
      refreshing: false,
      calendar:null,
      selectedStartDate: null,
      receiptList:[]
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

    // get receipt data when screen loads 
    componentDidMount(){
      this.getreceipts()
    }

    // Get request to get receipt data
    getreceipts = async() => {
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
         console.log(error.response)
        });
      };
      
      // set date to what date is pressed on calendar
      onDateChange(date) {
        this.setState({
          selectedStartDate: date
        });
      }
      // format current date calculated to YYYY-MM-DD
      formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        return [year, month, day].join('-');
    }

    // Post request to API to send email to user
    sendEmail = async(T) => {
          let apiName = 'ourAPI';
          let path = '/deleteReceipts';
          let myInit = { 
          headers: {},
          body: {"Total": T,
                  "Email": this.props.authData.attributes.email
              }
          }
          API.post(apiName, path, myInit)
          .then(response => {   
          console.log(response)
          alert("Email Sent")
          })
          .catch(error => {
          console.log(error.response)
          alert("Invalid Email. Email not sent.")
          });
      };
    
    // get receipt corressponding the selected date
    findReceipts(receiptDict,datey){
      console.log(receiptDict)
      if (receiptDict[datey] != undefined){
        var i;
        var j;
        var storeNames = [];
        if (receiptDict[datey].length == 1){
          for (i = 0; i < receiptDict[datey].length; i++) {
            for (j = 0; j < receiptDict[datey][i].length;j++){
              console.log(receiptDict[datey][i][j])
              if (j % 2 == 0){
                storeNames.push("Store Name: "+ receiptDict[datey][i][j])
              }
              else{
                storeNames.push("Total: " + receiptDict[datey][i][j] + "\n") 
              }}}
        }else{
          for (i = 0; i < receiptDict[datey].length; i++) {
            if (i % 2 == 0){
              storeNames.push("Store Name: "+ receiptDict[datey][i])
            }
            else{
              storeNames.push("Total: €" + receiptDict[datey][i]  + "\n")
            }}}
        this.setState({
          receiptList: storeNames
        })
      console.log(this.state.receiptList)
      }else{
        this.setState({
          receiptList: []
        })
      }}
  // set all states and totals for expense tracking variables
  render() {
    const{calendar} = this.state;
    const { selectedStartDate } = this.state;
    let { receiptList } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    let {receipts} = this.state;
    const receiptDict = {};
    let OverallTotal = 0.0;
    let clothesTotal = 0.0;
    let travelTotal = 0.0;
    let groceriesTotal = 0.0;
    let entertainmentTotal = 0.0;
    let MonTotal = 0.0
    let TueTotal = 0.0
    let WedTotal = 0.0
    let ThursTotal = 0.0
    let FriTotal = 0.0
    let SatTotal = 0.0
    let SunTotal = 0.0
    let today = new Date()
    let TodayDate = this.formatDate(today)

    // go through all receipt data and calculate totals
    if (receipts != null){
      let receiptsList = receipts.map(function(receipt) {
        let {StoreName, ReceiptTotal, ReceiptDate, receiptID, Category, TimeStamp} = receipt
        let ReceiptDay = TimeStamp.split(' ')[0]
        let receiptday1 = new Date(ReceiptDay).getDay()
        let ReceiptTotal1 = parseFloat(ReceiptTotal)
        OverallTotal = ReceiptTotal1 + OverallTotal
        if (ReceiptDay in receiptDict){
          receiptDict[ReceiptDay].push(StoreName, ReceiptTotal)
        }else{
          receiptDict[ReceiptDay] = [StoreName, ReceiptTotal]
        }
        const diffDays = Math.floor(( Date.parse(TodayDate) - Date.parse(ReceiptDay) ) / 86400000);
        if (Category == 'clothes' && diffDays < 30){
          let ReceiptTotal2 = parseFloat(ReceiptTotal)
          clothesTotal = ReceiptTotal2 + clothesTotal
        }
        else if (Category == 'groceries' && diffDays < 30){
          let ReceiptTotal3 = parseFloat(ReceiptTotal)
          groceriesTotal = ReceiptTotal3 + groceriesTotal
        }
        else if (Category == 'travel' && diffDays < 30){
          let ReceiptTotal4 = parseFloat(ReceiptTotal)
          travelTotal = ReceiptTotal4 + travelTotal
        }
        else if (Category == 'entertainment' && diffDays < 30){
          let ReceiptTotal5 = parseFloat(ReceiptTotal)
          entertainmentTotal = ReceiptTotal5 + entertainmentTotal
        }
        if (receiptday1 == 1 && diffDays < 8){
          MonTotal = parseFloat(ReceiptTotal) + MonTotal
        }
        else if (receiptday1 == 2 && diffDays < 8){
          TueTotal = parseFloat(ReceiptTotal) + TueTotal
        }
        else if (receiptday1 == 3 && diffDays < 8){
          WedTotal = parseFloat(ReceiptTotal) + WedTotal
        }
        else if (receiptday1 == 4 && diffDays < 8){
          ThursTotal = parseFloat(ReceiptTotal) + ThursTotal
        }
        else if (receiptday1 == 5 && diffDays < 8){
          FriTotal = parseFloat(ReceiptTotal) + FriTotal
        }
        else if (receiptday1 == 6 && diffDays < 8){
          SatTotal = parseFloat(ReceiptTotal) + SatTotal
        }
        else if (receiptday1 == 0 && diffDays < 8){
          SunTotal = parseFloat(ReceiptTotal) + SunTotal
        }
        })}

    // create list of weekly totals for email
    let weekTotals = ["Monday: €"+MonTotal,"Tuesday: €"+TueTotal,"Wednesday: €"+WedTotal,"Thursday: €"+ThursTotal,"Friday: €"+FriTotal,"Saturday: €"+SatTotal,"Sunday: €"+SunTotal]
    
    // dictionary for days of week
    const lookup = {0: "Monday Total", 1: "Tuesday Total", 2: "Wednesday Total", 3: "Thursday Total", 4: "Friday Total",5: "Saturday Total",6: "Sunday Total"};
    let customDatesStyles = [];
    // checks all dates in receipts retrieved and adds a blue highlight to them on calendar
    for (var n in receiptDict){
      customDatesStyles.push({
        date: n,
        // Random colors
        style: {backgroundColor: '#b5e4ff'}, //sets blue highlight for all days in the receipts list
        textStyle: {color: 'black'}, 
        containerStyle: [],
      });
    }
    // if calendar has been pressed render calendar
    if (calendar != null){
      return(
        <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container2}>
        <Text style={styles.writingText}>Select a date to view receipts.</Text>
        <Text style={styles.writingText}>Highlighted dates indicate a receipt.</Text>
        </View>
        <CalendarPicker
          style={styles.calendars}
          onDateChange={this.onDateChange}
          customDatesStyles={customDatesStyles}
          selectedDayColor={'#4FB7F3'}/>
        <View>
        <TouchableOpacity  style={styles.button} onPress={this.findReceipts.bind(this,receiptDict,this.formatDate(startDate))}><Text style={styles.buttonText}>Show Receipts</Text></TouchableOpacity>
        </View>
        <View style={styles.scrollViewTwo} >
        {this.state.receiptList.length == 0 && <Text>No receipts</Text>}  
        {this.state.receiptList.length != 0 && receiptList.map((item, key)=>(
         <Text key={key} style={styles.TextStyle}> { item } </Text>))}
        </View>
        <TouchableOpacity  style={styles.backButton} onPress={() => this.setState({
        calendar:null}) }><Text style={styles.buttonText}>Back</Text></TouchableOpacity>
      </ScrollView >
      )}
    // if calendar not pressed display expenses screen and generate charts
    return( 
      <ScrollView contentContainerStyle={styles.scrollView} refreshControl={
        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.getreceipts} />}>
        <View style={styles.container2}>
        <Text style={styles.writingText}>Pull down to referesh!</Text>
        <Text style={styles.writingText}>Please refresh after adding/deleting a receipt.</Text>
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity onPress={()=>this.setState({
            calendar:'yes'
          })}><Thumbnail source={require('./images/calendar.png')}></Thumbnail></TouchableOpacity>
            <TouchableOpacity onPress={this.sendEmail.bind(this,weekTotals)}><Thumbnail style={styles.email} source={require('./images/mail.png')}></Thumbnail></TouchableOpacity>
        </View>
        <Text style={styles.graphTitle}>Past 7 days expenses</Text>
        <LineChart
        data={{
          labels: ['Mon', 'Tue', 'Wed', 'Thur','Fri','Sat','Sun'],
          datasets: [
            {
              data: [
                MonTotal,
                TueTotal,
                WedTotal,
                ThursTotal,
                FriTotal,
                SatTotal,
                SunTotal
              ],},],
        }}
        width={Dimensions.get('window').width - 16}
        height={220}
        fromZero={true}
        segments = {6}
        yAxisLabel={'€'}
        onDataPointClick={(value)=>{Alert.alert(
          lookup[JSON.stringify((value.index))],
          '€'+JSON.stringify((value.value)))}} 
        chartConfig={{
          backgroundColor: 'white',
          backgroundGradientFrom: '#a0d8f8',
          backgroundGradientTo: 'white',
          decimalPlaces: 2,
          color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}/>
        <Text style={styles.graphTitle}>Category Percentages</Text>
        <PieChart
          data={[
            {
              name: 'Clothes',
              population: clothesTotal,
              color: '#4F65F3',
              legendFontColor: 'black',
              legendFontSize: 12,
            },
            {
              name: 'Groceries',
              population: groceriesTotal,
              color: '#8B4FF3',
              legendFontColor: 'black',
              legendFontSize: 12,
            },
            {
              name: 'Entertainment',
              population: entertainmentTotal,
              color: '#DD4FF3',
              legendFontColor: 'black',
              legendFontSize: 12,
            },
            {
              name: 'Travel',
              population: travelTotal,
              color: '#F38B4F',
              legendFontColor: 'black',
              legendFontSize: 12,
            },
          ]}
          width={Dimensions.get('window').width - 16}
          
          height={220}
          chartConfig={{
            backgroundColor: 'white',
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          accessor="population"
          backgroundColor="#a0d8f8"
          paddingLeft="15"/>
        <Text style={styles.graphTitle}>Category Amount Totals (Last 30 Days)</Text>
        <BarChart
        data={{
          labels: [
            'Clothes',
            'Entertainment',
            'Travel',
            'Groceries',
          ],
          datasets: [
            {
              data: [clothesTotal, entertainmentTotal, travelTotal, groceriesTotal],
            }],
        }}
        yAxisLabel={'€'}
        width={Dimensions.get('window').width - 16}
        height={220}
        fromZero={true}
        
        chartConfig={{
          backgroundColor: 'white',
          backgroundGradientFrom: '#a0d8f8',
          backgroundGradientTo: 'white',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        backgroundColor="rgba(79, 183, 243, 0.5)"/>
      </ScrollView>
    )}
}

// styling for charts and different platforms
const styles = StyleSheet.create({
  email:{
    marginLeft:wp(50)
  },
  rowContainer:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  backButton:{
    alignItems: 'center',
    backgroundColor: '#4FB7F3',
    borderRadius: 25,
    ...Platform.select({
      ios:{
        paddingBottom: hp(0.1),
        paddingTop: hp(1.1),
        marginTop: 20,
        width: wp(32),
        height: hp(5),
        marginTop: 10
      },
      android:{
        padding: 10,
        width: wp('25%'),
        marginTop: hp(2),
        marginBottom: 10
      }
    }) 
  },
  TextStyle:{
    ...Platform.select({
      ios:{
          fontSize:14, 
          fontWeight: 'bold'

      },
      android:{
          fontSize:13, 
          fontWeight: 'bold'
      }
  })
  },
  container: {
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 5,
  },
  scrollView:{
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  scrollViewTwo:{
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor:'#4FB7F3',
    borderWidth: 5,
    padding: 5,
    borderRadius:12
  },
  piechart:{
    flex: 6, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
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
        width: wp(52),
        height: hp(5),
        marginBottom:10
      },
      android:{
        padding: 10,
        width: wp('50%'),
        marginTop: hp(2),
        marginBottom: 10
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
  graphTitle:{
    textDecorationLine: 'underline'
  },
  container2: {
    ...Platform.select({
      ios:{
        width: '100%',
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#4FB7F3',
        padding:7,
        marginBottom: 8
      },
      android:{
        width: '100%',
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#4FB7F3',
        padding:3
      }
    }) 
  }
});

export default withAuthenticator(ExpensesScreen);
