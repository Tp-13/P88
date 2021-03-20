import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import firebase from 'firebase';
import db from '../config';

export default class WelcomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      emailID: '',
      password: '',
      isModalVisible: false,
      firstName: '',
      lastName: '',
      address: '',
      contact: '',
      confirmPassword: '',
      currencyCode: '',
    };
  }

  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}>
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: '100%' }}>
            <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
              <Text style={styles.modalTitle}>Registration</Text>
              <TextInput
                style={styles.formTextInput}
                placeholder={'First Name'}
                maxLength={15}
                onChangeText={(text) => {
                  this.setState({ firstName: text });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Last Name'}
                maxLength={15}
                onChangeText={(text) => {
                  this.setState({ lastName: text });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Contact'}
                maxLength={10}
                onChangeText={(text) => {
                  this.setState({ contact: text });
                }}
                keyboardType={'numeric'}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Address'}
                multiline={true}
                onChangeText={(text) => {
                  this.setState({ address: text });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Email Adress'}
                keyboardType={'email-address'}
                onChangeText={(text) => {
                  this.setState({ emailID: text });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Password'}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({ password: text });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Confirm Password'}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({ confirmPassword: text });
                }}
              />
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => {
                  this.signUp(
                    this.state.emailID,
                    this.state.password,
                    this.state.confirmPassword
                  );
                }}>
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  this.setState({ isModalVisible: false });
                }}>
                <Text style={{ color: '#ff5722' }}>Cancel</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  login = async (email, password) => {
    if (email && password) {
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
        if (response) {
          this.props.navigation.navigate('Home');
        }
      } catch (error) {
        switch (error.code) {
          case 'auth/user-not-found':
            Alert.alert('USER DOES NOT EXIST');
            break;
          case 'auth/invalid-email':
            Alert.alert('INCORRECT EMAIL ID OR PASSWORD');
            break;
          case 'auth/invalid-password':
            Alert.alert('INCORRECT EMAIL ID OR PASSWORD');
            break;
        }
      }
    } else {
      Alert.alert('Enter Email ID and Password');
    }
  };

  signUp = async (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return Alert.alert('Passwords Do Not Match');
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          db.collection('Users').add({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            contact: this.state.contact,
            email_ID: this.state.emailID,
            address: this.state.address,
            currencyCode: this.state.currencyCode,
          });
          return Alert.alert('Alert', 'User added succesfully', [
            {
              text: 'Ok',
              onPress: () => {
                this.setState({ isModalVisible: false });
              },
            },
          ]);
        })
        .catch((error) => {
          var errorMessage = error.message;
          return Alert.alert(errorMessage);
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {this.showModal()}
        </View>
        <View>
          <Text style={styles.title}>Barter App</Text>
        </View>
        <View>
          <TextInput
            style={styles.loginBox}
            placeholder={'Enter Your Email Adress'}
            keyboardType={'email-address'}
            onChangeText={(text) => {
              this.setState({ emailID: text });
            }}
          />
          <TextInput
            style={styles.loginBox}
            placeholder={'Enter Your Password'}
            secureTextEntry={true}
            onChangeText={(text) => {
              this.setState({ password: text });
            }}
          />
          <TextInput
            style={styles.loginBox}
            placeholder={'Country Currency Code'}
            onChangeText={(text) => {
              this.setState({ currencyCode: text });
            }}
          />
        </View>
        <View>
          <TouchableOpacity
            style={[styles.button, { marginBottom: 20, marginTop: 20 }]}
            onPress={() => {
              this.login(this.state.emailID, this.state.password);
            }}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({ isModalVisible: true });
            }}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loginBox: {
    width: 300,
    height: 40,
    fontSize: 20,
    margin: 10,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 65,
    fontWeight: '300',
    paddingBottom: 30,
    color: '#ff3d00',
  },
  buttonText: {
    color: '#ffff',
    fontWeight: '200',
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8BE85',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  KeyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 30,
    color: '#ff5722',
    margin: 50,
  },
  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
    marginRight: 30,
    marginLeft: 30,
    marginTop: 80,
    marginBottom: 80,
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
  registerButton: {
    width: 200,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 30,
  },
  registerButtonText: {
    color: '#ff5722',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelButton: {
    width: 200,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  button: {
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#ff9800',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16,
    padding: 10,
  },
});
