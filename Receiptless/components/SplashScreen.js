import React from 'react';
import { View, Image,StyleSheet } from 'react-native';

class SplashScreen extends React.Component {
  performTimeConsumingTask = async() => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        3000
      )
    )
  }
  async componentDidMount() {
    const data = await this.performTimeConsumingTask();
    if (data !== null) {
      this.props.navigation.navigate('App');
    }
  }
  render() {
    return (
      <View style={styles.viewStyles}>
        <Image style ={styles.logo} source={require('./images/loading.gif')}></Image>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCFCFC'
  },
  logo: {
    resizeMode: 'contain',
    flex: 0.8,
    width: '70%',
    height: '70%'
  }
});
export default SplashScreen;