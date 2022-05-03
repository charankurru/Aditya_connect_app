import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';


const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const NewsFeed = () => {
    const [Posts, setPosts] = useState([{
        id: '1',
        userName: 'Jenny Doe',

        postTime: '4 mins ago',
        post:
            'Hey there, this is my test for a post of my social app in React Native.',

        liked: true,
        likes: '14',
        comments: '5',
    },
    {
        id: '2',
        userName: 'John Doe',

        postTime: '2 hours ago',
        post:
            'Hey there, this is my test for a post of my social app in React Native.',

        liked: false,
        likes: '8',
        comments: '0',
    },
    {
        id: '3',
        userName: 'Ken William',

        postTime: '1 hours ago',
        post:
            'Hey there, this is my test for a post of my social app in React Native.',

        liked: true,
        likes: '1',
        comments: '0',
    },
    {
        id: '4',
        userName: 'Selina Paul',

        postTime: '1 day ago',
        post:
            'Hey there, this is my test for a post of my social app in React Native.',

        liked: true,
        likes: '22',
        comments: '4',
    },
    {
        id: '5',
        userName: 'Christy Alex',

        postTime: '2 days ago',
        post:
            'Hey there, this is my test for a post of my social app in React Native.',

        liked: false,
        likes: '0',
        comments: '0',
    }]);

    useEffect(() => {
    }, [])

    return (
        <View style={{ flex: 1, }}>
            <ScrollView style={{ paddingLeft: 2, paddingRight: 5 }}>
                {Posts ? Posts.map((post, index) =>
                    <Card key={index} elevation={5}>
                        <Card.Title title={post.userName} subtitle={post.postTime} left={LeftContent} />
                        <Card.Content>
                            {/* <Title>{post.userName}</Title> */}
                            <Paragraph>{post.post}</Paragraph>
                        </Card.Content>
                        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                        <Card.Actions>
                            <Button>Cancel</Button>
                            <Button>Ok</Button>
                        </Card.Actions>
                    </Card>) : null}

            </ScrollView>
        </View>
    )
}

export default NewsFeed