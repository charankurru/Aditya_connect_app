import React, { memo } from 'react'
import { Text, View, ToastAndroid, Alert, Dimensions, TouchableHighlight, TouchableOpacity, Modal, StyleSheet, Image, Animated } from 'react-native'
import { Avatar, Card, Paragraph } from 'react-native-paper';
import momentTime from './momentTime'
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system'
//import ImageViewer which will help us to zoom Image
import ImageViewer from 'react-native-image-zoom-viewer';
import { LikeOrDislikePost } from '../API/services';

const FeedCard = (props) => {

    const [diaLog, setDialog] = React.useState(null)


    let { post, index, userId } = props;
    const images = [
        {
            url: post.mediaId
        },
    ];
    let media = post.mediaId
    let fileName, type = undefined
    if (media.length > 0) {
        fileName = post.mediaId.split("---")[1]
        type = fileName.split(".")[1]
    }
    let nameArray = post.postedBy ? post.postedBy.adminName.split(" ") : "Anonymous admin"
    let textLabel = nameArray.length > 1 ? nameArray[0][0] + nameArray[1][0] : nameArray[0][0]
    textLabel = textLabel.toUpperCase()


    const [likes, setLikes] = React.useState(post.likedUsersList ? post.likedUsersList?.length : 0)
    const [like, setLike] = React.useState(post.likedUsersList?.length > 0 && post.likedUsersList.includes(userId) ? 1 : 0)

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
        else return <TouchableOpacity onPress={() => setDialog(index)}>
            <Card.Cover source={{ uri: post.mediaId }} />
            <View style={{ marginTop: 20 }}>

            </View>
        </TouchableOpacity>
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
                saveFile(uri)
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

    const likePost = async () => {
        if (like) {
            //perform unliking the post
            setLike(0)
            //Decrement the count

            setLikes(prev => prev - 1)
            LikeOrDislikePost({
                postId: post._id,
                userId: userId,
                action: -1
            })
                .then(res => {
                    console.log("Liked the post")
                })
                .catch(err => { console.log(err) })
        }
        else {
            //perform like the post
            setLike(1)
            //increment the count
            setLikes(prev => prev + 1)
            LikeOrDislikePost({
                postId: post._id,
                userId: userId,
                action: 1
            })
                .then(res => {
                    console.log("DisLiked the post")
                })
                .catch(err => { console.log(err) })
        }
    }


    return (
        <View style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 7 }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={diaLog != null}
                onRequestClose={() => {
                    setDialog(null)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={{ marginRight: -130, marginLeft: 150, display: 'flex', flexDirection: 'row', }}>

                        {/* button for downLoading */}
                        <TouchableOpacity onPress={() => downloadFile(post.mediaId)} style={{ display: 'flex', flexDirection: 'row', marginRight: 30 }}>
                            {/* <Text style={{ color: 'white', fontSize: 18 }}>download  </Text> */}
                            <Icon name="download" size={25} color="white" />
                        </TouchableOpacity>

                        {/* button for closing the modal */}
                        <TouchableOpacity onPress={() => setDialog(null)} style={{ display: 'flex', flexDirection: 'row', }}>
                            {/* <Text style={{ color: 'white', fontSize: 18, }}>close </Text> */}
                            <Icon name="close" size={25} color="white" />
                        </TouchableOpacity>

                    </View>
                    <ImageViewer style={styles.tinyLogo} imageUrls={images} renderIndicator={() => null} />

                </View>
            </Modal>

            <Card key={post.key} elevation={5} style={{
                padding: 1, marginTop: 1, borderRadius: 20
            }}>

                <Card.Title
                    style={styles.bottomDrawerSection}
                    titleStyle={{ fontSize: 16, marginBottom: -7 }}
                    title={post.postedBy ? post.postedBy?.adminName : "Anonymous User"}
                    subtitle={"Placement co-ordinator"}
                    left={(props) => <Avatar.Text {...props} color="white" label={textLabel} />}
                    right={(props) =>
                        <Text style={{ marginRight: 10, color: "#05375a", fontSize: 12 }}>
                            <MaterialCommunityIcons name="clock-outline" />
                            {momentTime(post.createdAt)}
                        </Text>}
                />
                <Card.Content style={{ marginBottom: 10 }}>
                    <Paragraph style={{ fontWeight: 'bold', textTransform: 'capitalize', fontSize: 18, color: "#05375a" }}>{post.postTitle}</Paragraph>
                    <Paragraph style={{ textAlign: 'justify', letterSpacing: 0.5 }}>{post.postMessage}</Paragraph>
                </Card.Content>

                {type ? <DisplayImageOrPDF post={post} type={type} fileName={fileName} /> : null}


                <Card.Actions style={{ marginLeft: 15, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => likePost()}><Icon name={like ? "heart" : "hearto"} size={30} color="red" /></TouchableOpacity>
                    <Text style={{ flex: 1, marginLeft: 10 }}>{likes}</Text>
                </Card.Actions>

            </Card>
        </View>
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
        // resizeMode: 'contain',
        width: '100%',
        // height: undefined,
        // aspectRatio: 1
    },
    bottomDrawerSection: {
        color: '#05375a',
        marginBottom: 10,
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
        fontSize: 7
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