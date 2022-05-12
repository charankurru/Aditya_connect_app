import React, { useEffect, useContext, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, FlatList } from 'react-native'
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper'
import { AuthContext } from '../../Components/context'
import { GetUserbyId, SendMessage } from '../../API/services'
const LeftContent = props => <Avatar.Icon {...props} icon="folder" />
const FeedBackTextInput = (props) => {
    return (
        <TextInput
            {...props}
            editable
        />
    );
}
const Feedback = () => {
    const [value, onChangeText] = React.useState('');
    const { loginState } = useContext(AuthContext);
    const [user, setUser] = useState({});
    const [messagesList, setMessagesList] = useState();

    useEffect(async () => {
        try {
            let user = await GetUserbyId(loginState.id);
            if (user && user.data.length > 0) {
                console.log("data fetched")
                setUser(user.data[0]);
                setMessagesList(user.data[0].messagesList)
            }
        } catch (error) {
            console.log(error);
        }

    }, [])

    const submitFeedback = async () => {
        console.log(value);
        try {
            let res = await SendMessage({
                message: value,
                postedBy: loginState.id
            })
            console.log(res)
            if (res && res.data.data) {
                setMessagesList([...messagesList, res.data.data])
                onChangeText("")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const renderMessage = ({ item }) => (
        <Card style={{ marginVertical: 3 }}>
            <Card.Title title={loginState.userName} subtitle={item.createdAt} left={LeftContent} />
            <Card.Content>
                {/* <Title>Card title</Title> */}
                <Paragraph>{item.message}</Paragraph>
            </Card.Content>
        </Card>
    );
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <Card>
                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            </Card>

            <Card elevated elevation={2}>
                <View style={{ padding: 10 }}>
                    <FeedBackTextInput
                        style={{
                            borderColor: '#009387',
                            borderWidth: 1,
                            borderRadius: 10,
                            textAlignVertical: 'top',
                            fontSize: 18,
                            fontWeight: 'bold',
                            padding: 7,
                        }}
                        placeholder="Please Provide your Valuable Feedback here..."
                        multiline
                        numberOfLines={7}
                        value={value}
                        onChangeText={text => onChangeText(text)}

                    />
                </View>
            </Card>
            <TouchableOpacity
                onPress={() => { submitFeedback() }}
                style={[styles.signIn, {
                    borderColor: '#009387',
                    borderWidth: 1,
                    marginTop: 15
                }]}
            >
                <Text style={[styles.textSign, {
                    color: '#009387'
                }]}>Submit</Text>
            </TouchableOpacity>
            <View>
                {messagesList ?
                    <FlatList
                        data={messagesList}
                        renderItem={renderMessage}
                        keyExtractor={item => item._id}
                    />
                    :
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 15 }}>
                        <Text>No Messages you have Posted yet</Text>
                    </View>
                }
            </View>
        </View >
    )
}

export default Feedback
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 3,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        color: '#05375a',
        fontSize: 18,
        fontWeight: 'bold'
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 30
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }
});