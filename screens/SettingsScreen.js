import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';

export default class SettingScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      emailID: '',
      firstName: '',
      lastName: '',
      contact: '',
      address: '',
      docID: '',
      currencyCode: '',
    };
  }

  componentDidMount() {
    this.getUserDetails();
  }

  getUserDetails = () => {
    var userEmail = firebase.auth().currentUser.email;
    db.collection('Users')
      .where('email_ID', '==', userEmail)
      .get()
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailID: data.email_ID,
            firstName: data.first_name,
            lastName: data.last_name,
            contact: data.contact,
            address: data.address,
            docID: doc.id,
            currencyCode: data.currencyCode,
          });
        });
      });
  };

  updateUsers = () => {
    db.collection('Users').doc(this.state.docID).update({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      contact: this.state.contact,
      address: this.state.address,
    });
    alert('Successfully Updated');
  };

  render() {
    return (
      <View style={styles.container}>
        <MyHeader title="Settings" navigation={this.props.navigation} />
        <View style={styles.formContainer}>
          <TextInput
            style={styles.formTextInput}
            placeholder={'First Name'}
            maxLength={15}
            onChangeText={(text) => {
              this.setState({ firstName: text });
            }}
            value={this.state.firstName}
          />
          <TextInput
            style={styles.formTextInput}
            placeholder={'Last Name'}
            maxLength={15}
            onChangeText={(text) => {
              this.setState({ lastName: text });
            }}
            value={this.state.lastName}
          />
          <TextInput
            style={styles.formTextInput}
            placeholder={'Contact'}
            maxLength={10}
            onChangeText={(text) => {
              this.setState({ contact: text });
            }}
            value={this.state.contact}
            keyboardType={'number-pad'}
          />
          <TextInput
            style={styles.formTextInput}
            placeholder={'Address'}
            multiline={true}
            onChangeText={(text) => {
              this.setState({ address: text });
            }}
            value={this.state.address}
          />
          <TextInput
            style={styles.formTextInput}
            placeholder={'Currency Code'}
            maxLength={15}
            onChangeText={(text) => {
              this.setState({ currencyCode: text });
            }}
            value={this.state.currencyCode}
          />
          <TouchableOpacity style={styles.button} onPress={this.updateUsers}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
});
