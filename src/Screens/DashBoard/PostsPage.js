import React, {
    useState,
    useEffect, useCallback
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
import momentTime from '../../Components/momentTime'
import CheckBox from '../../Components/CheckBox'
import { GetCategoriesData } from '../../API/services';
import fetchPostsHook from './fetchPostsHook';
const PostsPage = () => {

    const [categories, setCategories] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [refresh, setRefresh] = useState(false)
    const [visible, setVisible] = useState(false);
    const [categoryChecks, setChecked] = useState(undefined)
    const containerStyle = {
        backgroundColor: 'white',
        padding: 20,
        marginLeft: 'auto',
        marginRight: 'auto'
    };

    useEffect(() => {
        if (categories.length == 0) {
            getCategories();
        }
        performFilteringPosts()
    }, [categoryChecks]);

    const { isMoreLoading, posts, filterPosts, hasMore, onEndReachedCalledDuringMomentum, setFilterPosts, setOnEndReachedCalledDuringMomentum }
        = fetchPostsHook(pageNumber, "1232", categoryChecks, setPageNumber)

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const getCategories = async () => {
        try {
            let res = await GetCategoriesData();
            console.log(res)
            setCategories(res.data.result)
            let categoryCheckDict = {}
            res.data.result.forEach(category => {
                categoryCheckDict[category._id] = false
            })
            setChecked(categoryCheckDict)

        } catch (error) {
            console.log(error);
        }

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
        setTimeout(async () => {
            console.log("setting pageNumber to 1")
            setPageNumber(1)
            console.log(pageNumber)
            setRefresh(false)
        }, 1000);
    }

    const checkForNoFilter = () => {
        if (categoryChecks) {
            for (var key in categoryChecks) {
                if (categoryChecks[key]) {
                    console.log(categoryChecks[key])
                    return false
                }
            }
        }
        return true
    }

    const performFilteringPosts = () => {
        console.log(categoryChecks)
        if (checkForNoFilter()) {
            console.log("No filters applied")
            setFilterPosts(posts)
            return
        }
        console.log("Filtering posts started.........")
        let filteredPosts = posts.filter(post => categoryChecks[post.categoryId])
        if (hasMore && filteredPosts.length == 0) {
            setPageNumber(prevPageNumber => prevPageNumber + 1)
            return
        }
        setFilterPosts(filteredPosts);
    }

    const checkPressed = (id) => {
        console.log(id)
        setChecked({
            ...categoryChecks,
            [id]: !categoryChecks[id]
        })
    }

    return (
        <View style={{ flex: 1, }}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <Text>Select the category you want !</Text>
                    {categories?.map((category) => (
                        <CheckBox
                            key={category._id}
                            status={categoryChecks && categoryChecks[category._id] ? 'checked' : 'unchecked'}
                            label={category.categoryName}
                            id={category._id}
                            onPress={checkPressed}
                        />
                    ))}
                </Modal>
            </Portal>

            <FlatList
                data={filterPosts}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (<MyCard post={item} />)}
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.5}
                onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false) }}
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
