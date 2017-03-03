import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  Header,
  Title, Content, Footer, FooterTab, Button, Icon, List, ListItem, Text, Radio } from 'native-base';
import _ from 'underscore';
import Stripe, { PaymentCardTextField } from 'tipsi-stripe';

import { API } from 'coopcycle-js';
import theme from '../../theme/coopcycle';

const AppConfig = require('../../AppConfig');
const AppUser = require('../../AppUser');
const APIClient = null;

class AccountOrdersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      orders: []
    };
  }
  componentDidMount() {
    AppUser.load()
      .then((user) => {
        APIClient = API.createClient(AppConfig.API_BASEURL, user);
        APIClient.request('GET', '/api/me/orders')
          .then((data) => {
            this.setState({
              loading: false,
              orders: data['hydra:member']
            })
          });
      });
  }
  _renderRow(order) {
    return (
      <ListItem>
        <Text>{ order.restaurant.name }</Text>
      </ListItem>
    );
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    let loader = (
      <View />
    )
    if (this.state.loading) {
      loader = (
        <View style={styles.loader}>
          <ActivityIndicator
            animating={true}
            size="large"
            color="#fff"
          />
          <Text style={{color: '#fff'}}>Chargement...</Text>
        </View>
      );
    }

    return (
      <Container theme={ theme }>
        <Header>
          <Button transparent onPress={() => navigator.parentNavigator.pop()}>
            <Icon name="ios-arrow-back" />
          </Button>
          <Title>Commandes</Title>
        </Header>
        <Content>
          <List dataArray={ this.state.orders } renderRow={ this._renderRow.bind(this) } />
        </Content>
        { loader }
      </Container>
    );
  }
}

// <List dataArray={ this.props.user.deliveryAddresses } renderRow={ this._renderRow.bind(this) } />

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
});

module.exports = AccountOrdersPage;