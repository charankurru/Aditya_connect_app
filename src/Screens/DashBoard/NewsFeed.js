import React, { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { View, ActivityIndicator, ScrollView, FlatList } from 'react-native'
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { AuthContext } from '../../Components/context';
import fetchPostsHook from './fetchPostsHook';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const NewsFeed = () => {

    const { loginState } = useContext(AuthContext);
    const [pageNumber, setPageNumber] = useState(1)

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

    }

    const loadingIndicator = () => {
        return (

            <View>
                {loading && <ActivityIndicator size="large" color="#009387" />}
            </View>

        )
    }

    console.log()
    return (
        <View style={{ flex: 1, }}>
            <FlatList
                data={posts}
                onEndReached={() => { loadMore() }}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (<MyCard post={item} />)}
                ListFooterComponent={loadingIndicator()}
            />

        </View>
    )
}

export default NewsFeed











