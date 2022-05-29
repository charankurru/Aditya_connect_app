import React, { memo } from 'react'
import { Text, View, TouchableOpacity, ToastAndroid } from 'react-native'
import { Avatar, Card, Paragraph, FAB, } from 'react-native-paper';
import momentTime from './momentTime'
import Icon from 'react-native-vector-icons/AntDesign';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system'

const FeedCard = (props) => {

    const [statusHook, setStatus] = React.useState(false);
    const Display = (props) => {
        let { post, type, fileName } = props
        if (type === undefined) return null
        if (type === "pdf" || type === "docx") return (
            <View style={{ marginLeft: 15, paddingRight: 20 }}>
                <Card elevation={2} style={{ borderRadius: 15, }} >
                    <View style={{ paddingVertical: 20, display: 'flex' }}>
                        <Text style={{ fontWeight: '700', fontSize: 16 }}>{fileName}</Text>
                    </View>
                </Card>
            </View>
        )
        else return <Card.Cover source={{ uri: post.mediaId }} />
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
                saveFile(uri);
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

    const DownloadMedia = (props) => (
        <View style={{ marginRight: 12 }}>
            <TouchableOpacity onPress={() => downloadFile(props.mediaUrl)}>
                <Icon name="download" size={25} color="black" />
            </TouchableOpacity>
        </View>
    )

    let { post } = props;
    let media = post.mediaId
    let fileName, type = undefined
    if (media.length > 0) {
        fileName = post.mediaId.split("---")[1]
        type = fileName.split(".")[1]
        console.log(type)
    }
    let nameArray = post.postedBy?.adminName.split(" ")
    let textLabel = nameArray.length > 1 ? nameArray[0][0] + nameArray[1][0] : nameArray[0][0];

    return (
        <Card key={post.key} elevation={5}>
            <Card.Title title={post.postedBy?.adminName} subtitle={momentTime(post.createdAt)} left={(props) => <Avatar.Text {...props} color="white" label={textLabel} />}
                right={(props) => type && <DownloadMedia mediaUrl={post.mediaId} />} />
            <Card.Content>
                <Paragraph>{post.postMessage}</Paragraph>
            </Card.Content>
            {type ? <Display post={post} type={type} fileName={fileName} /> : null}
        </Card>
    )
}

export default memo(FeedCard)