import React from 'react';
import { Platform, NetInfo, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading,  Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import ApiKeys from './constants/ApiKeys';
import * as firebase from 'firebase';
import { YellowBox } from 'react-native';
import { Constants, Location, Permissions } from 'expo';

YellowBox.ignoreWarnings(['Remote debugger']);


export default class App extends React.Component {
  authSubscription;
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      isConnected: null,
      location: null,
      errorMessage: null,
    };

    // Initialize firebase...
    if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig); }
  }

  componentDidMount() {
    console.log('didmount start');
    if (Platform.OS === 'android' && !Constants.isDevice) {
      console.log('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
    } else {
      this._getLocationAsync();
    }
    NetInfo.isConnected.fetch().done(
      (isConnected) => { 
        console.log('isConnected:' + isConnected);
        this.setState({isConnected});
       }
  );
    
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        loading: false,
        user,
      });
    });
  }
  /**
   * Don't forget to stop listening for authentication state changes
   * when the component unmounts.
   */
  componentWillUnmount() {
     this.authSubscription();
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen ) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
