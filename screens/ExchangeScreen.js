import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';

export default class ExchangeScreen extends Component {
  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      itemName: '',
      reasonToRequest: '',
      isItemRequestActive: '',
      requestedItemName: '',
      item_Status: '',
      request_ID: '',
      userDocID: '',
      docID: '',
    };
  }

  componentDidMount(){
    getData()    
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  getData(){
    fetch("http://data.fixer.io/api/latest?access_key=fe9a6e76144cac717fd9f64ddc25aaaf")
    .then(response=>{
      return response.json();
    }).then(responseData =>{
      var currencyCode = this.state.currencyCode
      var currency = responseData.rates.INR
      var value = 1.19 / currency
      console.log(value);
    })
  }
  

  addRequest = (bookName, reasonToRequest) => {
    var userID = this.state.userID;
    var randomRequestID = this.createUniqueId();
    console.log(randomRequestID);
    db.collection('Requested_items').add({
      user_ID: userID,
      item_Name: itemName,
      reason_To_Request: reasonToRequest,
      request_ID: randomRequestID,
      item_Status: 'Requested',
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });
    this.getExchangeRequest();
    db.collection('Users')
      .where('email_ID', '==', userID)
      .get()
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          db.collection('Users').doc(doc.id).update({
            isItemRequestActive: true,
          });
        });
      });
    this.setState({
      itemName: '',
      reasonToRequest: '',
      request_ID: randomRequestID,
    });
    return Alert.alert('Item Rquested Successfully');
  };

  recievedItems = (itemName) => {
    var userID = this.state.userID;
    var requestID = this.state.request_ID;
    db.collection('Recieved_Books').add({
      user_ID: userID,
      item_Name: itemName,
      request_ID: requestID,
      item_Status: 'Recieved',
    });
  };

  getExchangeRequest = () => {
    var exchangeRequest = db
      .collection('Requested_Items')
      .where('user_ID', '==', this.state.userID)
      .get()
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          if (doc.data().item_Status !== 'Recieved') {
            this.setState({
              request_ID: doc.data().request_ID,
              requestedItemName: doc.data().item_Name,
              item_Status: doc.data().item_Status,
              docID: doc.id,
            });
          }
        });
      });
  };

  getIsExchangeRequestActive() {
    db.collection('Users')
      .where('email_ID', '==', this.state.userID)
      .onSnapshot((snapShot) => {
        snapShot.forEach((doc) => {
          this.setState({
            isItemRequestActive: doc.data().isItemRequestActive,
            userDocID: doc.id,
          });
        });
      });
  }

  componentDidMount() {
    this.getExchangeRequest();
    this.getIsExchangeRequestActive();
  }

  updateExchangeRequestStatus = () => {
    db.collection('Requested_Items').doc(this.state.docID).update({
      book_Status: 'Recieved',
    });
    db.collection('Users')
      .where('email_ID', '==', this.state.userID)
      .get()
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          db.collection('Users').doc(doc.id).update({
            isItemRequestActive: false,
          });
        });
      });
  };

  sendNotification = () => {
    db.collection('Users')
      .where('email_ID', '==', this.state.userID)
      .get()
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          var name = doc.data().first_Name;
          var lastName = doc.data().last_Name;
          db.collection('all_Notifications')
            .where('request_ID', '==', this.state.request_ID)
            .get()
            .then((snapShot) => {
              snapShot.forEach((doc) => {
                var donorID = doc.data().donor_ID;
                var itemName = doc.data().item_Name;
                db.collection('all_Notifications').add({
                  targeted_User_ID: donorID,
                  message:
                    name +
                    ' ' +
                    lastName +
                    ' recieved the ' +
                    itemName +
                    '!',
                  notification_Status: 'Unread',
                  item_Name: itemName,
                });
              });
            });
        });
      });
  };

  render() {
    if (this.state.isItemRequestActive) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}>
            <Text>Item Name</Text>
            <Text>{this.state.requestedItemName}</Text>
          </View>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}>
            <Text>Item Status</Text>
            <Text>{this.state.item_Status}</Text>
          </View>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: 'orange',
              backgroundColor: 'orange',
              width: 300,
              alignSelf: 'center',
              alignItems: 'center',
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateExchangeRequestStatus();
              this.recievedItems(this.state.requestedItemName);
            }}>
            <Text>I Do Not Need This Item</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Request Item" />
          <KeyboardAvoidingView style={styles.keyBoardStyle}>
            <TextInput
              style={styles.formTextInput}
              placeholder={'enter item name'}
              onChangeText={(text) => {
                this.setState({ itemName: text });
              }}
              value={this.state.itemName}
            />
            <TextInput
              style={[styles.formTextInput, { height: 300 }]}
              multiline
              numberOfLines={2}
              placeholder={'Why do you need the book'}
              onChangeText={(text) => {
                this.setState({ reasonToRequest: text });
              }}
              value={this.state.reasonToRequest}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addRequest(
                  this.state.itemName,
                  this.state.reasonToRequest
                );
              }}>
              <Text>Request</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTextInput: {
    width: '75%',
    height: 35,
    alignSelf: 'center',
    borderColor: '#ffab91',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: '75%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#ff5722',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
});
