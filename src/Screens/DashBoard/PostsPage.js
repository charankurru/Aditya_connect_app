import React, {
    useState,
    useEffect, useMemo, useContext
} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    ActivityIndicator,
    StatusBar,
    Text
} from 'react-native';
import { Modal, Portal, FAB, } from 'react-native-paper';
import CheckBox from '../../Components/CheckBox'
import { GetCategoriesData } from '../../API/services';
import fetchPostsHook from './fetchPostsHook';
import FeedCard from '../../Components/FeedCard';
import { AuthContext } from '../../Components/context';
const PostsPage = () => {

    const { loginState } = useContext(AuthContext);

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

    const { isMoreLoading, posts, filterPosts, hasMore, setFilterPosts, setPosts, setHasMore, getMore }
        = fetchPostsHook(pageNumber, loginState.collegeId._id, categoryChecks, setPageNumber)

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const getCategories = async () => {
        try {
            let res = await GetCategoriesData();
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

    const refreshingOnPull = async () => {
        setRefresh(true)
        setPageNumber(1)
        setPosts([])
        setFilterPosts([])
        setHasMore(true)
        await getMore()
        setRefresh(false)
    }

    const checkForNoFilter = () => {
        if (categoryChecks) {
            for (var key in categoryChecks) {
                if (categoryChecks[key]) {
                    return false
                }
            }
        }
        return true
    }

    const performFilteringPosts = () => {
        if (checkForNoFilter()) {
            setFilterPosts(posts)
            return
        }
        let filteredPosts = posts.filter(post => categoryChecks[post.categoryId])
        if (hasMore && filteredPosts.length == 0) {
            setPageNumber(prevPageNumber => prevPageNumber + 1)
            setFilterPosts(filteredPosts);
            return
        }
        setFilterPosts(filteredPosts);
    }

    const checkPressed = (id) => {
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
                renderItem={({ item, index }) => (<FeedCard index={index} post={item} userId={loginState.id} />)}
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.1}
                onEndReached={() => {
                    if (hasMore && !isMoreLoading) {
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
