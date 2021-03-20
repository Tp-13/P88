import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Card, Icon, ListItem } from 'react-native-elements';
import MyHeader from '../components/MyHeader.js';
import firebase from 'firebase';
import db from '../config.js';

export default class MyDonationScreen extends Component {
  static navigationOptions = { header: null };

  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      allExchanges: [],
      donorID: firebase.auth().currentUser.email,
      donorName: '',
    };
    this.requestRef = null;
  }

  getAllDonations = () => {
    this.requestRef = db
      .collection('all_exchanges')
      .where('donor_ID', '==', this.state.userID)
      .onSnapshot((snapShot) => {
        var allExchanges = snapShot.docs.map((doc) => {
          doc.data();
        });
        this.setState({ allExchanges: allExchanges });
      });
  };

  sendNotification = (itemDetails, requestStatus) => {
    var requestID = itemDetails.request_id;
    var donorID = itemDetails.donor_id;
    db.collection('all_notifications')
      .where('request_id', '==', requestID)
      .where('donor_id', '==', donorID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = '';
          if (requestStatus === 'Item Sent') {
            message = this.state.donorName + ' sent you the item';
          } else {
            message =
              this.state.donorName + ' has shown interest in donating the item';
          }
          db.collection('all_notifications').doc(doc.id).update({
            message: message,
            notification_status: 'unread',
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  sendItem = (bookDetails) => {
    if (bookDetails.requestStatus === 'Item Sent') {
      var requestStatus = 'Donor Interested';
      db.collection('all_Exchanges').doc(itemDetails.doc_id).update({
        requestStatus: 'Donor Interested',
      });
      this.sendNotification(itemDetails, requestStatus);
    } else {
      var requestStatus = 'Item Sent';
      db.collection('all_Exchanges').doc(itemDetails.doc_id).update({
        requestStatus: 'Item Sent',
      });
      this.sendNotification(itemDetails, requestStatus);
    }
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem
      key={i}
      title={item.item_Name}
      subtitle={
        'Requested by:' + item.requestBy + ' Status:' + item.requestStatus
      }
      leftElement={<icon name="book" type="font-awesome" color="#696969" />}
      titleStyle={{ color: 'black', fontWeight: 'bold' }}
      rightElement={
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                item.requestStatus === 'Item Sent' ? 'green' : '#ff5722',
            },
          ]}
          onPress={() => {
            this.sendItem(item);
          }}>
          <Text style={{ color: 'white' }}>
            {item.requestStatus === 'Item Sent' ? 'Item Sent' : 'Send Item'}
          </Text>
        </TouchableOpacity>
      }
      bottomDivider
    />
  );

  componentDidMount() {
    this.getAllDonations();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader navigation={this.props.navigation} title="My Barters" />
        <View style={{ flex: 1 }}>
          <MyHeader title="My Barters" navigation={this.props.navigation} />
          <View style={{ flex: 1 }}>
            {this.state.allExchanges.length === 0 ? (
              <View style={styles.subtitle}>
                <Text style={{ fontSize: 20 }}>List of All Item Exchanges</Text>
              </View>
            ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allExchanges}
                renderItem={this.renderItem}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    elevation: 16,
  },
  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
