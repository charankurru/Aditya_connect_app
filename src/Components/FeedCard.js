import React, { memo } from 'react'
import { Modal, Portal, Avatar, Card, Paragraph, FAB, } from 'react-native-paper';
import momentTime from './momentTime'

const FeedCard = (props) => {
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

export default memo(FeedCard)