import React, { memo } from 'react'
import { Text, View, ToastAndroid, Alert, Dimensions, TouchableOpacity, Modal, StyleSheet, Image, Animated } from 'react-native'
import { Avatar, Card, Paragraph } from 'react-native-paper';
import momentTime from './momentTime'
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system'
// import { downloadToFolder } from "expo-file-dl";
import GestureHandler, { PinchGestureHandler } from 'react-native-gesture-handler'
const screen = Dimensions.get('window');

const FeedCard = (props) => {

    const [statusHook, setStatus] = React.useState(false);
    const [diaLog, setDialog] = React.useState(null);
    const [scaleCustomer, SetScale] = React.useState(new Animated.Value(1));

    let { post, index } = props;
    let media = post.mediaId
    let fileName, type = undefined
    if (media.length > 0) {
        fileName = post.mediaId.split("---")[1]
        type = fileName.split(".")[1]
        console.log(type)
    }
    let nameArray = post.postedBy?.adminName.split(" ")
    let textLabel = nameArray.length > 1 ? nameArray[0][0] + nameArray[1][0] : nameArray[0][0];

    const onPinchEvent = Animated.event([{ nativeEvent: { scale: scaleCustomer } }], {
        useNativeDriver: true,
    });

    const onPinchStateChange = (event) => {
        console.log("event pinch")
        if (event.nativeEvent.oldState === GestureHandler.State.ACTIVE) {
            Animated.spring(scaleCustomer, {
                toValue: 1,
                useNativeDriver: true,
                bounciness: 1,
            }).start();
        }
    };


    const DisplayImageOrPDF = (props) => {
        let { post, type, fileName } = props
        if (type === undefined) return null
        if (type === "pdf" || type === "docx") return (
            <View style={{ marginLeft: 15, paddingRight: 20 }}>
                <TouchableOpacity onPress={() => downloadFile(post.mediaId)} >
                    <View style={{ paddingVertical: 20, display: 'flex', flexDirection: 'row' }}>
                        <MaterialCommunityIcons name="file-document" size={37} />
                        <Text style={{ fontWeight: '700', fontSize: 16, marginTop: 7, paddingLeft: 5 }}>{fileName}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
        else return <TouchableOpacity onPress={() => setDialog(index)}><Card.Cover source={{ uri: post.mediaId }} /></TouchableOpacity>
    }

    const downloadFile = (mediaUrl) => {
        const uri = mediaUrl
        let fileUri = FileSystem.documentDirectory + mediaUrl.split("---")[1];
        FileSystem.downloadAsync(uri, fileUri)
            .then(({ uri }) => {
                ToastAndroid.showWithGravity(
                    "Download started ....!",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                );
                // saveFile(uri);
                console.log(fileUri)
                console.log(uri)
                ToastAndroid.showWithGravity(
                    "Download completed ....!",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                );
            })
            .catch(error => {
                console.error(error);
            })
    }

    const saveFile = async (fileUri) => {
        try {
            let { status } = await MediaLibrary.requestPermissionsAsync()
            setStatus(status === 'granted')
            if (status) {
                const asset = await MediaLibrary.createAssetAsync(fileUri)
                await MediaLibrary.createAlbumAsync("Download", asset, false)
            }
        } catch (error) {
            ToastAndroid.showWithGravity(
                error.message,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        }
    }


    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={diaLog != null}
                onRequestClose={() => {
                    setDialog(null)
                }}
            >
                <View style={styles.centeredView}>

                    <PinchGestureHandler
                        onGestureEvent={onPinchEvent}
                        onHandlerStateChange={onPinchStateChange}
                    >

                        <Animated.Image style={[styles.tinyLogo, {
                            transform: [{ scale: scaleCustomer }],
                        }]} source={{ uri: post.mediaId }} />

                    </PinchGestureHandler>

                    <View style={{ display: 'flex', flexDirection: 'row', }}>

                        {/* button for downLoading */}
                        <TouchableOpacity onPress={() => downloadFile(post.mediaId)} style={{ display: 'flex', flexDirection: 'row', marginRight: 30 }}>
                            <Text style={{ color: 'white', fontSize: 18 }}>download  </Text>
                            <Icon name="download" size={25} color="white" />
                        </TouchableOpacity>

                        {/* button for closing the modal */}
                        <TouchableOpacity onPress={() => setDialog(null)} style={{ display: 'flex', flexDirection: 'row', }}>
                            <Text style={{ color: 'white', fontSize: 18, }}>close </Text>
                            <Icon name="close" size={25} color="white" />
                        </TouchableOpacity>

                    </View>

                </View>
            </Modal>

            <Card key={post.key} elevation={5} style={{ padding: 5, marginTop: 1 }}>

                <Card.Title title={post.postedBy?.adminName} subtitle={"Placement co-ordinator"} left={(props) => <Avatar.Text {...props} color="white" label={textLabel} />}
                    right={(props) => <Text style={{ marginRight: 10 }}>{momentTime(post.createdAt)}</Text>} />

                <Card.Content>
                    <Paragraph>{post.postMessage}</Paragraph>
                </Card.Content>

                {type ? <DisplayImageOrPDF post={post} type={type} fileName={fileName} /> : null}

                <Card.Actions style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity><Icon name="like2" size={30} color="green" /></TouchableOpacity>
                    <Text style={{ flex: 1, marginLeft: 10 }}>10</Text>
                </Card.Actions>

            </Card>
        </>
    )
}

export default memo(FeedCard)

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'black'
    },
    tinyLogo: {
        resizeMode: 'contain',
        width: screen.width,
        height: screen.width,
        // width: '100%',
        // height: undefined,
        // aspectRatio: 1
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});