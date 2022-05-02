import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

const FeedBackTextInput = (props) => {
    return (
        <TextInput
            {...props}
            editable
        />
    );
}
const Feedback = () => {
    const [value, onChangeText] = React.useState('Useless Multiline Placeholder');

    const submitFeedback = async () => {
        console.log(value);
    }


    return (
        <View style={styles.container}>
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
        </View>
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