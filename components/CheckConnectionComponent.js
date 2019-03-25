import React, { Component } from 'react';
import { NetInfo, Text, View } from 'react-native';

class CheckConnectionComponent extends Component {
  state = {
    isConnected: null,
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
        'change',
        this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done(
        (isConnected) => { this.setState({isConnected}); }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
        'change',
        this._handleConnectivityChange
    );
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({
      isConnected,
    });
  };

  render() {
    return (
        <View>
          <Text>{this.state.isConnected ? 'Online' : 'Offline'}</Text>
        </View>
    );
  }
}


