import React, {
    useState,
    useEffect
} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    ActivityIndicator,
    StatusBar,
    Text
} from 'react-native';
import { Modal, Portal, Avatar, Card, Paragraph, FAB, } from 'react-native-paper';
import { GetPosts } from '../../API/services';
import momentTime from '../../Components/momentTime'
import PostCategories from '../../Data/Postcategories.json'
import CheckBox from '../../Components/CheckBox'
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
            const res = await GetPosts(
                { channelId: "1232", pageNumber: pageNumber, limit: 5 })
            console.log(res)
            setPosts([...posts, ...res.data.result])
            setHasMore(res.data.result.length > 0)

        } catch (error) {
            console.log(error)
        }
    }

    const getMore = () => {
        setIsMoreLoading(true)
        setTimeout(async () => {
            await getPosts();
            setIsMoreLoading(false)
            onEndReachedCalledDuringMomentum = true;
        }, 100);
    }

    const MyCard = (props) => {
        let { post } = props;
        let nameArray = post.postedBy?.adminName.split(" ")
        let textLabel = nameArray.length > 1 ? nameArray[0][0] + nameArray[1][0] : nameArray[0][0];
        return (
            <Card key={post.key} elevation={5}>
                <Card.Title title={post.postedBy?.adminName} subtitle={momentTime(post.createdAt)} left={(props) => <Avatar.Text {...props} color="white" label={textLabel} />} />
                <Card.Content>
                    <Paragraph>{post.postMessage}</Paragraph>
                </Card.Content>
                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                {/* <Card.Actions>
                    <Button>Cancel</Button>
                    <Button>Ok</Button>
                </Card.Actions> */}
            </Card>
        )
    }

    const renderFooter = () => {
        if (!isMoreLoading) return true;
        return (
            <ActivityIndicator
                size='large'
                color={'#009387'}
                style={{ marginBottom: 10 }}
            />
        )
    }

    const refreshingOnPull = () => {
        setRefresh(true)
        setPosts([])
        setTimeout(async () => {
            setPageNumber(prevPageNumber => 1)
            const res = await GetPosts(
                { channelId: "1232", pageNumber: pageNumber, limit: 5 })
            setPosts(res.data.result)
            setRefresh(false)
        }, 1000);
    }

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {
        backgroundColor: 'white',
        padding: 20,
        marginLeft: 'auto',
        marginRight: 'auto'
    };

    let checkDict = {}
    PostCategories.forEach(category => {
        checkDict[category._id] = false
    })
    const [checked, setChecked] = React.useState(checkDict)

    const checkPressed = (id) => {
        setChecked({
            ...checked,
            [id]: !checked[id]
        })
    }

    return (
        <View style={{ flex: 1, }}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <Text>Select the category you want !</Text>
                    {PostCategories?.map((category) => (
                        <CheckBox
                            status={checked[category._id] ? 'checked' : 'unchecked'}
                            label={category.categoryName}
                            id={category._id}
                            onPress={checkPressed}
                        />
                    ))}
                </Modal>
            </Portal>

            <FlatList
                data={posts}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (<MyCard post={item} />)}
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.5}
                onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false; }}
                onEndReached={() => {
                    if (!onEndReachedCalledDuringMomentum && !isMoreLoading) {
                        setPageNumber(prevPageNumber => prevPageNumber + 1)
                    }
                }
                }
                refreshing={refresh}
                onRefresh={refreshingOnPull}
            />
            <FAB

                style={styles.fab}
                icon="filter"
                color="#fff"
                onPress={showModal}
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
