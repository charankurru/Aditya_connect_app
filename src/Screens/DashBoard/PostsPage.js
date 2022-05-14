import React, {
    useState,
    useEffect
} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, FAB } from 'react-native-paper';
import { GetPosts } from '../../API/services';
const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const PostsPage = () => {

    let onEndReachedCalledDuringMomentum = false;
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true)
    const [posts, setPosts] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            if (hasMore) {
                getMore();
            }
        }, 100);
    }, [pageNumber]);

    const getPosts = async () => {
        try {

            console.log(pageNumber);
            const res = await GetPosts(
                { channelId: "1232", pageNumber: pageNumber, limit: 5 })
            console.log(res)
            console.log("data fetched")
            setPosts([...posts, ...res.data.result])
            setHasMore(res.data.result.length > 0)

        } catch (error) {
            console.log(error)
        }
    }

    const getMore = () => {
        setIsMoreLoading(true)
        setTimeout(async () => {
            console.log(isMoreLoading)
            console.log(pageNumber)
            await getPosts();
            setIsMoreLoading(false)
            onEndReachedCalledDuringMomentum = true;
        }, 100);
    }

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

    const renderFooter = () => {
        if (!isMoreLoading) return true;
        return (
            <ActivityIndicator
                size='large'
                color={'#D83E64'}
                style={{ marginBottom: 10 }}
            />
        )
    }

    const refreshingOnPull = () => {
        setRefresh(true)
        setTimeout(() => {
            // setPosts((array) => {
            //     return []
            // })
            // setPageNumber(1)
            setRefresh(false)
        }, 100);
    }



    return (
        <View style={{ flex: 1, }}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <FlatList
                data={posts}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (<MyCard post={item} />)}
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.5}
                onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false; }}
                onEndReached={() => {
                    if (!onEndReachedCalledDuringMomentum && !isMoreLoading) {
                        console.log("trying")
                        setPageNumber(prevPageNumber => prevPageNumber + 1)
                    }
                }
                }
                refreshing={refresh}
                onRefresh={refreshingOnPull}

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

export default PostsPage

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        fontSize: 24
    },
})
