import React, { Component } from 'react';
import { Icon, ListItem } from 'react-native-elements';
import { View, Text, StyleSheet, Alert, Dimensions, Animated } from 'react-native';
import db from '../config';
import { SwipeListView } from 'react-native-swipe-list-view';

export default class SwipeableFlatlist extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            allNotification: this.props.allNotifications
        }
    }

    updateMarkAsRead = (notification) => {
        db.collection('all_Notifications').doc(notification.doc_ID).update({notification_Status: 'Read'})
    }

    onSwipeChangeValue = (swipeData) => {
        var allNotifications = this.state.allNotification
        const {key, value} = swipeData
        if(value < -Dimensions.get('window').width){
            const newData = [...allNotifications]
            this.updateMarkAsRead(allNotifications[key])
            newData.splice(key, 1)
            this.setState({
                allNotification: newData
            })
        }
    }

    renderItem = (data) => (
        <Animated.View>
            <ListItem
                leftElement = {
                    <Icon
                        name = 'book'
                        type = 'font-awesome'
                        color = '#696969'
                    />
                }
                title = {data.item.book_Name}
                subtitle = {data.item.message}
                titleStyle = {{ color: 'black', fontWeight: 'bold' }}
                bottomDivider
            />
        </Animated.View>
    )

    renderHiddenItem = () => (
        <View style={styles.rowBack}>
            <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
                <Text style={styles.backTextWhite}>Mark as Read!</Text>
            </View>
        </View>
    )

    render(){
        return(
            <View style={styles.container}>
                <SwipeListView
                    disableRightSwipe
                    data = {this.state.allNotification}
                    renderItem = {this.renderItem}
                    renderHiddenItem = {this.renderHiddenItem}
                    rightOpenValue = {-Dimensions.get('window').width}
                    previewRowKey = {0}
                    previewOpenValue = {-40}
                    previewOpenDelay = {3000}
                    onSwipeValueChange = {this.onSwipeValueChange}
                    keyExtractor = {(item, index)=>{index.toString()}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({ 
    container: { 
        backgroundColor: "white", 
        flex: 1 
    }, 
    backTextWhite: { 
        color: "#FFF", 
        fontWeight: "bold", 
        fontSize: 15, 
        textAlign: "center", 
        alignSelf: "flex-start" 
    }, 
    rowBack: { 
        alignItems: "center", 
        backgroundColor: "#29b6f6", 
        flex: 1, flexDirection: "row", 
        justifyContent: "space-between", 
        paddingLeft: 15 
    }, 
    backRightBtn: { 
        alignItems: "center", 
        bottom: 0, 
        justifyContent: "center", 
        position: "absolute", 
        top: 0, 
        width: 100 
    }, 
    backRightBtnRight: { 
        backgroundColor: "#29b6f6", 
        right: 0 
    } 
});