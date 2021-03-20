import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';
//import MyHeader from /components/MyHeader

export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      requestedItemList: [],
    };
    this.requestRef = null;
  }

  getRequestedItemsList = () => {
    this.requestRef = db
      .collection('Requested_Items')
      .onSnapshot((snapshot) => {
        var requestedItemList = snapshot.docs.map((document) => {
          document.data();
        });
        this.setState({ requestedItemList: requestedItemList });
      });
  };

  componentDidMount() {
    this.getRequestedItemsList();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.item_Name}
        subtitle={item.reason_To_Request}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
          <TouchableOpacity style={styles.button}>
            <Text style={{ color: 'white' }}>View</Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Exchange Items" />
        <View style={{ flex: 1 }}>
          {this.state.requestedItemList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List of All Requested Items</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.requestedItemList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff5722',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
});
