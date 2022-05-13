import React, { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { View, ActivityIndicator, StatusBar, FlatList, StyleSheet, ToastAndroid } from 'react-native'
import { Avatar, Button, Card, Title, Paragraph, FAB } from 'react-native-paper';
import { AuthContext } from '../../Components/context';
import fetchPostsHook from './fetchPostsHook';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const NewsFeed = () => {

    const { loginState } = useContext(AuthContext)
    const [pageNumber, setPageNumber] = useState(1)
    // const [pageNumber, setPageNumber] = useState({
    //     pno: 1,
    //     operation: 'LazyFetch'
    // })
    const [refresh, setRefresh] = useState(false)

    // const showToastWithGravityAndOffset = () => {
    //     ToastAndroid.showWithGravityAndOffset(
    //         "Welcome to aditya Connect!",
    //         ToastAndroid.LONG,
    //         ToastAndroid.BOTTOM,
    //         25,
    //         50
    //     );
    // };

    // useEffect(() => {
    //     showToastWithGravityAndOffset();
    // }, [])

    const {
        posts,
        hasMore,
        loading,
        error
    } = fetchPostsHook(pageNumber, loginState.collegeId)

    const MyCard = (props) => {
        let { post } = props;
        return (
            <Card key={post.key} elevation={5}>
                <Card.Title title={post.postedBy?.adminName} subtitle={post.createdAt} left={LeftContent} />
                <Card.Content>
                    <Paragraph>{post.postMessage}</Paragraph>
                </Card.Content>
                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                <Card.Actions>
                    <Button>Cancel</Button>
                    <Button>Ok</Button>
                </Card.Actions>
            </Card>
        )
    }

    const loadMore = () => {
        console.log("Fetching more data")
        if (hasMore) {
            setPageNumber(prevPageNumber => prevPageNumber + 1)
        }
        else {
            console.log("No More data available")
        }

    }

    const loadingIndicator = () => {
        return (
            loading ?
                <View>
                    <ActivityIndicator size="large" color="#009387" />
                </View> : null
        )
    }

    const refreshingOnPull = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false)
        }, 1000);
    }

    console.log()
    return (
        <View style={{ flex: 1, }}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <FlatList
                data={posts}
                onEndReached={loadMore}
                onEndReachedThreshold={1}
                keyExtractor={item => item._id}
                // renderFooter={loadingIndicator}
                refreshing={refresh}
                onRefresh={refreshingOnPull}
                renderItem={({ item }) => (<MyCard post={item} />)}
            />
            <FAB
                style={styles.fab}
                icon="plus"
                color="#fff"
                onPress={() => console.log('Pressed')}
            />

        </View>
    )
}

export default NewsFeed

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        fontSize: 24
    },
})











